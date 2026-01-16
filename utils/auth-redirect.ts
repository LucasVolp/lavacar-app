import { organizationService } from "@/services/organizations";

// Simulação de decodificação de token. Em produção usar `jwt-decode` ou contexto de Auth
const decodeToken = (token: string) => {
    // Implementação real usuaria jwt-decode(token)
    // aqui retornamos um mock ou tentamos ler se for um token real
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

/**
 * handleLoginSuccess - Lógica de redirecionamento pós-login
 * 
 * 1. Decodifica o token para obter o ID do usuário (sub ou userId)
 * 2. Busca as organizações do usuário
 * 3. Redireciona para o dashboard da primeira organização ou onboarding
 */
export const handleLoginSuccess = async (
    token: string, 
    navigate: (path: string) => void,
    saveToken: (token: string) => void
) => {
    // 1. Salvar token
    saveToken(token);

    // 2. Extrair User ID
    const user = decodeToken(token);
    const userId = user?.sub || user?.id; // Ajustar conforme payload do JWT

    if (!userId) {
        console.error("Token inválido: User ID não encontrado");
        return;
    }

    try {
        // 3. Buscar Organização
        // Como não estamos num componente React, chamamos o service diretamente
        const organizations = await organizationService.findByOwner(userId);

        if (organizations && organizations.length > 0) {
            // Se tiver organization, vai para o dashboard da primeira
            const orgId = organizations[0].id;
            navigate(`/organization/${orgId}`);
        } else {
            // Se não tiver, vai para onboarding criar one
            navigate('/onboarding/create-org');
        }
    } catch (error) {
        console.error("Erro ao redirecionar após login:", error);
        // Fallback seguro
        navigate('/onboarding/create-org');
    }
};

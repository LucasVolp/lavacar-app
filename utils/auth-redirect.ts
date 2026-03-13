import { organizationService } from "@/services/organizations";

const decodeToken = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

export const handleLoginSuccess = async (
    token: string,
    navigate: (path: string) => void,
    saveToken: (token: string) => void
) => {
    saveToken(token);

    const user = decodeToken(token);
    const userId = user?.sub || user?.id;

    if (!userId) {
        return;
    }

    try {
        const organizations = await organizationService.findByOwner(userId);

        if (organizations && organizations.length > 0) {
            const orgId = organizations[0].id;
            navigate(`/organization/${orgId}`);
        } else {
            navigate('/onboarding/create-org');
        }
    } catch {
        navigate('/onboarding/create-org');
    }
};

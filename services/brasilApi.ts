import axios from "axios";

const brasilApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BRASIL_API_URL || "https://brasilapi.com.br",
  timeout: 10000,
});

export interface BrasilApiCepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export interface BrasilApiStateResponse {
  id: number;
  sigla: string;
  nome: string;
  regiao?: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface BrasilApiCityResponse {
  nome: string;
  codigo_ibge: string;
}

export interface BrasilApiCnpjResponse {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  cep?: string;
  municipio?: string;
  uf?: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
}

export const brasilApiService = {
  async findAddressByCep(rawCep: string) {
    const cep = rawCep.replace(/\D/g, "");
    if (cep.length !== 8) {
      throw new Error("CEP inválido");
    }

    const response = await brasilApi.get<BrasilApiCepResponse>(`/api/cep/v1/${cep}`);
    return response.data;
  },

  async listStates() {
    const response = await brasilApi.get<BrasilApiStateResponse[]>("/api/ibge/uf/v1");
    return response.data.sort((a, b) => a.nome.localeCompare(b.nome));
  },

  async listCitiesByState(state: string) {
    const uf = state.trim().toUpperCase();
    if (!uf) {
      return [];
    }

    const response = await brasilApi.get<BrasilApiCityResponse[]>(
      `/api/ibge/municipios/v1/${uf}?providers=dados-abertos-br,gov,wikipedia`
    );
    return response.data
      .map((city) => city.nome)
      .sort((a, b) => a.localeCompare(b));
  },

  async findCompanyByCnpj(rawCnpj: string) {
    const cnpj = rawCnpj.replace(/\D/g, "");
    if (cnpj.length !== 14) {
      throw new Error("CNPJ inválido");
    }

    const response = await brasilApi.get<BrasilApiCnpjResponse>(`/api/cnpj/v1/${cnpj}`);
    return response.data;
  },
};

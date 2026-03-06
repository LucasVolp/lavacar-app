import axios from "axios";
import { BrasilApiFipeOption, BrasilApiFipeType } from "@/types/fipe";

const brasilApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BRASIL_API_URL || "https://brasilapi.com.br",
  timeout: 10000,
});

const FIPE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const memoryCache = new Map<string, { expiresAt: number; value: BrasilApiFipeOption[] }>();
const inFlightRequests = new Map<string, Promise<BrasilApiFipeOption[]>>();
const LOCAL_CACHE_PREFIX = "lavacar:fipe:";

function getSessionCache(key: string): BrasilApiFipeOption[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt: number; value: BrasilApiFipeOption[] };
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      window.sessionStorage.removeItem(key);
      return null;
    }
    return Array.isArray(parsed.value) ? parsed.value : null;
  } catch {
    return null;
  }
}

function getLocalCache(key: string): BrasilApiFipeOption[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${LOCAL_CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { expiresAt: number; value: BrasilApiFipeOption[] };
    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(`${LOCAL_CACHE_PREFIX}${key}`);
      return null;
    }
    return Array.isArray(parsed.value) ? parsed.value : null;
  } catch {
    return null;
  }
}

function setSessionCache(key: string, value: BrasilApiFipeOption[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        expiresAt: Date.now() + FIPE_CACHE_TTL_MS,
        value,
      }),
    );
  } catch {
    // Ignore quota/security errors.
  }
}

function setLocalCache(key: string, value: BrasilApiFipeOption[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${LOCAL_CACHE_PREFIX}${key}`,
      JSON.stringify({
        expiresAt: Date.now() + FIPE_CACHE_TTL_MS,
        value,
      }),
    );
  } catch {
    // Ignore quota/security errors.
  }
}

function getCachedFipeOptions(key: string): BrasilApiFipeOption[] | null {
  const memory = memoryCache.get(key);
  if (memory && memory.expiresAt >= Date.now()) {
    return memory.value;
  }

  const session = getSessionCache(key);
  if (session) {
    memoryCache.set(key, { expiresAt: Date.now() + FIPE_CACHE_TTL_MS, value: session });
    return session;
  }

  const local = getLocalCache(key);
  if (local) {
    memoryCache.set(key, { expiresAt: Date.now() + FIPE_CACHE_TTL_MS, value: local });
    setSessionCache(key, local);
    return local;
  }

  return null;
}

function setCachedFipeOptions(key: string, value: BrasilApiFipeOption[]) {
  memoryCache.set(key, { expiresAt: Date.now() + FIPE_CACHE_TTL_MS, value });
  setSessionCache(key, value);
  setLocalCache(key, value);
}

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

interface BrasilApiFipeRawOption {
  nome?: string;
  modelo?: string;
  brand?: string;
  valor?: string | number;
  id?: string | number;
  codigo?: string | number;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const MODEL_SPEC_WORDS = new Set([
  "tfsi", "fsi", "tsi", "tdi", "tgi", "v6", "v8", "v10", "turbo", "aspirado",
  "quattro", "4x4", "4wd", "awd", "s-tronic", "stronic", "tiptronic", "multitronic",
  "manual", "automatico", "automatica", "at", "mt", "cv", "cvt",
  "flex", "gasolina", "diesel", "etanol", "gnv", "hybrid", "phev", "hev", "ev",
  "8v", "16v", "20v", "24v",
  "ex", "lx", "exl", "ext", "touring", "xls", "xlt", "srv", "srx", "std", "adv",
  "cd", "cs", "ce", "active", "allure", "griffe", "style", "premier", "joy", "black", "amg",
  "abs", "cbs", "c-abs"
]);

const BODY_STYLE_WORDS = new Set([
  "avant",
  "sportback",
  "sedan",
  "hatch",
  "hatchback",
  "coupe",
  "cabriolet",
  "roadster",
  "wagon",
  "sw",
  "pickup",
  "van",
]);

function toDisplayModelName(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((token) => {
      if (/^[a-z]\d+$/i.test(token)) return token.toUpperCase();
      if (/^\d+[a-z]$/i.test(token)) return token.toUpperCase();
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join(" ");
}

function compactModelName(name: string): string {
  const normalized = normalizeText(name)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[\/,+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return "";

  const tokens = normalized.split(" ").filter(Boolean);
  const family: string[] = [];
  let reachedSpec = false;

  for (const token of tokens) {
    const isDisplacement = /^\d\.\d+$/.test(token);
    const isYear = /^(19|20)\d{2}$/.test(token);
    const powerPattern = /^\d{2,4}cv$/.test(token);

    if (isDisplacement || isYear || powerPattern || MODEL_SPEC_WORDS.has(token)) {
      reachedSpec = true;
      continue;
    }

    if (reachedSpec) {
      // After reaching specs, we only keep body style if present.
      if (BODY_STYLE_WORDS.has(token) && !family.includes(token)) {
        family.push(token);
      }
      continue;
    }

    if (!family.includes(token)) {
      family.push(token);
    }

    if (family.length >= 3) {
      reachedSpec = true;
    }
  }

  if (family.length === 0) {
    family.push(tokens[0]);
  }

  const bodyStyle = tokens.find((token) => BODY_STYLE_WORDS.has(token));
  if (bodyStyle && !family.includes(bodyStyle)) {
    family.push(bodyStyle);
  }

  return family.join(" ").trim();
}

function toStableCode(name: string): string {
  return compactModelName(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeFipeOptions(
  items: BrasilApiFipeRawOption[] | undefined,
  mode: "brand" | "model" = "brand"
): BrasilApiFipeOption[] {
  if (!Array.isArray(items)) return [];

  const normalized = items
    .map((item) => {
      const rawName = String(item.nome ?? item.modelo ?? item.brand ?? "").trim();
      const name = mode === "model" ? rawName : rawName;
      const codeValue = item.valor ?? item.id ?? item.codigo;
      const code =
        codeValue !== undefined && codeValue !== null
          ? String(codeValue).trim()
          : mode === "model"
            ? toStableCode(rawName)
            : "";

      if (!name || !code) return null;
      return { code, name };
    })
    .filter((item): item is BrasilApiFipeOption => Boolean(item));

  if (mode !== "model") {
    return normalized.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  // Deduplicacao rapida de variacoes de acabamento quase identicas
  const dedupMap = new Map<string, BrasilApiFipeOption>();
  for (const option of normalized) {
    const key = compactModelName(option.name);
    if (!key) continue;

    const existing = dedupMap.get(key);
    if (!existing) {
      dedupMap.set(key, {
        code: toStableCode(key),
        name: toDisplayModelName(key),
      });
      continue;
    }

    // Mantem sempre a forma compacta mais curta/estavel.
    if (option.name.length < existing.name.length) {
      dedupMap.set(key, {
        code: toStableCode(key),
        name: toDisplayModelName(key),
      });
    }
  }

  return Array.from(dedupMap.values()).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
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

  async listFipeBrands(type: BrasilApiFipeType) {
    const cacheKey = `fipe:brands:${type}`;
    const cached = getCachedFipeOptions(cacheKey);
    if (cached) return cached;

    const pending = inFlightRequests.get(cacheKey);
    if (pending) return pending;

    const request = (async () => {
      const response = await brasilApi.get<BrasilApiFipeRawOption[]>(`/api/fipe/marcas/v1/${type}`);
      const normalized = normalizeFipeOptions(response.data, "brand");
      setCachedFipeOptions(cacheKey, normalized);
      return normalized;
    })().finally(() => inFlightRequests.delete(cacheKey));

    inFlightRequests.set(cacheKey, request);
    return request;
  },

  async listFipeModels(type: BrasilApiFipeType, brandCode: string) {
    const normalizedBrandCode = String(brandCode || "").trim();
    if (!normalizedBrandCode) return [];

    const cacheKey = `fipe:models:${type}:${normalizedBrandCode}`;
    const cached = getCachedFipeOptions(cacheKey);
    if (cached) return cached;

    const pending = inFlightRequests.get(cacheKey);
    if (pending) return pending;

    const request = (async () => {
      const response = await brasilApi.get<BrasilApiFipeRawOption[]>(
        `/api/fipe/veiculos/v1/${type}/${encodeURIComponent(normalizedBrandCode)}`
      );
      const normalized = normalizeFipeOptions(response.data, "model");
      setCachedFipeOptions(cacheKey, normalized);
      return normalized;
    })().finally(() => inFlightRequests.delete(cacheKey));

    inFlightRequests.set(cacheKey, request);
    return request;
  },
};

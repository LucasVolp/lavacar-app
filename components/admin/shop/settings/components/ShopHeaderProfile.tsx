"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Form, message, Avatar, Upload, Typography, Select, Tabs, InputNumber, Checkbox } from "antd";
import type { UploadProps } from "antd";
import Image from "next/image";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  TikTokFilled,
  FileTextOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Shop, ShopSocialLinks, UpdateShopDto, SHOP_STATUS_MAP } from "@/types/shop";
import { maskCpfCnpj, maskPhone, maskCep } from "@/lib/masks";
import { sanitizeText } from "@/lib/security";
import { brasilApiService, BrasilApiStateResponse } from "@/services/brasilApi";
import { timeApiService } from "@/services/timeApi";
import { shopService } from "@/services/shop";

const { Title, Text } = Typography;

interface ShopHeaderProfileProps {
  shop: Shop;
  onSave: (values: UpdateShopDto) => Promise<void>;
  isSaving?: boolean;
}

/**
 * Format display masks for view mode
 */
const formatDocument = (doc?: string | null): string => {
  if (!doc) return "—";
  return maskCpfCnpj(doc);
};

const formatPhone = (phone?: string): string => {
  if (!phone) return "—";
  return maskPhone(phone);
};

const toNullableText = (value: unknown): string | null | undefined => {
  if (value === undefined) return undefined;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
};

const normalizeSocialLink = (platform: "instagram" | "youtube" | "tiktok" | "whatsapp", rawValue: unknown): string | null | undefined => {
  if (rawValue === undefined) return undefined;
  const value = String(rawValue).trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  if (platform === "instagram") {
    return `https://instagram.com/${value.replace(/^@/, "")}`;
  }

  if (platform === "youtube") {
    return value.startsWith("@")
      ? `https://youtube.com/${value}`
      : `https://youtube.com/${value.replace(/^\/+/, "")}`;
  }

  if (platform === "tiktok") {
    return `https://www.tiktok.com/@${value.replace(/^@/, "")}`;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
};

const parseSocialLinks = (socialLinks: Shop["socialLinks"]): ShopSocialLinks => {
  if (!socialLinks) return {};
  if (typeof socialLinks === "string") {
    try {
      const parsed = JSON.parse(socialLinks) as ShopSocialLinks;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return socialLinks;
};

/**
 * Info item for view mode display
 */
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-0 break-words">
        {value || "—"}
      </p>
    </div>
  </div>
);

export const ShopHeaderProfile: React.FC<ShopHeaderProfileProps> = ({
  shop,
  onSave,
  isSaving = false
}) => {
  const socialLinks = parseSocialLinks(shop.socialLinks);
  const instagramUrl = normalizeSocialLink("instagram", socialLinks.instagram) || "";
  const youtubeUrl = normalizeSocialLink("youtube", socialLinks.youtube) || "";
  const tiktokUrl = normalizeSocialLink("tiktok", socialLinks.tiktok) || "";
  const whatsappUrl = normalizeSocialLink("whatsapp", socialLinks.whatsapp) || "";
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const selectedState = Form.useWatch("state", form);
  const [logoLoading, setLogoLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(shop.logoUrl || "");
  const [bannerPreview, setBannerPreview] = useState<string>(shop.bannerUrl || "");
  const [states, setStates] = useState<BrasilApiStateResponse[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [timezones, setTimezones] = useState<string[]>([]);
  const [loadingByCep, setLoadingByCep] = useState(false);
  const [useShopPhoneOnWhatsApp, setUseShopPhoneOnWhatsApp] = useState(false);

  useEffect(() => {
    let active = true;
    const loadAuxData = async () => {
      const [ufRes, tzRes, ipRes] = await Promise.allSettled([
        brasilApiService.listStates(),
        timeApiService.listTimezones(),
        timeApiService.detectTimezoneByIp(),
      ]);

      if (!active) return;

      if (ufRes.status === "fulfilled") {
        setStates(ufRes.value);
      } else {
        setStates([]);
      }

      if (tzRes.status === "fulfilled") {
        setTimezones(tzRes.value);
      } else {
        setTimezones(typeof Intl.supportedValuesOf === "function"
          ? Intl.supportedValuesOf("timeZone")
          : ["America/Sao_Paulo"]);
      }

      if (!shop.timeZone && ipRes.status === "fulfilled" && ipRes.value) {
        form.setFieldValue("timeZone", ipRes.value);
      }
    };

    loadAuxData();
    return () => {
      active = false;
    };
  }, [form, shop.timeZone]);

  const handleStartEdit = () => {
    form.setFieldsValue({
      name: shop.name,
      phone: shop.phone ? maskPhone(shop.phone) : "",
      email: shop.email || "",
      document: shop.document ? maskCpfCnpj(shop.document) : "",
      zipCode: shop.zipCode ? maskCep(shop.zipCode) : "",
      street: shop.street || "",
      number: shop.number || "",
      complement: shop.complement || "",
      neighborhood: shop.neighborhood || "",
      city: shop.city || "",
      state: shop.state || "",
      timeZone: shop.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo",
      slotInterval: shop.slotInterval,
      bufferBetweenSlots: shop.bufferBetweenSlots,
      maxAdvanceDays: shop.maxAdvanceDays,
      minAdvanceMinutes: shop.minAdvanceMinutes,
      socialInstagram: socialLinks.instagram || "",
      socialYoutube: socialLinks.youtube || "",
      socialTiktok: socialLinks.tiktok || "",
      socialWhatsapp: socialLinks.whatsapp || "",
    });
    if (shop.state) {
      brasilApiService.listCitiesByState(shop.state)
        .then(setCities)
        .catch(() => setCities([]));
    }
    setLogoPreview(shop.logoUrl || "");
    setBannerPreview(shop.bannerUrl || "");
    setUseShopPhoneOnWhatsApp(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setLogoPreview(shop.logoUrl || "");
    setBannerPreview(shop.bannerUrl || "");
    setUseShopPhoneOnWhatsApp(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const socialWhatsappRaw = useShopPhoneOnWhatsApp ? values.phone : values.socialWhatsapp;
      const socialLinksPayload: ShopSocialLinks = {
        instagram: normalizeSocialLink("instagram", values.socialInstagram),
        youtube: normalizeSocialLink("youtube", values.socialYoutube),
        tiktok: normalizeSocialLink("tiktok", values.socialTiktok),
        whatsapp: normalizeSocialLink("whatsapp", socialWhatsappRaw),
      };

      // Remove masks before saving
      const payload: UpdateShopDto = {
        name: values.name,
        phone: values.phone?.replace(/\D/g, ""),
        email: toNullableText(values.email),
        document: toNullableText(values.document)?.replace(/\D/g, "") ?? null,
        zipCode: values.zipCode?.replace(/\D/g, "") || undefined,
        street: values.street || undefined,
        number: values.number || undefined,
        complement: toNullableText(values.complement),
        neighborhood: values.neighborhood || undefined,
        city: values.city || undefined,
        state: values.state?.toUpperCase() || undefined,
        timeZone: toNullableText(values.timeZone),
        slotInterval: values.slotInterval ?? undefined,
        bufferBetweenSlots: values.bufferBetweenSlots ?? undefined,
        maxAdvanceDays: values.maxAdvanceDays ?? undefined,
        minAdvanceMinutes: values.minAdvanceMinutes ?? undefined,
        logoUrl: toNullableText(logoPreview),
        bannerUrl: toNullableText(bannerPreview),
        socialLinks: JSON.stringify(socialLinksPayload),
      };
      await onSave(payload);
      message.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch {
      message.error("Erro ao salvar. Verifique os campos.");
    }
  };

  // Handle phone mask on change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("phone", maskPhone(e.target.value));
  };

  // Handle document mask on change
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("document", maskCpfCnpj(e.target.value));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("zipCode", maskCep(e.target.value));
  };

  const handleStateChange = async (state?: string) => {
    form.setFieldValue("state", state);
    form.setFieldValue("city", undefined);
    if (!state) {
      setCities([]);
      return;
    }
    try {
      const cityList = await brasilApiService.listCitiesByState(state);
      setCities(cityList);
    } catch {
      setCities([]);
      message.warning("Não foi possível carregar as cidades.");
    }
  };

  const handleZipCodeBlur = async () => {
    const zipCode = String(form.getFieldValue("zipCode") || "");
    const cepDigits = zipCode.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      return;
    }

    setLoadingByCep(true);
    try {
      const data = await brasilApiService.findAddressByCep(cepDigits);
      form.setFieldsValue({
        zipCode: maskCep(data.cep),
        street: data.street || form.getFieldValue("street"),
        neighborhood: data.neighborhood || form.getFieldValue("neighborhood"),
        city: data.city || form.getFieldValue("city"),
        state: data.state || form.getFieldValue("state"),
      });

      if (data.state) {
        try {
          const cityList = await brasilApiService.listCitiesByState(data.state);
          setCities(cityList);
        } catch {
          setCities([]);
        }
      }
    } catch {
      message.warning("CEP não encontrado. Você pode preencher o endereço manualmente.");
    } finally {
      setLoadingByCep(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    const fileObj = file as File;

    if (fileObj.size > 12 * 1024 * 1024) {
      message.error("Logo: tamanho máximo 12MB");
      onError?.(new Error("File too large"));
      return;
    }

    setLogoLoading(true);
    try {
      const result = await shopService.uploadLogo(shop.id, fileObj);
      setLogoPreview(result.url);
      onSuccess?.("ok");
      message.success("Logo enviada com sucesso");
    } catch {
      onError?.(new Error("Upload failed"));
      message.error("Erro ao carregar logo");
    } finally {
      setLogoLoading(false);
    }
  };

  // Handle banner upload
  const handleBannerUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    const fileObj = file as File;

    if (fileObj.size > 12 * 1024 * 1024) {
      message.error("Banner: tamanho máximo 12MB");
      onError?.(new Error("File too large"));
      return;
    }

    setBannerLoading(true);
    try {
      const result = await shopService.uploadBanner(shop.id, fileObj);
      setBannerPreview(result.url);
      onSuccess?.("ok");
      message.success("Banner enviado com sucesso");
    } catch {
      onError?.(new Error("Upload failed"));
      message.error("Erro ao carregar banner");
    } finally {
      setBannerLoading(false);
    }
  };

  const statusConfig = SHOP_STATUS_MAP[shop.status];

  // Full address string
  const fullAddress = [
    shop.street,
    shop.number,
    shop.complement,
    shop.neighborhood,
    `${shop.city}/${shop.state}`,
    shop.zipCode
  ].filter(Boolean).join(", ");

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
      {/* Banner */}
      <div className="relative h-32 md:h-44 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        {(isEditing ? bannerPreview : shop.bannerUrl) && (
          <Image
            src={isEditing ? bannerPreview : shop.bannerUrl || ""}
            alt="Banner"
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {isEditing && (
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={handleBannerUpload}
            className="absolute inset-0 z-10 cursor-pointer group"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium inline-flex items-center gap-2">
                <EditOutlined />
                {bannerLoading ? "Enviando..." : "Editar banner"}
              </span>
            </div>
          </Upload>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{
              backgroundColor: `${statusConfig.color}20`,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.color}40`
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusConfig.color }}
            />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Logo Avatar */}
        <div className="flex items-end gap-4 -mt-10 mb-6">
          {isEditing ? (
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={handleLogoUpload}
              className="relative group cursor-pointer"
            >
              <Avatar
                size={80}
                src={logoPreview}
                icon={!logoPreview && <ShopOutlined />}
                className="border-4 border-white dark:border-zinc-900 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {logoLoading ? "..." : <EditOutlined />}
                </span>
              </div>
            </Upload>
          ) : (
            <Avatar
              size={80}
              src={shop.logoUrl}
              icon={!shop.logoUrl && <ShopOutlined />}
              className="border-4 border-white dark:border-zinc-900 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
            />
          )}
          <div className="flex-1 min-w-0 pb-1">
            <Title
              level={2}
              className="!text-xl md:!text-2xl !font-bold !text-zinc-900 dark:!text-zinc-100 !mb-0 truncate"
            >
              {sanitizeText(shop.name)}
            </Title>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              /{shop.slug}
            </Text>
          </div>
          <Button
            type={isEditing ? "default" : "primary"}
            icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
            onClick={isEditing ? handleCancel : handleStartEdit}
            className={isEditing
              ? ""
              : "!bg-indigo-600 hover:!bg-indigo-500 !border-0 !shadow-md !shadow-indigo-600/20"
            }
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </Button>
        </div>

        {/* View Mode */}
        {!isEditing && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <InfoItem
              icon={<PhoneOutlined />}
              label="Telefone"
              value={formatPhone(shop.phone)}
            />
            <InfoItem
              icon={<MailOutlined />}
              label="E-mail"
              value={shop.email || "—"}
            />
            <InfoItem
              icon={<FileTextOutlined />}
              label="CPF/CNPJ"
              value={formatDocument(shop.document)}
            />
            <InfoItem
              icon={<GlobalOutlined />}
              label="Fuso Horário"
              value={shop.timeZone || "America/Sao_Paulo"}
            />
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Endereço"
                value={fullAddress || "Endereço não cadastrado"}
              />
            </div>
            {(instagramUrl || youtubeUrl || tiktokUrl || whatsappUrl) && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Redes Sociais</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/social no-underline inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 !text-white shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <InstagramOutlined className="text-base !text-inherit group-hover/social:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/social no-underline inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-red-600 to-red-500 !text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <YoutubeOutlined className="text-base !text-inherit group-hover/social:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">YouTube</span>
                    </a>
                  )}
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/social no-underline inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200 !text-white dark:!text-black shadow-md shadow-zinc-900/20 dark:shadow-white/15 hover:shadow-lg hover:shadow-zinc-900/30 dark:hover:shadow-white/25 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <TikTokFilled className="text-base !text-inherit group-hover/social:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">TikTok</span>
                    </a>
                  )}
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/social no-underline inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl !bg-[#25D366] dark:!bg-[#25D366] !text-white shadow-md shadow-[#25D366]/20 hover:shadow-lg hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <WhatsAppOutlined className="text-base !text-white group-hover/social:rotate-12 transition-transform duration-300" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <Form form={form} layout="vertical" className="animate-fade-in">
            <Tabs
              defaultActiveKey="basic"
              items={[
                {
                  key: "basic",
                  label: "Dados Básicos",
                  children: (
                    <div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Form.Item
                          name="name"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Nome da Loja</span>}
                          rules={[{ required: true, message: "Informe o nome" }]}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<ShopOutlined className="text-zinc-400" />}
                            placeholder="Nome do estabelecimento"
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <Form.Item
                          name="phone"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Telefone</span>}
                          rules={[{ required: true, message: "Informe o telefone" }]}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<PhoneOutlined className="text-zinc-400" />}
                            placeholder="(99) 99999-9999"
                            onChange={handlePhoneChange}
                            maxLength={15}
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <Form.Item
                          name="email"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">E-mail</span>}
                          rules={[{ type: "email", message: "E-mail inválido" }]}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<MailOutlined className="text-zinc-400" />}
                            placeholder="contato@loja.com"
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <Form.Item
                          name="document"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">CPF/CNPJ</span>}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<FileTextOutlined className="text-zinc-400" />}
                            placeholder="000.000.000-00"
                            onChange={handleDocumentChange}
                            maxLength={18}
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <Form.Item
                          name="socialInstagram"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Instagram</span>}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<InstagramOutlined className="text-zinc-400" />}
                            placeholder="@seuperfil ou link"
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <Form.Item
                          name="socialYoutube"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">YouTube</span>}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<YoutubeOutlined className="text-zinc-400" />}
                            placeholder="@canal ou link"
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <Form.Item
                          name="socialTiktok"
                          label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">TikTok</span>}
                          className="!mb-3"
                        >
                          <Input
                            prefix={<TikTokFilled className="text-zinc-400" />}
                            placeholder="@perfil ou link"
                            allowClear
                            className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                          />
                        </Form.Item>

                        <div className="!mb-3">
                          <Form.Item
                            name="socialWhatsapp"
                            label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">WhatsApp</span>}
                            className="!mb-2"
                          >
                            <Input
                              prefix={<WhatsAppOutlined className="text-zinc-400" />}
                              placeholder="(DDD) número ou link wa.me"
                              allowClear
                              disabled={useShopPhoneOnWhatsApp}
                              className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                            />
                          </Form.Item>
                          <Checkbox
                            checked={useShopPhoneOnWhatsApp}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setUseShopPhoneOnWhatsApp(checked);
                              if (checked) {
                                form.setFieldValue("socialWhatsapp", form.getFieldValue("phone") || shop.phone || "");
                              }
                            }}
                          >
                            Usar mesmo telefone cadastrado
                          </Checkbox>
                        </div>
                      </div>

                    </div>
                  ),
                },
                {
                  key: "address",
                  label: "Endereço e Fuso",
                  children: (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Form.Item
                        name="timeZone"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Fuso Horário</span>}
                        className="!mb-3 sm:col-span-2"
                        rules={[{ required: true, message: "Selecione o fuso horário" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Selecione o timezone"
                          optionFilterProp="label"
                          allowClear
                          options={timezones.map((tz) => ({ value: tz, label: tz }))}
                        />
                      </Form.Item>

                      <Form.Item
                        name="zipCode"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">CEP</span>}
                        className="!mb-3"
                        rules={[{ required: true, message: "Informe o CEP" }]}
                        help={loadingByCep ? "Buscando CEP..." : undefined}
                      >
                        <Input
                          placeholder="00000-000"
                          onChange={handleZipCodeChange}
                          onBlur={handleZipCodeBlur}
                          maxLength={9}
                          allowClear
                          className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                        />
                      </Form.Item>

                      <Form.Item
                        name="street"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Rua</span>}
                        className="!mb-3"
                        rules={[{ required: true, message: "Informe a rua" }]}
                      >
                        <Input
                          placeholder="Nome da rua"
                          allowClear
                          className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                        />
                      </Form.Item>

                      <Form.Item
                        name="number"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Número</span>}
                        className="!mb-3"
                        rules={[{ required: true, message: "Informe o número" }]}
                      >
                        <Input
                          placeholder="123"
                          allowClear
                          className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                        />
                      </Form.Item>

                      <Form.Item
                        name="complement"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Complemento</span>}
                        className="!mb-3"
                      >
                        <Input
                          placeholder="Sala, bloco, etc."
                          allowClear
                          className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                        />
                      </Form.Item>

                      <Form.Item
                        name="neighborhood"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Bairro</span>}
                        className="!mb-3"
                        rules={[{ required: true, message: "Informe o bairro" }]}
                      >
                        <Input
                          placeholder="Bairro"
                          allowClear
                          className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                        />
                      </Form.Item>

                      <Form.Item
                        name="state"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">UF</span>}
                        className="!mb-3"
                        rules={[{ required: true, message: "Informe a UF" }]}
                      >
                        <Select
                          showSearch
                          placeholder="UF"
                          optionFilterProp="label"
                          allowClear
                          options={states.map((state) => ({
                            value: state.sigla,
                            label: `${state.sigla} - ${state.nome}`,
                          }))}
                          onChange={handleStateChange}
                        />
                      </Form.Item>

                      <Form.Item
                        name="city"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Cidade</span>}
                        className="!mb-3"
                        rules={[{ required: true, message: "Informe a cidade" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Selecione a cidade"
                          optionFilterProp="label"
                          allowClear
                          disabled={!selectedState}
                          options={cities.map((city) => ({ value: city, label: city }))}
                        />
                      </Form.Item>
                    </div>
                  ),
                },
                {
                  key: "advanced",
                  label: "Avançado",
                  children: (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Form.Item
                        name="slotInterval"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Intervalo entre Slots</span>}
                        rules={[{ required: true, message: "Informe o intervalo" }]}
                        className="!mb-3"
                      >
                        <InputNumber min={5} max={120} step={5} addonAfter="min" className="!w-full" />
                      </Form.Item>

                      <Form.Item
                        name="bufferBetweenSlots"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Buffer entre Agendamentos</span>}
                        rules={[{ required: true, message: "Informe o buffer" }]}
                        className="!mb-3"
                      >
                        <InputNumber min={0} max={60} step={5} addonAfter="min" className="!w-full" />
                      </Form.Item>

                      <Form.Item
                        name="maxAdvanceDays"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Máximo de Dias</span>}
                        rules={[{ required: true, message: "Informe o máximo" }]}
                        className="!mb-3"
                      >
                        <InputNumber min={1} max={365} addonAfter="dias" className="!w-full" />
                      </Form.Item>

                      <Form.Item
                        name="minAdvanceMinutes"
                        label={<span className="text-zinc-600 dark:text-zinc-400 text-sm">Antecedência Mínima</span>}
                        rules={[{ required: true, message: "Informe a antecedência" }]}
                        className="!mb-3"
                      >
                        <InputNumber min={0} max={1440} step={15} addonAfter="min" className="!w-full" />
                      </Form.Item>
                    </div>
                  ),
                },
              ]}
            />

            <div className="flex justify-end gap-4 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={handleSave}
                loading={isSaving}
                className="!bg-indigo-600 hover:!bg-indigo-500 !border-0"
              >
                Salvar Alterações
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

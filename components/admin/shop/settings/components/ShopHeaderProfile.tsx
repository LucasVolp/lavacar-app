"use client";

import React, { useState } from "react";
import { Button, Input, Form, message, Avatar, Upload, Typography } from "antd";
import type { UploadProps, UploadFile } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { Shop, UpdateShopDto, SHOP_STATUS_MAP } from "@/types/shop";
import { maskCpfCnpj, maskPhone } from "@/lib/masks";
import { sanitizeText } from "@/lib/security";

const { Title, Text } = Typography;

interface ShopHeaderProfileProps {
  shop: Shop;
  onSave: (values: UpdateShopDto) => Promise<void>;
  isSaving?: boolean;
}

/**
 * Format display masks for view mode
 */
const formatDocument = (doc?: string): string => {
  if (!doc) return "—";
  return maskCpfCnpj(doc);
};

const formatPhone = (phone?: string): string => {
  if (!phone) return "—";
  return maskPhone(phone);
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

/**
 * Image upload button component
 */
const UploadButton: React.FC<{ loading?: boolean; label: string }> = ({ loading, label }) => (
  <div className="flex flex-col items-center justify-center p-4 text-zinc-400 dark:text-zinc-500">
    {loading ? <LoadingOutlined className="text-2xl" /> : <PlusOutlined className="text-2xl" />}
    <span className="mt-2 text-xs font-medium">{label}</span>
  </div>
);

/**
 * Convert file to base64 for preview (mock upload)
 */
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const ShopHeaderProfile: React.FC<ShopHeaderProfileProps> = ({
  shop,
  onSave,
  isSaving = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [logoLoading, setLogoLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(shop.logoUrl || "");
  const [bannerPreview, setBannerPreview] = useState<string>(shop.bannerUrl || "");

  const handleStartEdit = () => {
    form.setFieldsValue({
      name: shop.name,
      phone: shop.phone ? maskPhone(shop.phone) : "",
      email: shop.email || "",
      document: shop.document ? maskCpfCnpj(shop.document) : "",
    });
    setLogoPreview(shop.logoUrl || "");
    setBannerPreview(shop.bannerUrl || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setLogoPreview(shop.logoUrl || "");
    setBannerPreview(shop.bannerUrl || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // Remove masks before saving
      const payload: UpdateShopDto = {
        name: values.name,
        phone: values.phone?.replace(/\D/g, ""),
        email: values.email || undefined,
        document: values.document?.replace(/\D/g, "") || undefined,
        logoUrl: logoPreview || undefined,
        bannerUrl: bannerPreview || undefined,
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

  // Validate image dimensions
  const validateImageDimensions = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    label: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width > maxWidth || img.height > maxHeight) {
          message.error(`${label}: dimensões máximas ${maxWidth}x${maxHeight}px`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        message.error(`${label}: erro ao carregar imagem`);
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle logo upload
  const handleLogoUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;
    const fileObj = file as File;

    // Validate file size (max 5MB)
    if (fileObj.size > 5 * 1024 * 1024) {
      message.error("Logo: tamanho máximo 5MB");
      onError?.(new Error("File too large"));
      return;
    }

    // Validate dimensions
    const isValid = await validateImageDimensions(fileObj, 500, 500, "Logo");
    if (!isValid) {
      onError?.(new Error("Invalid dimensions"));
      return;
    }

    setLogoLoading(true);
    try {
      const base64 = await getBase64(fileObj);
      setLogoPreview(base64);
      onSuccess?.("ok");
      message.success("Logo carregado");
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

    // Validate file size (max 5MB)
    if (fileObj.size > 5 * 1024 * 1024) {
      message.error("Banner: tamanho máximo 5MB");
      onError?.(new Error("File too large"));
      return;
    }

    // Validate dimensions
    const isValid = await validateImageDimensions(fileObj, 1920, 600, "Banner");
    if (!isValid) {
      onError?.(new Error("Invalid dimensions"));
      return;
    }

    setBannerLoading(true);
    try {
      const base64 = await getBase64(fileObj);
      setBannerPreview(base64);
      onSuccess?.("ok");
      message.success("Banner carregado");
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
          <img
            src={isEditing ? bannerPreview : shop.bannerUrl}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

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
          <Avatar
            size={80}
            src={isEditing ? logoPreview : shop.logoUrl}
            icon={!(isEditing ? logoPreview : shop.logoUrl) && <ShopOutlined />}
            className="border-4 border-white dark:border-zinc-900 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
          />
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
            <div className="sm:col-span-2 lg:col-span-3">
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Endereço"
                value={fullAddress || "Endereço não cadastrado"}
              />
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <Form form={form} layout="vertical" className="animate-fade-in">
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
                  className="!rounded-xl dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                />
              </Form.Item>
            </div>

            {/* Image Upload Section */}
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Text className="text-zinc-600 dark:text-zinc-400 text-sm font-medium block mb-4">
                Imagens da Loja
              </Text>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Logo Upload */}
                <div>
                  <Text className="text-zinc-500 dark:text-zinc-400 text-xs block mb-2">
                    Logo (máx. 500x500px, 5MB)
                  </Text>
                  <Upload.Dragger
                    name="logo"
                    accept="image/*"
                    showUploadList={false}
                    customRequest={handleLogoUpload}
                    className={`
                      !bg-zinc-50 dark:!bg-zinc-800/50
                      !border-zinc-200 dark:!border-zinc-700
                      !rounded-xl
                      hover:!border-indigo-400 dark:hover:!border-indigo-500
                      transition-colors
                      [&_.ant-upload-drag-icon]:!mb-2
                    `}
                  >
                    {logoPreview ? (
                      <div className="p-2">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-20 h-20 mx-auto object-cover rounded-xl"
                        />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                          Clique ou arraste para substituir
                        </p>
                      </div>
                    ) : (
                      <UploadButton loading={logoLoading} label="Upload Logo" />
                    )}
                  </Upload.Dragger>
                </div>

                {/* Banner Upload */}
                <div>
                  <Text className="text-zinc-500 dark:text-zinc-400 text-xs block mb-2">
                    Banner (máx. 1920x600px, 5MB)
                  </Text>
                  <Upload.Dragger
                    name="banner"
                    accept="image/*"
                    showUploadList={false}
                    customRequest={handleBannerUpload}
                    className={`
                      !bg-zinc-50 dark:!bg-zinc-800/50
                      !border-zinc-200 dark:!border-zinc-700
                      !rounded-xl
                      hover:!border-indigo-400 dark:hover:!border-indigo-500
                      transition-colors
                      [&_.ant-upload-drag-icon]:!mb-2
                    `}
                  >
                    {bannerPreview ? (
                      <div className="p-2">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-16 mx-auto object-cover rounded-lg"
                        />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                          Clique ou arraste para substituir
                        </p>
                      </div>
                    ) : (
                      <UploadButton loading={bannerLoading} label="Upload Banner" />
                    )}
                  </Upload.Dragger>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800">
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

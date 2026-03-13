"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Form, Input, Button, Card, Row, Col, InputNumber, Select, Upload, message, Collapse } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined, CloseCircleFilled, SettingOutlined } from "@ant-design/icons";
import { CreateShopDto } from "@/types/shop";
import { shopService } from "@/services/shop";
import { formatDocument, generateSlug } from "@/utils/formatters";
import { validateDocument } from "@/utils/validators";
import { brasilApiService, BrasilApiStateResponse } from "@/services/brasilApi";
import { timeApiService } from "@/services/timeApi";
import { maskCep, maskPhone } from "@/lib/masks";
import { useShops } from "@/hooks/shop/useShops";

interface StepIdentityProps {
  organizationId: string;
  isSubmitting: boolean;
  onSubmit: (payload: CreateShopDto, logoFile: File | null, bannerFile: File | null) => Promise<void>;
  onCancel: () => void;
}

type Availability = "idle" | "checking" | "available" | "taken" | "error";

const SECTION_CONTAINER_CLASS =
  "bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200";

const INPUT_CLASS =
  "w-full bg-white dark:bg-zinc-950/50 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-indigo-500 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-lg";

const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-zinc-700 dark:text-zinc-300 font-medium tracking-tight text-sm">{children}</span>
);

const normalizeDigits = (value?: string | null) => (value || "").replace(/\D/g, "");

const availabilityUi = (status: Availability, busyText: string, okText: string, takenText: string) => {
  if (status === "checking") return { validateStatus: "validating" as const, help: busyText };
  if (status === "available") return { validateStatus: "success" as const, help: okText };
  if (status === "taken") return { validateStatus: "error" as const, help: takenText };
  if (status === "error") return { validateStatus: "warning" as const, help: "Não foi possível validar agora." };
  return { validateStatus: undefined, help: undefined };
};

export const StepIdentity: React.FC<StepIdentityProps> = ({
  organizationId,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<CreateShopDto>();
  const selectedState = Form.useWatch("state", form);
  const watchedSlug = Form.useWatch("slug", form);
  const watchedPhone = Form.useWatch("phone", form);
  const watchedDocument = Form.useWatch("document", form);

  const [slugTouched, setSlugTouched] = useState(false);

  const [states, setStates] = useState<BrasilApiStateResponse[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingByCep, setLoadingByCep] = useState(false);
  const [loadingByCnpj, setLoadingByCnpj] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [slugAvailability, setSlugAvailability] = useState<Availability>("idle");
  const [phoneAvailability, setPhoneAvailability] = useState<Availability>("idle");
  const [documentAvailability, setDocumentAvailability] = useState<Availability>("idle");

  const { data: existingShops = [] } = useShops();

  const timezones = useMemo(() => timeApiService.listTimezones(), []);

  useEffect(() => {
    let active = true;

    form.setFieldValue("timeZone", timeApiService.detectTimezone());

    brasilApiService.listStates()
      .then((data) => { if (active) setStates(data); })
      .catch(() => { if (active) setStates([]); });

    return () => { active = false; };
  }, [form]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [logoPreview, bannerPreview]);

  useEffect(() => {
    const slug = String(watchedSlug || "").trim().toLowerCase();
    if (!slug || slug.length < 3) {
      setSlugAvailability("idle");
      return;
    }

    const timer = setTimeout(async () => {
      setSlugAvailability("checking");
      try {
        await shopService.findBySlug(slug);
        setSlugAvailability("taken");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setSlugAvailability("available");
          return;
        }
        setSlugAvailability("error");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [watchedSlug]);

  useEffect(() => {
    const phoneDigits = normalizeDigits(String(watchedPhone || ""));
    if (phoneDigits.length < 10) {
      setPhoneAvailability("idle");
      return;
    }

    const timer = setTimeout(() => {
      setPhoneAvailability("checking");
      const shops = Array.isArray(existingShops) ? existingShops : [];
      const exists = shops.some((shop) => normalizeDigits(shop.phone) === phoneDigits);
      setPhoneAvailability(exists ? "taken" : "available");
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedPhone, existingShops]);

  useEffect(() => {
    const docDigits = normalizeDigits(String(watchedDocument || ""));
    if (docDigits.length !== 11 && docDigits.length !== 14) {
      setDocumentAvailability("idle");
      return;
    }

    const timer = setTimeout(() => {
      setDocumentAvailability("checking");
      const shops = Array.isArray(existingShops) ? existingShops : [];
      const existsOutsideOrg = shops.some(
        (shop) =>
          normalizeDigits(shop.document) === docDigits &&
          shop.organizationId &&
          shop.organizationId !== organizationId
      );
      const existsWithoutOrgInfo = shops.some(
        (shop) => normalizeDigits(shop.document) === docDigits && !shop.organizationId
      );
      setDocumentAvailability(existsOutsideOrg || existsWithoutOrgInfo ? "taken" : "available");
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedDocument, existingShops, organizationId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugTouched) {
      form.setFieldsValue({ slug: generateSlug(e.target.value) });
    }
  };

  const handleSlugChange = () => setSlugTouched(true);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("phone", maskPhone(e.target.value));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("document", formatDocument(e.target.value));
  };

  const handleStateChange = async (state: string) => {
    form.setFieldValue("state", state);
    form.setFieldValue("city", undefined);
    try {
      const cityList = await brasilApiService.listCitiesByState(state);
      setCities(cityList);
    } catch {
      setCities([]);
      message.warning("Não foi possível carregar as cidades deste estado.");
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("zipCode", maskCep(e.target.value));
  };

  const handleZipCodeBlur = async () => {
    const zipCode = String(form.getFieldValue("zipCode") || "");
    const cepDigits = normalizeDigits(zipCode);
    if (cepDigits.length !== 8) return;

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
      message.warning("CEP não encontrado. Preencha o endereço manualmente.");
    } finally {
      setLoadingByCep(false);
    }
  };

  const handleDocumentBlur = async () => {
    const document = String(form.getFieldValue("document") || "");
    const digits = normalizeDigits(document);
    if (digits.length !== 14) return;

    setLoadingByCnpj(true);
    try {
      const company = await brasilApiService.findCompanyByCnpj(digits);

      const nextValues: Partial<CreateShopDto> = {};
      if (!form.getFieldValue("name")) nextValues.name = company.nome_fantasia || company.razao_social || undefined;
      if (!form.getFieldValue("zipCode")) nextValues.zipCode = company.cep || undefined;
      if (!form.getFieldValue("street")) nextValues.street = company.logradouro || undefined;
      if (!form.getFieldValue("number")) nextValues.number = company.numero || undefined;
      if (!form.getFieldValue("neighborhood")) nextValues.neighborhood = company.bairro || undefined;
      if (!form.getFieldValue("city")) nextValues.city = company.municipio || undefined;
      if (!form.getFieldValue("state")) nextValues.state = company.uf || undefined;

      form.setFieldsValue(nextValues);
      if (company.uf) {
        const cityList = await brasilApiService.listCitiesByState(company.uf);
        setCities(cityList);
      }

      if ((company.nome_fantasia || company.razao_social) && !slugTouched) {
        form.setFieldValue("slug", generateSlug(company.nome_fantasia || company.razao_social || ""));
      }
    } catch {
      message.info("CNPJ não encontrado. Continue o preenchimento manualmente.");
    } finally {
      setLoadingByCnpj(false);
    }
  };

  const pickImageUpload = (type: "logo" | "banner"): UploadProps["customRequest"] => {
    return async ({ file, onSuccess, onError }) => {
      const image = file as File;
      if (image.size > 12 * 1024 * 1024) {
        message.error(`Imagem de ${type} excede 12MB.`);
        onError?.(new Error("File too large"));
        return;
      }

      const preview = URL.createObjectURL(image);
      if (type === "logo") {
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoFile(image);
        setLogoPreview(preview);
      } else {
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerFile(image);
        setBannerPreview(preview);
      }

      onSuccess?.("ok");
    };
  };

  const removeImage = (type: "logo" | "banner") => {
    if (type === "logo") {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoFile(null);
      setLogoPreview("");
    } else {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setBannerFile(null);
      setBannerPreview("");
    }
  };

  const hasUniquenessBlocker = () =>
    slugAvailability === "taken" || phoneAvailability === "taken" || documentAvailability === "taken";

  const handleNext = async () => {
    if (hasUniquenessBlocker()) {
      message.error("Corrija os campos com duplicidade antes de avançar.");
      return;
    }

    try {
      await form.validateFields();
    } catch {
      message.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const values = form.getFieldsValue(true) as CreateShopDto;
    const phoneDigits = normalizeDigits(values.phone);
    const phoneNormalized =
      phoneDigits.length >= 10 && phoneDigits.length <= 11
        ? `+55${phoneDigits}`
        : values.phone;

    const payload: CreateShopDto = {
      ...values,
      slug: String(values.slug || "").trim().toLowerCase(),
      phone: phoneNormalized,
      zipCode: normalizeDigits(values.zipCode),
      state: String(values.state || "").trim().toUpperCase(),
      document: values.document?.replace(/\D/g, ""),
      organizationId: "",
    };

    await onSubmit(payload, logoFile, bannerFile);
  };

  const slugUi = availabilityUi(slugAvailability, "Validando slug...", "Slug disponível", "Slug já está em uso");
  const phoneUi = availabilityUi(phoneAvailability, "Validando telefone...", "Telefone disponível", "Telefone já cadastrado");
  const docUi = availabilityUi(documentAvailability, "Validando documento...", "Documento disponível", "Documento já cadastrado");

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        slotInterval: 30,
        bufferBetweenSlots: 0,
        maxAdvanceDays: 30,
        minAdvanceMinutes: 60,
        timeZone: "America/Sao_Paulo",
      }}
      className="space-y-6"
      requiredMark
    >
      <div className={SECTION_CONTAINER_CLASS}>
        <Card
          bordered={false}
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Dados Gerais</span>}
          className="bg-transparent"
          styles={{ header: { padding: "24px 32px 0", borderBottom: "none" }, body: { padding: 32 } }}
        >
          <div className="space-y-4">
            <Row gutter={[24, 24]}>
              <Col span={24} md={12}>
                <Form.Item name="name" label={<FormLabel>Nome do Estabelecimento</FormLabel>} rules={[{ required: true, message: "O nome é obrigatório" }]}>
                  <Input size="large" placeholder="Ex: Lava Jato Centro" onChange={handleNameChange} className={INPUT_CLASS} />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="slug"
                  label={<FormLabel>Slug (URL)</FormLabel>}
                  tooltip="Identificador único da URL pública"
                  extra={<span className="text-xs text-zinc-500">Gerado automaticamente a partir do nome</span>}
                  validateStatus={slugUi.validateStatus}
                  help={slugUi.help}
                  rules={[{ required: true, message: "O slug é obrigatório" }]}
                >
                  <Input size="large" placeholder="ex: lava-jato-centro" className={INPUT_CLASS} onChange={handleSlugChange} />
                </Form.Item>
              </Col>

              <Col span={24} md={8}>
                <Form.Item
                  name="phone"
                  label={<FormLabel>Telefone / WhatsApp</FormLabel>}
                  rules={[{ required: true, message: "O telefone é obrigatório" }]}
                  validateStatus={phoneUi.validateStatus}
                  help={phoneUi.help}
                >
                  <Input size="large" placeholder="(00) 00000-0000" className={INPUT_CLASS} onChange={handlePhoneChange} maxLength={15} />
                </Form.Item>
              </Col>
              <Col span={24} md={8}>
                <Form.Item name="email" label={<FormLabel>Email de Contato</FormLabel>} rules={[{ type: "email", message: "Email inválido" }]}>
                  <Input size="large" placeholder="contato@loja.com" className={INPUT_CLASS} />
                </Form.Item>
              </Col>
              <Col span={24} md={8}>
                <Form.Item
                  name="document"
                  label={<FormLabel>CNPJ / CPF</FormLabel>}
                  validateStatus={docUi.validateStatus}
                  help={docUi.help}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (validateDocument(value)) return Promise.resolve();
                        return Promise.reject(new Error("CPF ou CNPJ inválido"));
                      },
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="00.000.000/0000-00"
                    className={INPUT_CLASS}
                    maxLength={18}
                    onChange={handleDocumentChange}
                    onBlur={handleDocumentBlur}
                  />
                </Form.Item>
                {loadingByCnpj && <p className="text-xs text-zinc-500 -mt-4">Buscando dados do CNPJ...</p>}
              </Col>

              <Col span={24}>
                <Form.Item name="description" label={<FormLabel>Descrição (Opcional)</FormLabel>}>
                  <Input.TextArea
                    size="large"
                    rows={4}
                    placeholder="Descreva os serviços, diferenciais e horário de funcionamento..."
                    className={INPUT_CLASS}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Imagens da Loja</h3>
              <Row gutter={[16, 16]}>
                <Col span={24} md={10}>
                  <div className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Logo</p>
                    {logoPreview ? (
                      <div className="relative flex justify-center">
                        <div className="relative group">
                          <Image
                            src={logoPreview}
                            alt="Preview logo"
                            width={128}
                            height={128}
                            className="h-32 w-32 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("logo")}
                            className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:scale-110 transition-transform"
                          >
                            <CloseCircleFilled className="text-red-500 text-xl" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Upload.Dragger
                        accept="image/*"
                        showUploadList={false}
                        customRequest={pickImageUpload("logo")}
                        className="!bg-zinc-50 dark:!bg-zinc-900/50 !border-zinc-300 dark:!border-zinc-700 hover:!border-indigo-500 !rounded-xl"
                      >
                        <div className="flex flex-col items-center gap-2 py-4">
                          <InboxOutlined className="text-3xl text-indigo-400" />
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Arraste sua logo aqui
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            ou clique para selecionar &bull; PNG, JPG, WEBP até 12MB
                          </p>
                        </div>
                      </Upload.Dragger>
                    )}
                  </div>
                </Col>
                <Col span={24} md={14}>
                  <div className="space-y-4 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Banner</p>
                    {bannerPreview ? (
                      <div className="relative">
                        <Image
                          src={bannerPreview}
                          alt="Preview banner"
                          width={560}
                          height={112}
                          className="h-28 w-full rounded-xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("banner")}
                          className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 rounded-full shadow-md hover:scale-110 transition-transform"
                        >
                          <CloseCircleFilled className="text-red-500 text-xl" />
                        </button>
                      </div>
                    ) : (
                      <Upload.Dragger
                        accept="image/*"
                        showUploadList={false}
                        customRequest={pickImageUpload("banner")}
                        className="!bg-zinc-50 dark:!bg-zinc-900/50 !border-zinc-300 dark:!border-zinc-700 hover:!border-indigo-500 !rounded-xl"
                      >
                        <div className="flex flex-col items-center gap-2 py-4">
                          <InboxOutlined className="text-3xl text-indigo-400" />
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Arraste o banner aqui
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            ou clique para selecionar &bull; Formato horizontal recomendado
                          </p>
                        </div>
                      </Upload.Dragger>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </div>

      <div className={SECTION_CONTAINER_CLASS}>
        <Card
          bordered={false}
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Endereço</span>}
          className="bg-transparent"
          styles={{ header: { padding: "24px 32px 0", borderBottom: "none" }, body: { padding: 32 } }}
        >
          <div className="space-y-4">
            <Row gutter={[24, 24]}>
              <Col span={24} md={6}>
                <Form.Item name="zipCode" label={<FormLabel>CEP</FormLabel>} rules={[{ required: true, message: "CEP é obrigatório" }]}>
                  <Input size="large" placeholder="00000-000" maxLength={9} className={INPUT_CLASS} onChange={handleZipCodeChange} onBlur={handleZipCodeBlur} />
                </Form.Item>
                {loadingByCep && <p className="text-xs text-zinc-500 -mt-4">Buscando CEP...</p>}
              </Col>
              <Col span={24} md={14}>
                <Form.Item name="street" label={<FormLabel>Logradouro</FormLabel>} rules={[{ required: true, message: "Rua/Av é obrigatório" }]}>
                  <Input size="large" placeholder="Rua das Flores" className={INPUT_CLASS} />
                </Form.Item>
              </Col>
              <Col span={24} md={4}>
                <Form.Item name="number" label={<FormLabel>Número</FormLabel>} rules={[{ required: true, message: "Número é obrigatório" }]}>
                  <Input size="large" placeholder="123" className={INPUT_CLASS} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col span={24} md={10}>
                <Form.Item name="neighborhood" label={<FormLabel>Bairro</FormLabel>} rules={[{ required: true, message: "Bairro é obrigatório" }]}>
                  <Input size="large" placeholder="Bairro Centro" className={INPUT_CLASS} />
                </Form.Item>
              </Col>
              <Col span={24} md={14}>
                <Form.Item name="complement" label={<FormLabel>Complemento</FormLabel>}>
                  <Input size="large" placeholder="Apto 101, Fundos, Próximo ao mercado..." className={INPUT_CLASS} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col span={24} md={18}>
                <Form.Item name="city" label={<FormLabel>Cidade</FormLabel>} rules={[{ required: true, message: "Cidade é obrigatória" }]}>
                  <Select
                    showSearch
                    placeholder="Selecione a cidade"
                    optionFilterProp="label"
                    disabled={!selectedState}
                    options={cities.map((city) => ({ value: city, label: city }))}
                    onChange={(city) => form.setFieldValue("city", city)}
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={6}>
                <Form.Item name="state" label={<FormLabel>UF</FormLabel>} rules={[{ required: true, message: "UF obrigatória" }]}>
                  <Select
                    showSearch
                    placeholder="UF"
                    optionFilterProp="label"
                    options={states.map((s) => ({ value: s.sigla, label: `${s.sigla} - ${s.nome}` }))}
                    onChange={handleStateChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      <div className={SECTION_CONTAINER_CLASS}>
        <div className="px-8 py-6">
          <Collapse
            ghost
            items={[
              {
                key: "advanced",
                label: (
                  <span className="flex items-center gap-2 text-base font-semibold text-zinc-700 dark:text-zinc-300">
                    <SettingOutlined className="text-zinc-400" />
                    Configurações Avançadas
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-4">
                    <Row gutter={[24, 24]}>
                      <Col span={24} md={6}>
                        <Form.Item name="slotInterval" label={<FormLabel>Intervalo de Agenda (min)</FormLabel>} rules={[{ required: true }]}>
                          <InputNumber size="large" min={15} max={120} step={15} className="w-full" />
                        </Form.Item>
                      </Col>
                      <Col span={24} md={6}>
                        <Form.Item name="bufferBetweenSlots" label={<FormLabel>Intervalo entre serviços (min)</FormLabel>}>
                          <InputNumber size="large" min={0} max={60} step={5} className="w-full" />
                        </Form.Item>
                      </Col>
                      <Col span={24} md={6}>
                        <Form.Item name="minAdvanceMinutes" label={<FormLabel>Antecedência Mínima (min)</FormLabel>}>
                          <InputNumber size="large" min={0} step={15} className="w-full" />
                        </Form.Item>
                      </Col>
                      <Col span={24} md={6}>
                        <Form.Item name="maxAdvanceDays" label={<FormLabel>Agenda Aberta (dias)</FormLabel>}>
                          <InputNumber size="large" min={1} max={365} className="w-full" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="timeZone" label={<FormLabel>Fuso Horário</FormLabel>} rules={[{ required: true, message: "Selecione o fuso horário" }]}>
                          <Select
                            showSearch
                            placeholder="Selecione o fuso horário"
                            optionFilterProp="label"
                            options={timezones.map((tz) => ({ value: tz, label: tz }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Estas configurações podem ser alteradas depois nas configurações da loja.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button size="large" onClick={onCancel} className="text-zinc-600 dark:text-zinc-300">
          Cancelar
        </Button>
        <Button
          type="primary"
          size="large"
          loading={isSubmitting}
          onClick={handleNext}
        >
          Criar Loja e Continuar
        </Button>
      </div>
    </Form>
  );
};

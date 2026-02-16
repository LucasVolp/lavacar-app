"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Row, Col, InputNumber, Select, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useCreateShop } from "@/hooks/shop/useCreateShop";
import { CreateShopDto } from "@/types/shop";
import { formatDocument, generateSlug } from "@/utils/formatters";
import { validateDocument } from "@/utils/validators";
import { brasilApiService, BrasilApiStateResponse } from "@/services/brasilApi";
import { timeApiService } from "@/services/timeApi";
import { maskCep } from "@/lib/masks";

interface CreateShopFormProps {
  organizationId: string;
  ownerId?: string;
}

// Estilos Reutilizáveis (Clean/Linear Style)
const SECTION_CONTAINER_CLASS = 
  "bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200";

const INPUT_CLASS = 
  "w-full bg-white dark:bg-zinc-950/50 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-indigo-500 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-lg";

// Helper para Labels consistentes
const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-zinc-700 dark:text-zinc-300 font-medium tracking-tight text-sm">
    {children}
  </span>
);

export const CreateShopForm: React.FC<CreateShopFormProps> = ({
  organizationId,
  ownerId,
}) => {
  const router = useRouter();
  const [form] = Form.useForm<CreateShopDto>();
  const selectedState = Form.useWatch("state", form);
  const createShop = useCreateShop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [states, setStates] = useState<BrasilApiStateResponse[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingByCep, setLoadingByCep] = useState(false);
  const [loadingByCnpj, setLoadingByCnpj] = useState(false);
  const [timezones, setTimezones] = useState<string[]>([]);

  const handleFinish = async (values: CreateShopDto) => {
    setIsSubmitting(true);
    try {
      const payload: CreateShopDto = {
        ...values,
        document: values.document?.replace(/\D/g, ''), // Remove formatting before sending
        organizationId,
        ownerId,
      };

      await createShop.mutateAsync(payload);
      message.success("Estabelecimento criado com sucesso!");
      router.push(`/organization/${organizationId}/shops`);
    } catch (error: unknown) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errMsg = (error as any)?.response?.data?.message || "Erro ao criar estabelecimento";
      message.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!slugTouched) {
        const slug = generateSlug(name);
        form.setFieldsValue({ slug });
    }
  };

  const handleSlugChange = () => {
    setSlugTouched(true);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    form.setFieldsValue({ document: formatted });
  };

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const [ufList, timezoneList, ipTimezone] = await Promise.all([
          brasilApiService.listStates(),
          timeApiService.listTimezones(),
          timeApiService.detectTimezoneByIp().catch(() => null),
        ]);

        if (!active) return;
        setStates(ufList);
        setTimezones(timezoneList);
        form.setFieldValue("timeZone", ipTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo");
      } catch {
        if (!active) return;
        const fallbackTimezones = typeof Intl.supportedValuesOf === "function"
          ? Intl.supportedValuesOf("timeZone")
          : ["America/Sao_Paulo"];
        setTimezones(fallbackTimezones);
      }
    };

    loadInitialData();
    return () => {
      active = false;
    };
  }, [form]);

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
          message.warning("CEP encontrado, mas não foi possível carregar cidades automaticamente.");
        }
      }
    } catch {
      message.warning("CEP não encontrado. Você pode preencher o endereço manualmente.");
    } finally {
      setLoadingByCep(false);
    }
  };

  const handleDocumentBlur = async () => {
    const document = String(form.getFieldValue("document") || "");
    const digits = document.replace(/\D/g, "");
    if (digits.length !== 14) {
      return;
    }

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
      message.info("CNPJ não encontrado na BrasilAPI. Continue o preenchimento manualmente.");
    } finally {
      setLoadingByCnpj(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("zipCode", maskCep(e.target.value));
  };


  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        slotInterval: 30,
        bufferBetweenSlots: 0,
        maxAdvanceDays: 30,
        minAdvanceMinutes: 60,
        timeZone: "America/Sao_Paulo",
      }}
      className="max-w-5xl mx-auto pb-24 space-y-8"
      requiredMark={false}
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1">
           <Button 
             type="text" 
             icon={<ArrowLeftOutlined />} 
             className="pl-0 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center mb-1"
             onClick={() => router.back()}
           >
             Voltar para listagem
           </Button>
           <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
             Novo Estabelecimento
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-2xl">
             Cadastre uma nova unidade da sua organização. As configurações iniciais podem ser editadas posteriormente.
           </p>
        </div>
        
        <div className="flex items-center gap-3 pt-6 md:pt-0">
            <Button 
              size="large" 
              type="text"
              onClick={() => router.back()} 
              className="text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={isSubmitting}
              icon={<SaveOutlined />}
              className="bg-zinc-900 dark:bg-indigo-600 hover:!bg-zinc-800 dark:hover:!bg-indigo-500 shadow-xl shadow-black/10 dark:shadow-indigo-900/20 border-0"
            >
              Criar Loja
            </Button>
        </div>
      </div>

      {/* --- DADOS GERAIS --- */}
      <div className={SECTION_CONTAINER_CLASS}>
        <Card 
          bordered={false} 
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Dados Gerais</span>}
          className="bg-transparent"
          styles={{ 
            header: { padding: '24px 32px 0 32px', borderBottom: 'none' },
            body: { padding: '32px' } 
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24} md={12}>
              <Form.Item
                name="name"
                label={<FormLabel>Nome do Estabelecimento</FormLabel>}
                rules={[{ required: true, message: "O nome é obrigatório" }]}
              >
                <Input 
                  size="large" 
                  placeholder="Ex: Lava Jato Centro" 
                  onChange={handleNameChange} 
                  className={INPUT_CLASS} 
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="slug"
                label={<FormLabel>Slug (URL)</FormLabel>}
                tooltip="Este campo define o endereço web do seu shop"
                extra={<span className="text-xs text-zinc-500">Identificador único (ex: lavacar.com.br/loja/<strong>seu-slug</strong>)</span>}
              >
                <Input 
                  size="large" 
                  placeholder="ex: lava-jato-centro" 
                  className={INPUT_CLASS}
                  onChange={handleSlugChange}
                />
              </Form.Item>
            </Col>

             <Col span={24} md={8}>
              <Form.Item
                name="phone"
                label={<FormLabel>Telefone / WhatsApp</FormLabel>}
                rules={[{ required: true, message: "O telefone é obrigatório" }]}
              >
                <Input size="large" placeholder="(00) 00000-0000" className={INPUT_CLASS} />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item
                name="email"
                label={<FormLabel>Email de Contato</FormLabel>}
                rules={[{ type: "email", message: "Email inválido" }]}
              >
                <Input size="large" placeholder="contato@loja.com" className={INPUT_CLASS} />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item
                name="document"
                label={<FormLabel>CNPJ / CPF</FormLabel>}
                rules={[
                  { 
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (validateDocument(value)) return Promise.resolve();
                      return Promise.reject(new Error("CPF ou CNPJ inválido"));
                    }
                  }
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
              {loadingByCnpj && (
                <p className="text-xs text-zinc-500 -mt-4">Buscando dados do CNPJ...</p>
              )}
            </Col>

            <Col span={24}>
              <Form.Item
                name="description"
                label={<FormLabel>Descrição (Opcional)</FormLabel>}
              >
                <Input.TextArea 
                  size="large" 
                  rows={4} 
                  placeholder="Descreva os serviços, diferenciais e horário de funcionamento..." 
                  className={INPUT_CLASS} 
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </div>

      {/* --- ENDEREÇO --- */}
      <div className={SECTION_CONTAINER_CLASS}>
        <Card 
          bordered={false} 
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Endereço</span>}
          className="bg-transparent"
          styles={{ 
            header: { padding: '24px 32px 0 32px', borderBottom: 'none' },
            body: { padding: '32px' } 
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24} md={6}>
              <Form.Item
                name="zipCode"
                label={<FormLabel>CEP</FormLabel>}
                rules={[{ required: true, message: "CEP é obrigatório" }]}
              >
                <Input
                  size="large"
                  placeholder="00000-000"
                  maxLength={9}
                  className={INPUT_CLASS}
                  onChange={handleZipCodeChange}
                  onBlur={handleZipCodeBlur}
                />
              </Form.Item>
              {loadingByCep && (
                <p className="text-xs text-zinc-500 -mt-4">Buscando CEP...</p>
              )}
            </Col>
            <Col span={24} md={14}>
              <Form.Item
                name="street"
                label={<FormLabel>Logradouro</FormLabel>}
                rules={[{ required: true, message: "Rua/Av é obrigatório" }]}
              >
                <Input size="large" placeholder="Rua das Flores" className={INPUT_CLASS} />
              </Form.Item>
            </Col>
            <Col span={24} md={4}>
              <Form.Item
                name="number"
                label={<FormLabel>Número</FormLabel>}
                rules={[{ required: true, message: "Número é obrigatório" }]}
              >
                <Input size="large" placeholder="123" className={INPUT_CLASS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={24} md={10}>
              <Form.Item
                name="neighborhood"
                label={<FormLabel>Bairro</FormLabel>}
                rules={[{ required: true, message: "Bairro é obrigatório" }]}
              >
                <Input size="large" placeholder="Bairro Centro" className={INPUT_CLASS} />
              </Form.Item>
            </Col>
            <Col span={24} md={14}>
              <Form.Item
                name="complement"
                label={<FormLabel>Complemento</FormLabel>}
              >
                <Input size="large" placeholder="Apto 101, Fundos, Próximo ao mercado..." className={INPUT_CLASS} />
              </Form.Item>
            </Col>
        </Row>
        <Row gutter={[24, 24]}>
            <Col span={24} md={18}>
              <Form.Item
                name="city"
                label={<FormLabel>Cidade</FormLabel>}
                rules={[{ required: true, message: "Cidade é obrigatória" }]}
              >
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
              <Form.Item
                name="state"
                label={<FormLabel>UF</FormLabel>}
                rules={[{ required: true, message: "UF obrigatória" }]}
              >
                <Select
                  showSearch
                  placeholder="UF"
                  optionFilterProp="label"
                  options={states.map((state) => ({
                    value: state.sigla,
                    label: `${state.sigla} - ${state.nome}`,
                  }))}
                  onChange={handleStateChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </div>

       {/* --- CONFIGURAÇÕES DE AGENDAMENTO --- */}
       <div className={SECTION_CONTAINER_CLASS}>
        <Card 
          bordered={false} 
          title={<span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Configurações de Agendamento</span>}
          className="bg-transparent"
          styles={{ 
            header: { padding: '24px 32px 0 32px', borderBottom: 'none' },
            body: { padding: '32px' } 
          }}
        >
         <Row gutter={[24, 24]}>
           <Col span={24} md={6}>
             <Form.Item
               name="slotInterval"
               label={<FormLabel>Intervalo de Agenda (min)</FormLabel>}
               rules={[{ required: true }]}
               extra={<span className="text-xs text-zinc-500 dark:text-zinc-500 block mt-1">Tempo padrão de cada horário</span>}
             >
               <InputNumber size="large" min={15} max={120} step={15} className="w-full" />
             </Form.Item>
           </Col>
           <Col span={24} md={6}>
             <Form.Item
               name="bufferBetweenSlots"
               label={<FormLabel>Intervalo entre serviços (min)</FormLabel>}
               extra={<span className="text-xs text-zinc-500 dark:text-zinc-500 block mt-1">Tempo de folga/trânsito entre agendamentos</span>}
             >
               <InputNumber size="large" min={0} max={60} step={5} className="w-full" />
             </Form.Item>
           </Col>
           <Col span={24} md={6}>
             <Form.Item
               name="minAdvanceMinutes"
               label={<FormLabel>Antecedência Mínima (min)</FormLabel>}
               extra={<span className="text-xs text-zinc-500 dark:text-zinc-500 block mt-1">Bloqueia agendamentos muito em cima da hora</span>}
             >
               <InputNumber size="large" min={0} step={15} className="w-full" />
             </Form.Item>
           </Col>
           <Col span={24} md={6}>
             <Form.Item
               name="maxAdvanceDays"
               label={<FormLabel>Agenda Aberta (dias)</FormLabel>}
               extra={<span className="text-xs text-zinc-500 dark:text-zinc-500 block mt-1">Quantos dias à frente o cliente vê</span>}
             >
               <InputNumber size="large" min={1} max={365} className="w-full" />
             </Form.Item>
           </Col>
           <Col span={24}>
             <Form.Item
               name="timeZone"
               label={<FormLabel>Timezone da Loja</FormLabel>}
               rules={[{ required: true, message: "Selecione o timezone" }]}
               extra={<span className="text-xs text-zinc-500 dark:text-zinc-500 block mt-1">Usado para agenda, bloqueios e cálculos de disponibilidade</span>}
             >
               <Select
                 showSearch
                 placeholder="Selecione o timezone"
                 optionFilterProp="label"
                 options={timezones.map((tz) => ({ value: tz, label: tz }))}
               />
             </Form.Item>
           </Col>
         </Row>
      </Card>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="flex justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button 
          size="large" 
          onClick={() => router.back()}
          className="text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancelar
        </Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          size="large"
          loading={isSubmitting}
          icon={<SaveOutlined />}
          className="bg-zinc-900 dark:bg-indigo-600 hover:!bg-zinc-800 dark:hover:!bg-indigo-500 shadow-xl shadow-black/10 dark:shadow-indigo-900/20 border-0"
        >
          Criar Loja
        </Button>
      </div>
    </Form>
  );
};

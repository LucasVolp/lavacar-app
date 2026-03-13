"use client";

import React, { useState, useRef } from "react";
import { Button, Input, Form, Select, AutoComplete, Spin, message } from "antd";
import {
  PhoneOutlined,
  CarOutlined,
  LoadingOutlined,
  SearchOutlined,
  CheckCircleFilled,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Vehicle } from "@/types/vehicle";
import { VehicleSelector } from "@/components/booking/VehicleSelector";
import { usePublicUserByPhone } from "@/hooks/useUsers";
import { useCheckShopClient } from "@/hooks/useShopClients";
import { maskPhone } from "@/lib/masks";
import { useFipeBrandsByVehicleCategory, useFipeModelsByVehicleCategory } from "@/hooks/useFipe";
import { authService, GuestLoginPayload } from "@/services/auth";
import { usersService } from "@/services/users";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface IdentificationStepProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onAddVehicle: () => void;
  shopId: string;
  onGuestUserCreated: (userId: string, vehicleId: string, vehicleInfo?: { id: string; brand: string; model: string; size: string; type: string; plate?: string; color?: string }) => void;
  onLogin: () => void;
}

export function IdentificationStep({
  isAuthenticated,
  isLoading,
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onAddVehicle,
  shopId,
  onGuestUserCreated,
}: IdentificationStepProps) {
  const phoneInputRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState("");
  const debouncedPhone = useDebouncedValue(phone, 1000);
  const rawPhone = debouncedPhone.replace(/\D/g, "");
  const isValidPhone = rawPhone.length >= 10;
  const searchedPhone = isValidPhone ? rawPhone : null;

  const {
    data: publicUser,
    isFetching: isSearchingUser,
    isSuccess: isSearchComplete,
  } = usePublicUserByPhone(searchedPhone, !!searchedPhone);

  const isUserFound = isSearchComplete && !!publicUser;

  const { data: shopClient } = useCheckShopClient(
    shopId,
    publicUser?.id || null,
    !!publicUser?.id
  );

  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleType = Form.useWatch("vehicleType", form) || "CAR";
  const selectedBrandName = Form.useWatch("brand", form);

  const { data: brandsData } = useFipeBrandsByVehicleCategory(vehicleType);
  const brands = brandsData || [];

  const selectedBrand = brands.find((b) => b.name === selectedBrandName);
  const brandCode = selectedBrand ? String(selectedBrand.code) : null;

  const { data: modelsData, isLoading: isLoadingModels } = useFipeModelsByVehicleCategory(
    vehicleType,
    brandCode,
    !!brandCode
  );
  const models = modelsData || [];

  const brandOptions = brands.map((b) => ({ value: b.name }));
  const modelOptions = models.map((m) => ({ value: m.name }));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
  };

  const handleClearPhone = () => {
    setPhone("");
    onSelectVehicle("");
  };

  const handleSelectExistingVehicle = (vehicleId: string) => {
    if (!publicUser) return;
    const vehicle = publicUser.vehicles?.find((v) => v.id === vehicleId);
    onSelectVehicle(vehicleId);
    onGuestUserCreated(publicUser.id, vehicleId, vehicle ? {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      size: vehicle.size,
      type: vehicle.type,
      plate: vehicle.plate,
      color: vehicle.color,
    } : undefined);
  };

  const handleCreateGuest = async (values: {
    firstName: string;
    lastName?: string;
    vehicleType: string;
    brand: string;
    model: string;
    size: string;
    plate?: string;
    color?: string;
    year?: string | number;
  }) => {
    setIsSubmitting(true);
    try {
      const rawPhoneValue = phone.replace(/\D/g, "");
      const payload: GuestLoginPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: rawPhoneValue,
        vehicle: {
          type: values.vehicleType,
          brand: values.brand,
          model: values.model,
          size: values.size,
          plate: values.plate || undefined,
          color: values.color || undefined,
          year: values.year ? Number(values.year) : undefined,
        },
      };

      await authService.guestLogin(payload);

      const createdUser = await usersService.findPublicUser(rawPhoneValue);
      const vehicle = createdUser?.vehicles?.[0];
      const vehicleId = vehicle?.id;

      if (vehicleId && createdUser) {
        onGuestUserCreated(createdUser.id, vehicleId, vehicle ? {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          size: vehicle.size,
          type: vehicle.type,
          plate: vehicle.plate,
          color: vehicle.color,
        } : undefined);
      } else {
        message.error("Erro ao buscar dados do veículo. Tente novamente.");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Erro ao prosseguir.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="p-5 sm:p-6 md:p-8 animate-fade-in">
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Selecione o Veículo
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            Qual veículo receberá o tratamento hoje?
          </p>
        </div>
        <VehicleSelector
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={onSelectVehicle}
          onAddVehicle={onAddVehicle}
          loading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 md:p-8 animate-fade-in">
      <div className="mb-6 sm:mb-8 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center">
          <PhoneOutlined className="text-2xl sm:text-3xl text-indigo-500 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Sua Identificação
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-sm mx-auto">
          Informe seu número de WhatsApp para buscarmos seus dados.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div ref={phoneInputRef} style={{ overflowAnchor: "auto" }}>
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2.5 text-center sm:text-left">
            Número de WhatsApp
          </label>
          <Input
            value={phone}
            onChange={handlePhoneChange}
            disabled={isSubmitting || (isUserFound && !!publicUser)}
            size="large"
            placeholder="(00) 00000-0000"
            prefix={
              <span className="flex items-center text-slate-400 dark:text-slate-500 pr-1">
                <SearchOutlined className="text-base" />
              </span>
            }
            suffix={
              isSearchingUser ? (
                <Spin indicator={<LoadingOutlined className="text-indigo-500" spin />} size="small" />
              ) : isUserFound && publicUser ? (
                <button
                  type="button"
                  onClick={handleClearPhone}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors px-1"
                >
                  <CloseOutlined className="text-xs" />
                  <span className="hidden sm:inline">Limpar</span>
                </button>
              ) : null
            }
            className="!h-14 sm:!h-16 !rounded-2xl !text-base sm:!text-lg !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] focus-within:!border-indigo-500 dark:focus-within:!border-indigo-400 !transition-all [&_input]:!bg-transparent [&_input::placeholder]:!text-slate-300 dark:[&_input::placeholder]:!text-slate-600 [&_input]:!text-slate-900 dark:[&_input]:!text-white"
          />

          {phone && !isValidPhone && rawPhone.length > 0 && (
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 text-center sm:text-left">
              Continue digitando...
            </p>
          )}
        </div>

        <div style={{ overflowAnchor: "none" }}>
          {isUserFound && publicUser && (
            <div>
              <div className="bg-white dark:bg-[#18181b] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#27272a] overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 border-b border-slate-100 dark:border-[#27272a] px-5 py-5 sm:px-8 sm:py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <span className="text-2xl sm:text-3xl">{shopClient ? "\uD83C\uDF89" : "\uD83D\uDC4B"}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                        {shopClient
                          ? `Que bom te ver de volta, ${publicUser.firstName}!`
                          : `Olá, ${publicUser.firstName}!`}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {shopClient
                          ? "Seus dados já estão salvos. Selecione o veículo."
                          : "Encontramos seu cadastro. Selecione o veículo para continuar."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {publicUser.vehicles && publicUser.vehicles.length > 0 ? (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Seus veículos
                      </span>
                      <div className="space-y-2.5">
                        {publicUser.vehicles.map((v) => {
                          const isSelected = selectedVehicleId === v.id;
                          const isDisabled = !v.isActive;

                          return (
                            <button
                              key={v.id}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                if (!isDisabled) {
                                  handleSelectExistingVehicle(v.id);
                                }
                              }}
                              className={`
                                w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left
                                active:scale-[0.98]
                                ${isDisabled
                                  ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-[#09090b] border-slate-200 dark:border-[#27272a]"
                                  : isSelected
                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 shadow-sm"
                                    : "border-slate-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-[#18181b]"
                                }
                              `}
                            >
                              <div
                                className={`
                                  w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                  ${isSelected
                                    ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-slate-100 dark:bg-[#27272a] text-slate-400 dark:text-slate-500"
                                  }
                                `}
                              >
                                <CarOutlined className="text-lg sm:text-xl" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                                    {v.brand} {v.model}
                                  </span>
                                  {isDisabled && (
                                    <span className="text-[10px] bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                                      Inativo
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                  {v.plate || "Sem placa"}
                                  {v.color ? ` · ${v.color}` : ""}
                                  {v.year ? ` · ${v.year}` : ""}
                                </p>
                              </div>

                              {isSelected && (
                                <CheckCircleFilled className="text-emerald-500 text-lg shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#27272a] flex items-center justify-center mx-auto mb-3">
                        <CarOutlined className="text-2xl text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Nenhum veículo encontrado para este número.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {searchedPhone && !isUserFound && !isSearchingUser && !publicUser && (
            <div>
              <div className="bg-white dark:bg-[#18181b] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-[#27272a] overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border-b border-slate-100 dark:border-[#27272a] px-5 py-5 sm:px-8 sm:py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                      <UserOutlined className="text-xl sm:text-2xl text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Quase lá!
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Preencha seus dados para agendar.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateGuest}
                    requiredMark={false}
                    initialValues={{ vehicleType: "CAR", size: "MEDIUM" }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Nome *
                          </span>
                        }
                        name="firstName"
                        rules={[{ required: true, message: "Informe seu nome" }]}
                        className="!mb-0"
                      >
                        <Input
                          size="large"
                          placeholder="Seu nome"
                          className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Sobrenome
                          </span>
                        }
                        name="lastName"
                        className="!mb-0"
                      >
                        <Input
                          size="large"
                          placeholder="Opcional"
                          className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                        />
                      </Form.Item>
                    </div>

                    <div className="flex items-center gap-3 my-5 sm:my-6">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-[#27272a]" />
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <CarOutlined className="text-sm" />
                        <span className="text-xs font-bold uppercase tracking-wider">Veículo</span>
                      </div>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-[#27272a]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Tipo *
                          </span>
                        }
                        name="vehicleType"
                        rules={[{ required: true, message: "Selecione" }]}
                        className="!mb-0"
                      >
                        <Select
                          size="large"
                          className="!h-12 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!bg-slate-50 dark:[&_.ant-select-selector]:!bg-[#09090b] [&_.ant-select-selector]:!border-slate-200 dark:[&_.ant-select-selector]:!border-[#27272a]"
                          onChange={() => form.setFieldsValue({ brand: undefined, model: undefined })}
                        >
                          <Select.Option value="CAR">Carro</Select.Option>
                          <Select.Option value="MOTORCYCLE">Moto</Select.Option>
                          <Select.Option value="TRUCK">Caminhonete</Select.Option>
                          <Select.Option value="SUV">SUV</Select.Option>
                          <Select.Option value="VAN">Van</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Tamanho *
                          </span>
                        }
                        name="size"
                        rules={[{ required: true, message: "Selecione" }]}
                        className="!mb-0"
                      >
                        <Select
                          size="large"
                          className="!h-12 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!bg-slate-50 dark:[&_.ant-select-selector]:!bg-[#09090b] [&_.ant-select-selector]:!border-slate-200 dark:[&_.ant-select-selector]:!border-[#27272a]"
                        >
                          <Select.Option value="SMALL">Pequeno</Select.Option>
                          <Select.Option value="MEDIUM">Médio</Select.Option>
                          <Select.Option value="LARGE">Grande</Select.Option>
                          <Select.Option value="EXTRA_LARGE">Extra Grande</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Marca *
                          </span>
                        }
                        name="brand"
                        rules={[{ required: true, message: "Informe a marca" }]}
                        className="!mb-0"
                      >
                        <AutoComplete
                          options={brandOptions}
                          filterOption={(input, option) =>
                            String(option?.value || "")
                              .toUpperCase()
                              .includes(input.toUpperCase())
                          }
                          onChange={() => form.setFieldsValue({ model: undefined })}
                        >
                          <Input
                            size="large"
                            placeholder="Ex: Honda"
                            className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                          />
                        </AutoComplete>
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider flex items-center gap-2">
                            Modelo * {isLoadingModels && <Spin size="small" />}
                          </span>
                        }
                        name="model"
                        rules={[{ required: true, message: "Informe o modelo" }]}
                        className="!mb-0"
                      >
                        <AutoComplete
                          options={modelOptions}
                          filterOption={(input, option) =>
                            String(option?.value || "")
                              .toUpperCase()
                              .includes(input.toUpperCase())
                          }
                          disabled={!selectedBrandName}
                        >
                          <Input
                            size="large"
                            placeholder={selectedBrandName ? "Ex: Civic" : "Selecione a marca"}
                            className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                          />
                        </AutoComplete>
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Placa
                          </span>
                        }
                        name="plate"
                        className="!mb-0"
                      >
                        <Input
                          size="large"
                          placeholder="Opcional"
                          maxLength={7}
                          className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Cor
                          </span>
                        }
                        name="color"
                        className="!mb-0"
                      >
                        <Input
                          size="large"
                          placeholder="Opcional"
                          className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                        />
                      </Form.Item>
                      <Form.Item
                        label={
                          <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">
                            Ano
                          </span>
                        }
                        name="year"
                        className="!mb-0"
                      >
                        <Input
                          size="large"
                          type="number"
                          placeholder="Opcional"
                          className="!rounded-xl !h-12 !bg-slate-50 dark:!bg-[#09090b] !border-slate-200 dark:!border-[#27272a] [&_input]:!bg-transparent [&_input]:!text-slate-900 dark:[&_input]:!text-white"
                        />
                      </Form.Item>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={isSubmitting}
                      className="!mt-6 !rounded-2xl !border-none !h-14 !text-base sm:!text-lg !font-bold !shadow-lg !shadow-emerald-500/20 !bg-emerald-600 hover:!bg-emerald-500 active:!scale-[0.98] !transition-all"
                    >
                      Continuar Agendamento
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { App, Button, Form, Input, Modal, Upload, Image, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useCreateChecklist, useGetChecklist } from "@/hooks/useChecklist";
import { validateUUID } from "@/utils/validators";

const { Title } = Typography;
const { TextArea } = Input;

interface ChecklistModalProps {
  appointmentId: string;
  open: boolean;
  onClose: () => void;
  readOnly?: boolean;
}

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  appointmentId,
  open,
  onClose,
  readOnly = false,
}) => {
  const { message } = App.useApp();
  const [description, setDescription] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const normalizedAppointmentId = useMemo(
    () =>
      typeof appointmentId === "string" && validateUUID(appointmentId.trim())
        ? appointmentId.trim()
        : "",
    [appointmentId]
  );

  const { data: checklist, isLoading: isChecklistLoading } = useGetChecklist(
    open && normalizedAppointmentId ? normalizedAppointmentId : null
  );
  const createChecklist = useCreateChecklist();

  const hasChecklist = !!checklist;
  const isViewMode = readOnly || hasChecklist;

  const checklistFiles = useMemo<UploadFile[]>(
    () =>
      checklist?.photos.map((url, index) => ({
        uid: `existing-${index}`,
        name: `foto-${index + 1}.jpg`,
        status: "done",
        url,
      })) ?? [],
    [checklist]
  );

  const uploadProps: UploadProps = {
    listType: "picture-card",
    fileList: isViewMode ? checklistFiles : fileList,
    disabled: isViewMode,
    beforeUpload: () => false,
    onChange: ({ fileList: nextList }) => {
      if (!isViewMode) {
        setFileList(nextList);
      }
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await fileToBase64(file.originFileObj as File);
      }

      setPreviewImage((file.url || file.preview) as string);
      setPreviewOpen(true);
    },
  };

  const canSubmit = useMemo(
    () => !!normalizedAppointmentId && !isViewMode,
    [normalizedAppointmentId, isViewMode]
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const formData = new FormData();
    formData.append("appointmentId", normalizedAppointmentId);

    if (description.trim()) {
      formData.append("description", description.trim());
    }

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("photos", file.originFileObj as File);
      }
    });

    try {
      await createChecklist.mutateAsync(formData);
      message.success("Vistoria salva com sucesso.");
      setDescription("");
      setFileList([]);
      onClose();
    } catch {
      message.error("Não foi possível salvar a vistoria.");
    }
  };

  const handleClose = () => {
    setDescription("");
    setFileList([]);
    onClose();
  };

  return (
    <div className="space-y-4">
      <>
        <div className="space-y-4">
          <Modal
            open={open}
            onCancel={handleClose}
            destroyOnHidden
            width={720}
            title={<Title level={3} className="!m-0 !font-bold">Vistoria de Entrada</Title>}
            className="[&_.ant-modal-content]:!bg-white dark:[&_.ant-modal-content]:!bg-zinc-900 [&_.ant-modal-header]:!bg-transparent"
            footer={
              <div className="flex justify-end gap-2 border-t border-zinc-200 dark:border-zinc-700 pt-4">
                <Button ghost onClick={handleClose}>
                  Cancelar
                </Button>
                {!isViewMode && (
                  <Button
                    type="primary"
                    loading={createChecklist.isPending}
                    onClick={handleSubmit}
                  >
                    Salvar Vistoria
                  </Button>
                )}
              </div>
            }
          >
            <div className="space-y-5">
              {!normalizedAppointmentId && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Agendamento inválido para vistoria. Reabra o atendimento e tente novamente.
                </div>
              )}
              <div
                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-4
                [&_.ant-upload-list-item-container]:!w-[104px] [&_.ant-upload-list-item-container]:!h-[104px]
                [&_.ant-upload-select]:!border-zinc-300 dark:[&_.ant-upload-select]:!border-zinc-700
                [&_.ant-upload-select]:!bg-white dark:[&_.ant-upload-select]:!bg-zinc-900"
              >
                <Upload {...uploadProps}>
                  {!isViewMode && (
                    <button type="button" className="border-0 bg-transparent text-zinc-500 dark:text-zinc-300">
                      <PlusOutlined />
                      <div className="mt-2">Upload</div>
                    </button>
                  )}
                </Upload>
              </div>

              <Form layout="vertical" requiredMark={false}>
                <Form.Item label="Descrição">
                  <TextArea
                    rows={4}
                    value={isViewMode ? checklist?.description ?? "" : description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Descreva o estado do veículo na entrada..."
                    disabled={isViewMode || isChecklistLoading}
                  />
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </div>

        <div className="space-y-4">
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
              alt="Prévia da vistoria"
            />
          )}
        </div>

      </>
    </div>

  );
};

export default ChecklistModal;

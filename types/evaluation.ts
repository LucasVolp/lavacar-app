export interface Evaluation {
    id: string;
    rating: number;
    comment?: string;
    appointmentId: string;
    userId: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateEvaluationPayload {
    rating: number;
    comment?: string;
    appointmentId: string;
    userId: string;
}

export interface UpdateEvaluationPayload {
    rating?: number;
    comment?: string;
}
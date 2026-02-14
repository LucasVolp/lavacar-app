export interface Evaluation {
    id: string;
    rating: number;
    comment?: string;
    photos?: string[];
    appointmentId: string;
    userId: string;

    createdAt: string;
    updatedAt: string;
}

/**
 * Evaluation with nested appointment relations,
 * as returned by the backend findAll endpoint.
 */
export interface EvaluationWithRelations extends Evaluation {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        picture?: string;
    };
    appointment?: {
        id: string;
        services?: { serviceName: string }[];
        vehicle?: { brand: string; model: string; plate: string };
        shop?: { id: string; name: string };
    };
}

export interface CreateEvaluationPayload {
    rating: number;
    comment?: string;
    photos?: string[];
    appointmentId: string;
    userId: string;
}

export interface UpdateEvaluationPayload {
    rating?: number;
    comment?: string;
    photos?: string[];
}

export interface BlockedTime {
    id: string;
    type: 'FULL_DAY' | 'PARTIAL';
    date: string;
    reason?: string;

    startTime?: string;
    endTime?: string;

    shopId: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateBlockedTimePayload {
    type: 'FULL_DAY' | 'PARTIAL';
    date: string;
    reason?: string;

    startTime?: string;
    endTime?: string;

    shopId: string;
}

export interface UpdateBlockedTimePayload {
    type?: 'FULL_DAY' | 'PARTIAL';
    date?: string;
    reason?: string;

    startTime?: string;
    endTime?: string;
}
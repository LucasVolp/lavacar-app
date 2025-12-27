export interface Schedule {
    id: string;
    weekday: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    isOpen: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    startTime: string;
    endTime: string;

    breakStartTime?: string;
    breakEndTime?: string;

    shopId: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateSchedulePayload {
    weekday: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    isOpen: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    startTime: string;
    endTime: string;

    breakStartTime?: string;
    breakEndTime?: string;

    shopId: string;
}

export interface UpdateSchedulePayload {
    weekday?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    isOpen?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    startTime?: string;
    endTime?: string;

    breakStartTime?: string;
    breakEndTime?: string;
}
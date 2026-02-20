export { authService } from "./auth";
export type { AuthUser, LoginCredentials, RegisterPayload, AuthResponse } from "./auth";

export { appointmentService } from "./appointment";
export type { CreateAppointmentRequest } from "./appointment";

export { shopService } from "./shop";
export { serviceService } from "./service";
export { serviceVariantService } from "./serviceVariant";
export { vehicleService } from "./vehicle";
export { scheduleService } from "./schedule";
export { usersService } from "./users";
export { blockedTimeService } from "./blockedTime";
export { evaluationService } from "./evaluation";

export { default as axiosInstance } from "./axiosInstance";
export { organizationMemberService } from "./organization-members";
export { checklistService } from "./checklist";
export { salesGoalService } from "./salesGoal";
export { shopClientService } from "./shopClient";

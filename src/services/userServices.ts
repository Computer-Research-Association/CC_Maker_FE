import api from "../api/apiClient";

export type UpdateMePayload = { name: string; email: string };

export const userService = {
  updateMe: (body: UpdateMePayload) => api.put("/api/user/me", body),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/api/user/change-password", { currentPassword, newPassword }),
  deleteMe: () => api.delete("/api/user/me"),
};

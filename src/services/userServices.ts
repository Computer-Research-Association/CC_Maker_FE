import api from "../api/apiClient";

export type UpdateMePayload = { name: string; email: string };

export const userService = {
  updateMe: (body: UpdateMePayload) => {
    // null 체크 및 기본값 설정
    const safeBody = {
      name: body.name || "",
      email: body.email || ""
    };
    
    // 빈 문자열 체크
    if (!safeBody.name.trim() || !safeBody.email.trim()) {
      throw new Error("이름과 이메일을 모두 입력해주세요.");
    }
    
    return api.put("/api/user/me", safeBody);
  },
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/api/user/change-password", { currentPassword, newPassword }),
  deleteMe: () => api.delete("/api/user/me"),
};

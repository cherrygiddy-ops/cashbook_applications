// src/hooks/useLogin.ts

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type User from "../entities/UserContext";
import { axiosInstance } from "../services/ApiClient";
import LoginService from "../services/LoginService";
import { useAuthStore } from "@/Store/AuthStore";

const useLogin = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const navigate = useNavigate();

  return useMutation<
    { token: string },
    AxiosError,
    { phoneNumber: string; password: string }
  >({
    mutationFn: async (payload) => {
      return await LoginService.login(payload);
    },

    onSuccess: async (data) => {
      setAccessToken(data.token);

      const userRes = await axiosInstance.get<User>(
        "/auth/currentUser",
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      useAuthStore.setState({
        user: userRes.data,
        loading: false,
      });

      toast.success("Login successful!", {
        description: "Welcome to Cashbook.",
        duration: 3000,
      });

      // Go to the protected Cashbook dashboard
      navigate("/dashboard");
    },

    onError: (error) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : (error.response?.data as { message?: string })?.message ||
            error.message ||
            "Please try again.";

      toast.error("Login failed", { description: message, duration: 4000 });
    },
  });
};

export default useLogin;
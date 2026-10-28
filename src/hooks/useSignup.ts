import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import type SignupPayload from "@/entities/SignupPayload";
import type SignupResponse from "@/entities/SignupResponse";
import SignupService from "@/services/SignupService";

const useSignup = () => {
  const navigate = useNavigate();

  return useMutation<SignupResponse, AxiosError, SignupPayload>({
    mutationFn: (payload) => SignupService.signUp(payload),

    onSuccess: (data) => {
      toast.success("Account created!", {
        description: `Welcome, ${data.username}! Your Cashbook account has been created successfully.`,
        duration: 4000,
      });

      navigate("/");
    },
    onError: (error) => {
      const responseData = error.response?.data;

      let message = "Unable to create account. Please try again.";

      if (typeof responseData === "string" && responseData.trim()) {
        message = responseData;
      } else if (responseData && typeof responseData === "object") {
        const data = responseData as {
          message?: string;
          error?: string;
          details?: string;
        };

        message = data.message || data.details || data.error || message;
      }

      // Handle duplicate username or phone number errors.
      const normalizedMessage = message.toLowerCase();

      if (
        normalizedMessage.includes("username") &&
        (normalizedMessage.includes("exist") ||
          normalizedMessage.includes("duplicate") ||
          normalizedMessage.includes("already"))
      ) {
        message = "This username already exists. Please choose another.";
      } else if (
        (normalizedMessage.includes("phone") ||
          normalizedMessage.includes("phone_number") ||
          normalizedMessage.includes("phonenumber")) &&
        (normalizedMessage.includes("exist") ||
          normalizedMessage.includes("duplicate") ||
          normalizedMessage.includes("already"))
      ) {
        message = "This phone number is already registered.";
      }

      toast.error("Signup failed", { description: message, duration: 5000 });
    },
  });
};

export default useSignup;

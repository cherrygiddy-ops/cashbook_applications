import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  Users,
} from "lucide-react";
import CashbookMark from "@/components/CashbookMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSignup from "@/hooks/useSignup";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 3 characters",
      })
      .max(50, {
        message: "Username must not exceed 50 characters",
      }),

    phoneNumber: z
      .string()
      .min(9, {
        message: "Provide a valid phone number",
      })
      .max(15, {
        message: "Phone number is too long",
      }),

    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters",
      }),

    confirmPassword: z
      .string()
      .min(6, {
        message: "Please confirm your password",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupData = z.infer<typeof signupSchema>;

export default function Signup() {
  const {
    mutate: signupUser,
    data: signupData,
    error: signupError,
    isPending,
    isSuccess,
    isError,
  } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupData) => {
    signupUser({
      username: data.username.trim(),
      phoneNumber: data.phoneNumber.trim(),
      password: data.password,
    });
  };

  const responseData = signupError?.response?.data as
    | {
        message?: string;
        error?: string;
        details?: string;
      }
    | string
    | undefined;

  const errorMessage =
    typeof responseData === "string"
      ? responseData
      : responseData?.message ||
        responseData?.details ||
        responseData?.error ||
        signupError?.message ||
        "";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-emerald-950">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-center w-full p-12"
        >
          <div className="max-w-md text-white">
            <div className="flex items-center gap-3 mb-10">
              <CashbookMark className="h-14 w-14 rounded-2xl shadow-lg shadow-emerald-500/20" iconClassName="h-7 w-7" />

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Cashbook
                </h1>
                <p className="text-sm text-emerald-200/70">
                  Financial Management
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Start managing your
              <span className="text-emerald-400">
                {" "}finances smarter.
              </span>
            </h2>

            <p className="mt-5 text-lg text-emerald-100/70 leading-relaxed">
              Create your Cashbook account and keep track of your
              transactions, cash flow and business finances in one place.
            </p>

            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15">
                  <UserPlus className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">Easy to Get Started</p>
                  <p className="text-sm text-white/50 mt-1">
                    Create your account in just a few simple steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">Built for Teams</p>
                  <p className="text-sm text-white/50 mt-1">
                    Work together with owners, accountants and team members.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">Secure Account</p>
                  <p className="text-sm text-white/50 mt-1">
                    Your financial information stays protected.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-10 text-xs text-white/30">
              Simple • Secure • Powerful
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <CashbookMark className="h-12 w-12 rounded-xl" iconClassName="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Cashbook</h1>
              <p className="text-xs text-muted-foreground">
                Financial Management
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-muted-foreground">
              Get started with Cashbook today
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                {...register("username")}
                className="h-12 rounded-xl"
              />
              {errors.username && (
                <p className="text-red-500 text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Phone number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g. 0712345678"
                autoComplete="tel"
                {...register("phoneNumber")}
                className="h-12 rounded-xl"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                {...register("password")}
                className="h-12 rounded-xl"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="h-12 rounded-xl"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Backend error */}
            {isError && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30"
              >
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {errorMessage}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Success message */}
            {isSuccess && signupData && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm text-emerald-700">
                  Account created successfully for {signupData.username}.
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have a Cashbook account?{" "}
              <Link
                to="/"
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Cashbook. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

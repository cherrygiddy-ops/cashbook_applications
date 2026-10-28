import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, BarChart3, ShieldCheck } from 'lucide-react'
import CashbookMark from '@/components/CashbookMark'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useLogin from '@/hooks/useLogin'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useAuthStore } from '@/Store/AuthStore'

const loginSchema = z.object({
  phoneNumber: z.string().min(9, { message: 'Provide a valid phone number' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginData = z.infer<typeof loginSchema>

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

 const onSubmit = async (data: LoginData) => {
  try {
    setErrorMessage("");

    await login.mutateAsync({
      phoneNumber: data.phoneNumber,
      password: data.password,
    });

  } catch (err) {
    console.error(err);

    setErrorMessage(
      "Login failed. Please check your phone number and password."
    );
  }
};
  return (
    <div className="min-h-screen flex bg-background">
      {/* =========================
          LEFT PANEL
      ========================== */}
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
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <CashbookMark className="h-14 w-14 rounded-2xl shadow-lg shadow-emerald-500/20" iconClassName="h-7 w-7" />

              <div>
                <h1 className="text-3xl font-bold tracking-tight">Cashbook</h1>

                <p className="text-sm text-emerald-200/70">
                  Financial Management
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Take control of your
              <span className="text-emerald-400"> business finances.</span>
            </h2>

            <p className="mt-5 text-lg text-emerald-100/70 leading-relaxed">
              Record transactions, monitor cash flow, manage your business, and
              keep your financial records organized — all in one place.
            </p>

            {/* Features */}
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15">
                  <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="font-semibold">Track Transactions</p>

                  <p className="text-sm text-white/50 mt-1">
                    Record income, expenses and daily cash movements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="font-semibold">Understand Your Cash Flow</p>

                  <p className="text-sm text-white/50 mt-1">
                    Get a clear view of your business performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/15">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                  <p className="font-semibold">Secure & Multi-User</p>

                  <p className="text-sm text-white/50 mt-1">
                    Manage access for owners, accountants and team members.
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

      {/* =========================
          RIGHT PANEL
      ========================== */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <CashbookMark className="h-12 w-12 rounded-xl" iconClassName="h-6 w-6" />

            <div>
              <h1 className="text-2xl font-bold">Cashbook</h1>

              <p className="text-xs text-muted-foreground">
                Financial Management
              </p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>

            <p className="mt-2 text-muted-foreground">
              Sign in to your Cashbook account
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Username */}
            <div className="space-y-2">
              {' '}
              <Label htmlFor="phoneNumber"> Phone Number </Label>{' '}
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g. 0712345678"
                autoComplete="tel"
                {...register('phoneNumber')}
                className="h-12 rounded-xl"
              />{' '}
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">
                  {' '}
                  {errors.phoneNumber.message}{' '}
                </p>
              )}{' '}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
                className="h-12 rounded-xl"
              />

              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Sign in */}
            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20"
            >
              {login.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* =========================
              SIGN UP
          ========================== */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have a Cashbook account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Create an account
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
  )
}

import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import Layout from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
 * Login & Registration page
 *   /login    → opens on the "Login" tab
 *   /register → opens on the "Register" tab
 * ───────────────────────────────────────────────────────────── */

/* ── Validation ─────────────────────────────────────────────── */
const emailField = z
  .string()
  .trim()
  .min(1, "Enter your email address")
  .email("Enter a valid email address");

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password"),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
    email: emailField,
    phone: z
      .string()
      .trim()
      .refine(
        (v) => /^(\+91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
        "Enter a valid 10-digit mobile number",
      ),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

/* ── Backend hook-up point ──────────────────────────────────────
 * This project has no authentication API yet, so nothing is sent
 * anywhere. Replace the body of this function with your real call, e.g.
 *
 *   const res = await fetch("/api/auth/login", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(values),
 *   });
 *   return { ok: res.ok, message: (await res.json()).message };
 * ─────────────────────────────────────────────────────────────── */
async function submitAuth(
  _kind: "login" | "register",
  _values: LoginValues | RegisterValues,
): Promise<{ ok: boolean; message?: string }> {
  return {
    ok: false,
    message:
      "Your details look good, but sign-in isn't connected to a server yet. Add your API call in submitAuth() in client/pages/Auth.tsx.",
  };
}

/* ── Small form field with label, error text and optional show/hide ── */
type TextFieldProps = React.ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: string;
  password?: boolean;
};

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, password, id, className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={password ? (visible ? "text" : "password") : props.type}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              "h-11 rounded-lg border-slate-300 bg-white text-slate-900 focus-visible:ring-violet-500",
              password && "pr-11",
              error && "border-red-400 focus-visible:ring-red-400",
              className,
            )}
            {...props}
          />
          {password && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
TextField.displayName = "TextField";

/* ── Forms ──────────────────────────────────────────────────── */
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    const res = await submitAuth("login", values);
    if (res.ok) toast.success(res.message ?? "Logged in");
    else toast.info(res.message ?? "Something went wrong. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <TextField
        id="login-email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <TextField
        id="login-password"
        label="Password"
        password
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-lg text-base font-semibold">
        {isSubmitting && <Loader2 className="animate-spin" />}
        Log in
      </Button>
      <p className="text-center text-sm text-slate-500">
        Trouble signing in?{" "}
        <Link to="/contact" className="font-medium text-primary hover:underline">
          Contact us
        </Link>
      </p>
    </form>
  );
}

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    const res = await submitAuth("register", values);
    if (res.ok) toast.success(res.message ?? "Account created");
    else toast.info(res.message ?? "Something went wrong. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <TextField
        id="reg-name"
        label="Full name"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name?.message}
        {...register("name")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="reg-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="reg-phone"
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="98765 43210"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <TextField
        id="reg-password"
        label="Password"
        password
        autoComplete="new-password"
        placeholder="Create a password"
        hint="At least 8 characters, with a letter and a number."
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        id="reg-confirm"
        label="Confirm password"
        password
        autoComplete="new-password"
        placeholder="Re-enter your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-lg text-base font-semibold">
        {isSubmitting && <Loader2 className="animate-spin" />}
        Create account
      </Button>
    </form>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
const trust = [
  { value: "60,000+", label: "Students trained" },
  { value: "5,000+", label: "Successful placements" },
  { value: "200+", label: "Courses offered" },
];

export default function Auth() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const tab = pathname.startsWith("/register") ? "register" : "login";

  return (
    <Layout>
      <section className="bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <div className="container px-5 py-10 sm:px-8 lg:py-16">
          <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl shadow-violet-900/10 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Brand panel (desktop only) */}
            <aside
              className="relative hidden flex-col justify-between gap-10 p-10 text-white lg:flex"
              style={{
                backgroundColor: "#1e0e3a",
                backgroundImage: [
                  "radial-gradient(70% 60% at 100% 0%, rgba(217,70,239,0.30), transparent 65%)",
                  "linear-gradient(150deg, #1e0e3a 0%, #33185c 55%, #5a2a7e 100%)",
                ].join(","),
              }}
            >
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-pink-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-300" aria-hidden="true" />
                  Skill Training Center
                </span>
                <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight">
                  Your learning journey
                  <span className="block bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200 bg-clip-text pb-1 text-transparent">
                    starts here
                  </span>
                </h2>
                <p className="mt-4 max-w-sm text-white/75">
                  Log in to continue, or create an account to get started with job-ready training.
                </p>
              </div>

              <dl className="space-y-4">
                {trust.map((t) => (
                  <div key={t.label} className="flex items-baseline gap-3 border-t border-white/15 pt-4">
                    <dt className="w-32 shrink-0 text-2xl font-extrabold">{t.value}</dt>
                    <dd className="text-sm text-white/70">{t.label}</dd>
                  </div>
                ))}
              </dl>
            </aside>

            {/* Form panel */}
            <div className="p-6 sm:p-10">
              <Tabs
                value={tab}
                onValueChange={(v) => navigate(v === "register" ? "/register" : "/login", { replace: true })}
              >
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
                  <TabsTrigger
                    value="login"
                    className="h-full rounded-lg text-sm font-semibold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#2b1450] data-[state=active]:shadow"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="h-full rounded-lg text-sm font-semibold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#2b1450] data-[state=active]:shadow"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-8">
                  <h1 className="text-2xl font-bold tracking-tight text-[#2b1450]">Welcome back</h1>
                  <p className="mb-6 mt-1 text-sm text-slate-600">Log in to continue to your account.</p>
                  <LoginForm />
                  <p className="mt-6 text-center text-sm text-slate-600">
                    New here?{" "}
                    <Link to="/register" replace className="font-semibold text-primary hover:underline">
                      Create an account
                    </Link>
                  </p>
                </TabsContent>

                <TabsContent value="register" className="mt-8">
                  <h1 className="text-2xl font-bold tracking-tight text-[#2b1450]">Create your account</h1>
                  <p className="mb-6 mt-1 text-sm text-slate-600">It only takes a minute.</p>
                  <RegisterForm />
                  <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" replace className="font-semibold text-primary hover:underline">
                      Log in
                    </Link>
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

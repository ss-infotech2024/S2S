import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Clock, Loader2, Phone, ShieldCheck } from "lucide-react";

import Layout from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCourseById } from "@/data/courses";
import { API } from "@/lib/studentApi";
import { cn } from "@/lib/utils";

// Official number students call to pay for and activate a course (set in the root .env).
const PAYMENT_NUMBER = String(import.meta.env.VITE_PAYMENT_CONTACT_NUMBER || "").trim();
const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Name is too long")
    .regex(/^[\p{L}][\p{L} .'-]*$/u, "Use letters only"),
  email: z.string().trim().min(1, "Enter your email address").email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s()-]/g, "")),
      "Enter a valid 10-digit Indian mobile number",
    ),
  college: z.string().trim().min(2, "Enter your college name").max(150, "College name is too long"),
});

type Values = z.infer<typeof schema>;
type Saved = { id: string; enrollment_id: string; course: string; created_at: string; trackingToken: string };

const Field = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & { label: string; error?: string }
>(({ label, error, id, ...props }, ref) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-sm font-medium text-slate-700">
      {label} <span className="text-red-500">*</span>
    </Label>
    <Input
      id={id}
      ref={ref}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "h-11 rounded-lg border-slate-300 bg-white text-slate-900 focus-visible:ring-violet-500",
        error && "border-red-400 focus-visible:ring-red-400",
      )}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
));
Field.displayName = "Field";

// Remember the reference so "My Enrollments" can show its status on this browser.
function rememberEnrollment(saved: Saved) {
  try {
    const list = JSON.parse(localStorage.getItem("s2s_my_enrollments") || "[]");
    const rest = Array.isArray(list) ? list.filter((x) => x?.id !== saved.id) : [];
    localStorage.setItem(
      "s2s_my_enrollments",
      JSON.stringify([
        { id: saved.id, trackingToken: saved.trackingToken, course: saved.course, created_at: saved.created_at },
        ...rest,
      ]),
    );
  } catch {
    /* tracking on this browser is optional */
  }
}

export default function Enroll() {
  const { id = "" } = useParams();
  const course = getCourseById(id);
  const navigate = useNavigate();
  const submissionId = React.useRef(crypto.randomUUID());
  const [serverError, setServerError] = React.useState("");
  const [saved, setSaved] = React.useState<Saved | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    setServerError("");
    let response: Response;
    try {
      response = await fetch(`${API}/api/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, courseId: id, submissionId: submissionId.current }),
      });
    } catch {
      setServerError("We couldn't reach our server. Check your internet connection and try again.");
      return;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      for (const [key, message] of Object.entries<string>(data.fields ?? {})) {
        if (key in schema.shape) setError(key as keyof Values, { message });
      }
      setServerError(data.error || "Something went wrong on our side. Please try again in a moment.");
      return;
    }

    rememberEnrollment(data);
    setSaved(data);
    reset();
    submissionId.current = crypto.randomUUID();
  };

  if (!course) {
    return (
      <Layout>
        <section className="container py-14 text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="mt-2 text-slate-600">The course you are trying to enroll in does not exist.</p>
          <Button asChild className="mt-6">
            <Link to="/courses">Browse courses</Link>
          </Button>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white">
        <div className="container px-5 py-10 sm:px-8 lg:py-12">
          <div className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-violet-100 bg-white shadow-lg shadow-violet-900/10 lg:grid-cols-[0.9fr_1.1fr]">
            <aside
              className="flex flex-col gap-6 p-6 text-white sm:p-6"
              style={{
                backgroundColor: "#1e0e3a",
                backgroundImage: [
                  "radial-gradient(70% 60% at 100% 0%, rgba(217,70,239,0.30), transparent 65%)",
                  "linear-gradient(150deg, #1e0e3a 0%, #33185c 55%, #5a2a7e 100%)",
                ].join(","),
              }}
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-pink-100">
                You are enrolling in
              </span>
              <div>
                <h2 className="text-2xl font-extrabold leading-tight sm:text-2xl">{course.title}</h2>
                {course.short && <p className="mt-3 text-white/75">{course.short}</p>}
              </div>
              <dl className="space-y-3 text-sm">
                {course.duration && (
                  <div className="flex items-center gap-2 text-white/85">
                    <Clock className="h-4 w-4 text-pink-200" /> <dt className="sr-only">Duration</dt>
                    <dd>{course.duration}</dd>
                  </div>
                )}
                <div className="flex items-start gap-2 text-white/85">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-pink-200" />
                  <dd>Course access is activated after our team verifies your payment.</dd>
                </div>
              </dl>
            </aside>

            <div className="p-5 sm:p-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#2b1450]">Enrollment form</h1>
              <p className="mb-6 mt-1 text-sm text-slate-600">
                Fill in your details and our admissions team will get in touch.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Field id="enroll-name" label="Full Name" autoComplete="name" placeholder="Your full name" error={errors.name?.message} {...register("name")} />
                <Field id="enroll-email" label="Email Address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
                <Field id="enroll-phone" label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" error={errors.phone?.message} {...register("phone")} />
                <Field id="enroll-college" label="College Name" autoComplete="organization" placeholder="Your college" error={errors.college?.message} {...register("college")} />

                {serverError && (
                  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {serverError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                  <Button type="button" variant="outline" className="h-11 rounded-lg" onClick={() => navigate(-1)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="h-11 flex-1 rounded-lg text-base font-semibold">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Submit Enrollment"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!saved} onOpenChange={(open) => !open && setSaved(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] rounded-xl sm:max-w-md">
          <DialogHeader className="items-center text-center sm:text-center">
            <span className="mb-2 flex h-11 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </span>
            <DialogTitle className="text-xl text-[#2b1450]">Enrollment Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-slate-600">
              Thank you for your interest in SS Infotech. Your enrollment request has been submitted successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Course</p>
            <p className="font-bold text-[#2b1450]">{saved?.course}</p>
            {saved?.enrollment_id && <p className="mt-1 text-xs text-slate-500">Reference: {saved.enrollment_id}</p>}
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {PAYMENT_NUMBER
              ? "To complete your admission and activate access to your selected course, please call our team at the official course payment contact number."
              : "To complete your admission, our team will call you on the number you provided."}{" "}
            Our team will guide you through the payment process and activate your course access after payment verification.
          </p>

          <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
            {PAYMENT_NUMBER && (
              <Button asChild className="h-11 w-full rounded-lg text-base font-semibold">
                <a href={telHref(PAYMENT_NUMBER)}>
                  <Phone className="mr-2 h-4 w-4" /> Call Now: {PAYMENT_NUMBER}
                </a>
              </Button>
            )}
            <Button variant="outline" className="h-11 w-full rounded-lg" onClick={() => setSaved(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

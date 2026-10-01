import usePageMeta from "@/hooks/use-page-meta";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/site/Layout";
import { getCourseById } from "@/data/courses";

// TODO: replace with your own deployed Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzikXYaDkViNbbW0mJE421h401IrdjyRVUCctcqiDgVidrppGCnVkJzYm7D1Sd_CiM/exec";

export default function Enroll() {
  usePageMeta("Enroll Now", "Enroll in a course at Skill Training Center and start learning with expert trainers.");
  const { id } = useParams();
  const course = id ? getCourseById(id) : null;
  const navigate = useNavigate();

  const initialFormState = {
    course: course?.title || "",
    name: "",
    email: "",
    phone: "",
    qualification: "",
    city: "",
    message: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      // Encode as x-www-form-urlencoded (avoids preflight CORS issues)
      const payload = new URLSearchParams();
      Object.entries(form).forEach(([key, value]) =>
        payload.append(key, (value ?? "").toString())
      );

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body: payload.toString(),
      });

      const rawText = await response.text();
      let json: any;

      try {
        json = JSON.parse(rawText || "{}");
      } catch {
        json = { status: response.ok ? "success" : "error", message: rawText };
      }

      if (response.ok && json.status === "success") {
        setStatusMessage("✅ Thank you! Your enrollment has been recorded.");
        setForm(initialFormState);

        // Redirect after delay
        setTimeout(() => navigate("/", { replace: true }), 1500);
      } else {
        throw new Error(json.message || "Unknown server error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatusMessage(
        "❌ Something went wrong. Please check your network tab or Apps Script deployment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-extrabold">
            Enroll{course ? `: ${course.title}` : ""}
          </h1>
          <p className="mt-2 text-foreground/80">
            Complete the form and our admissions team will contact you shortly.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {/* Course (readonly) */}
            <div>
              <label className="block text-sm font-medium">Course</label>
              <input
                name="course"
                value={form.course}
                readOnly
                className="mt-1 w-full rounded-md border bg-gray-100 px-3 py-2"
              />
            </div>

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-medium">
                Highest Qualification
              </label>
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-md bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Enrollment"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-11 rounded-md border px-4"
              >
                Cancel
              </button>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <p
                className={`mt-4 text-center ${statusMessage.includes("✅")
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
}

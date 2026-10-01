import usePageMeta from "@/hooks/use-page-meta";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/site/Layout";

const WHATSAPP = "919399345989";

const info = [
  { icon: Phone, title: "Call Us", lines: ["+91 93993 45989", "+91 84466 91425"], href: "tel:+919399345989" },
  { icon: MessageCircle, title: "WhatsApp", lines: ["Chat with our counsellors", "Quick replies on working days"], href: `https://wa.me/${WHATSAPP}` },
  { icon: MapPin, title: "Visit Us", lines: ["Plot No.26, Khandwekar Bunglow, 2nd Floor,", "Near Lendra Park, Ramdaspeth, Nagpur-440010"] },
  { icon: Clock, title: "Working Hours", lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: Closed"] },
];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

export default function Contact() {
  usePageMeta("Contact Us", "Get in touch with Skill Training Center in Nagpur for course enquiries, demos and counselling.");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setBusy(true);
    const text = `New Enquiry:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nSubject: ${form.subject || "General"}\nMessage: ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setBusy(false);
    toast.success("Your message is ready in WhatsApp", { description: "Press send there to confirm your enquiry." });
  }

  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-20 text-white">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="container relative text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">Contact Us</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Let's talk about your career</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Questions about courses, batches, fees or placements? Our team is happy to help you pick the right path.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-12 pb-6">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {info.map((c) => {
            const body = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{c.title}</h3>
                <div className="mt-1 space-y-0.5 text-sm text-slate-600">
                  {c.lines.map((l) => <p key={l}>{l}</p>)}
                </div>
              </>
            );
            const cls = "block rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl";
            return c.href ? (
              <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>{body}</a>
            ) : (
              <div key={c.title} className={cls}>{body}</div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container grid gap-8 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <h2 className="text-2xl font-extrabold text-slate-900">Send us a message</h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">Fill in the form and we'll continue the conversation on WhatsApp.</p>
            <form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputCls} placeholder="Full name *" value={form.name} onChange={set("name")} required />
                <input className={inputCls} type="tel" placeholder="Phone *" value={form.phone} onChange={set("phone")} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputCls} type="email" placeholder="Email *" value={form.email} onChange={set("email")} required />
                <select className={inputCls} value={form.subject} onChange={set("subject")}>
                  <option value="">Subject (optional)</option>
                  <option>Course enquiry</option>
                  <option>Fees & batches</option>
                  <option>Placements</option>
                  <option>Corporate training</option>
                  <option>Other</option>
                </select>
              </div>
              <textarea className={`${inputCls} min-h-[140px] resize-y`} placeholder="How can we help you? *" value={form.message} onChange={set("message")} required />
              <button type="submit" disabled={busy}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 font-semibold text-white shadow-lg shadow-primary/25 transition hover:shadow-xl hover:brightness-110 disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send via WhatsApp
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-2">
            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <iframe
                title="Skill Training Center Nagpur Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.337405892367!2d79.067185!3d21.1363751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c1000c0583e5%3A0x2a9d4b509fe5934e!2sSS%20Infotech%20Nagpur!5e0!3m2!1sen!2sin!4v1695739200000!5m2!1sen!2sin"
                width="100%" height="100%" loading="lazy" allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="min-h-[320px] border-0"
              />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-900 p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold">Prefer to talk right now?</h3>
              <p className="mt-1 text-sm text-blue-100">Our counsellors will guide you on courses, fees and placement support.</p>
              <a href="tel:+919399345989" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50">
                <Phone className="h-4 w-4" /> +91 93993 45989
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

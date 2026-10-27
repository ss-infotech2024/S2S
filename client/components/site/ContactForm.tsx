import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// Real contact details (kept in one place so the form card and the info
// card below never drift out of sync with the footer).
const CONTACT_INFO = [
  {
    icon: MapPinIcon,
    label: "Visit Us",
    value: "Plot No.26, Khandwekar Bunglow, 2nd Floor, Near Lendra Park, Ramdaspeth, Nagpur-440010",
    chip: "from-primary to-blue-500",
  },
  {
    icon: PhoneIcon,
    label: "Call Us",
    value: "9399345989, 8446691425",
    chip: "from-secondary to-violet-500",
  },
  {
    icon: ClockIcon,
    label: "Response Time",
    value: "We usually reply within 24 hours",
    chip: "from-teal-500 to-emerald-500",
  },
  {
    icon: GlobeAltIcon,
    label: "Online",
    value: "ssinfotech.co.in",
    chip: "from-primary to-secondary",
  },
];

function FieldShell({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-11 pr-3.5 text-sm text-foreground placeholder:text-slate-400 shadow-sm transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function ContactForm({ showHeading = true }: { showHeading?: boolean }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    // Construct WhatsApp message
    const whatsappNumber = "919399345989";
    const message = `New Contact Form Submission:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Reset form
    setForm({ name: "", email: "", phone: "", message: "" });

    setIsSubmitting(false);
    alert("Your message has been prepared in WhatsApp. Please send it to confirm.");
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-violet-50/50 py-20 md:py-24"
    >
      {/* Soft decorative glows, kept inside the section so nothing overflows sideways */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="container relative">
        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <ChatBubbleLeftRightIcon className="h-4 w-4" aria-hidden="true" />
              Get In Touch
            </span>

            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Let's Start a{" "}
              <span className="bg-gradient-to-r from-primary via-violet-600 to-teal-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Have questions about courses, batches or fees? Send us a message and our team
              will get back to you shortly.
            </p>
          </motion.div>
        )}

        <div className={`mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 ${showHeading ? "mt-14" : ""}`}>
          {/* Card 1 — Message form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-md shadow-primary/25">
                <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">Send us a Message</h3>
                <p className="text-sm text-foreground/60">We'll reply over WhatsApp or email</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldShell icon={UserIcon}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Full name"
                    required
                  />
                </FieldShell>
                <FieldShell icon={EnvelopeIcon}>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={inputClasses}
                    placeholder="Email"
                    required
                  />
                </FieldShell>
              </div>

              <FieldShell icon={PhoneIcon}>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Phone"
                  required
                />
              </FieldShell>

              <div className="relative flex-1">
                <ChatBubbleBottomCenterTextIcon
                  className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className={`min-h-[128px] resize-none ${inputClasses}`}
                  placeholder="Your message"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-violet-600 to-teal-500 px-5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <PaperAirplaneIcon
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-foreground/50">
                <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                We usually respond within 24 hours
              </p>
            </form>
          </motion.div>

          {/* Card 2 — Location & map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5"
          >
            <div className="p-6 pb-2 sm:p-8 sm:pb-2">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-secondary text-white shadow-md shadow-teal-500/25">
                  <MapPinIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Visit Our Center</h3>
                  <p className="text-sm text-foreground/60">Drop by for a free counselling session</p>
                </div>
              </div>

              <ul className="space-y-4">
                {CONTACT_INFO.map(({ icon: Icon, label, value, chip }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${chip} text-white shadow-sm`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold uppercase tracking-wide text-foreground/45">{label}</div>
                      <div className="text-sm leading-relaxed text-foreground/80">{value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex-1 px-6 pb-6 sm:px-8 sm:pb-8">
              <div className="h-full min-h-[220px] overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
                <iframe
                  title="Skill Training Center Nagpur Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.337405892367!2d79.067185!3d21.1363751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c1000c0583e5%3A0x2a9d4b509fe5934e!2sSS%20Infotech%20Nagpur!5e0!3m2!1sen!2sin!4v1695739200000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[220px] w-full border-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

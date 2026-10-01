import Layout from "@/components/site/Layout";
import PageBanner from "@/components/site/PageBanner";
import ContactForm from "@/components/site/ContactForm";

export default function Contact() {
  return (
    <Layout>
      <PageBanner
        eyebrow="Get In Touch"
        title="Contact Us"
        text="Have a question about a course, batch or fee? Send us a message and we'll get back to you."
        crumbs={[{ label: "Contact" }]}
      />
      <ContactForm showHeading={false} />
    </Layout>
  );
}

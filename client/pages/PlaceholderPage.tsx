import Layout from "@/components/site/Layout";

export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <Layout>
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="page-title">{title}</h1>
          {description ? (
            <p className="mt-3 text-[15px] text-foreground/80">{description}</p>
          ) : null}
          <p className="mt-6 text-sm text-muted-foreground">This section will be built out next. Use the navigation to explore available pages.</p>
        </div>
      </section>
    </Layout>
  );
}

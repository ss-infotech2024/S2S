import Layout from "@/components/site/Layout";

export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <Layout>
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-4 text-foreground/80">{description}</p>
          ) : null}
          <p className="mt-6 text-sm text-muted-foreground">This section will be built out next. Use the navigation to explore available pages.</p>
        </div>
      </section>
    </Layout>
  );
}

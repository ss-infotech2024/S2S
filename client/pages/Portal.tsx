import usePageMeta from "@/hooks/use-page-meta";
import Layout from "@/components/site/Layout";
import AuthPanel from "@/components/site/AuthPanel";

export default function Portal() {
  usePageMeta("Student Portal", "Login or register for the Skill Training Center Student Portal.");
  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 py-14 md:py-20">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto mb-8 max-w-xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Student Portal</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Your learning, all in one place</h1>
          </div>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
            <AuthPanel />
          </div>
        </div>
      </section>
    </Layout>
  );
}

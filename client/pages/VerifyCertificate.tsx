import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, Loader2, SearchX, ShieldCheck } from "lucide-react";
import Layout from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/studentApi";

type Result =
  | { valid: true; certificate_id: string; student_name: string; course_title: string; issued_at: string }
  | { valid: false };

export default function VerifyCertificate() {
  const { certificateId = "" } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(certificateId);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!certificateId) return;
    setLoading(true);
    setError("");
    setResult(null);
    fetch(`${API}/api/certificates/verify/${encodeURIComponent(certificateId)}`)
      .then(async (r) => {
        if (r.status === 404) return setResult({ valid: false });
        if (!r.ok) throw new Error();
        setResult(await r.json());
      })
      .catch(() => setError("Unable to reach the verification service. Please try again."))
      .finally(() => setLoading(false));
  }, [certificateId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (value) navigate(`/verify-certificate/${encodeURIComponent(value)}`);
  };

  return (
    <Layout>
      <section className="min-h-[70vh] bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white">
        <div className="container max-w-2xl py-14">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-3 text-3xl font-extrabold text-[#2b1450]">Verify a Certificate</h1>
            <p className="mt-2 text-slate-600">Enter the certificate ID printed on an SS Infotech certificate.</p>
          </div>

          <form onSubmit={submit} className="mt-8 flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SSI-2026-XXXXXXXX" aria-label="Certificate ID" className="h-11 bg-white" />
            <Button type="submit" className="h-11">Verify</Button>
          </form>

          <div className="mt-8">
            {loading && <p className="flex items-center justify-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Checking...</p>}
            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700">{error}</p>}
            {result?.valid === true && (
              <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-lg shadow-violet-900/5">
                <p className="flex items-center gap-2 font-semibold text-green-700"><BadgeCheck className="h-5 w-5" /> Valid certificate</p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-slate-500">Awarded to</dt><dd className="text-lg font-bold text-slate-900">{result.student_name}</dd></div>
                  <div><dt className="text-slate-500">Course</dt><dd className="text-lg font-bold text-slate-900">{result.course_title}</dd></div>
                  <div><dt className="text-slate-500">Issued on</dt><dd className="font-semibold">{new Date(result.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</dd></div>
                  <div><dt className="text-slate-500">Certificate ID</dt><dd className="font-mono font-semibold">{result.certificate_id}</dd></div>
                </dl>
              </div>
            )}
            {result?.valid === false && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <SearchX className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 font-semibold text-slate-900">No certificate found with this ID</p>
                <p className="mt-1 text-sm text-slate-500">Check the ID and try again.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

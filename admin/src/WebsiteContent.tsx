// Homepage & Content — banners, hero/announcement text and per-section headings + visibility.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listRows, saveRow, deleteRow, Row } from "./store";
import { resources } from "./resources";
import { Form } from "./ResourcePage";

const cfg = resources.banners;
type Sec = { k: string; label: string; table: string; to: string; sub: string; live?: (r: Row) => boolean };
const SECTIONS: Sec[] = [
  { k: "online", label: "Online Training", table: "online_training", to: "/online-training", sub: "Live and recorded classes with expert trainers, from anywhere." },
  { k: "classroom", label: "Classroom Training", table: "classroom_training", to: "/classroom-training", sub: "Weekday and weekend batches at our centre." },
  { k: "corporate", label: "Corporate Training", table: "corporate_programs", to: "/corporate-training", sub: "Upskill your team with tailored programs." },
  { k: "gallery", label: "College Gallery", table: "gallery", to: "/colleges-gallery", sub: "Training sessions and events across partner colleges." },
  { k: "placements", label: "Placements", table: "placements", to: "/placements", sub: "Where our students work today." },
  { k: "testimonials", label: "Testimonials", table: "testimonials", to: "/testimonials", sub: "Real feedback from our learners.", live: (r) => r.status === "approved" },
  { k: "blog", label: "Blog", table: "posts", to: "/blog", sub: "Tips, guides and career advice." },
];
const isLive = (r: Row, s: Sec) => (s.live ? s.live(r) : !!r.published);
const sorted = (rows: Row[]) => [...rows].sort((a, b) => (Number(a.position) || 999) - (Number(b.position) || 999) || a.created_at.localeCompare(b.created_at));

export default function WebsiteContent() {
  const [tab, setTab] = useState<"banners" | "hero" | "sections">("banners");
  const [banners, setBanners] = useState<Row[]>([]);
  const [saved, setSaved] = useState<Row>({});
  const [c, setC] = useState<Row>({});
  const [counts, setCounts] = useState<Record<string, [number, number]>>({});
  const [editing, setEditing] = useState<Row | null>(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const loadBanners = async () => setBanners(sorted(await listRows("banners")));
  const loadContent = async () => { const r = (await listRows("site_content"))[0] ?? {}; setSaved(r); setC(r); };
  useEffect(() => {
    document.title = "Homepage & Content · Skill Training Center Admin";
    loadBanners(); loadContent();
    Promise.all(SECTIONS.map(async (s) => {
      const rows = await listRows(s.table);
      const live = rows.filter((r) => isLive(r, s)).length;
      return [s.k, [live, rows.length - live]] as [string, [number, number]];
    })).then((x) => setCounts(Object.fromEntries(x)));
  }, []);

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(c), [saved, c]);
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const on = (k: string) => c[k] !== false; // sections default to shown

  const saveContent = async () => {
    setBusy(true);
    try { await saveRow("site_content", c); } catch { setBusy(false); return say("Could not save."); }
    await loadContent(); setBusy(false); say("Website content saved");
  };

  /* ---- banners ---- */
  const saveBanner = async (v: Row) => {
    const row = { ...v, position: v.position ? Number(v.position) : banners.length + 1 };
    try { await saveRow("banners", row); } catch { return say("Could not save — image may be too large for browser storage."); }
    setEditing(null); say(v.id ? "Banner saved" : "Banner added"); loadBanners();
  };
  const toggle = async (b: Row) => {
    try { await saveRow("banners", { ...b, published: !b.published }); } catch { return say("Could not update banner."); }
    say(b.published ? "Banner hidden" : "Banner is live"); loadBanners();
  };
  const removeBanner = async (b: Row) => {
    if (!confirm(`Delete banner "${b.heading}"? This can't be undone.`)) return;
    try { await deleteRow("banners", b.id); } catch { return say("Could not delete banner."); }
    say("Banner deleted"); loadBanners();
  };
  const move = async (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= banners.length) return;
    const a = [...banners]; [a[i], a[j]] = [a[j], a[i]];
    try { for (let n = 0; n < a.length; n++) if (Number(a[n].position) !== n + 1) await saveRow("banners", { ...a[n], position: n + 1 }); } catch { say("Could not reorder banners."); }
    loadBanners();
  };

  const liveBanners = banners.filter((b) => b.published).length;

  return (
    <>
      <header className="bar">
        <h2>Homepage &amp; Content</h2>
        {tab !== "banners" && (
          <>
            {dirty && <span className="wc-dirty">Unsaved changes</span>}
            <button onClick={() => setC(saved)} disabled={!dirty}>Discard</button>
            <button className="primary" onClick={saveContent} disabled={!dirty || busy}>{busy ? "Saving…" : "Save changes"}</button>
          </>
        )}
        {tab === "banners" && <button className="primary" onClick={() => setEditing(cfg.defaults())}>Add banner</button>}
      </header>

      <div className="cm-tabs wc-tabs" role="tablist">
        {([["banners", "Banners"], ["hero", "Hero & announcement"], ["sections", "Sections"]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab !== "banners" && dirty && <p className="wc-note">You have unsaved changes. They stay in this page when you switch tabs.</p>}

      {tab === "banners" && (
        <>
          <p className="wc-note">{liveBanners} of {banners.length} banners are live. They rotate on the homepage in the order shown here.</p>
          <div className="wc-banners">
            {banners.map((b, i) => (
              <article key={b.id} className={`wc-banner${b.published ? "" : " draft"}`}>
                <div className={`wc-prev ${b.align === "center" ? "c" : ""}`} style={b.image ? { backgroundImage: `linear-gradient(90deg,rgba(11,31,68,.78),rgba(11,31,68,.25)),url(${b.image})` } : undefined}>
                  <span className="wc-no">{i + 1}</span>
                  <h3>{b.heading}</h3>
                  {b.subheading && <p>{b.subheading}</p>}
                  {b.cta_text && <span className="wc-cta">{b.cta_text}</span>}
                </div>
                <div className="wc-bar">
                  <button className={`cm-pub inline${b.published ? " on" : ""}`} onClick={() => toggle(b)} aria-pressed={!!b.published}><i />{b.published ? "Live" : "Hidden"}</button>
                  <span className="wc-link" title={b.cta_link}>{b.cta_link || "No link"}</span>
                  <span className="wc-sp" />
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" title="Move earlier">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === banners.length - 1} aria-label="Move later" title="Move later">↓</button>
                  <button onClick={() => setEditing(b)}>Edit</button>
                  <button className="danger" onClick={() => removeBanner(b)} aria-label="Delete banner" title="Delete">✕</button>
                </div>
              </article>
            ))}
          </div>
          {!banners.length && <p className="empty">No banners yet. Select “Add banner” to create the first slide.</p>}
        </>
      )}

      {tab === "hero" && (
        <div className="wc-form">
          <section className="panel2">
            <div className="ph"><h3>Announcement bar</h3>
              <label className="wc-sw"><input type="checkbox" checked={!!c.announce_show} onChange={(e) => set("announce_show", e.target.checked)} /> Show on website</label></div>
            <div className="wc-two">
              <label><span>Message</span><input value={c.announce_text ?? ""} onChange={(e) => set("announce_text", e.target.value)} placeholder="Admissions open for new batches" /></label>
              <label><span>Link (optional)</span><input value={c.announce_link ?? ""} onChange={(e) => set("announce_link", e.target.value)} placeholder="/classroom-training" /></label>
            </div>
          </section>
          <section className="panel2">
            <div className="ph"><h3>Hero text</h3></div>
            <label><span>Headline</span><input value={c.hero_title ?? ""} onChange={(e) => set("hero_title", e.target.value)} maxLength={90} /><em>{(c.hero_title ?? "").length}/90 · shown big, above the banners' own text</em></label>
            <label><span>Sub-text</span><textarea rows={3} value={c.hero_subtitle ?? ""} onChange={(e) => set("hero_subtitle", e.target.value)} maxLength={220} /><em>{(c.hero_subtitle ?? "").length}/220</em></label>
            <div className="wc-two">
              <label><span>Primary button text</span><input value={c.hero_cta_text ?? ""} onChange={(e) => set("hero_cta_text", e.target.value)} /></label>
              <label><span>Primary button link</span><input value={c.hero_cta_link ?? ""} onChange={(e) => set("hero_cta_link", e.target.value)} /></label>
              <label><span>Secondary button text</span><input value={c.hero_cta2_text ?? ""} onChange={(e) => set("hero_cta2_text", e.target.value)} /></label>
              <label><span>Secondary button link</span><input value={c.hero_cta2_link ?? ""} onChange={(e) => set("hero_cta2_link", e.target.value)} /></label>
            </div>
          </section>
          <section className="panel2">
            <div className="ph"><h3>About blurb</h3></div>
            <label><span>Short text for the home page / footer</span><textarea rows={4} value={c.about_text ?? ""} onChange={(e) => set("about_text", e.target.value)} /></label>
          </section>
        </div>
      )}

      {tab === "sections" && (
        <div className="wc-secs">
          {SECTIONS.map((s) => {
            const [live, draft] = counts[s.k] ?? [0, 0];
            const shown = on(`sec_${s.k}_show`);
            return (
              <section key={s.k} className={`panel2 wc-sec${shown ? "" : " off"}`}>
                <div className="ph">
                  <h3>{s.label}</h3>
                  <label className="wc-sw"><input type="checkbox" checked={shown} onChange={(e) => set(`sec_${s.k}_show`, e.target.checked)} /> {shown ? "Shown on homepage" : "Hidden"}</label>
                </div>
                <label><span>Section heading</span><input value={c[`sec_${s.k}_title`] ?? ""} onChange={(e) => set(`sec_${s.k}_title`, e.target.value)} placeholder={s.label} /></label>
                <label><span>Short description</span><textarea rows={2} value={c[`sec_${s.k}_sub`] ?? ""} onChange={(e) => set(`sec_${s.k}_sub`, e.target.value)} placeholder={s.sub} /></label>
                <div className="wc-foot">
                  <span><b>{live}</b> live{draft ? <> · <b>{draft}</b> {s.k === "testimonials" ? "not approved" : "draft"}</> : null}</span>
                  <Link to={s.to}>Manage content →</Link>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {editing && <Form cfg={cfg} row={editing} onSave={saveBanner} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
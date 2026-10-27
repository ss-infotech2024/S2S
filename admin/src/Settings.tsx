import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { listRows, saveRow, exportAll, importAll, resetAll, Row } from "./store";
import { resources } from "./resources";

const FIELDS: [string, string][] = [
  ["name", "Institute name"], ["tagline", "Tagline"], ["phone", "Phone"], ["whatsapp", "WhatsApp number"],
  ["email", "Email"], ["address", "Address"], ["hours", "Working hours"], ["site_url", "Website URL"],
  ["instagram", "Instagram URL"], ["facebook", "Facebook URL"], ["linkedin", "LinkedIn URL"], ["youtube", "YouTube URL"],
];
const tables = [...Object.values(resources).map((r) => r.table), "settings"];

export default function Settings() {
  const [v, setV] = useState<Row | null>(null);
  const [msg, setMsg] = useState("");
  const load = () => listRows("settings").then((r) => setV(r[0] ?? {}));
  useEffect(() => { load(); document.title = "Settings · Skill Training Center Admin"; }, []);
  if (!v) return null;
  const say = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const set = (k: string, x: string) => setV({ ...v, [k]: x });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) return say("Enter a valid email address.");
    try { await saveRow("settings", v); } catch (err) { return say(err instanceof Error && err.message ? `Could not save: ${err.message}` : "Could not save settings."); }
    await load(); say("Settings saved");
  };
  const restore = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      importAll(JSON.parse(await file.text()), tables);
      location.reload();
    } catch { say("That file is not a valid backup."); }
  };

  return (
    <>
      <header className="bar"><h2>Settings</h2></header>
      <form onSubmit={save}>
        <h3 className="sec">Institute profile</h3>
        <div className="settings">
          {FIELDS.map(([k, label]) => (
            <label key={k}>{label}<input value={v[k] ?? ""} onChange={(e) => set(k, e.target.value)} /></label>
          ))}
          <label>Auto sign-out after
            <select value={v.idle_minutes ?? "30"} onChange={(e) => set("idle_minutes", e.target.value)}>
              {["15", "30", "60"].map((m) => <option key={m} value={m}>{m} minutes idle</option>)}
            </select>
            <em>Applies from the next sign-in.</em>
          </label>
          <div className="full actions"><button className="primary">Save settings</button></div>
        </div>
      </form>
      <h3 className="sec">Data</h3>
      <div className="settings">
        <p className="full empty" style={{ padding: 0, margin: 0 }}>
          Data is stored in this browser only. Download a backup regularly; restore it here or on another browser.
        </p>
        <div className="full actions">
          <button onClick={() => exportAll(tables)}>Download backup</button>
          <label className="filebtn">Restore backup<input type="file" accept="application/json" hidden onChange={restore} /></label>
          <button className="danger" onClick={() => { if (confirm("Reset ALL data to the starting copy? Your edits will be lost.")) { resetAll(tables); location.reload(); } }}>Reset all data</button>
        </div>
      </div>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  );
}

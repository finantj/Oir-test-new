"use client";

import { useEffect, useState } from "react";

type Step = { label: string; time?: string };

export default function Home() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [statusError, setStatusError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/status");
        if (!r.ok) throw new Error("HTTP " + r.status);
        const d = await r.json();
        setSteps(d.steps ?? []);
      } catch (e: any) {
        setStatusError(e?.message || String(e));
      }
    })();
  }, []);
  const last = steps[steps.length - 1];

  const chips = ["Annals","Fiants","NMS Sites","Bardic Poetry","DIB","CIRCLE","Logainm"];
  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-semibold tracking-wide text-gold drop-shadow">Oir Project</h1>
        <p className="mt-2 opacity-90">Linking Ireland’s Past, One Record at a Time</p>
        {last && (
          <div className="mt-4 mx-auto max-w-xl rounded-lg border"
               style={{background:"#123c22", borderColor:"#1ea453", color:"#b8f7cf", fontWeight:600, padding:"10px 12px"}}>
            ✅ {last.label} {last.time ? `— ${new Date(last.time).toLocaleString()}` : ""}
          </div>
        )}
        {!last && statusError && (
          <div className="mt-4 mx-auto max-w-xl rounded-lg border"
               style={{background:"#3c1212", borderColor:"#a41e1e", color:"#f7b8b8", fontWeight:600, padding:"10px 12px"}}>
            ⚠️ Status error: {statusError}. Try reloading or confirm <code>/api/status</code> exists in this deployment.
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          {chips.map(k => (
            <span key={k} className="px-3 py-2 rounded-full bg-black/25 border border-gold">{k}</span>
          ))}
        </div>
      </header>

      <section className="bg-black/25 border border-gold rounded-xl p-4">
        <input
          placeholder="Search across centuries of Irish history…"
          className="w-full h-12 px-3 text-lg bg-black/20 border border-gold rounded placeholder:opacity-60"
        />
        <div className="mt-4 text-sm opacity-80">
          Search & JSON-LD inspector will appear here next.
        </div>
      </section>
    </main>
  );
}

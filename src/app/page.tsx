"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { IconBadge, StarToggle } from "@/components/IconBadge";
import TimelineSparkline from "@/components/TimelineSparkline";

const DATASET_CHIPS = ["Annals", "Fiants", "NMS Sites", "Bardic Poetry", "DIB", "CIRCLE", "Logainm"];
const TABS = [
  { key: "", label: "Texts" },
  { key: "CreativeWork", label: "Records" },
  { key: "Place", label: "Places" },
  { key: "Person", label: "People" },
  { key: "Annotation", label: "Annotations" },
];

const demoTimeline = Array.from({ length: 9 }).map((_, i) => ({
  year: 1000 + i * 100,
  count: Math.round(Math.random() * 8 + 2),
}));

export default function HomePage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const ctl = new AbortController();
    if (!q) {
      setResults([]);
      return;
    }
    const url = new URL("/api/search", window.location.origin);
    url.searchParams.set("q", q);
    if (type) url.searchParams.set("type", type);
    fetch(url.toString(), { signal: ctl.signal })
      .then((r) => r.json())
      .then(setResults)
      .catch(() => {});
    return () => ctl.abort();
  }, [q, type]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-semibold tracking-wide text-gold drop-shadow">Oir Project</h1>
        <p className="mt-2 text-oir-cream/90">Linking Ireland’s Past, One Record at a Time</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          {DATASET_CHIPS.map((k) => (
            <span
              key={k}
              className="px-3 py-2 rounded-full bg-black/25 border border-gold text-oir-cream/90 shadow-oir"
            >
              {k}
            </span>
          ))}
        </div>
      </header>

      <div className="bg-black/25 border border-gold rounded-xl p-4 shadow-oir">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search across centuries of Irish history…"
          className="h-12 text-lg bg-black/20 border-gold text-oir-cream placeholder:text-oir-cream/60"
        />

        <div className="mt-3">
          <Tabs value={type} onValueChange={setType}>
            <TabsList className="bg-transparent border border-gold">
              {TABS.map((t) => (
                <TabsTrigger key={t.key} value={t.key} className="data-[state=active]:bg-black/30 text-oir-cream">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-4 space-y-2">
          {results.map((r: any) => {
            const icon: "MapPin" | "User" | "BookOpen" =
              r["@type"] === "Place" ? "MapPin" : r["@type"] === "Person" ? "User" : "BookOpen";
            return (
              <Card key={r.id} className="bg-black/20 border border-gold text-oir-cream">
                <CardContent className="p-3 flex items-center">
                  <IconBadge type={icon} />
                  <div className="ml-3">
                    <div className="font-semibold">{r.name || r.title}</div>
                    <div className="text-sm opacity-80">{r.date || r._slug}</div>
                  </div>
                  <div className="ml-auto">
                    <StarToggle />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {results.length === 0 && (
            <div className="text-oir-cream/70 text-sm">Try “Annals of Ulster” or “Richard Edgeworth”.</div>
          )}
        </div>

        <div className="mt-6">
          <TimelineSparkline data={demoTimeline} />
        </div>
      </div>

      <section className="mt-8">
        <JsonLdInspector />
      </section>
    </div>
  );
}

function JsonLdInspector() {
  const [raw, setRaw] = useState(
    `{
  "@context": ["https://schema.org"],
  "@id": "urn:example",
  "name": "Sample"
}`
  );
  const [out, setOut] = useState<string>("");

  const parse = async () => {
    try {
      const res = await fetch("/api/inspect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonld: JSON.parse(raw) }),
      });
      setOut(await res.text());
    } catch (e: any) {
      setOut(String(e?.message || e));
    }
  };

  return (
    <div className="bg-black/25 border border-gold rounded-xl p-4 shadow-oir">
      <h2 className="text-gold text-xl mb-2">JSON-LD Inspector</h2>
      <textarea
        className="w-full h-40 bg-black/20 border border-gold rounded p-2 text-oir-cream"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />
      <button onClick={parse} className="mt-2 px-4 py-2 rounded bg-gold text-black font-semibold">
        Parse →
      </button>
      {out && (
        <pre className="mt-3 text-sm bg-black/20 border border-gold rounded p-3 text-oir-cream overflow-x-auto whitespace-pre-wrap">
          {out}
        </pre>
      )}
    </div>
  );
}

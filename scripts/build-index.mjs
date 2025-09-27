import fs from "node:fs/promises";
import path from "node:path";

let fg;
try {
  ({ default: fg } = await import("fast-glob"));
} catch (err) {
  console.warn("fast-glob not available, using fallback walker:", err?.message || err);
  fg = async function fallbackGlob(patterns, { cwd }) {
    const regexes = patterns.map((pattern) => {
      const escaped = pattern.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
      return new RegExp(`^${escaped.replace(/\*/g, "[^/]*")}$`);
    });
    const results = new Set();
    async function walk(relDir = "") {
      const absDir = relDir ? path.join(cwd, relDir) : cwd;
      let entries = [];
      try {
        entries = await fs.readdir(absDir, { withFileTypes: true });
      } catch (readErr) {
        return;
      }
      for (const entry of entries) {
        const relPath = relDir ? path.join(relDir, entry.name) : entry.name;
        if (entry.isDirectory()) {
          await walk(relPath);
        } else if (regexes.some((re) => re.test(relPath))) {
          results.add(relPath);
        }
      }
    }
    await walk("");
    return Array.from(results).sort();
  };
}

let MiniSearch;
try {
  ({ default: MiniSearch } = await import("minisearch"));
} catch (err) {
  console.warn("MiniSearch not available, building fallback index:", err?.message || err);
}

const DATA = path.join(process.cwd(), "src", "data");
const OUT  = path.join(DATA, "indexes");
await fs.mkdir(OUT, { recursive: true });

const mini = MiniSearch
  ? new MiniSearch({
      fields: ["name","title","entryText","translation","date","@type"],
      storeFields: ["@id","name","title","date","@type","_slug","_file"]
    })
  : null;

const fallbackDocs = [];

function collectDocs(doc, sourceFile) {
  const bucket = [];
  const pushDoc = (d, i) => {
    if (!d || typeof d !== "object") return;
    const id = d["@id"] || `${sourceFile}#${i}`;
    const slug = (id.split("/").pop() || "").replace(/^#/, "") || String(i);
    bucket.push({
      id,
      _slug: slug,
      _file: sourceFile,
      ...d
    });
  };

  if (Array.isArray(doc)) {
    doc.forEach((d, i) => pushDoc(d, i));
    return bucket;
  }

  if (doc && typeof doc === "object" && Array.isArray(doc["@graph"])) {
    doc["@graph"].forEach((d, i) => pushDoc(d, i));
    return bucket;
  }

  pushDoc(doc, 0);
  return bucket;
}

const patterns = [
  "people/*.jsonld",
  "places/*.jsonld",
  "events/*.jsonld",
  "annals/*/*.jsonld",
  "fiants/*/*.jsonld",
  "fiants/*.jsonld",
  "annals/*.jsonld",
  "bardic/*.jsonld",
  "dib/*.jsonld"
];

const FILES = await fg(patterns, { cwd: DATA, dot: false });

let count = 0;
for (const rel of FILES) {
  const full = path.join(DATA, rel);
  const raw = await fs.readFile(full, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.warn("Skipping invalid JSON:", rel);
    continue;
  }
  const docs = collectDocs(parsed, rel);
  docs.forEach((d) => {
    if (mini) {
      mini.add({ id: d.id, ...d });
    }
    fallbackDocs.push(d);
  });
  count += docs.length;
}

const outputPath = path.join(OUT, "minisearch_all.json");
const payload = mini ? mini.toJSON() : { docs: fallbackDocs, generatedAt: new Date().toISOString() };
await fs.writeFile(outputPath, JSON.stringify(payload, null, 2));
console.log("Index built with", count, "docs from", FILES.length, "file(s)");
if (!mini) {
  console.log("(Fallback index written; install dependencies for full MiniSearch index.)");
}

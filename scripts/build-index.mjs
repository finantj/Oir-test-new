import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import MiniSearch from "minisearch";

const DATA = path.join(process.cwd(), "src", "data");
const OUT  = path.join(DATA, "indexes");

await fs.mkdir(OUT, { recursive: true });

const mini = new MiniSearch({
  fields: ["name","title","entryText","date","@type"],
  storeFields: ["@id","name","title","date","@type","_slug"]
});

const files = await fg([
  "people/*.jsonld","places/*.jsonld","events/*.jsonld",
  "annals/*/*.jsonld","fiants/*/*.jsonld"
], { cwd: DATA });

for (const rel of files) {
  const full = path.join(DATA, rel);
  const doc = JSON.parse(await fs.readFile(full, "utf8"));
  const slug = rel.replace(/\.jsonld$/, "").split("/").pop();
  mini.add({ id: doc["@id"] || rel, _slug: slug, ...doc });
}

await fs.writeFile(path.join(OUT,"minisearch_all.json"), JSON.stringify(mini.toJSON()));
console.log("Index built with", files.length, "docs");

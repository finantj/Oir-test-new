import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import MiniSearch from "minisearch";

const DATA = path.join(process.cwd(), "src", "data");
const OUT  = path.join(DATA, "indexes");

// If data folder is missing (fresh repo), make a tiny sample set:
await fs.mkdir(path.join(DATA, "contexts"), { recursive: true }).catch(()=>{});
await fs.mkdir(path.join(DATA, "people"), { recursive: true }).catch(()=>{});
await fs.mkdir(path.join(DATA, "places"), { recursive: true }).catch(()=>{});
await fs.mkdir(path.join(DATA, "annals", "connacht"), { recursive: true }).catch(()=>{});
await fs.mkdir(OUT, { recursive: true }).catch(()=>{});

async function ensure(file, content) {
  try { await fs.access(file); } catch { await fs.writeFile(file, content); }
}

await ensure(path.join(DATA,"contexts","core.json"), JSON.stringify({
  "@vocab":"http://schema.org/",
  "name":"http://schema.org/name",
  "title":"http://schema.org/name",
  "type":"@type",
  "entryText":"http://schema.org/text",
  "translation":"http://schema.org/translationOfWork",
  "date":"http://schema.org/datePublished"
}, null, 2));

await ensure(path.join(DATA,"people","mac-dermot-aodh.jsonld"), JSON.stringify({
  "@context":["../contexts/core.json"],
  "@id":"https://gaelicireland.com/oir/id/person/mac-dermot-aodh",
  "@type":"Person","name":"Aodh mac Diarmata","date":"c. 1200–1265"
}, null, 2));

await ensure(path.join(DATA,"places","lough-key.jsonld"), JSON.stringify({
  "@context":["../contexts/core.json"],
  "@id":"https://gaelicireland.com/oir/id/place/lough-key",
  "@type":"Place","name":"Lough Key"
}, null, 2));

await ensure(path.join(DATA,"annals","connacht","1022.1.jsonld"), JSON.stringify({
  "@context":["../../contexts/core.json"],
  "@id":"https://gaelicireland.com/oir/id/annals/connacht/1022.1",
  "@type":"CreativeWork","title":"Annals of Connacht 1022.1","date":"1022",
  "entryText":"Lann Leite was plundered…"
}, null, 2));

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
console.log("Index built:", path.join("src/data/indexes/minisearch_all.json"));

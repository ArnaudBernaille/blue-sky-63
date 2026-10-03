/* Tests de deploy/core.js : node deploy/test.mjs (après node deploy/build.mjs) */
import {readFileSync,readdirSync} from "node:fs";
import assert from "node:assert/strict";
import {decryptPage,mergeRemote,stampKey} from "./core.js";
const key=readFileSync("secrets/content-key.txt","utf8").trim();
for(const f of readdirSync("public").filter(f=>f.endsWith(".html")&&f!=="en.html")){
  const blob=/"blob":"\/([^"]+)"/.exec(readFileSync("public/"+f,"utf8"))[1];
  const html=await decryptPage(readFileSync("public/"+blob),key);
  assert.equal(html,readFileSync(f,"utf8"),f);
  assert.ok(!readFileSync("public/"+blob).includes("Uniform"),"blob en clair : "+f);
}
await assert.rejects(decryptPage(readFileSync("public/"+readdirSync("public/c").map(f=>"c/"+f)[0]),Buffer.alloc(32).toString("base64")));
class Mem{constructor(o={}){this.m=new Map(Object.entries(o))}get length(){return this.m.size}key(i){return [...this.m.keys()][i]??null}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(k,String(v))}}
// nouvel appareil : le distant gagne
let s=new Mem();let p=mergeRemote(s,{bluesky63:{s:"R",t:100}});
assert.equal(s.getItem("bluesky63"),"R");assert.deepEqual(p,{});
// progression locale jamais synchronisée, rien à distance : envoyée
s=new Mem({bluesky63:"L",bluesky86:"L86",autre:"x"});p=mergeRemote(s,{});
assert.deepEqual(Object.keys(p).sort(),["bluesky63","bluesky86"]);assert.equal(p.bluesky63.s,"L");
// local plus récent : envoyé ; distant plus récent : écrit en local
s=new Mem({bluesky63:"L","bluesky63@t":"200",bluesky86:"L","bluesky86@t":"50"});
p=mergeRemote(s,{bluesky63:{s:"R",t:100},bluesky86:{s:"R86",t:90}});
assert.deepEqual(p,{bluesky63:{s:"L",t:200}});assert.equal(s.getItem("bluesky86"),"R86");assert.equal(s.getItem("bluesky63"),"L");
// local jamais synchronisé mais distant existant : le distant gagne
s=new Mem({bluesky63:"vieux"});p=mergeRemote(s,{bluesky63:{s:"R",t:5}});assert.equal(s.getItem("bluesky63"),"R");assert.deepEqual(p,{});
// entrées distantes invalides ignorées
s=new Mem();mergeRemote(s,{bluesky63:{s:1,t:"x"},foo:{s:"a",t:1}});assert.equal(s.length,0);
// stampKey
s=new Mem();const e=stampKey(s,"bluesky63","v",Mem.prototype.setItem);assert.equal(e.s,"v");assert.ok(+s.getItem("bluesky63@t")>0);
console.log("tests ok");

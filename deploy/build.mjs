/* Construit public/ pour Firebase Hosting : node deploy/build.mjs
   Chaque page HTML de la racine (sauf en.html, simple redirection) est compressée, chiffrée en AES-256-GCM,
   et remplacée par une page de connexion qui la déchiffre après authentification.
   La clé est créée au premier lancement dans secrets/content-key.txt (jamais commité) ;
   sa valeur doit être copiée dans Firestore, document config/key, champ k (voir deploy/README.md). */
import {readFileSync,writeFileSync,mkdirSync,rmSync,existsSync,readdirSync,copyFileSync} from "node:fs";
import {gzipSync,constants} from "node:zlib";
import {createCipheriv,randomBytes,createHash} from "node:crypto";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const ROOT=join(dirname(fileURLToPath(import.meta.url)),"..");
const OUT=join(ROOT,"public"),SECRETS=join(ROOT,"secrets"),KEYF=join(SECRETS,"content-key.txt");
const PLAIN=["en.html"]; // copiées telles quelles : aucun contenu de cours

if(!existsSync(KEYF)){mkdirSync(SECRETS,{recursive:true});writeFileSync(KEYF,randomBytes(32).toString("base64")+"\n");console.log("Nouvelle clé créée : "+KEYF+" (à copier dans Firestore config/key, champ k)")}
const key=Buffer.from(readFileSync(KEYF,"utf8").trim(),"base64");
if(key.length!==32)throw new Error("secrets/content-key.txt doit contenir 32 octets en base64");

rmSync(OUT,{recursive:true,force:true});mkdirSync(join(OUT,"c"),{recursive:true});mkdirSync(join(OUT,"bs"),{recursive:true});
for(const f of ["loader.js","core.js","config.js"])copyFileSync(join(ROOT,"deploy",f),join(OUT,"bs",f));
const shell=readFileSync(join(ROOT,"deploy","shell.html"),"utf8");

for(const f of readdirSync(ROOT).filter(f=>f.endsWith(".html"))){
  if(PLAIN.includes(f)){copyFileSync(join(ROOT,f),join(OUT,f));console.log("copiée  "+f);continue}
  const html=readFileSync(join(ROOT,f));
  const iv=randomBytes(12),c=createCipheriv("aes-256-gcm",key,iv);
  const enc=Buffer.concat([iv,c.update(gzipSync(html,{level:constants.Z_BEST_COMPRESSION})),c.final(),c.getAuthTag()]);
  /* Nom dérivé du contenu : le fichier peut être mis en cache sans limite (firebase.json). */
  const name="c/"+createHash("sha256").update(html).digest("hex").slice(0,16)+".bin";
  writeFileSync(join(OUT,name),enc);
  const lang=(/<html[^>]*\blang="([a-z]+)/i.exec(html.toString("utf8").slice(0,500))||[,"fr"])[1];
  const page=shell.replace("__LANG__",lang).replace("__BOOT__",JSON.stringify({blob:"/"+name,lang}));
  writeFileSync(join(OUT,f),page);
  console.log("chiffrée "+f+" → "+name+" ("+Math.round(enc.length/1024)+" Ko)");
}

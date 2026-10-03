/* Fonctions sans dépendance à Firebase, testées par deploy/test.mjs. */

/* Clés de progression des pages de série. */
export const localKeys=/^bluesky\d+$/;
const tKey=k=>k+"@t";

/* Format produit par build.mjs : iv (12 octets) || texte chiffré || tag GCM (16 octets), du HTML compressé en gzip. */
export async function decryptPage(buf,keyB64){
  const raw=Uint8Array.from(atob(keyB64),c=>c.charCodeAt(0));
  const key=await crypto.subtle.importKey("raw",raw,"AES-GCM",false,["decrypt"]);
  const b=new Uint8Array(buf);
  const gz=await crypto.subtle.decrypt({name:"AES-GCM",iv:b.slice(0,12)},key,b.slice(12));
  const plain=new Blob([gz]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(plain).text();
}

/* Remote : {bluesky63:{s,t}, …}. La version la plus récente gagne, clé par clé.
   Écrit dans storage les versions distantes plus récentes ; renvoie les versions locales plus récentes, à envoyer. */
export function mergeRemote(storage,remote){
  const push={};
  Object.keys(remote).forEach(k=>{
    const r=remote[k];if(!localKeys.test(k)||!r||typeof r.s!=="string"||!Number.isFinite(r.t))return;
    const lt=+storage.getItem(tKey(k))||0;
    if(r.t>lt){storage.setItem(k,r.s);storage.setItem(tKey(k),String(r.t))}
  });
  const keys=[];for(let i=0;i<storage.length;i++)keys.push(storage.key(i));
  for(const k of keys){
    if(!localKeys.test(k))continue;
    const r=remote[k],lt=+storage.getItem(tKey(k))||0;
    /* Progression locale jamais synchronisée (lt = 0) : envoyée seulement s'il n'existe rien à distance. */
    if(r&&r.t>=lt)continue;
    if(!r&&!lt){const t=Date.now();storage.setItem(tKey(k),String(t));push[k]={s:storage.getItem(k),t};continue}
    if(lt>(r?r.t:0))push[k]={s:storage.getItem(k),t:lt};
  }
  return push;
}

/* Horodate une écriture locale (sans repasser par le setItem intercepté) et renvoie l'entrée à envoyer. */
export function stampKey(storage,k,v,set){
  const t=Date.now();set.call(storage,tKey(k),String(t));return {s:v,t};
}

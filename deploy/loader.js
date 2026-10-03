/* Blue Sky : chargeur des pages privées.
   La page publique ne contient que ce chargeur. Le vrai contenu (le fichier HTML d'origine, compressé puis chiffré
   en AES-256-GCM par build.mjs) est déchiffré avec une clé que Firestore ne donne qu'aux comptes autorisés.
   La progression (clés localStorage « bluesky<numéro> ») est synchronisée dans users/{uid}, sans modifier les pages. */
import {initializeApp} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {getAuth,onAuthStateChanged,signInWithPopup,signOut,GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {FIREBASE_CONFIG} from "./config.js";
import {decryptPage,mergeRemote,localKeys,stampKey} from "./core.js";

const BOOT=window.BS_BOOT; // {blob, lang} écrit par build.mjs dans chaque page
const T=BOOT.lang==="en"
  ?{load:"Loading…",need:"Sign in to access the course.",btn:"Sign in with Google",denied:"This account does not have access. Sign in with an authorized Google account.",err:"Something went wrong: ",out:"Sign out"}
  :{load:"Chargement…",need:"Connecte-toi pour accéder au cours.",btn:"Se connecter avec Google",denied:"Ce compte n'a pas accès. Connecte-toi avec un compte Google autorisé.",err:"Erreur : ",out:"Se déconnecter"};
const $=id=>document.getElementById(id);
const msg=t=>{$("bsMsg").textContent=t};

const app=initializeApp(FIREBASE_CONFIG),auth=getAuth(app),db=getFirestore(app);
$("bsBtn").textContent=T.btn;msg(T.load);
$("bsBtn").onclick=()=>signInWithPopup(auth,new GoogleAuthProvider()).catch(e=>{if(e.code!=="auth/popup-closed-by-user")msg(T.err+e.code)});

let started=false;
onAuthStateChanged(auth,async user=>{
  if(!user){$("bsBtn").hidden=false;msg(T.need);return}
  if(started)return;started=true;
  $("bsBtn").hidden=true;msg(T.load);
  try{
    let k=null;try{k=sessionStorage.getItem("bs-key")}catch(e){}
    if(!k){const kd=await getDoc(doc(db,"config","key"));k=kd.data().k;try{sessionStorage.setItem("bs-key",k)}catch(e){}}
    const ref=doc(db,"users",user.uid);
    const [html,ud]=await Promise.all([fetch(BOOT.blob).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.arrayBuffer()}).then(b=>decryptPage(b,k)),getDoc(ref)]);
    const push=mergeRemote(localStorage,ud.exists()?ud.data():{});
    if(Object.keys(push).length)await setDoc(ref,push,{merge:true});
    const flush=startSync(ref);
    document.open();document.write(html);document.close();
    /* document.open() efface les écouteurs de window et document : on les pose après. */
    addEventListener("pagehide",flush);
    document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")flush()});
    addSignOut(user);
  }catch(e){
    started=false;
    if(e.code==="permission-denied"){try{sessionStorage.removeItem("bs-key")}catch(_){}msg(T.denied);$("bsBtn").hidden=false;signOut(auth);return}
    msg(T.err+(e.code||e.message));
  }
});

/* Toute écriture de la page dans localStorage sous « bluesky<numéro> » est horodatée et envoyée à Firestore (regroupée toutes les 2 s). */
function startSync(ref){
  const set=Storage.prototype.setItem,pending={};let timer=null;
  const flush=()=>{clearTimeout(timer);timer=null;const keys=Object.keys(pending);if(!keys.length)return;
    const data={};keys.forEach(k=>{data[k]=pending[k];delete pending[k]});setDoc(ref,data,{merge:true}).catch(()=>{keys.forEach(k=>{if(!pending[k])pending[k]=data[k]})})};
  Storage.prototype.setItem=function(k,v){
    set.call(this,k,v);
    if(this===localStorage&&localKeys.test(k)){pending[k]=stampKey(this,k,v,set);if(!timer)timer=setTimeout(flush,2000)}
  };
  return flush;
}

function addSignOut(user){
  const b=document.createElement("button");
  b.type="button";b.textContent=T.out;b.title=user.email||"";
  b.style.cssText="font:12px/1.4 system-ui,sans-serif;background:none;border:0;padding:4px 0;color:inherit;opacity:.7;text-decoration:underline;cursor:pointer;text-align:left";
  b.onclick=()=>{try{sessionStorage.removeItem("bs-key")}catch(e){}signOut(auth).then(()=>location.reload())};
  const aside=document.querySelector("aside");
  if(aside)aside.append(b);
  else{b.style.position="fixed";b.style.right="12px";b.style.bottom="calc(8px + env(safe-area-inset-bottom, 0px))";document.body.append(b)}
}

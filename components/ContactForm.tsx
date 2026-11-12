'use client';
import {useState} from 'react';
import Script from 'next/script';
declare global {interface Window {turnstile?:{render:(el:HTMLElement,opts:{sitekey:string,callback:(token:string)=>void,'expired-callback':()=>void})=>void;reset:()=>void}}}
export default function ContactForm(){
 const [token,setToken]=useState('');const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);
 const siteKey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(!token){setStatus('Complete the security check.');return}
  setBusy(true);setStatus('Sending...');
  const form=e.currentTarget;const data=new FormData(form);
  try{const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),email:data.get('email'),message:data.get('message'),website:data.get('website'),consent:data.get('consent')==='on',token})});
   const result=await res.json();if(!res.ok)throw new Error(result.error||'Unable to send');
   setStatus('Thank you. Your message was received.');form.reset();setToken('');
  }catch(error){setStatus(error instanceof Error?error.message:'Please try again.')}
  finally{setBusy(false);window.turnstile?.reset()}
 }
 return <form onSubmit={submit} className="mt-6 space-y-4">
 <label className="block text-sm font-semibold">Name<input required name="name" minLength={2} maxLength={120} autoComplete="name" className="mt-2 w-full rounded-xl border p-3"/></label>
 <label className="block text-sm font-semibold">Email<input required name="email" type="email" maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border p-3"/></label>
 <label className="block text-sm font-semibold">Message<textarea required name="message" minLength={10} maxLength={3000} className="mt-2 w-full rounded-xl border p-3" rows={4}/></label>
 <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]"/>
 <label className="flex items-start gap-3 text-sm"><input required type="checkbox" name="consent" className="mt-1"/>I consent to being contacted about my inquiry. Please do not include sensitive medical information.</label>
 {siteKey?<><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={()=>{const el=document.getElementById('turnstile-box');if(el&&window.turnstile)window.turnstile.render(el,{sitekey:siteKey,callback:setToken,'expired-callback':()=>setToken('')})}}/><div id="turnstile-box"/></>:<p role="status" className="text-sm text-red-700">Form is unavailable until security verification is configured.</p>}
 <button disabled={busy||!token||!siteKey} className="btn disabled:opacity-50">{busy?'Sending...':'Send Message'}</button>
 <p aria-live="polite" role="status" className="text-sm">{status}</p>
 </form>
}

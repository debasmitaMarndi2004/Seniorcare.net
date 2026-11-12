'use client';
import {useEffect} from 'react';
export default function OriginalInteractions(){
 useEffect(()=>{
  const root=document.getElementById('original-design');if(!root)return;
  const modal=root.querySelector<HTMLElement>('#modal');
  const nav=root.querySelector<HTMLElement>('#nav, .links');
  const menuButton=root.querySelector<HTMLButtonElement>('#menu');
  let previous:HTMLElement|null=null;
  const backdrop=document.createElement('div');backdrop.className='drawer-backdrop';backdrop.setAttribute('aria-hidden','true');root.appendChild(backdrop);
  nav?.setAttribute('aria-label','Main navigation');
  const routes:Record<string,string>={
   'Care Options':'/senior-living-options','Services':'/care-services',
   'Resources':'/resources','Contact Us':'/contact',
   'About Us':'/contact','Care Guides':'/resources',
   'Articles & Tips':'/resources','Assisted Living':'/senior-living-options',
   'Memory Care':'/senior-living-options','Independent Living':'/senior-living-options',
   'In-Home Care':'/care-services','Nursing Homes':'/senior-living-options',
   'Continuing Care':'/senior-living-options',
  };
  root.querySelectorAll<HTMLAnchorElement>('a').forEach(link=>{
   const label=link.textContent?.trim()||'';
   if(routes[label])link.href=routes[label];
   if(link.classList.contains('brand'))link.href='/';
  });
  // Add a direct Contact link to the mobile menu while retaining original styling.
  if(nav&&!nav.querySelector('a[href="/contact"]')){
   const contact=document.createElement('a');contact.href='/contact';contact.textContent='Contact Us';
   nav.insertBefore(contact,nav.querySelector('.nav-cta'));
  }
  function closeMenu(){nav?.classList.remove('open');backdrop.classList.remove('visible');menuButton?.setAttribute('aria-expanded','false');document.body.style.overflow='';}
  function closeModal(){modal?.classList.remove('open','show','active');modal?.setAttribute('aria-hidden','true');previous?.focus()}
  function click(e:MouseEvent){
   const target=e.target as Element;
   if(target.closest('#menu')){e.preventDefault();const open=nav?.classList.toggle('open')||false;backdrop.classList.toggle('visible',open);menuButton?.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':'';return}
   if(target.closest('.drawer-backdrop')){closeMenu();return}
   const action=target.closest('[data-action]')?.getAttribute('data-action');
   if(action==='open'){e.preventDefault();previous=document.activeElement as HTMLElement;modal?.classList.add('open');modal?.setAttribute('aria-hidden','false');modal?.querySelector<HTMLElement>('button')?.focus();return}
   if(action==='close'){e.preventDefault();closeModal();return}
   if(target.closest('#nav a'))closeMenu();
   if(target===modal)closeModal();
  }
  function key(e:KeyboardEvent){if(e.key==='Escape'){closeMenu();closeModal()}}
  async function submit(e:Event){
   const form=e.target as HTMLFormElement;
   if(!form.matches('form'))return;
   e.preventDefault();
   const status=form.querySelector<HTMLElement>('#contact-status, #form-status, .status, .notice');
   if(!form.matches('[data-secure-form]')){if(status)status.textContent='This preview form is not connected. Please use the Contact Us page.';return}
   const fields=new FormData(form);
   const first=String(fields.get('first_name')||'').trim(),last=String(fields.get('last_name')||'').trim();
   const email=String(fields.get('email')||'').trim(),message=String(fields.get('message')||'').trim();
   const topic=String(fields.get('topic')||'').trim();
   const token=String(fields.get('cf-turnstile-response')||'');
   if(!form.reportValidity())return;
   if(!token){if(status)status.textContent='Security verification is unavailable. Please try again later.';return}
   const button=form.querySelector<HTMLButtonElement>('button[type="submit"],button.btn');
   if(button)button.disabled=true;
   if(status){status.textContent='Sending your message…';status.setAttribute('role','status')}
   try{
    const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
     name:[first,last].filter(Boolean).join(' '),email,message:topic?topic+' — '+message:message,
     consent:fields.get('consent')==='on',website:String(fields.get('website')||''),token
    })});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'Unable to send message.');
    if(status)status.textContent='Your message was sent successfully.';
    form.reset();
    const turnstile=(window as Window & {turnstile?:{reset:()=>void}}).turnstile;turnstile?.reset();
   }catch(err){if(status)status.textContent=err instanceof Error?err.message:'Unable to send message. Please try again.'}
   finally{if(button)button.disabled=false}
  }
  root.addEventListener('click',click);root.addEventListener('submit',submit);document.addEventListener('keydown',key);
  return ()=>{root.removeEventListener('click',click);root.removeEventListener('submit',submit);document.removeEventListener('keydown',key);document.body.style.overflow='';backdrop.remove()};
 },[]);
 return null;
}

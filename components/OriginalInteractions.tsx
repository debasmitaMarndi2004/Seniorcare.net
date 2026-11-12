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
  function submit(e:Event){if((e.target as Element).matches('form')){e.preventDefault();const note=(e.target as Element).querySelector<HTMLElement>('#form-status, .notice');if(note)note.textContent='This preview does not submit information. Please use the contact page for inquiries.'}}
  root.addEventListener('click',click);root.addEventListener('submit',submit);document.addEventListener('keydown',key);
  return ()=>{root.removeEventListener('click',click);root.removeEventListener('submit',submit);document.removeEventListener('keydown',key);document.body.style.overflow='';backdrop.remove()};
 },[]);
 return null;
}

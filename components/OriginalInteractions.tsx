'use client';
import {useEffect} from 'react';
export default function OriginalInteractions(){
 useEffect(()=>{
  const root=document.getElementById('original-design');if(!root)return;
  const modal=root.querySelector<HTMLElement>('#modal');
  const menu=root.querySelector<HTMLElement>('.nav-links, .nav-menu, #mobile-menu');
  let previous:HTMLElement|null=null;
  function click(e:MouseEvent){
   const target=e.target as Element;
   const action=target.closest('[data-action]')?.getAttribute('data-action');
   if(action==='open'){e.preventDefault();previous=document.activeElement as HTMLElement;modal?.classList.add('show','open','active');modal?.setAttribute('aria-hidden','false');modal?.querySelector<HTMLElement>('button')?.focus()}
   if(action==='close'){e.preventDefault();modal?.classList.remove('show','open','active');modal?.setAttribute('aria-hidden','true');previous?.focus()}
   if(target.closest('.menu, [aria-label="Open menu"]')){menu?.classList.toggle('open');menu?.classList.toggle('show');}
  }
  function key(e:KeyboardEvent){if(e.key==='Escape'){modal?.classList.remove('show','open','active');previous?.focus();menu?.classList.remove('open','show')}}
  function submit(e:Event){if((e.target as Element).matches('form')){e.preventDefault();const note=(e.target as Element).querySelector<HTMLElement>('#form-status, .notice');if(note)note.textContent='This preview does not submit information. Please use the contact page for inquiries.'}}
  root.addEventListener('click',click);root.addEventListener('submit',submit);document.addEventListener('keydown',key);
  return ()=>{root.removeEventListener('click',click);root.removeEventListener('submit',submit);document.removeEventListener('keydown',key)};
 },[]);
 return null;
}

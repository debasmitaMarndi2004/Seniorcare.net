import {readFile} from 'node:fs/promises';
import path from 'node:path';
import Image from 'next/image';
import {Fragment} from 'react';
import OriginalInteractions from './OriginalInteractions';
const allowed=['home','care-services','senior-living-options','resources','contact'] as const;
type PageName=(typeof allowed)[number];
export default async function OriginalPage({name}:{name:PageName}){
 const html=await readFile(path.join(process.cwd(),'public',name+'.html'),'utf8');
 // The approved markup is a repository-controlled static file, not user-provided HTML.
 const parts=html.split(/(<img\b[^>]*>)/gi);
 return <><link rel="stylesheet" href={`/${name}.css`}/><div className="original-design" id="original-design">
 {parts.map((part,i)=>{
  if(!/^<img\b/i.test(part))return <Fragment key={i}><span style={{display:'contents'}} dangerouslySetInnerHTML={{__html:part}}/></Fragment>;
  const attrs=Object.fromEntries([...part.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  const width=Number(attrs.width),height=Number(attrs.height);
  if(!attrs.src?.startsWith('/images/')||!width||!height)return null;
  return <Image key={i} src={attrs.src} alt={attrs.alt||''} width={width} height={height} priority={attrs.loading==='eager'} className={attrs.class||undefined} style={{maxWidth:'100%',height:'auto'}}/>;
 })}</div><OriginalInteractions/></>;
}

import {readFile} from 'node:fs/promises';
import path from 'node:path';
import Image from 'next/image';
import parse, {domToReact, Element} from 'html-react-parser';
import OriginalInteractions from './OriginalInteractions';
const allowed=['home','care-services','senior-living-options','resources','contact'] as const;
type PageName=(typeof allowed)[number];
export default async function OriginalPage({name}:{name:PageName}){
 const html=await readFile(path.join(process.cwd(),'public',name+'.html'),'utf8');
 const content=parse(html,{replace(node){
  if(node instanceof Element && node.name==='img'){
   const a=node.attribs;const width=Number(a.width),height=Number(a.height);
   if(a.src?.startsWith('/images/')&&width&&height)return <Image src={a.src} alt={a.alt||''} width={width} height={height} priority={a.loading==='eager'} className={a.class||undefined}/>;
  }
  // Preserve native SVG symbols and links from the approved source.
 }});
 return <><link rel="stylesheet" href={`/${name}.css`}/><div className="original-design" id="original-design">{content}</div><OriginalInteractions/></>;
}

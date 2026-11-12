import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
export const runtime = 'nodejs';
const schema = z.object({name:z.string().trim().min(2).max(120),email:z.email().max(254),message:z.string().trim().min(10).max(3000),consent:z.literal(true),website:z.string().max(0),token:z.string().min(1)});
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin'),expected=process.env.SITE_URL;
 if(!expected||!origin||origin!==new URL(expected).origin)return NextResponse.json({error:'Invalid origin'},{status:403});
 if(Number(req.headers.get('content-length')||0)>12000)return NextResponse.json({error:'Request too large'},{status:413});
 let body:unknown;try{body=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:'Check the form fields and consent.'},{status:400});
 const secret=process.env.TURNSTILE_SECRET_KEY,dbSecret=process.env.SUPABASE_SECRET_KEY,url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 if(!secret||!dbSecret||!url)return NextResponse.json({error:'Form temporarily unavailable.'},{status:503});
 const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({secret,response:parsed.data.token}),cache:'no-store',signal:AbortSignal.timeout(8000)}).then(r=>r.json()).catch(()=>({success:false}));
 if(!verify.success)return NextResponse.json({error:'Security check failed.'},{status:400});
 const db=createClient(url,dbSecret,{auth:{persistSession:false,autoRefreshToken:false}});
 const {error}=await db.from('contact_inquiries').insert({name:parsed.data.name,email:parsed.data.email,message:parsed.data.message});
 if(error){console.error('Contact inquiry insert failed');return NextResponse.json({error:'Unable to send message.'},{status:500})}
 return NextResponse.json({ok:true},{status:201,headers:{'Cache-Control':'no-store'}});
}

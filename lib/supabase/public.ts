import { createClient } from '@supabase/supabase-js';

export type PublishedGuide = { slug: string; title: string; excerpt: string | null };

// Read-only public CMS client. No service-role or secret key is used.
// Published content is protected by the database RLS policy.
export async function getPublishedGuides(): Promise<PublishedGuide[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes('YOUR_PROJECT_REF') || key.includes('REPLACE_ME')) return [];

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from('articles')
    .select('slug,title,excerpt')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) {
    console.error('Unable to load public guides from Supabase.');
    return [];
  }
  return (data ?? []) as PublishedGuide[];
}

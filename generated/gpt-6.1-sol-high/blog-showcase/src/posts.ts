import { createClient } from '@supabase/supabase-js';

export type Post = {
  id: string;
  type: 'featured' | 'standard';
  badge: string | null;
  title: string;
  description: string | null;
  author: string | null;
  category: string;
  category_color: string;
  video_url: string;
  image_url: string | null;
  display_order: number;
};
const cdn = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
export const seedPosts: Post[] = [
  { id: 'featured', type: 'featured', badge: 'Must Read', title: 'Full-Frame vs. Crop Sensor: Which for Photography?', description: "An honest look at the real-world differences between these camera systems to help you choose what's actually right for your photography needs.", author: 'By August Renner (c)', category: 'Gear', category_color: '#7d1a4a', video_url: cdn + 'hf_20260507_155500_808e6fdd-761f-4acd-b3be-cb7e6e700def.mp4', image_url: null, display_order: 0 },
  { id: 'lighting', type: 'standard', badge: null, title: 'Finding Natural Light in Unexpected Places', description: null, author: null, category: 'Lighting', category_color: '#2c4c34', video_url: cdn + 'hf_20260506_030111_a9e15665-d379-4a7f-8116-695bbe452ad1.mp4', image_url: null, display_order: 1 },
  { id: 'editing', type: 'standard', badge: null, title: 'My Approach to Editing: Creating a Consistent Photography Style', description: null, author: null, category: 'Editing', category_color: '#a63e2d', video_url: cdn + 'hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4', image_url: null, display_order: 2 },
  { id: 'business', type: 'standard', badge: null, title: 'Pricing Your Photography: Strategies That Work', description: null, author: null, category: 'Business', category_color: '#1a2b8c', video_url: cdn + 'hf_20260507_154232_f8809bd2-a6c3-4a38-908d-2005e5b3cb3e.mp4', image_url: null, display_order: 3 },
];

export async function loadPosts(): Promise<Post[]> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [...seedPosts].sort((a, b) => a.display_order - b.display_order);
  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('blog_posts').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return data as Post[];
}

// The exact supplied clips are mirrored locally for dependable static delivery.
export function videoSource(post: Post) {
  const seed = seedPosts.find(item => item.video_url === post.video_url);
  return seed ? `${import.meta.env.BASE_URL}videos/${seed.id}.mp4` : post.video_url;
}

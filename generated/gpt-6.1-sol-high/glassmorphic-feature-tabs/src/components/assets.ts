export const tabs = [
  { label: 'Exclusive Tutorial', image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260521_222821_06fd2e74-16a5-4e7f-90ed-14e6760e7edb.png&w=1280&q=85', caption: 'Step-by-step guides to master AI design tools.', title: 'Exclusive Tutorials', activeNav: 'Tutorials' },
  { label: 'Courses', image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260521_222901_b133c5f0-191c-4285-a018-a68fd9c9f5ac.png&w=1280&q=85', caption: 'Structured learning paths to level up your skills.', title: 'Courses', activeNav: 'Courses' },
  { label: 'Templates', image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260521_225713_3226e3ad-3364-42b1-99bd-ed82005c0524.png&w=1280&q=85', caption: 'Production-ready designs you can customize instantly.', title: 'Templates', activeNav: 'Templates' },
  { label: 'Animated Backgrounds', image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260521_222832_223716d0-9b6c-4c48-98a6-a5e3c02e2962.png&w=1280&q=85', caption: 'Motion-ready visuals that bring your projects to life.', title: 'Animated Backgrounds', activeNav: 'Backgrounds' }
];
export const assetRoot = 'https://miptxtnhvjrkpmnjgdhk.supabase.co/storage/v1/object/public/training-assets/landing/';
export const covers = Array.from({ length: 6 }, (_, i) => `${assetRoot}module-cover-${i + 1}.png`);
export const playIcon = `${assetRoot}play_icon.svg`;
export const videos = Array.from({ length: 6 }, (_, i) => `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260521_014404_bg${i + 1}.mp4`);

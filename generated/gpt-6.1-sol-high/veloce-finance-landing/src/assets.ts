const cloud = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
export const assets = {
  hero: cloud + 'hf_20260405_154629_a31a2372-bd54-4f7e-ac9b-21246141a664.mp4',
  members: cloud + 'hf_20260405_143605_bc7bd6c0-9c68-49ff-a9d3-073a10759fa4.mp4',
  transfers: cloud + 'hf_20260405_145119_f4ec4d9f-3ecd-4116-baa3-26e8cf2df976.mp4',
  global: cloud + 'hf_20260405_140728_ae719193-f10b-4105-82fc-c989610b3aa6.mp4',
  google: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_154325_6e98dcdb-51ba-446a-8c52-2d2f2675a575.png&w=1280&q=85',
  apple: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_154356_13de5dda-6dfe-4f54-b3e2-251301254578.png&w=1280&q=85',
};
export const localAsset = (name: string) => import.meta.env.BASE_URL + 'assets/' + name;

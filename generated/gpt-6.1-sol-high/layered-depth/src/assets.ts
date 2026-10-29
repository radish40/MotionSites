export const assets = {
  hero: 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/f_auto/v1779808200/bg-video_xsmysw.mp4',
  enter: 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/v1779808206/bird-entrada_e72qt7.webm',
  idle1: 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/v1779808282/bird-idle_fzjami.webm',
  idle2: 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/v1779808284/bird-idle2_rajmgo.webm',
  leave: 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/v1779808286/bird-saida_ifroz1.webm',
  section2: 'https://res.cloudinary.com/dy5er7kv5/video/upload/q_auto/f_auto/v1779835701/bg-2-video_sgbpqt.mp4',
  logo: 'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779808187/q-logo_isvugc.png',
  slab: 'https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779854565/slab_v1_kb4vqk.png',
  cta: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
};
export const localAsset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

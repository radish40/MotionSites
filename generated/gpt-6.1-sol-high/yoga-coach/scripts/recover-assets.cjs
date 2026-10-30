// Run inside the documented Docker image. Downloads use the specified assets' origins.
const fs=require('fs');
const {chromium}=require('/app/node_modules/playwright-core');
const assets='public/assets/';
const sources={
 'original.png':'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_053103_a6c6fd5c-8f43-4942-a487-e81c8f3cd0c1.png',
 'hero.jpg':'https://image.mux.com/YyFgoUXUTVMiVMMLeQoq49tP00joMyEzoRmnEnk02H5rA/thumbnail.jpg?time=0&width=1920',
 'card1.jpg':'https://image.mux.com/S9BmS8DLYYowz7jr1BkN2PbAQm4bjEwijllpwmEB4xA/thumbnail.jpg?time=0&width=640',
 'card2.jpg':'https://image.mux.com/83kMTSKA4Xy01RTddNwDdt7OjCocQTCdKHY7AsD02Dlgc/thumbnail.jpg?time=0&width=640',
 'card3.jpg':'https://image.mux.com/c4KUkE6NHGljcc4M8458iMEdHAbUvsG5MTpqefzBYvo/thumbnail.jpg?time=0&width=640',
 'anton.ttf':'https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm0K0.ttf'
};
(async()=>{
 for(const [file,url] of Object.entries(sources)){
  if(fs.existsSync(assets+file))continue;
  const response=await fetch(url);if(!response.ok)throw new Error(`${response.status}: ${url}`);
  fs.writeFileSync(assets+file,Buffer.from(await response.arrayBuffer()));
 }
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage();
 const data=await page.evaluate(async data=>{
  const image=new Image();image.src=`data:image/png;base64,${data}`;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=Math.round(1920*image.height/image.width);
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/webp',.85).split(',')[1];
 },fs.readFileSync(assets+'original.png').toString('base64'));
 fs.writeFileSync(assets+'poster.webp',Buffer.from(data,'base64'));await browser.close();
 fs.unlinkSync(assets+'original.png');
 console.log('Recovered original poster as 1920px WebP.');
})();

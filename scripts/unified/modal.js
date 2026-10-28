let modalGeneration=0, detailPromise=null;
const variantTextCache=new Map();
function showPreview(path){
 const kind=(path||'').split('.').pop().toLowerCase();
 $('preview').innerHTML=mediaOf({...current,local_rel:path||'',local_kind:kind},true);
}
async function selectVariant(index){
 const item=current, variant=item.variants[index];
 if(!variant)return;
 const generation=++modalGeneration;
 item.prompt_text='';item.active_variant=variant.id;
 $('prompt').textContent=t('modalLoading');$('prompt').dataset.mode='loading';
 $('copy').disabled=true;$('download').disabled=true;
 $('variant-sources').replaceChildren();
 variant.sources.forEach(source=>{
  const a=document.createElement('a');a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';
  a.textContent=sourceLabel(source.key)+' · '+source.path.split('/').pop();
  a.title=source.url;$('variant-sources').appendChild(a);
 });
 try{
  let body=variantTextCache.get(variant.text_path);
  if(body===undefined){const response=await fetch('data/'+variant.text_path,{cache:'no-store'});if(!response.ok)throw Error(response.status);body=await response.text();variantTextCache.set(variant.text_path,body);}
  if(generation!==modalGeneration||current!==item||!$('dlg').open)return;
  item.prompt_text=body;$('prompt').textContent=body;$('prompt').dataset.mode='prompt';
  $('copy').disabled=false;$('download').disabled=false;
 }catch(e){if(generation===modalGeneration){$('prompt').textContent=t('loadFailed');$('prompt').dataset.mode='error';}}
}
$('variant-choice').addEventListener('change',()=>selectVariant(Number($('variant-choice').value)));
$('preview-choice').addEventListener('change',()=>showPreview($('preview-choice').value));
async function openItem(id){
 const item=DATA.find(x=>x.id===id);if(!item)return;
 const generation=++modalGeneration;current=item;
 $('title').textContent=item.title;$('description').textContent=item.description||'';
 $('tags').innerHTML='<span class="tag accent">'+esc(item.category)+'</span><span class="tag">'+item.variant_count+' '+t('versionsUnit')+'</span>';
 $('prompt').textContent=t('modalLoading');$('prompt').dataset.mode='loading';
 $('variant-choice').replaceChildren();$('variant-sources').replaceChildren();$('preview-choice').replaceChildren();
 $('copy').disabled=true;$('download').disabled=true;
 showPreview(item.local_rel);
 if(!$('dlg').open)$('dlg').showModal();
 try{
  if(!detailPromise)detailPromise=fetchJSON('data/catalog-details.json').catch(e=>{detailPromise=null;throw e;});
  const all=await detailPromise;
  if(generation!==modalGeneration||current!==item||!$('dlg').open)return;
  item.variants=all[id].variants;
  item.variants.forEach((variant,i)=>{
   const option=document.createElement('option');option.value=i;
   option.textContent=(i+1)+'. '+[...new Set(variant.sources.map(s=>sourceLabel(s.key)))].join(' / ')+' · '+variant.length.toLocaleString()+(LANG==='en'?' characters':' 字符');
   $('variant-choice').appendChild(option);
  });
  const media=all[id].previews||[];
  media.forEach((path,i)=>{const option=document.createElement('option');option.value=path;option.textContent=(i+1)+'. '+path.split('/').pop();$('preview-choice').appendChild(option);});
  $('preview-choice').hidden=media.length<2;$('preview-choice').previousElementSibling.hidden=media.length<2;
  await selectVariant(0);
 }catch(e){if(generation===modalGeneration){$('prompt').textContent=t('loadFailed');$('prompt').dataset.mode='error';}}
}

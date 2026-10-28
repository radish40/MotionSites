let SEARCH_TEXT=Object.create(null), searchPromise=null;
async function searchAndRender(){
 render();
 if(!$('q').value.trim()){$('search-status').textContent='';return;}
 if(!searchPromise){
  $('search-status').textContent=t('searchLoading');
  searchPromise=fetchJSON('data/catalog-search.json').then(data=>{SEARCH_TEXT=data;return data;}).catch(e=>{searchPromise=null;throw e;});
 }
 try{await searchPromise;$('search-status').textContent='';render();}
 catch(e){$('search-status').textContent=t('searchFailed');}
}

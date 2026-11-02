// Progressive enhancement only. All pack options remain readable without JavaScript.
for (const select of document.querySelectorAll('[data-shop-pack]')) {
 const variants=select.closest('article').querySelectorAll('[data-shop-variant]');
 const update=()=>{for(const variant of variants)variant.hidden=variant.dataset.shopVariant!==select.value;};
 select.addEventListener('change',update); update();
}

// Keep the original category artwork available if a licensed first-party photo fails.
for (const photo of document.querySelectorAll('[data-shop-photo]')) {
 const showFallback=()=>{
  const fallback=photo.closest('article')?.querySelector('[data-shop-fallback]');
  if(fallback){photo.hidden=true;fallback.hidden=false;}
 };
 photo.addEventListener('error',showFallback,{once:true});
 if(photo.complete && photo.naturalWidth===0)showFallback();
}

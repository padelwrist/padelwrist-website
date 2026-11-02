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

// Audience sections own independent filters. No product metadata or interactions are transmitted.
for(const section of document.querySelectorAll('[data-shop-section]')) {
 const form=section.querySelector('[data-shop-filters]');
 const brand=form.querySelector('[data-shop-brand]'),category=form.querySelector('[data-shop-category]');
 const choices=[...section.querySelectorAll('[data-shop-category-choice]')];
 const products=[...section.querySelectorAll('[data-shop-product]')];
 const results=section.querySelector('.shop-results'),empty=section.querySelector('[data-shop-no-results]'),count=section.querySelector('[data-shop-count]');
 const reset=form.querySelector('[type="reset"]');
 const update=()=>{
  let visible=0;
  for(const product of products){product.hidden=Boolean((brand.value&&product.dataset.brand!==brand.value)||(category.value&&!product.dataset.categories.split(' ').includes(category.value)));if(!product.hidden)visible++;}
  for(const choice of choices)choice.setAttribute('aria-pressed',String(choice.dataset.shopCategoryChoice===category.value));
  empty.hidden=visible!==0||(!brand.value&&!category.value);
  count.textContent=count.dataset.prefix+': '+visible;
  reset.disabled=!brand.value&&!category.value;
 };
 form.hidden=false;section.querySelector('[data-shop-categories]').hidden=false;
 form.addEventListener('submit',event=>event.preventDefault());
 form.addEventListener('change',update);
 form.addEventListener('reset',()=>{brand.value='';category.value='';update();});
 section.querySelector('[data-shop-clear]').addEventListener('click',()=>{form.reset();brand.focus();});
 for(const choice of choices){
  choice.addEventListener('click',event=>{event.preventDefault();category.value=category.value===choice.dataset.shopCategoryChoice?'':choice.dataset.shopCategoryChoice;update();results.focus({preventScroll:true});results.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
  choice.addEventListener('keydown',event=>{if(event.key===' '){event.preventDefault();choice.click();}});
 }
 update();
}

const audienceLinks=[...document.querySelectorAll('.shop-audiences a')];
function showAudienceLocation(){
 for(const link of audienceLinks){if(link.hash===location.hash)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
}
addEventListener('hashchange',showAudienceLocation);showAudienceLocation();

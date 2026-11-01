// Progressive enhancement only. All pack options remain readable without JavaScript.
for (const select of document.querySelectorAll('[data-shop-pack]')) {
 const variants=select.closest('article').querySelectorAll('[data-shop-variant]');
 const update=()=>{for(const variant of variants)variant.hidden=variant.dataset.shopVariant!==select.value;};
 select.addEventListener('change',update); update();
}

// gallery.js — basic lightbox behavior
(function(){
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentIndex = 0;
  const items = Array.from(document.querySelectorAll('.gallery-img'));

  function openLightbox(index){
    const el = items[index];
    if(!el) return;
    currentIndex = index;
    if(lightbox && lightboxImg){
      lightboxImg.src = el.dataset.full || el.src;
      lightbox.classList.remove('hidden');
    }
  }

  function closeLightbox(){
    lightbox && lightbox.classList.add('hidden');
  }

  items.forEach((el,i)=>el.addEventListener('click',()=>openLightbox(i)));
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', ()=>openLightbox((currentIndex-1+items.length)%items.length));
  document.getElementById('lightbox-next')?.addEventListener('click', ()=>openLightbox((currentIndex+1)%items.length));
})();


// app.js — readable source for hero audio, intersection animations, and form handling

// Intersection observer for simple fade-up reveal
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.rate-card, .rate-panel, .gallery-img').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Simple hero audio player (single track)
const tracks = [ { title: 'Mike Audio', duration: '3:24', src: 'assets/mike-audio.mp3' } ];
let trackIndex = 0;
let isPlaying = false;

const trackTitleEl = document.getElementById('track-title');
const trackDurationEl = document.getElementById('track-duration');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');

const heroAudio = new Audio(tracks[0].src);
heroAudio.preload = 'metadata';

if (playBtn) {
  function renderTrack(index) {
    const t = tracks[index];
    trackTitleEl.textContent = t.title;
    trackDurationEl.textContent = t.duration;
    progressFill.style.width = '0%';
    heroAudio.src = t.src;
  }

  function updateProgress() {
    if (!heroAudio.duration || Number.isNaN(heroAudio.duration)) return;
    progressFill.style.width = `${(heroAudio.currentTime / heroAudio.duration) * 100}%`;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    playIcon.style.marginLeft = isPlaying ? '0' : '2px';
    if (isPlaying) {
      heroAudio.play().catch(() => { isPlaying = false; playIcon.className = 'fas fa-play'; playIcon.style.marginLeft = '2px'; });
    } else {
      heroAudio.pause();
    }
  }

  function nextTrack() { trackIndex = (trackIndex + 1) % tracks.length; renderTrack(trackIndex); if (isPlaying) heroAudio.play(); }
  function prevTrack() { trackIndex = (trackIndex - 1 + tracks.length) % tracks.length; renderTrack(trackIndex); if (isPlaying) heroAudio.play(); }

  heroAudio.addEventListener('timeupdate', updateProgress);
  heroAudio.addEventListener('ended', () => { isPlaying = false; playIcon.className = 'fas fa-play'; playIcon.style.marginLeft = '2px'; progressFill.style.width = '100%'; });
  playBtn.addEventListener('click', togglePlay);
  nextBtn && nextBtn.addEventListener('click', nextTrack);
  prevBtn && prevBtn.addEventListener('click', prevTrack);
  renderTrack(0);
}

// Contact form handler
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const feedback = document.getElementById('form-feedback');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitUrl = form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

  form.addEventListener('submit', async (ev) => {
    const honey = form.querySelector('[name="_gotcha"], [name="_honey"]');
    if (honey && honey.value) {
      ev.preventDefault();
      return; // spam trap
    }

    ev.preventDefault();
    submitBtn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch(submitUrl, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        feedback.classList.remove('sr-only');
        feedback.innerHTML = '<p class="text-green-600">Thanks — your message was sent!</p>';
        form.reset();
      } else {
        const text = await res.text().catch(() => '');
        const isActivationMessage = /activate form|check your email/i.test(text);
        feedback.classList.remove('sr-only');
        feedback.innerHTML = isActivationMessage
          ? '<p class="text-amber-600">The form is not activated yet. Please complete the FormSubmit activation email for this address and try again.</p>'
          : '<p class="text-red-600">Submission failed. Please try again later.</p>';
      }
    } catch (err) {
      feedback.classList.remove('sr-only');
      feedback.innerHTML = '<p class="text-red-600">Submission failed. Please try again later.</p>';
    } finally {
      submitBtn.disabled = false;
    }
  });
})();


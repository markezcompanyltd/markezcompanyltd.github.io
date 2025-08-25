// Main javascript file

// Global carousel state
const carouselState = {
  container: null,
  slides: [],
  dots: [],
  index: 0,
  timer: null,
  autoplayMs: 7000
};

function goToSlide(i) {
  if (!carouselState.container) return;
  const total = carouselState.slides.length;
  if (total === 0) return;
  if (i < 0) i = total - 1;
  if (i >= total) i = 0;
  carouselState.index = i;
  const offset = -i * 105;
  carouselState.container.style.transform = 'translateX(' + offset + '%)';
  carouselState.dots.forEach((d, idx) => {
    d.classList.toggle('active', idx === i);
  });
}

window.prevSlide = function () {
  goToSlide(carouselState.index - 1);
};
window.nextSlide = function () {
  goToSlide(carouselState.index + 1);
};
window.currentSlide = function (i) {
  goToSlide(i);
};

// Mobile menu toggle (used by inline onclick)
window.toggleMenu = function () {
  const menu = document.getElementById('nav-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
};

// Animate numbers utility (optional '+' suffix)
function animateCounter(element, target, duration, keepPlus) {
  let start = 0;
  const increment = Math.max(1, target / (duration / 16));
  const plus = keepPlus === true;
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      clearInterval(timer);
      element.textContent = String(target) + (plus ? '+' : '');
    } else {
      element.textContent = String(Math.floor(start)) + (plus ? '+' : '');
    }
  }, 16);
}

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Initialize carousel if present
  const container = document.getElementById('carousel-container');
  if (container) {
    carouselState.container = container;
    carouselState.slides = Array.from(container.querySelectorAll('.carousel-slide'));
    carouselState.dots = Array.from(document.querySelectorAll('#carousel-nav .carousel-dot'));

    goToSlide(0);

    const carouselEl = container.closest('.carousel');
    const startAutoplay = () => {
      stopAutoplay();
      carouselState.timer = setInterval(() => {
        goToSlide(carouselState.index + 1);
      }, carouselState.autoplayMs);
    };
    const stopAutoplay = () => {
      if (carouselState.timer) {
        clearInterval(carouselState.timer);
        carouselState.timer = null;
      }
    };
    startAutoplay();
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAutoplay);
      carouselEl.addEventListener('mouseleave', startAutoplay);
    }
    window.addEventListener('resize', () => {
      goToSlide(carouselState.index);
    });
  }

  // Stats animation when in view
  const statElements = document.querySelectorAll('.stat h3');
  let statsAnimated = false;
  function checkStats() {
    if (statsAnimated || statElements.length === 0) return;
    const anyVisible = Array.from(statElements).some(el => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
    });
    if (anyVisible) {
      statsAnimated = true;
      statElements.forEach(el => {
        const text = el.textContent.trim();
        const numeric = parseInt(text);
        const plus = text.endsWith('+');
        animateCounter(el, isNaN(numeric) ? 0 : numeric, 1500, plus);
      });
    }
  }
  window.addEventListener('scroll', checkStats);
  checkStats();

  // Smooth scrolling for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetSel = this.getAttribute('href');
      if (!targetSel || targetSel === '#') return;
      const target = document.querySelector(targetSel);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        const menu = document.getElementById('nav-menu');
        if (menu) menu.classList.remove('open');
      }
    });
  });

  // Feature icon animation when in view
  const featureIcons = document.querySelectorAll('.feature-icon');
  function checkFeatures() {
    featureIcons.forEach(icon => {
      const r = icon.getBoundingClientRect();
      const vis = r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
      if (vis && !icon.classList.contains('animated')) {
        icon.classList.add('animated');
        icon.style.transition = 'transform 0.5s ease';
        icon.style.transform = 'scale(1.1)';
        setTimeout(() => {
          icon.style.transform = 'scale(1)';
        }, 500);
      }
    });
  }
  window.addEventListener('scroll', checkFeatures);
  checkFeatures();

  // Newsletter mock submit
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) {
        alert('Please enter a valid email.');
        return;
      }
      alert('Thanks for subscribing, ' + email + '!');
      if (emailInput) emailInput.value = '';
    });
  });

  // Close mobile nav on resize up
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const menu = document.getElementById('nav-menu');
      if (menu) menu.classList.remove('open');
    }
  });
});

// Blog pagination and dynamic posts (appended)
document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('blog-posts');
  const paginationEl = document.getElementById('pagination');
  if (!postsContainer || !paginationEl) return;

  const IMAGES = [
    'static/imgs/AdobeStock_377905344-2048x1536.jpeg',
    'static/imgs/Next-Generation-Electric-Vehicle.webp',
    'static/imgs/OIP.webp',
    'static/imgs/OIP (1).webp',
    'static/imgs/download.webp'
  ];

  // Generate 18 blog posts programmatically
  const posts = Array.from({ length: 18 }, (_, i) => {
    const idx = i + 1;
    const date = new Date(2025, 7, 20); // Aug 20, 2025
    date.setDate(date.getDate() - i * 3); // every post 3 days earlier
    const dateStr = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const titles = [
      'Expanding Our EV Fleet: New Models Added',
      'Our Charging Network Reaches New Milestone',
      'Reducing Carbon Footprint: Our Impact So Far',
      'Partner Spotlight: Accelerating Sustainable Mobility',
      'Customer Story: Making the Switch to EV',
      'Charging At Home: Tips to Get Started',
      'EV Myths Debunked: Facts You Should Know',
      'How We Maintain EV Performance Over Time',
      'Behind the Scenes: Our Support Team',
      'Charging Network Upgrade: Faster Than Ever',
      'Sustainability Report: Year-to-Date Highlights',
      'Price Transparency: How Our Plans Are Built',
      'Battery Health: What You Need to Know',
      'EV for Families: Practical Considerations',
      'City-Friendly EVs: Compact and Efficient',
      'Long-Distance Trips: Planning With Confidence',
      'New App Features: Smarter Charging',
      'What’s Next for UMAC: A Look Ahead'
    ];

    const excerpts = [
      'We are continually adding more EV options to suit every lifestyle and budget.',
      'More stations, less wait time—our charging expansion continues nationwide.',
      'Our community is making measurable progress toward lower emissions.',
      'Collaborating with innovators to bring you better EV experiences.',
      'Hear how drivers like you simplified their switch to electric.',
      'From install to first charge—what to expect at home.',
      'We separate fact from fiction to help you make informed decisions.',
      'Our maintenance approach keeps vehicles reliable and efficient.',
      'Meet the people dedicated to helping you every step of the way.',
      'Faster charging times are rolling out across key routes.',
      'Key metrics highlighting our environmental progress.',
      'See how we keep costs clear and competitive.',
      'Best practices to keep your EV battery healthy.',
      'Space, safety, and savings for modern families.',
      'Compact EVs that thrive in urban environments.',
      'Plan, route, and charge with confidence on long trips.',
      'Control, insight, and convenience in our latest app update.',
      'A preview of initiatives we’re building next at UMAC.'
    ];

    return {
      id: idx,
      title: titles[i % titles.length],
      date: dateStr,
      author: 'UMAC Team',
      excerpt: excerpts[i % excerpts.length],
      image: IMAGES[i % IMAGES.length]
    };
  });

  const POSTS_PER_PAGE = 10;
  let currentPage = 1;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  function renderPosts(page) {
    const start = (page - 1) * POSTS_PER_PAGE;
    const pageItems = posts.slice(start, start + POSTS_PER_PAGE);

    postsContainer.innerHTML = pageItems.map(p => `
      <article class="blog-post">
        <div class="post-image" style="background: url('${p.image}') center/cover no-repeat; height: 200px; display: flex; align-items: center; justify-content: center; color: white;">
          <h3 style="text-shadow: 0 2px 6px rgba(0,0,0,0.4)">${p.title}</h3>
        </div>
        <div class="post-content">
          <h2>${p.title}</h2>
          <p class="post-meta">Published on ${p.date} by ${p.author}</p>
          <p>${p.excerpt}</p>
          <a href="#" class="read-more">Read More</a>
        </div>
      </article>
    `).join('');
  }

  function button(label, disabled, handler, isActive = false, ariaLabel) {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
    if (disabled) btn.disabled = true;
    if (isActive) btn.classList.add('active');
    btn.addEventListener('click', handler);
    return btn;
  }

  function renderPagination() {
    paginationEl.innerHTML = '';

    // Prev
    paginationEl.appendChild(
      button('Prev', currentPage === 1, () => setPage(currentPage - 1), false, 'Previous page')
    );

    // Numbered pages
    for (let p = 1; p <= totalPages; p++) {
      paginationEl.appendChild(
        button(String(p), false, () => setPage(p), p === currentPage, `Go to page ${p}`)
      );
    }

    // Next
    paginationEl.appendChild(
      button('Next', currentPage === totalPages, () => setPage(currentPage + 1), false, 'Next page')
    );
  }

  function setPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderPosts(currentPage);
    renderPagination();
    // Scroll back to top of blog list on page change (UX)
    document.getElementById('blog-header')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Initial render
  setPage(1);
});

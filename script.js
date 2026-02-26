// ============================================
// HERO ANIMATION SEQUENCE
// ============================================

function initHeroSequence() {
  const heroVideo = document.querySelector('.hero-video');
  const heroText = document.querySelector('.hero-text');
  const heroStats = document.querySelector('.hero-stats');

  // Timeline definitions (in milliseconds)
  const TIMELINE = {
    initialPause: 1000,      // Wait 1 second before video starts
    textVisibleDuration: 2000, // Text stays visible for 2 seconds after video starts
    textVanishDuration: 1000   // Text vanish animation duration
  };

  // PHASE 1: Initial pause
  // - Video: Not playing
  // - Text & Stats: Fading in (CSS handles this with 0.5s delay)
  console.log('[Hero Sequence] PHASE 1: Initial pause (2s) - Text & stats fading in');

  // PHASE 2: Start video after 2 seconds
  setTimeout(() => {
    console.log('[Hero Sequence] PHASE 2: Starting video playback');
    heroVideo.play();
  }, TIMELINE.initialPause);

  // PHASE 3: Apply vanish animation to text and stats after video has been playing for 2 seconds
  setTimeout(() => {
    console.log('[Hero Sequence] PHASE 3: Applying text & stats vanish animation');
    heroText.classList.add('vanish');
    heroStats.classList.add('vanish');
  }, TIMELINE.initialPause + TIMELINE.textVisibleDuration);
}

// Initialize hero sequence when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initHeroSequence();
});
function toggleTheme() {
  const html = document.documentElement;
  const themeIcon = document.querySelector('.theme-icon');
  
  if (html.classList.contains('light-mode')) {
    html.classList.remove('light-mode');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.add('light-mode');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  }
}

function initTheme() {
  const html = document.documentElement;
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'light') {
    html.classList.add('light-mode');
    themeIcon.textContent = '☀️';
  } else {
    html.classList.remove('light-mode');
    themeIcon.textContent = '🌙';
  }
}

// Intersection Observer
function animateCounters() {
  const counters = document.querySelectorAll('.counter-value');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let current = 0;
    const increment = target / 50;
    
    const update = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    
    update();
  });
}

// Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      if (entry.target.classList.contains('counter-card')) {
        animateCounters();
      }
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Smooth Scroll
function smoothScroll(e) {
  if (e.target.tagName === 'A' && e.target.hash) {
    e.preventDefault();
    const target = document.querySelector(e.target.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-primary');
    const originalText = btn.textContent;
    
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 2000);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Observe elements
  document.querySelectorAll('.showcase-card, .feature-card, .vehicle-card, .counter-card, .value-item, .stat-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Smooth scroll
  document.addEventListener('click', smoothScroll);
});

// Keyboard shortcut for theme
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === 't') {
    toggleTheme();
  }
});

console.log('🚗 AutoMart Premium - Loaded Successfully!');

const API_BASE = window.location.origin;

// ---- Populate dropdowns on page load ----
async function initCarSearch() {
  const makeSelect = document.getElementById('searchMake');
  const modelSelect = document.getElementById('searchModel');
  const yearSelect = document.getElementById('searchYear');
  const form = document.getElementById('carSearchForm');

  if (!makeSelect || !form) return;

  try {
    const res = await fetch(`${API_BASE}/api/makes`);
    const data = await res.json();
    if (data.success) {
      data.makes.forEach(make => {
        const opt = document.createElement('option');
        opt.value = typeof make === 'string' ? make : make.name;
        opt.textContent = typeof make === 'string' ? make : make.name;
        makeSelect.appendChild(opt);
      });
    }
  } catch (e) {
    console.error('Failed to load makes:', e);
  }

  try {
    const res = await fetch(`${API_BASE}/api/years`);
    const data = await res.json();
    if (data.success) {
      data.years.forEach(year => {
        const opt = document.createElement('option');
        opt.value = year;
        opt.textContent = year;
        yearSelect.appendChild(opt);
      });
    }
  } catch (e) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= 1995; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }
  }

  makeSelect.addEventListener('change', async () => {
    const make = makeSelect.value;
    const year = yearSelect.value;

    modelSelect.innerHTML = '<option value="">Select Model</option>';

    if (!make) {
      modelSelect.disabled = true;
      return;
    }

    modelSelect.disabled = false;
    modelSelect.innerHTML = '<option value="">Loading models...</option>';

    try {
      let url = `${API_BASE}/api/models?make=${encodeURIComponent(make)}`;
      if (year) url += `&year=${year}`;

      const res = await fetch(url);
      const data = await res.json();

      modelSelect.innerHTML = '<option value="">Select Model</option>';
      if (data.success && data.models.length > 0) {
        data.models.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.name;
          opt.textContent = m.name;
          modelSelect.appendChild(opt);
        });
      } else {
        modelSelect.innerHTML = '<option value="">No models found</option>';
      }
    } catch (e) {
      console.error('Failed to load models:', e);
      modelSelect.innerHTML = '<option value="">Error loading models</option>';
    }
  });

  // When year changes and make is selected, reload models
  yearSelect.addEventListener('change', () => {
    if (makeSelect.value) {
      makeSelect.dispatchEvent(new Event('change'));
    }
  });

  // Form submit > search car
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await searchCar();
  });
}

// ---- Search Car Details ----
async function searchCar() {
  const make = document.getElementById('searchMake').value;
  const model = document.getElementById('searchModel').value;
  const year = document.getElementById('searchYear').value;
  const resultsDiv = document.getElementById('searchResults');
  const errorDiv = document.getElementById('searchError');
  const btnText = document.querySelector('.search-btn-text');
  const btnLoader = document.querySelector('.search-btn-loader');
  const searchBtn = document.getElementById('searchBtn');

  // Hide previous results
  resultsDiv.style.display = 'none';
  errorDiv.style.display = 'none';

  // Validate — year is optional
  if (!make || !model) {
    showSearchError('Missing Fields', 'Please select a make and model before searching.');
    return;
  }

  // Show loading state
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-flex';
  searchBtn.disabled = true;

  try {
    let url = `${API_BASE}/api/car?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;
    if (year) url += `&year=${encodeURIComponent(year)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.success) {
      showSearchError(
        `No Results for ${year} ${make} ${model}`,
        data.error || 'No data found for this vehicle.',
        data.suggestions || ''
      );
      return;
    }

    // Display results
    displayCarResults(data.vehicle);
  } catch (e) {
    console.error('Search failed:', e);
    showSearchError(
      'Connection Error',
      'Failed to connect to the car API. Make sure the server is running.',
      'Try refreshing the page or check if the server is up at ' + API_BASE
    );
  } finally {
    // Reset button
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    searchBtn.disabled = false;
  }
}

// ---- Display Car Results (CarAPI.app + Price Estimation) ----
function displayCarResults(vehicle) {
  const resultsDiv = document.getElementById('searchResults');
  const errorDiv = document.getElementById('searchError');
  errorDiv.style.display = 'none';

  let trimsHTML = '';

  if (vehicle.trims && vehicle.trims.length > 0) {
    trimsHTML = vehicle.trims.map((trim, i) => {
      // Format currency (USD & INR)
      const USD_TO_INR = 85;   // Approximate conversion rate
      const fmtUSD = (v) => v ? '$' + Number(v).toLocaleString('en-US') : null;
      const fmtINR = (v) => v ? '₹' + Math.round(Number(v) * USD_TO_INR).toLocaleString('en-IN') : null;

      // Only show price section if API returned real pricing
      const hasPrice = trim.estimated_price && trim.msrp;
      let priceSectionHTML = '';
      if (hasPrice) {
        const methodLabels = {
          carapi_msrp:       '✓ MSRP Verified',
          local_msrp:        '≈ Estimated (Local)',
          estimated_default: '≈ Rough Estimate'
        };
        const methodLabel = methodLabels[trim.price_method] || 'Estimated';
        const methodClass = trim.price_method === 'carapi_msrp' ? 'badge-verified' : 'badge-unverified';
        priceSectionHTML = `
          <div class="trim-price-section">
            <div class="estimated-price">${fmtUSD(trim.estimated_price)}</div>
            <div class="estimated-price-inr">${fmtINR(trim.estimated_price)}</div>
            <div class="price-details">
              <span class="msrp-label">MSRP: ${fmtUSD(trim.msrp)} / ${fmtINR(trim.msrp)}</span>
              <span class="depreciation-badge">↓ ${trim.depreciation_pct || 0}% depreciation</span>
            </div>
            <span class="results-badge ${methodClass}">${methodLabel}</span>
          </div>`;
      }

      return `
      <div class="trim-card" style="animation-delay: ${i * 0.08}s">
        <div class="trim-card-header">
          <h4>${trim.trim_name || 'Standard'}</h4>
          <span class="trim-number">Trim ${i + 1}</span>
        </div>

        ${priceSectionHTML}

        <!-- Specs Grid -->
        <div class="spec-grid">
          <div class="spec-item">
            <span class="spec-label">Engine</span>
            <span class="spec-value highlight">${trim.engine || 'N/A'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Horsepower</span>
            <span class="spec-value highlight">${trim.horsepower || 'N/A'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Torque</span>
            <span class="spec-value">${trim.torque || 'N/A'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Fuel Type</span>
            <span class="spec-value">${trim.fuel_type || 'N/A'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Transmission</span>
            <span class="spec-value">${trim.transmission || 'N/A'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Drive Type</span>
            <span class="spec-value">${trim.drive_type || 'N/A'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Cylinders</span>
            <span class="spec-value">${trim.cylinders || 'N/A'}</span>
          </div>
          ${trim.submodel ? `
          <div class="spec-item">
            <span class="spec-label">Submodel</span>
            <span class="spec-value">${trim.submodel}</span>
          </div>` : ''}
        </div>

        ${trim.description && trim.description !== 'N/A' ? `
        <div class="trim-description">${trim.description}</div>` : ''}
      </div>
    `}).join('');
  } else {
    trimsHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Limited Data Available</h3>
        <p>The vehicle was found but detailed trim/spec data is not available for this combination.</p>
      </div>
    `;
  }

  resultsDiv.innerHTML = `
    <div class="results-header">
      <h3>
        <span>${vehicle.year} ${vehicle.make} ${vehicle.model}</span>
      </h3>
      <div class="results-meta">
        ${vehicle.total_trims > 0 ? vehicle.total_trims + ' trim(s) found' : 'Model verified'} &bull; Source: ${vehicle.source}
      </div>
    </div>
    <div class="trims-grid">
      ${trimsHTML}
    </div>
  `;

  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- Show Search Error ----
function showSearchError(title, message, suggestion) {
  const errorDiv = document.getElementById('searchError');
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.style.display = 'none';

  errorDiv.innerHTML = `
    <div class="error-title">⚠ ${title}</div>
    <div class="error-message">${message}</div>
    ${suggestion ? `<div class="error-suggestion">💡 ${suggestion}</div>` : ''}
  `;
  errorDiv.style.display = 'block';
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize car search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initCarSearch();
});
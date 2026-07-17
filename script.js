/**
 * Original Warm Wedding Invitation
 * Korean Mobile 청첩장 - Script
 * (Original aiWedding-main design, new architecture)
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDateShort(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? 'AM' : 'PM';
    const h12 = hours % 12 || 12;
    const minuteStr = String(minutes).padStart(2, '0');
    return `${year}. ${month}. ${date} ${day} ${period} ${h12}:${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00+09:00`);
  }

  /* ═══════════════════════════════════════════
     Image Auto-Detection
     ═══════════════════════════════════════════ */

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
        const images = [];
        let current = 1;
        let consecutiveFails = 0;

        function tryNext() {
            if (current > maxAttempts || consecutiveFails >= 3) {
                resolve(images);
                return;
            }
            const img = new Image();
            const path = `images/${folder}/${current}.jpg`;
            img.onload = function() {
                images.push(path);
                consecutiveFails = 0;
                current++;
                tryNext();
            };
            img.onerror = function() {
                consecutiveFails++;
                current++;
                tryNext();
            };
            img.src = path;
        }

        tryNext();
    });
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showToast(successMsg || '복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute('content', content);
    };
    setMeta('property', 'og:title', m.title);
    setMeta('property', 'og:description', m.description);
    setMeta('property', 'og:image', 'images/og/1.jpg');
    setMeta('name', 'twitter:title', m.title);
    setMeta('name', 'twitter:description', m.description);
    setMeta('name', 'twitter:image', 'images/og/1.jpg');
    setMeta('name', 'description', m.description);
  }

  /* ═══════════════════════════════════════════
     Curtain
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $('#curtainOverlay');
    if (!curtain) return;

    if (CONFIG.useCurtain === false) {
      curtain.style.display = 'none';
      return;
    }

    setTimeout(() => {
      curtain.classList.add('hidden');
    }, 2200);
  }

  /* ═══════════════════════════════════════════
     Petal Animation
     ═══════════════════════════════════════════ */

  function initPetals() {
    function createPetalsContainer() {
      const container = document.createElement('div');
      container.className = 'petals-container';
      document.body.appendChild(container);
      return container;
    }

    function createPetal(container) {
      const petal = document.createElement('div');
      petal.className = 'petal';

      const startX = Math.random() * 100;
      const size = Math.random() * 8 + 8;
      const duration = Math.random() * 4 + 6;
      const delay = Math.random() * 0.5;

      petal.style.left = startX + 'vw';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = duration + 's';
      petal.style.animationDelay = delay + 's';

      container.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, (duration + delay) * 1000 + 100);
    }

    const container = createPetalsContainer();
    let petalCount = 0;
    const maxPetals = 40;

    const interval = setInterval(() => {
      if (petalCount >= maxPetals) {
        clearInterval(interval);
        setTimeout(() => {
          container.remove();
        }, 12000);
        return;
      }
      createPetal(container);
      if (Math.random() > 0.5) createPetal(container);
      petalCount++;
    }, 400);
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    const heroImg = $('#heroImage');
    if (heroImg) heroImg.src = 'images/hero/1.jpg';

    $('#heroDate').textContent = formatDateShort(CONFIG.wedding.date, CONFIG.wedding.time);
    $('#heroNames').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name}`;
    $('#heroVenue').textContent = CONFIG.wedding.venue;

    // Parents info
    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentSpan(name, deceased) {
      return deceased ? `<span class="parent-names deceased">${name}</span>` : `<span class="parent-names">${name}</span>`;
    }

    const parentsHTML = `
      <p class="parent-line">${parentSpan(g.father, g.fatherDeceased)} · ${parentSpan(g.mother, g.motherDeceased)}의 아들 <span class="child-name">${g.name}</span></p>
      <p class="parent-line">${parentSpan(b.father, b.fatherDeceased)} · ${parentSpan(b.mother, b.motherDeceased)}의 딸 <span class="child-name">${b.name}</span></p>
    `;
    $('#heroParents').innerHTML = parentsHTML;

    // Fix mobile viewport height
    const heroContainer = $('.hero-image-container');
    if (heroContainer) {
      const setFixedHeight = () => {
        heroContainer.style.height = heroContainer.offsetHeight + 'px';
      };
      if (document.readyState === 'complete') {
        setFixedHeight();
      } else {
        window.addEventListener('load', setFixedHeight);
      }
    }
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        $('#countdown-days').textContent = '0';
        $('#countdown-hours').textContent = '0';
        $('#countdown-minutes').textContent = '0';
        $('#countdown-seconds').textContent = '0';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      $('#countdown-days').textContent = days;
      $('#countdown-hours').textContent = hours;
      $('#countdown-minutes').textContent = minutes;
      $('#countdown-seconds').textContent = seconds;
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Calendar (Google Cal & ICS)
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();
    const startDate = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const endDate = endDt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.groom.name + ' ♥ ' + CONFIG.bride.name + ' 결혼식')}&dates=${startDate}/${endDate}&location=${encodeURIComponent(CONFIG.wedding.venue + ' ' + CONFIG.wedding.address)}&details=${encodeURIComponent('결혼식에 초대합니다.')}`;
    const googleBtn = $('#googleCalBtn');
    if (googleBtn) googleBtn.href = gcalUrl;

    const icsBtn = $('#icsDownloadBtn');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Wedding//Invitation//KO',
          'BEGIN:VEVENT',
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          `SUMMARY:${CONFIG.groom.name} ♥ ${CONFIG.bride.name} 결혼식`,
          `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
          'DESCRIPTION:결혼식에 초대합니다.',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wedding.ics';
        a.click();
        URL.revokeObjectURL(url);
        showToast('캘린더 파일이 다운로드됩니다');
      });
    }
  }

  /* ═══════════════════════════════════════════
     Story Section
     ═══════════════════════════════════════════ */

  function initStory(storyImages) {
    $('#storyTitle').textContent = CONFIG.story.title;
    $('#storyContent').textContent = CONFIG.story.content;

    const topContainer = $('#storyPhotos');
    const bottomContainer = $('#storyPhotosBottom');

    // Remove loading placeholder
    const placeholder = topContainer.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();
    const placeholder2 = bottomContainer.querySelector('.loading-placeholder');
    if (placeholder2) placeholder2.remove();

    if (storyImages.length === 0) return;

    // Place first story image above text, rest below (matching original layout)
    storyImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'story-image-container fade-in-left';
      div.innerHTML = `<img src="${src}" alt="스토리 사진 ${i + 1}" loading="lazy">`;
      div.addEventListener('click', () => openViewer(storyImages, i));

      if (i === 0) {
        topContainer.appendChild(div);
      } else {
        // Alternate animation direction
        div.className = 'story-image-container ' + (i % 2 === 0 ? 'fade-in-left' : 'fade-in-right');
        bottomContainer.appendChild(div);
      }
    });

    // Re-observe new elements for scroll animations
    observeNewElements();
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

  let galleryImagesList = [];

  function initGallery(galleryImages) {
    galleryImagesList = galleryImages;
    const grid = $('#galleryGrid');

    // Remove loading placeholder
    const placeholder = grid.querySelector('.loading-placeholder');
    if (placeholder) placeholder.remove();

    if (galleryImages.length === 0) {
      const section = $('#gallerySection');
      if (section) section.style.display = 'none';
      return;
    }

    galleryImages.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'gallery-item scale-in';
      div.style.setProperty('--delay', i);
      div.setAttribute('data-index', i);
      div.innerHTML = `<img src="${src}" alt="갤러리 사진 ${i + 1}" loading="lazy">`;
      div.addEventListener('click', () => openViewer(galleryImages, i));
      grid.appendChild(div);
    });

    // Update viewer total count
    $('#totalCount').textContent = galleryImages.length;

    // Re-observe new elements for scroll animations
    observeNewElements();
  }

  /* ═══════════════════════════════════════════
     Photo Viewer (with swipe)
     ═══════════════════════════════════════════ */

  let viewerImages = [];
  let viewerIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function openViewer(images, index, mode = 'gallery') {
    viewerImages = images;
    viewerIndex = index;

    const viewer = $('#photoViewer');
    const isSingleImage = images.length <= 1;

    viewer.classList.toggle('map-viewer-mode', mode === 'map');
    $('#viewerPrev').style.display = isSingleImage ? 'none' : '';
    $('#viewerNext').style.display = isSingleImage ? 'none' : '';
    $('.viewer-counter').style.display = isSingleImage ? 'none' : '';

    showViewerImage();
    viewer.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeViewer() {
    const viewer = $('#photoViewer');
    viewer.classList.remove('active', 'map-viewer-mode');
    document.body.classList.remove('no-scroll');

    $('#viewerPrev').style.display = '';
    $('#viewerNext').style.display = '';
    $('.viewer-counter').style.display = '';

    const img = $('#viewerImage');
    if (img) img.style.transform = '';
  }

  function showViewerImage() {
    const img = $('#viewerImage');
    const loading = $('#viewerLoading');
    loading.classList.remove('hidden');
    img.style.opacity = '0';

    img.src = viewerImages[viewerIndex];
    $('#currentIndex').textContent = viewerIndex + 1;
    $('#totalCount').textContent = viewerImages.length;
  }

  function navigateViewer(direction) {
    const img = $('#viewerImage');
    img.classList.add('fade-out');

    setTimeout(() => {
      if (direction === 'prev') {
        viewerIndex = (viewerIndex - 1 + viewerImages.length) % viewerImages.length;
      } else {
        viewerIndex = (viewerIndex + 1) % viewerImages.length;
      }
      showViewerImage();
      img.classList.remove('fade-out');
    }, 200);
  }

  function initPhotoViewer() {
    const viewer = $('#photoViewer');
    const viewerImage = $('#viewerImage');
    const viewerLoading = $('#viewerLoading');

    $('#viewerClose').addEventListener('click', closeViewer);
    $('#viewerPrev').addEventListener('click', () => navigateViewer('prev'));
    $('#viewerNext').addEventListener('click', () => navigateViewer('next'));

    // Image load/error
    viewerImage.addEventListener('load', () => {
      viewerLoading.classList.add('hidden');
      viewerImage.style.opacity = '1';
    });
    viewerImage.addEventListener('error', () => {
      viewerLoading.classList.add('hidden');
      viewerImage.style.opacity = '1';
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!viewer.classList.contains('active')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') navigateViewer('prev');
      if (e.key === 'ArrowRight') navigateViewer('next');
    });

    // Touch swipe
    let isSingleTouch = false;
    const content = $('#viewerContent');

    content.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isSingleTouch = true;
        touchStartX = e.touches[0].clientX;
      } else {
        isSingleTouch = false;
      }
    }, { passive: true });

    content.addEventListener('touchend', (e) => {
      if (!isSingleTouch) return;
      touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX - touchEndX;
      const swipeThreshold = 50;

      if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
          navigateViewer('next');
        } else {
          navigateViewer('prev');
        }
      }
    });
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;
    $('#locationVenue').textContent = w.venue;
    $('#locationAddress').textContent = w.address;

    const locationMapImg = $('#locationMapImg');
    const locationMapContainer = $('.location-map-container');
    locationMapImg.src = 'images/location/1.jpg?v=left-map-only-20260717-v2';

    // 약도를 갤러리 뷰어처럼 크게 열기
    const openLocationMap = () => {
      openViewer([locationMapImg.currentSrc || locationMapImg.src], 0, 'map');
    };

    locationMapImg.setAttribute('role', 'button');
    locationMapImg.setAttribute('tabindex', '0');
    locationMapImg.setAttribute('aria-label', '약도 크게 보기');
    locationMapImg.addEventListener('click', openLocationMap);
    locationMapImg.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLocationMap();
      }
    });

    if (locationMapContainer) {
      locationMapContainer.classList.add('is-clickable');

      if (!locationMapContainer.querySelector('.map-zoom-hint')) {
        const zoomHint = document.createElement('div');
        zoomHint.className = 'map-zoom-hint';
        zoomHint.innerHTML = '<span aria-hidden="true">⌕</span> 사진을 눌러 크게 보기';
        locationMapContainer.appendChild(zoomHint);
      }
    }

    $('#kakaoMapBtn').href = w.mapLinks.kakao || '#';
    $('#naverMapBtn').href = w.mapLinks.naver || '#';

    // 약도에 포함된 교통 설명을 모바일에서 읽기 쉬운 텍스트 카드로 표시
    const transportGuide = $('#transportGuide');
    if (transportGuide && w.transportation) {
      $('#transportTitle').textContent = w.transportation.title || '교통 안내';

      const sectionsContainer = $('#transportSections');
      sectionsContainer.innerHTML = '';

      const transportSections = w.transportation.sections || [];

      if (transportSections.length > 0) {
        const tabGrid = document.createElement('div');
        tabGrid.className = 'transport-tab-grid';

        const detailPanel = document.createElement('div');
        detailPanel.className = 'transport-detail-panel';
        detailPanel.hidden = true;

        const detailHeader = document.createElement('div');
        detailHeader.className = 'transport-detail-header';

        const detailIcon = document.createElement('span');
        detailIcon.className = 'transport-detail-icon';
        detailIcon.setAttribute('aria-hidden', 'true');

        const detailTitle = document.createElement('h4');
        detailTitle.className = 'transport-detail-title';

        const detailClose = document.createElement('button');
        detailClose.type = 'button';
        detailClose.className = 'transport-detail-close';
        detailClose.setAttribute('aria-label', '교통 안내 닫기');
        detailClose.textContent = '×';

        const detailList = document.createElement('ul');
        detailList.className = 'transport-section-list transport-detail-list';

        detailHeader.appendChild(detailIcon);
        detailHeader.appendChild(detailTitle);
        detailHeader.appendChild(detailClose);
        detailPanel.appendChild(detailHeader);
        detailPanel.appendChild(detailList);

        let activeButton = null;

        const closeDetail = () => {
          detailPanel.hidden = true;
          detailList.innerHTML = '';
          if (activeButton) {
            activeButton.classList.remove('active');
            activeButton.setAttribute('aria-expanded', 'false');
            activeButton = null;
          }
        };

        detailClose.addEventListener('click', closeDetail);

        transportSections.forEach((section) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'transport-tab';
          button.setAttribute('aria-expanded', 'false');

          const icon = document.createElement('span');
          icon.className = 'transport-tab-icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.textContent = section.icon || '•';

          const title = document.createElement('span');
          title.className = 'transport-tab-title';
          title.textContent = section.title || '';

          const arrow = document.createElement('span');
          arrow.className = 'transport-tab-arrow';
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = '›';

          button.appendChild(icon);
          button.appendChild(title);
          button.appendChild(arrow);

          button.addEventListener('click', () => {
            if (activeButton === button && !detailPanel.hidden) {
              closeDetail();
              return;
            }

            if (activeButton) {
              activeButton.classList.remove('active');
              activeButton.setAttribute('aria-expanded', 'false');
            }

            activeButton = button;
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');

            detailIcon.textContent = section.icon || '•';
            detailTitle.textContent = section.title || '';
            detailList.innerHTML = '';

            (section.items || []).forEach((text) => {
              const item = document.createElement('li');
              item.textContent = text;
              detailList.appendChild(item);
            });

            detailPanel.hidden = false;
            detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });

          tabGrid.appendChild(button);
        });

        sectionsContainer.appendChild(tabGrid);
        sectionsContainer.appendChild(detailPanel);
      } else {
        transportGuide.style.display = 'none';
      }
    } else if (transportGuide) {
      transportGuide.style.display = 'none';
    }

    const parkingGuide = $('#parkingGuide');
    if (parkingGuide && w.parking) {
      $('#parkingTitle').textContent = w.parking.title || '주차 안내';
      $('#parkingSummary').textContent = w.parking.summary || '';

      const details = $('#parkingDetails');
      details.innerHTML = '';
      (w.parking.details || []).forEach((text) => {
        const item = document.createElement('li');
        item.textContent = text;
        details.appendChild(item);
      });

      if (!w.parking.summary) $('#parkingSummary').style.display = 'none';
      if (!w.parking.details || w.parking.details.length === 0) details.style.display = 'none';
    } else if (parkingGuide) {
      parkingGuide.style.display = 'none';
    }

    $('#copyAddressBtn').addEventListener('click', () => {
      copyToClipboard(w.address, '주소가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    accounts.forEach((acc) => {
      const item = document.createElement('div');
      item.className = 'account-item';
      const accountStr = `${acc.bank} ${acc.number}`;
      item.innerHTML = `
        <p class="account-role">${acc.role}${acc.name ? ` ${acc.name}` : ''}</p>
        <p class="account-info">${accountStr}</p>
        <button class="copy-btn" data-account="${accountStr}">복사</button>
      `;
      container.appendChild(item);
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, 'groomAccountList');
    renderAccounts(CONFIG.accounts.bride, 'brideAccountList');

    // Accordion toggles
    $$('.accordion-header').forEach((header) => {
      header.addEventListener('click', () => {
        const accordion = header.parentElement;
        accordion.classList.toggle('active');
      });
    });

    // Copy account delegates
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.account-item .copy-btn');
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, '계좌번호가 복사되었습니다');
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const placeholderHTML = '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';

    const storyPhotos = $('#storyPhotos');
    const galleryGrid = $('#galleryGrid');

    if (storyPhotos) storyPhotos.innerHTML = placeholderHTML;
    if (galleryGrid) galleryGrid.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  let scrollObserver = null;

  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Add animation classes to static elements
    const storyText = $('.story-text');
    const galleryTitle = $('.gallery-title');
    const gallerySubtitle = $('.gallery-subtitle');
    const locationTitle = $('.location-title');
    const locationInfo = $('.location-info');
    const locationMap = $('.location-map-container');
    const parkingGuide = $('.parking-guide');
    const accountTitle = $('.account-title');
    const accountSubtitle = $('.account-subtitle');

    if (storyText) storyText.classList.add('fade-in-right');
    if (galleryTitle) galleryTitle.classList.add('fade-in');
    if (gallerySubtitle) gallerySubtitle.classList.add('fade-in');
    if (locationTitle) locationTitle.classList.add('fade-in');
    if (locationInfo) locationInfo.classList.add('fade-in');
    if (locationMap) locationMap.classList.add('scale-in');
    if (parkingGuide) parkingGuide.classList.add('fade-in');
    if (accountTitle) accountTitle.classList.add('fade-in');
    if (accountSubtitle) accountSubtitle.classList.add('fade-in');

    // Observe all animated elements
    $$('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
      scrollObserver.observe(el);
    });
  }

  function observeNewElements() {
    if (!scrollObserver) return;
    $$('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
      if (!el.classList.contains('visible')) {
        scrollObserver.observe(el);
      }
    });
  }

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  async function init() {
    setMetaTags();
    initCurtain();
    initHero();
    initCountdown();
    initCalendar();

    // Show loading placeholders while detecting images
    showLoadingPlaceholders();

    // Init sections that don't depend on image detection
    initPhotoViewer();
    initLocation();
    initAccounts();
    initFooter();
    initScrollAnimations();

    // Start petal animation
    initPetals();

    // Auto-detect story and gallery images in parallel
    const [storyImages, galleryImages] = await Promise.all([
      loadImagesFromFolder('story'),
      loadImagesFromFolder('gallery')
    ]);

    // Render sections with discovered images
    initStory(storyImages);
    initGallery(galleryImages);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

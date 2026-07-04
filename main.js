// ===== main.js — render konten dari data.js ke index.html =====
(function(){
  const D = window.SITE_DATA || {};
  const esc = (s) => (s || "").toString();

  // ----- Hero / Profile -----
  if (D.profile) {
    const nameWords = esc(D.profile.name).split(' ');
    const lastWord = nameWords.pop();
    document.getElementById('heroName').innerHTML =
      `${nameWords.join(' ')} <span class="accent">${lastWord}</span>`;
    document.getElementById('heroTagline').textContent = D.profile.tagline || "";
    document.title = `${D.profile.name} — Portofolio`;

    const metaEl = document.getElementById('heroMeta');
    const metaParts = [];
    if (D.profile.school) metaParts.push(`<span><b>Sekolah:</b> ${esc(D.profile.school)}</span>`);
    if (D.profile.grade) metaParts.push(`<span><b>${esc(D.profile.grade)}</b></span>`);
    if (D.profile.targetCampus && D.profile.targetCampus.length) {
      metaParts.push(`<span><b>Target Kampus:</b> ${D.profile.targetCampus.join(", ")}</span>`);
    }
    metaEl.innerHTML = metaParts.join("");

    document.getElementById('aboutIntro').textContent = D.profile.intro || "";
    document.getElementById('aboutMore').textContent = D.profile.about || "";

    const initials = D.profile.name ? D.profile.name.split(' ').map(w=>w[0]).slice(0,2).join('') : "KS";
    const photoEl = document.getElementById('heroPhoto');
    if (D.profile.photo) {
      photoEl.innerHTML = `<img src="${esc(D.profile.photo)}" alt="${esc(D.profile.name)}">`;
    } else {
      photoEl.innerHTML = `<span class="initials">${initials}</span>`;
    }

    document.getElementById('contactEmail').textContent = D.profile.email || "-";
    document.getElementById('contactEmail').href = D.profile.email && D.profile.email.includes('@') ? `mailto:${D.profile.email}` : "#";
    if (D.profile.instagram) {
      document.getElementById('contactIgWrap').style.display = "block";
      document.getElementById('contactIg').textContent = D.profile.instagram;
      document.getElementById('contactIg').href = `https://instagram.com/${D.profile.instagram.replace('@','')}`;
    }
  }

  // ----- Pendidikan -----
  const eduWrap = document.getElementById('educationTimeline');
  (D.education || []).forEach(item => {
    eduWrap.insertAdjacentHTML('beforeend', `
      <div class="timeline-item">
        <span class="level">${esc(item.level)}</span>
        <h3>${esc(item.institution)}</h3>
        ${item.period ? `<span class="period">${esc(item.period)}</span>` : ""}
        <p>${esc(item.note)}</p>
      </div>
    `);
  });

  // ----- Organisasi -----
  const orgWrap = document.getElementById('orgTimeline');
  (D.organizations || []).forEach(item => {
    orgWrap.insertAdjacentHTML('beforeend', `
      <div class="timeline-item">
        <span class="level">${esc(item.org)}</span>
        <h3>${esc(item.title)}</h3>
        ${item.period ? `<span class="period">${esc(item.period)}</span>` : ""}
        <p>${esc(item.desc)}</p>
      </div>
    `);
  });

  // ----- Prestasi -----
  const achWrap = document.getElementById('achievementGrid');
  (D.achievements || []).forEach(item => {
    achWrap.insertAdjacentHTML('beforeend', `
      <div class="card">
        <div class="badge">&#127942;</div>
        ${item.year ? `<span class="year">${esc(item.year)}</span>` : ""}
        <h4>${esc(item.title)}</h4>
        <div class="event">${esc(item.event)}</div>
      </div>
    `);
  });

  // ----- Tulisan -----
  const writeWrap = document.getElementById('writingsList');
  (D.writings || []).forEach(item => {
    writeWrap.insertAdjacentHTML('beforeend', `
      <div class="list-item">
        <span class="tag">${esc(item.type)}</span>
        <h4>${esc(item.title)}</h4>
        <p>${esc(item.desc)}</p>
      </div>
    `);
  });
  if (!(D.writings || []).length) {
    writeWrap.innerHTML = `<p style="color:#888;">Belum ada tulisan ditambahkan.</p>`;
  }

  // ----- Buku -----
  const bookWrap = document.getElementById('booksList');
  (D.books || []).forEach(item => {
    bookWrap.insertAdjacentHTML('beforeend', `
      <div class="list-item">
        <h4>${esc(item.title)}</h4>
        <p>${esc(item.desc)}</p>
      </div>
    `);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // ----- Mobile nav toggle -----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
})();

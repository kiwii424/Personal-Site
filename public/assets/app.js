function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

const state = { skill: '__all__', cls: '__all__' };
window.__ui = {};

function iconSvg(type){
  if(type === 'email'){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`;
  }
  if(type === 'nvidia'){
    // Simple NVIDIA-style badge (green + wordmark) to match icon-only treatments like LinkedIn/GitHub.
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#76B900"></rect>
      <text x="12" y="15" text-anchor="middle" font-size="7.2" font-weight="800" fill="#0b0f17"
        font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">NVIDIA</text>
    </svg>`;
  }
  if(type === 'github'){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .6a11.4 11.4 0 0 0-3.6 22.2c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.4-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a10.7 10.7 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.4 11.4 0 0 0 12 .6z"/></svg>`;
  }
  if(type === 'linkedin'){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0.5 23.5h4V7.5h-4v16zM8.5 7.5h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4.01 0 4.75 2.7 4.75 6.2v9.8h-4v-8.7c0-2.08-.04-4.75-2.9-4.75-2.9 0-3.34 2.3-3.34 4.6v8.85h-4V7.5z"/></svg>`;
  }
  if(type === 'instagram'){
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5zM18 6.3a1.2 1.2 0 1 1-1.2 1.2A1.2 1.2 0 0 1 18 6.3z"/></svg>`;
  }
  return '';
}

function toggle(kind, value){
  if(kind === 'skill'){
    state.skill = (state.skill === value) ? '__all__' : value;
  }
  if(kind === 'cls'){
    state.cls = (state.cls === value) ? '__all__' : value;
  }
  apply();
  if(typeof window.__updateActiveCourseCards === 'function'){ window.__updateActiveCourseCards(); }
}

function setFilter(kind, value){
  if(kind === 'skill'){ state.skill = value; }
  if(kind === 'cls'){ state.cls = value; }
  apply();
  if(typeof window.__updateActiveCourseCards === 'function'){ window.__updateActiveCourseCards(); }
}

function apply(){
  $all('[data-skill-chip]').forEach(c => c.classList.toggle('active', c.getAttribute('data-skill-chip') === state.skill));
  $all('[data-class-chip]').forEach(c => c.classList.toggle('active', c.getAttribute('data-class-chip') === state.cls));

  // competitions: skill only
  let compShown = 0;
  $all('[data-competition]').forEach(p => {
    const skills = JSON.parse(p.getAttribute('data-skills'));
    const ok = (state.skill === '__all__') || skills.includes(state.skill);
    p.classList.toggle('hidden', !ok);
    p.classList.toggle('active', ok && state.skill !== '__all__');
    $all('.tag[data-kind="skill"]', p).forEach(t => t.classList.toggle('on', state.skill !== '__all__' && t.getAttribute('data-value') === state.skill));
    if(ok) compShown += 1;
  });
  const compEmpty = $('#competitions-empty');
  if(compEmpty) compEmpty.classList.toggle('hidden', compShown !== 0);

  // course projects: skill + class
  let courseShown = 0;
  $all('[data-course]').forEach(p => {
    const skills = JSON.parse(p.getAttribute('data-skills'));
    const classes = JSON.parse(p.getAttribute('data-classes'));
    const okSkill = (state.skill === '__all__') || skills.includes(state.skill);
    const okCls = (state.cls === '__all__') || classes.includes(state.cls);
    const ok = okSkill && okCls;

    p.classList.toggle('hidden', !ok);
    p.classList.toggle('active', ok && (state.skill !== '__all__' || state.cls !== '__all__'));

    $all('.tag[data-kind="skill"]', p).forEach(t => t.classList.toggle('on', state.skill !== '__all__' && t.getAttribute('data-value') === state.skill));
    $all('.tag[data-kind="cls"]', p).forEach(t => t.classList.toggle('on', state.cls !== '__all__' && t.getAttribute('data-value') === state.cls));

    if(ok) courseShown += 1;
  });
  const courseEmpty = $('#course-empty');
  if(courseEmpty) courseEmpty.classList.toggle('hidden', courseShown !== 0);

  // badges
  const skillBadge = $('#active-skill');
  const classBadge = $('#active-class');
  const ui = window.__ui || {};
  if(skillBadge) skillBadge.textContent = (state.skill === '__all__') ? (ui.all_skills || 'All skills') : state.skill;
  if(classBadge) classBadge.textContent = (state.cls === '__all__') ? (ui.all_classes || 'All classes') : state.cls;
}

function renderTags(container, arr, kind){
  const tags = document.createElement('div');
  tags.className = 'tags';
  (arr || []).forEach(v => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    if(kind === 'cls'){
      // Add school badge next to class tag for course projects
      const label = document.createElement('span');
      label.className = 'tag-label';
      label.textContent = v;
      tag.appendChild(label);

      const meta = (window.__classSchool || {});
      const school = meta[String(v)] || '';
      if(school){
        const b = document.createElement('span');
        b.className = 'tag-school';
        b.setAttribute('data-school', school);
        b.textContent = school.toUpperCase();
        tag.appendChild(b);
      }
    }else{
      tag.textContent = v;
    }
    prove(tag, kind, v);
    tags.appendChild(tag);
  });
  container.appendChild(tags);
}
function prove(tag, kind, v){
  tag.setAttribute('data-kind', kind);
  tag.setAttribute('data-value', v);
  tag.addEventListener('click', (ev) => {
    // Prevent tag clicks from bubbling to the project card click handler (which opens GitHub).
    ev.stopPropagation();
    ev.preventDefault();
    toggle(kind === 'cls' ? 'cls' : 'skill', v);
  });
}

function renderList(listEl, items, type){
  listEl.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'item';
    if(type === 'competition') card.setAttribute('data-competition', it.title);
    if(type === 'course') card.setAttribute('data-course', it.title);
    if(type === 'course') card.classList.add('is-course-project');
    if(type === 'course' && it.link) card.setAttribute('data-card-href', it.link);
    if(type === 'course' && it.link){
      const a = document.createElement('a');
      a.className = 'repo-link';
      a.href = it.link;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.setAttribute('aria-label','GitHub repo');
      a.innerHTML = githubSvg();
      a.addEventListener('click', (ev)=>{ ev.stopPropagation(); });
      card.appendChild(a);
    }

    const skills = it.skills || [];
    const classes = it.classes || [];
    card.setAttribute('data-skills', JSON.stringify(skills));
    card.setAttribute('data-classes', JSON.stringify(classes));

    const top = document.createElement('div');
    top.className = 'top';
    const t = document.createElement('div');
    t.className = 'title';
    t.textContent = it.title;
    const tm = document.createElement('div');
    tm.className = 'time';
    tm.textContent = it.time || '';
    top.appendChild(t); top.appendChild(tm);

    const ul = document.createElement('ul');
    (it.desc || []).forEach(d => {
      const li = document.createElement('li');
      li.textContent = d;
      ul.appendChild(li);
    });

    card.appendChild(top);
    card.appendChild(ul);

    renderTags(card, skills, 'skill');
    if(type === 'course') renderTags(card, classes, 'cls');

    const href = card.getAttribute('data-card-href');
if(href){
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => window.open(href, '_blank', 'noreferrer'));
}

    listEl.appendChild(card);
  });
}

function setNavActive(id){
  $all('[data-nav]').forEach(a => a.classList.toggle('active', a.getAttribute('data-nav') === id));
}

function setupScrollSpy(){

  const sections = $all('section[data-section]');
  const obs = new IntersectionObserver((entries) => {
    // pick the entry with the highest intersection ratio
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
    if(visible.length === 0) return;
    const id = visible[0].target.getAttribute('id');
    if(id) setNavActive(id);
  }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.1, 0.2, 0.35] });

  sections.forEach(s => obs.observe(s));
}

function initLangSwitch(){
  const sel = $('[data-lang-select]');
  if(!sel) return;
  sel.addEventListener('change', (e) => {
    const v = e.target.value;
    if(v === 'en') window.location.href = '/en/';
    if(v === 'zh') window.location.href = '/zh/';
  });
}

function render(data){
  const locale = document.documentElement.getAttribute('data-locale') || 'en';

  $('#brand-name').textContent = data.name;
  $('#brand-role').textContent = data.role;

  const nav = $('#side-nav');
  nav.innerHTML = '';
  data.nav.forEach(item => {
    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.textContent = item.label;
    a.setAttribute('data-nav', item.id);
    a.addEventListener('click', (e) => {
  e.preventDefault();
  const id = item.id;
  const el = document.getElementById(id);
  if(el){
    setNavActive(id);
    history.replaceState(null, '', `#${id}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
nav.appendChild(a);
  });

  $('#hero-name').textContent = data.name;
  $('#hero-headline').textContent = data.headline;

// hero card photo + about quick links
const heroPhoto = $('#hero-photo');
if(heroPhoto) heroPhoto.src = (data.photo && data.photo.href) ? data.photo.href : '/assets/profile.svg';

const heroAboutText = $('#hero-about-text');
if(heroAboutText){
  // use the first sentence of about text if available
  heroAboutText.textContent = (data.about && data.about.summary) ? data.about.summary : ((data.about && data.about.body && data.about.body[0]) ? data.about.body[0] : '');
}

// localize hero labels if provided
const ui2 = data.ui || {};
const hat = $('#hero-about-title');
if(hat && ui2.hero_about_title) hat.textContent = ui2.hero_about_title;

const hrb = $('#hero-resume-btn');
if(hrb && ui2.hero_resume) hrb.textContent = ui2.hero_resume;

const hjc = $('#hero-jump-competitions');
if(hjc && ui2.hero_competitions) hjc.textContent = ui2.hero_competitions;

const hjp = $('#hero-jump-course');
if(hjp && ui2.hero_course_projects) hjp.textContent = ui2.hero_course_projects;

const hjcl = $('#hero-jump-classes');
if(hjcl && ui2.hero_classes) hjcl.textContent = ui2.hero_classes;

const hjce = $('#hero-jump-certs');
if(hjce && ui2.hero_certs) hjce.textContent = ui2.hero_certs;

const hjact = $('#hero-jump-activities');
if(hjact && ui2.hero_activities) hjact.textContent = ui2.hero_activities;

const hjct = $('#hero-jump-contact');
if(hjct && ui2.hero_contact) hjct.textContent = ui2.hero_contact;

// bind jump buttons
document.querySelectorAll('[data-jump]').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = btn.getAttribute('data-jump');
    const el = document.querySelector(sel);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }, { once: true });
});

// top-right social icons
const iconBar = document.querySelector('.floating-icons #social-icons');
if(iconBar){
  iconBar.innerHTML = '';
  (data.socials || []).forEach(s => {
    if(!s.href) return;
    const a = document.createElement('a');
    a.className = 'iconbtn';
    a.href = s.href;
    a.setAttribute('aria-label', s.label || s.type || 'link');
    if(s.href.startsWith('http')){
      a.target = '_blank';
      a.rel = 'noreferrer';
    }
    a.innerHTML = iconSvg(s.type);
    iconBar.appendChild(a);
  });
}

// UI localization
window.__ui = data.ui || {};
const ui = window.__ui;

const resumeBtn = $('#resume-btn');
if(resumeBtn && ui.resume_button) resumeBtn.textContent = ui.resume_button;

const afl = $('#active-filters-label');
if(afl && ui.active_filters) afl.textContent = ui.active_filters;

const aboutColLeft = $('#about-col-left');
const aboutColRight = $('#about-col-right');
if(aboutColLeft && ui.about_col_left) aboutColLeft.textContent = ui.about_col_left;
if(aboutColRight && ui.about_col_right) aboutColRight.textContent = ui.about_col_right;

const lblName = $('#label-name');
if(lblName && ui.form_name) lblName.textContent = ui.form_name;
const lblEmail = $('#label-email');
if(lblEmail && ui.form_email) lblEmail.textContent = ui.form_email;
const lblMsg = $('#label-message');
if(lblMsg && ui.form_message) lblMsg.textContent = ui.form_message;

const btnSend = $('#btn-send');
if(btnSend && ui.form_send) btnSend.textContent = ui.form_send;

const ec = $('#empty-competitions-text');
if(ec && ui.empty_competitions) ec.textContent = ui.empty_competitions;
const ecp = $('#empty-course-text');
if(ecp && ui.empty_course) ecp.textContent = ui.empty_course;

  // About
  $('#about-title').textContent = data.about.title;
  const aboutName = $('#about-name');
  if(aboutName) aboutName.textContent = data.name;
  const photo = $('#profile-photo');
  photo.src = data.photo_src || '/assets/profile.svg';
  photo.alt = data.photo_alt || 'profile photo';

  const aboutBody = $('#about-body');
  aboutBody.innerHTML = '';
  data.about.body.forEach(line => {
    const p = document.createElement('p');
    p.className = 'sub';
    p.style.margin = '0 0 10px';
    p.textContent = line;
    aboutBody.appendChild(p);
  });

  const links = $('#contact-links');
  links.innerHTML = '';
  (data.links || []).forEach(l => {
    const row = document.createElement('div');
    row.className = 'kvrow';
    const label = document.createElement('div');
    label.style.minWidth = '90px';
    label.textContent = l.label + ':';
    const val = document.createElement('div');
    if(l.href){
      const a = document.createElement('a');
      a.href = l.href;
      a.target = l.href.startsWith('http') ? '_blank' : '_self';
      a.rel = l.href.startsWith('http') ? 'noreferrer' : '';
      a.textContent = l.value;
      val.appendChild(a);
    }else{
      val.textContent = l.value;
    }
    row.appendChild(label);
    row.appendChild(val);
    links.appendChild(row);
  });

  // Render About mini cards early so zh page still shows them even if later sections fail.
  try{ renderAboutMini(locale); }catch(e){}

  // Titles and hints
  $('#competitions-title').textContent = data.projects_meta.competitions_title;
  $('#competitions-hint').textContent = data.projects_meta.competitions_hint;
  $('#course-title').textContent = data.projects_meta.course_projects_title;
  $('#course-hint').textContent = data.projects_meta.course_projects_hint;

  $('#skills-title').textContent = data.skills.title;
  $('#skills-hint').textContent = data.skills.hint;

  $('#classes-title').textContent = data.classes.title;
  $('#classes-hint').textContent = data.classes.hint;

  $('#certs-title').textContent = data.certifications.title;
  $('#certs-hint').textContent = data.certifications.hint;

  $('#contact-title').textContent = data.contact.title;
  $('#contact-note').textContent = data.contact.note;

  // Skill chips
  const skillChips = $('#skill-chips');
  skillChips.innerHTML = '';
  const allSkill = document.createElement('div');
  allSkill.className = 'chip';
  allSkill.textContent = ((window.__ui && window.__ui.all) ? window.__ui.all : 'All');
  allSkill.setAttribute('data-skill-chip', '__all__');
  allSkill.addEventListener('click', () => toggle('skill', '__all__'));
  skillChips.appendChild(allSkill);

  (data.skills_list || []).forEach(s => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = s;
    chip.setAttribute('data-skill-chip', s);
    chip.addEventListener('click', () => toggle('skill', s));
    skillChips.appendChild(chip);
  });

  // Class chips
  const classChips = $('#class-chips');
  if(classChips) classChips.innerHTML = '';
  const allCls = document.createElement('div');
  allCls.className = 'chip';
  allCls.textContent = ((window.__ui && window.__ui.all) ? window.__ui.all : 'All');
  allCls.setAttribute('data-class-chip', '__all__');
  allCls.addEventListener('click', () => toggle('cls', '__all__'));
  if(classChips) classChips.appendChild(allCls);

  const classNames = (data.classes_list || []).map(c => c.name);
  classNames.forEach(cn => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = cn;
    chip.setAttribute('data-class-chip', cn);
    chip.addEventListener('click', () => toggle('cls', cn));
    if(classChips) classChips.appendChild(chip);
  });

  renderList($('#competitions-list'), data.competitions_list || [], 'competition');
  renderList($('#course-list'), data.course_projects_list || [], 'course');


// Classes grouped cards (NYCU / UIUC)
const nycuTitle = $('#classes-nycu-title');
const nycuSub = $('#classes-nycu-sub');
const nycuGrid = $('#classes-nycu-grid');
const uiucTitle = $('#classes-uiuc-title');
const uiucSub = $('#classes-uiuc-sub');
const uiucGrid = $('#classes-uiuc-grid');

function normalizeClassKey(raw){
  const s = String(raw || '').trim();
  if(!s) return '';
  // remove common course code prefixes like "ECE 408", "FIN 556", "IE 421"
  const noCode = s.replace(/^[A-Z]{2,6}\s*\d{2,4}\s+/i, '');
  // drop parenthetical suffix: "(...)" or "（...）"
  const noParen = noCode.replace(/\s*[\(（][^\)）]*[\)）]\s*$/g, '');
  return noParen.trim();
}

function buildProjectClassIndex(courseProjects){
  const idx = new Map(); // norm -> { canonical: string, count: number }
  (courseProjects || []).forEach(p => {
    (p.classes || []).forEach(cls => {
      const norm = normalizeClassKey(cls);
      if(!norm) return;
      const prev = idx.get(norm);
      if(prev){
        prev.count += 1;
      }else{
        idx.set(norm, { canonical: cls, count: 1 });
      }
    });
  });
  return idx;
}

const projectClassIndex = buildProjectClassIndex(data.course_projects_list || []);

function courseCategory(c){
  const explicit = (c && (c.category || c.cat)) ? String(c.category || c.cat) : '';
  if(explicit) return explicit;
  const hay = `${c && c.name ? c.name : ''} ${c && c.key ? c.key : ''}`.toLowerCase();

  // 3) economics & finance
  if(
    hay.includes('econom') || hay.includes('金融') || hay.includes('財務') || hay.includes('finance') ||
    hay.includes('trading') || hay.includes('交易') || hay.includes('market microstructure') || hay.includes('市場微結構') ||
    hay.includes('antitrust') || hay.includes('反托拉斯') || hay.includes('political economy') || hay.includes('國際政治經濟')
  ){ return 'econ'; }

  // 2) programming & computing skills
  if(
    hay.includes('program') || hay.includes('程式') || hay.includes('coding') ||
    hay.includes('computer') || hay.includes('computers') || hay.includes('計算機') ||
    hay.includes('data structure') || hay.includes('資料結構') ||
    hay.includes('object-oriented') || hay.includes('物件導向') ||
    hay.includes('go') || hay.includes('python') || hay.includes('cuda') ||
    hay.includes('parallel') || hay.includes('平行') ||
    hay.includes('ai') || hay.includes('artificial intelligence') || hay.includes('人工智慧')
  ){ return 'code'; }

  // 1) fundamentals
  if(
    hay.includes('calculus') || hay.includes('微積分') ||
    hay.includes('physics') || hay.includes('物理') ||
    hay.includes('linear algebra') || hay.includes('線性代數') ||
    hay.includes('probability') || hay.includes('機率') ||
    hay.includes('discrete') || hay.includes('離散') ||
    hay.includes('differential equation') || hay.includes('微分方程') ||
    hay.includes('circuit') || hay.includes('電路') ||
    hay.includes('electromagnet') || hay.includes('電磁') ||
    hay.includes('signals') || hay.includes('訊號') ||
    hay.includes('digital circuits') || hay.includes('數位電路') ||
    hay.includes('electronics') || hay.includes('電子學') ||
    hay.includes('logic design') || hay.includes('邏輯設計')
  ){ return 'basic'; }

  // 4) others
  return 'other';
}

function courseCategoryOrder(){
  return ['basic','code','econ','other'];
}

function renderCourseGrid(gridEl, group){
  if(!gridEl || !group) return;
  gridEl.innerHTML = '';
  const theme = (group && group.theme) ? String(group.theme) : '';
  const useCategoryLayout = (theme === 'nycu'); // keep UIUC original row layout

  (group.items || []).forEach(c => {
    const card = document.createElement('div');
    card.className = 'course-card';
    const cat = courseCategory(c);
    card.classList.add(`cat-${cat}`);
    card.setAttribute('data-cat', cat);
    const rawKey = c.key || c.name || '';
    const norm = normalizeClassKey(rawKey);
    const match = norm ? projectClassIndex.get(norm) : null;
    const explicit = c.project_class || c.projectClass || '';
    const targetCls = explicit || (match ? match.canonical : '');
    card.setAttribute('data-course-key', rawKey);
    card.setAttribute('data-course-target-cls', targetCls);
    if(targetCls){
      card.classList.add('has-project');
      card.setAttribute('data-project-count', String(match.count || 1));
    }

    const term = document.createElement('div');
    term.className = 'course-term';
    term.textContent = c.term || '';

    const name = document.createElement('div');
    name.className = 'course-name';
    name.textContent = c.name || '';

    card.appendChild(term);
    card.appendChild(name);

    if(targetCls){
      card.addEventListener('click', () => {
        // set filter without "toggle-off" behavior (no click lock / no second-click cancel)
        setFilter('cls', targetCls);
        const sec = document.getElementById('course-projects');
        if(sec){
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // after apply(), jump the first visible project card into view
          window.setTimeout(() => {
            const first = document.querySelector('#course-list [data-course]:not(.hidden)');
            if(first){ first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
          }, 220);
        }
      });
    }

    if(useCategoryLayout){
      gridEl.classList.add('classes-by-cat');
      let row = gridEl.querySelector(`[data-cat-row="${cat}"]`);
      if(!row){
        // lazily create rows in desired order (and only once)
        if(!gridEl.querySelector('[data-cat-row]')){
          for(const k of courseCategoryOrder()){
            const r = document.createElement('div');
            r.className = `course-cat-row cat-${k}`;
            r.setAttribute('data-cat-row', k);
            gridEl.appendChild(r);
          }
        }
        row = gridEl.querySelector(`[data-cat-row="${cat}"]`);
      }
      (row || gridEl).appendChild(card);
    }else{
      // UIUC: keep original layout (horizontal row, no category grouping)
      gridEl.appendChild(card);
    }
  });
}

function updateActiveCourseCards(){
  // Course cards should not have a persistent "clicked" highlight (hover-only UX).
  document.querySelectorAll('.course-card').forEach(el => el.classList.remove('active'));
}
window.__updateActiveCourseCards = updateActiveCourseCards;

const groups = data.classes_groups || {};
if(nycuTitle && groups.nycu && groups.nycu.title) nycuTitle.textContent = groups.nycu.title;
if(nycuSub && groups.nycu && groups.nycu.subtitle) nycuSub.textContent = groups.nycu.subtitle;
if(uiucTitle && groups.uiuc && groups.uiuc.title) uiucTitle.textContent = groups.uiuc.title;
if(uiucSub && groups.uiuc && groups.uiuc.subtitle) uiucSub.textContent = groups.uiuc.subtitle;

// Build a mapping from course-project class tag -> school (NYCU/UIUC)
window.__classSchool = {};
try{
  const map = {};
  for(const it of (groups.nycu && groups.nycu.items) ? groups.nycu.items : []){
    if(it && it.project_class){ map[String(it.project_class)] = 'nycu'; }
  }
  for(const it of (groups.uiuc && groups.uiuc.items) ? groups.uiuc.items : []){
    if(it && it.project_class){ map[String(it.project_class)] = 'uiuc'; }
  }
  // Fallback: infer from class tag text if not explicitly mapped
  (data.course_projects_list || []).forEach(p => {
    (p.classes || []).forEach(cls => {
      const s = String(cls);
      if(map[s]) return;
      if(/\bUIUC\b/i.test(s) || /University of Illinois/i.test(s) || /ECE\s*408/i.test(s) || /FIN\s*556/i.test(s) || /IE\s*421/i.test(s)){
        map[s] = 'uiuc';
      }
    });
  });
  window.__classSchool = map;
}catch(e){}

renderCourseGrid(nycuGrid, groups.nycu);
renderCourseGrid(uiucGrid, groups.uiuc);

// ensure active highlight reflects current state
updateActiveCourseCards();

  // Certifications list
  const certsList = $('#certs-list');
  certsList.innerHTML = '';
  (data.certifications_list || []).forEach(c => {
    const row = document.createElement('div');
    row.className = 'cert-row';

    const left = document.createElement('div');
    left.className = 'cert-icon';
    const iconImg = c.icon_img || c.icon_src || '';
    if(iconImg && String(iconImg).startsWith('/')){
      const img = document.createElement('img');
      img.src = iconImg;
      img.alt = (c.issuer || 'icon') + ' logo';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => { left.innerHTML = iconSvg(c.icon || 'nvidia'); }, { once: true });
      left.appendChild(img);
    }else{
      left.innerHTML = iconSvg(c.icon || 'linkedin');
    }

    const right = document.createElement('div');
    right.className = 'cert-body';

    const title = document.createElement('div');
    title.className = 'cert-title';
    title.textContent = c.title || '';

    const meta = document.createElement('div');
    meta.className = 'cert-meta';
    meta.textContent = [c.issuer, (c.issued || c.year)].filter(Boolean).join(' · ');

    right.appendChild(title);
    if(meta.textContent) right.appendChild(meta);

    if(c.credential_id){
      const idLine = document.createElement('div');
      idLine.className = 'cert-id';
      idLine.textContent = (locale === 'zh' ? '證照編號：' : 'Credential ID: ') + c.credential_id;
      right.appendChild(idLine);
    }

    if(c.url){
      const linkLine = document.createElement('div');
      linkLine.className = 'cert-link';
      const a = document.createElement('a');
      a.href = c.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = (locale === 'zh' ? '顯示證照' : 'View credential');
      linkLine.appendChild(a);
      right.appendChild(linkLine);
    }

    row.appendChild(left);
    row.appendChild(right);
    certsList.appendChild(row);
  });

  try{ renderAboutMini(locale); }catch(e){}
  renderMoreAbout(data);
  renderActivities(data);
  setupScrollSpy();

  state.skill = '__all__';
  state.cls = '__all__';
  apply();
}

function renderAboutMini(locale){
  const host = $('#about-mini');
  if(!host) return;
  host.innerHTML = '';
  const mk = (top, title, sub) => {
    const d = document.createElement('div');
    d.className = 'mini-card';
    const t = document.createElement('div');
    t.className = 'mini-top';
    t.textContent = top;
    const h = document.createElement('div');
    h.className = 'mini-title';
    h.textContent = title;
    const p = document.createElement('div');
    p.className = 'mini-sub';
    p.textContent = sub;
    d.appendChild(t); d.appendChild(h); d.appendChild(p);
    return d;
  };

  if(locale === 'zh'){
    host.appendChild(mk('語言', '中文', '母語'));
    host.appendChild(mk('語言', '英文', 'IELTS 7.5'));
    host.appendChild(mk('2022.09 至 2026.06', '電機工程學士', '國立陽明交通大學 NYCU'));
    host.appendChild(mk('2025.08 至 2025.12', '交換學生', 'UIUC Electrical Engineering'));
  }else{
    host.appendChild(mk('Language', 'Chinese', 'Native'));
    host.appendChild(mk('Language', 'English', 'IELTS 7.5'));
    host.appendChild(mk('Sep 2022 to Jun 2026', 'B.S. in Electrical Engineering', 'National Yang Ming Chiao Tung University (NYCU)'));
    host.appendChild(mk('Aug 2025 to Dec 2025', 'Exchange student', 'University of Illinois Urbana-Champaign (UIUC EE)'));
  }
}

async function main(){
  initLangSwitch();
  const locale = document.documentElement.getAttribute('data-locale') || 'en';
  const res = await fetch(`/assets/data/${locale}.json`, { cache: 'no-store' });
  const data = await res.json();
  render(data);
  buildSideNav();
  updateActiveNavFromScroll();
}

document.addEventListener('DOMContentLoaded', main);

// global card click handler (Course Projects)
document.addEventListener('click', (e) => {
  const card = e.target.closest('[data-card-href]');
  if(!card) return;
  const href = card.getAttribute('data-card-href');
  if(!href) return;
  window.open(href, '_blank', 'noreferrer');
});

function githubSvg(){
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 19c-5 1.5-5-2.5-7-3"/>
    <path d="M16 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>`;
}
function renderSkillChips(parent, skills){
  if(!parent || !skills || !skills.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'skill-chips';
  skills.forEach(s => {
    const c = document.createElement('span');
    c.className = 'skill-chip';
    c.textContent = s;
    wrap.appendChild(c);
  });
  parent.appendChild(wrap);
}

function renderMoreAbout(data){
  const m = data.more_about || {};
  const hint = document.getElementById('more-hint');
  const grid = document.getElementById('more-grid');
  if(!grid) return;
  if(hint) hint.textContent = m.hint || '';

  clearMoreTimers();
  grid.innerHTML = '';

  (m.items || []).forEach((item, idx) => {
    const tile = document.createElement('div');
    tile.className = 'more-tile';
    tile.dataset.idx = String(idx);

    const imgs = Array.isArray(item.imgs) && item.imgs.length ? item.imgs : (item.img ? [item.img] : []);
    let pos = 0;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'more-imgwrap';

    const img = document.createElement('img');
    img.className = 'more-img';
    img.src = imgs[0] || '/assets/profile.svg';
    img.alt = item.label || 'more';
    imgWrap.appendChild(img);

    const setPos = (newPos) => {
      const n = imgs.length || 1;
      pos = ((newPos % n) + n) % n;
      img.src = imgs[pos] || '/assets/profile.svg';
    };

    if(imgs.length > 1){
      const left = document.createElement('button');
      left.className = 'more-nav more-nav-left';
      left.type = 'button';
      left.setAttribute('aria-label', 'Previous photo');
      left.innerHTML = '‹';

      const right = document.createElement('button');
      right.className = 'more-nav more-nav-right';
      right.type = 'button';
      right.setAttribute('aria-label', 'Next photo');
      right.innerHTML = '›';

      left.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setPos(pos - 1);
      });
      right.addEventListener('click', (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        setPos(pos + 1);
      });

      imgWrap.appendChild(left);
      imgWrap.appendChild(right);

      const timerId = setInterval(() => {
        // pause when user interacts (hover/open)
        if(tile.matches(':hover')) return;
        setPos(pos + 1);
      }, 2600);
      __moreTimers.push(timerId);
    }

    tile.appendChild(imgWrap);

    const overlay = document.createElement('div');
    overlay.className = 'more-overlay';

    const card = document.createElement('div');
    card.className = 'more-card';

    const leftText = document.createElement('div');
    leftText.textContent = item.label || '';

    const rightText = document.createElement('span');
    rightText.textContent = (m.cta || (document.documentElement.dataset.locale === 'zh' ? '更多內容' : 'More'));

    card.appendChild(leftText);
    card.appendChild(rightText);
    overlay.appendChild(card);
    tile.appendChild(overlay);

    grid.appendChild(tile);
  });
}




const NAV_ORDER = ['about','skills','competitions','course-projects','classes','certifications','activities','more','contact'];

let navLockUntil = 0;

function setActiveNav(id, lock){
  const nav = document.getElementById('side-nav');
  if(!nav) return;
  nav.querySelectorAll('.nav-item').forEach(x => x.classList.toggle('active', x.dataset.target === id));
  if(lock) navLockUntil = Date.now() + 800;
}

function smoothScrollToSection(target){
  navLockUntil = Date.now() + 800;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateActiveNavFromScroll(){
  if(Date.now() < navLockUntil) return;
  const ids = NAV_ORDER.filter(id => document.getElementById(id));
  if(!ids.length) return;
  const y = window.scrollY + 10;
  let current = ids[0];
  for(const id of ids){
    const el = document.getElementById(id);
    if(!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if(top <= y) current = id;
  }
  setActiveNav(current, false);
}

function buildSideNav(){
  const nav = document.getElementById('side-nav');
  if(!nav) return;
  nav.innerHTML = '';
  const sections = NAV_ORDER.map(id => document.getElementById(id)).filter(Boolean);

  sections.forEach(sec => {
    const a = document.createElement('a');
    a.className = 'nav-item';
    a.href = `#${sec.id}`;
    a.dataset.target = sec.id;
    const titleEl = sec.querySelector('.section-title') || sec.querySelector('h2') || sec.querySelector('h1');
    a.textContent = titleEl ? titleEl.textContent.trim() : sec.id;
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const target = document.getElementById(sec.id);
      if(!target) return;
      setActiveNav(sec.id, true);
      smoothScrollToSection(target);
    });
    nav.appendChild(a);
  });

  updateActiveNavFromScroll();
}

window.addEventListener('scroll', () => { try{ updateActiveNavFromScroll(); }catch(e){} });


function renderActivities(data){
  const a = data.activities || {};
  const tabsEl = document.getElementById('activities-tabs');
  const albumEl = document.getElementById('activities-album');
  const textEl = document.getElementById('activities-text');
  if(!tabsEl || !albumEl || !textEl) return;

  tabsEl.innerHTML = '';
  const tabs = a.tabs || [];
  let activeKey = tabs.length ? tabs[0].key : null;

  const renderAlbum = (imgs=[]) => {
    try{ if(albumEl._timer){ clearInterval(albumEl._timer); albumEl._timer = null; } }catch(e){}
    albumEl.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'act-imgwrap';

    const img = document.createElement('img');
    img.className = 'act-img';
    img.src = imgs[0] || '/assets/profile.svg';
    img.alt = 'activity';
    wrap.appendChild(img);

    if(imgs.length > 1){
      const left = document.createElement('button');
      left.className = 'act-nav act-nav-left';
      left.type = 'button';
      left.setAttribute('aria-label', 'Previous photo');
      left.innerHTML = '‹';

      const right = document.createElement('button');
      right.className = 'act-nav act-nav-right';
      right.type = 'button';
      right.setAttribute('aria-label', 'Next photo');
      right.innerHTML = '›';

      let pos = 0;
      const setPos = (p) => {
        const n = imgs.length;
        pos = ((p % n) + n) % n;
        img.src = imgs[pos];
      };

      left.addEventListener('click', (ev) => { ev.preventDefault(); setPos(pos-1); });
      right.addEventListener('click', (ev) => { ev.preventDefault(); setPos(pos+1); });

      wrap.appendChild(left);
      wrap.appendChild(right);

      // autoplay
      albumEl._timer = setInterval(() => {
        if(albumEl.matches(':hover')) return;
        setPos(pos + 1);
      }, 2600);
    }

    albumEl.appendChild(wrap);
  };

  const renderText = (tab) => {
    textEl.innerHTML = '';

    const meta = document.createElement('div');
    meta.className = 'act-meta';

    const b1 = document.createElement('div');
    b1.className = 'act-badge';
    const top1 = document.createElement('div');
    top1.className = 'act-badge-top';
    top1.textContent = (document.documentElement.dataset.locale === 'zh') ? '職位' : 'Role';
    const main1 = document.createElement('div');
    main1.className = 'act-badge-main';
    main1.textContent = tab.role || '';
    b1.appendChild(top1); b1.appendChild(main1);

    const b2 = document.createElement('div');
    b2.className = 'act-badge';
    const top2 = document.createElement('div');
    top2.className = 'act-badge-top';
    top2.textContent = (document.documentElement.dataset.locale === 'zh') ? '時間' : 'Time';
    const main2 = document.createElement('div');
    main2.className = 'act-badge-main';
    main2.textContent = tab.time || '';
    b2.appendChild(top2); b2.appendChild(main2);

    meta.appendChild(b1);
    meta.appendChild(b2);
    textEl.appendChild(meta);

    const title = document.createElement('div');
    title.className = 'act-title';
    title.textContent = tab.label || '';
    textEl.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = 'act-bullets';
    (tab.bullets || []).forEach(x => {
      const li = document.createElement('li');
      li.textContent = x;
      ul.appendChild(li);
    });
    textEl.appendChild(ul);
  };

  const setActive = (key) => {
    activeKey = key;
    tabsEl.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
    const tab = tabs.find(x => x.key === key) || tabs[0];
    if(!tab) return;
    renderAlbum(tab.imgs || []);
    renderText(tab);
  };

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab';
    btn.dataset.key = tab.key;
    btn.textContent = tab.label || tab.key;
    btn.addEventListener('click', () => setActive(tab.key));
    tabsEl.appendChild(btn);
  });

  if(activeKey) setActive(activeKey);
}


let __moreTimers = [];
function clearMoreTimers(){
  __moreTimers.forEach(id => { try{ clearInterval(id); }catch(e){} });
  __moreTimers = [];
}

/* Portfolio site. Everything shown on the page comes from content/site.json, which the /admin panel edits. */
(function () {
  'use strict';
  var S = null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function arr(a) { return Array.isArray(a) ? a : []; }
  function link(u) { u = String(u || '').trim(); if (!u) return ''; if (!/^https?:\/\//i.test(u)) u = 'https://' + u; return /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : ''; }
  function asset(p) { p = String(p || '').trim(); if (!p) return ''; if (/^(https?:)?\/\//i.test(p)) return p; return p.charAt(0) === '/' ? p : '/' + p; }
  function hex(c, d) { c = String(c || '').trim(); return /^#[0-9a-f]{6}$/i.test(c) ? c : d; }
  function num(v, d, lo, hi) { v = parseFloat(v); if (!isFinite(v)) return d; return Math.min(hi, Math.max(lo, v)); }
  function lines(a) { return arr(a).map(esc); }

  var TYPES = {
    whatsapp: { tag: 'WA', name: 'WhatsApp' },
    linkedin: { tag: 'in', name: 'LinkedIn', base: 'https://www.linkedin.com/in/' },
    facebook: { tag: 'f', name: 'Facebook', base: 'https://www.facebook.com/' },
    instagram: { tag: 'IG', name: 'Instagram', base: 'https://www.instagram.com/' },
    messenger: { tag: 'Ms', name: 'Messenger', base: 'https://m.me/' },
    telegram: { tag: 'TG', name: 'Telegram', base: 'https://t.me/' },
    github: { tag: 'GH', name: 'GitHub', base: 'https://github.com/' },
    behance: { tag: 'Be', name: 'Behance', base: 'https://www.behance.net/' },
    dribbble: { tag: 'Dr', name: 'Dribbble', base: 'https://dribbble.com/' },
    x: { tag: 'X', name: 'X (Twitter)', base: 'https://x.com/' },
    youtube: { tag: 'YT', name: 'YouTube', base: 'https://www.youtube.com/@' },
    custom: { tag: '↗', name: 'Other website' }
  };
  function handle(v) { v = String(v || '').trim().replace(/^@/, '').replace(/\/+$/, ''); return /^[A-Za-z0-9._\-\/]+$/.test(v) ? v : ''; }
  function chan(l) {
    var t = TYPES[l.type] || TYPES.custom, v = String(l.value != null ? l.value : '').trim(), url = '', label = l.label || '';
    if (l.type === 'whatsapp') {
      var d = v.replace(/\D/g, ''); if (/^01\d{9}$/.test(d)) d = '880' + d.slice(1);
      if (d.length >= 8 && d.length <= 15) {
        url = 'https://wa.me/' + d + '?text=' + encodeURIComponent((S.contact && S.contact.waText) || 'Hi! I found your portfolio and would like to talk.');
        label = label || 'WhatsApp +' + d;
      }
    } else if (/^https?:\/\//i.test(v) || /^(www\.)?[a-z0-9-]+\.[a-z]{2,}(\/|$)/i.test(v)) {
      url = link(v);
      label = label || (l.type && l.type !== 'custom' ? t.name + ': ' : '') + v.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
    } else if (t.base) {
      var hd = handle(v); if (hd) { url = t.base + hd; label = label || t.name + ': ' + (l.type === 'youtube' ? '@' : '') + hd; }
    }
    return { tag: t.tag, url: url, label: label || t.name };
  }
  function mailOk(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || '').trim()); }

  /* ---------- page ---------- */
  function applyTheme() {
    var t = S.theme || {}, st = document.documentElement.style;
    st.setProperty('--red', hex(t.accent, '#e3262e'));
    st.setProperty('--bg', hex(t.bg, '#070506'));
    var s = S.site;
    document.title = s.pageTitle || (s.name + (s.title ? ' | ' + s.title : ''));
    var md = document.querySelector('meta[name=description]');
    if (md) md.setAttribute('content', s.description || (s.name + ' - ' + s.title + '. ' + String(s.intro || '').slice(0, 120)));
  }

  function render() {
    var s = S.site, c = S.contact, y = new Date().getFullYear(), h = '';
    h += '<div class="wrap"><header class="top"><div class="role"><span class="red up">' + esc(s.topRole) + '</span><small class="up">' + esc(s.topSub) + '</small></div>'
      + '<nav class="tnav" aria-label="Sections"><a href="#work">Work</a><a href="#gallery">Gallery</a><a href="#about">About</a><a href="#contact">Contact</a></nav>'
      + '<div class="avail"><span>' + esc(s.avail) + '</span><span class="plus">+</span></div></header>';

    var o3 = S.object3d || {}, orb = o3.enabled !== false;
    h += '<section class="hero' + (s.photo ? ' hasphoto' : '') + '" id="top"><div class="mega" aria-hidden="true">' + esc(s.mega) + '</div>'
      + (orb ? '<canvas id="orb" aria-hidden="true"></canvas>' : '')
      + (s.photo ? '<img class="hphoto" src="' + esc(asset(s.photo)) + '" alt="' + esc(s.name) + '">' : '')
      + '<div class="hero-left"><p class="hello">' + esc(s.hello) + '</p><h1>' + esc(s.name) + '<br>' + esc(s.title) + '</h1><p class="intro">' + esc(s.intro) + '</p>'
      + '<div class="loc"><span class="pin"></span><span>' + esc(s.location) + '</span></div></div>'
      + '<div class="hero-right"><div class="tagline"><span class="spark" aria-hidden="true">✦</span><p>' + esc(s.tagline) + '</p></div><ul class="pts">'
      + lines(s.points).map(function (p) { return '<li><span class="plus">+</span>' + p + '</li>'; }).join('') + '</ul></div></section>';

    h += '<section class="sec" id="work"><h2 class="eyebrow">Selected Projects</h2><div class="pgrid">';
    arr(S.projects).forEach(function (p, i) {
      var u = link(p.url), tag = u ? 'a' : 'div', attr = u ? ' href="' + esc(u) + '" target="_blank" rel="noopener"' : '';
      h += '<' + tag + ' class="proj"' + attr + '><div class="thumb t' + (i % 4) + '">'
        + (p.img ? '<img src="' + esc(asset(p.img)) + '" alt="' + esc(p.title) + '" loading="lazy">' : '<span class="big">' + esc(p.title) + '</span><span class="dev"></span>')
        + '</div><div class="pmeta"><div><h3>' + esc(p.title) + '</h3><p>' + esc(p.cat) + '<br>' + esc(p.role) + '</p></div><span class="num">' + ('0' + (i + 1)).slice(-2) + ' →</span></div></' + tag + '>';
    });
    h += '</div></section>';

    var albums = arr(S.albums);
    h += '<section class="sec" id="gallery"><h2 class="eyebrow">Gallery</h2>';
    if (!albums.length) h += '<p class="empty">Photo albums will appear here.</p>';
    else {
      h += '<div class="agrid">';
      albums.forEach(function (a, i) {
        var ph = arr(a.photos), cv = a.cover || (ph[0] && ph[0].image) || '';
        h += '<button class="album" type="button" data-album="' + i + '"><div class="acover">' + (cv ? '<img src="' + esc(asset(cv)) + '" alt="" loading="lazy">' : '')
          + '<span class="acount">' + ph.length + (ph.length === 1 ? ' photo' : ' photos') + '</span></div><h3>' + esc(a.title) + '</h3>' + (a.desc ? '<p>' + esc(a.desc) + '</p>' : '') + '</button>';
      });
      h += '</div>';
    }
    h += '</section>';

    var q = S.quote || {};
    h += '<section class="trio" id="about"><div class="col"><h2>Education &amp; Skills</h2><p class="edu-label">Education</p>'
      + arr(S.education).map(function (e) { return '<div class="edu"><b>' + esc(e.t) + '</b><span>' + esc(e.y) + '</span></div>'; }).join('')
      + '<p class="edu-note">' + esc(S.eduNote) + '</p><p class="edu-label">Skills</p><div class="chips">'
      + arr(S.skills).map(function (k) { return '<span class="chip">' + esc(k) + '</span>'; }).join('') + '</div></div>'
      + '<div class="col"><h2>Work Process</h2><ol class="steps">'
      + arr(S.process).map(function (p, i) { return '<li class="step"><span class="ico">' + ('0' + (i + 1)).slice(-2) + '</span><div><b>' + esc(p.t) + '</b><small>' + esc(p.s) + '</small></div></li>'; }).join('')
      + '</ol></div><div class="col quote"><span class="qmark">“</span><p>' + esc(q.text) + '</p><span class="sign">' + esc(q.sign) + '</span><span class="lets">' + esc(q.cta) + '</span><span class="plus">+</span></div></section>';

    h += '<section class="contact" id="contact"><div><h2>' + esc(c.heading) + '<span class="plus">✦</span></h2><p>' + esc(c.text) + '</p><div class="free"><i>→</i><span>' + esc(c.free) + '</span></div></div>'
      + '<ul class="clist"><li><span class="cic">@</span><span class="v" id="mailv">' + esc(c.email) + '</span>'
      + (mailOk(c.email) ? '<a class="copy" href="https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(c.email.trim()) + '&su=' + encodeURIComponent('Hello from your portfolio') + '" target="_blank" rel="noopener">Gmail</a><a class="copy" href="mailto:' + esc(c.email.trim()) + '">Mail app</a>' : '')
      + '<button class="copy" id="copyb" type="button">Copy</button></li>'
      + arr(c.links).map(function (l) { var k = chan(l); return '<li><span class="cic">' + esc(k.tag) + '</span>' + (k.url ? '<a href="' + esc(k.url) + '" target="_blank" rel="noopener">' + esc(k.label) + '</a>' : '<span class="v">' + esc(k.label) + '</span>') + '</li>'; }).join('')
      + '</ul><div class="laptop" aria-hidden="true"><div class="lap"><b>' + esc(s.mega) + '</b></div><div class="lapbase"></div></div></section>';

    h += '<footer><span>© ' + y + ' ' + esc(s.name) + '</span><a href="#top">Back to top ↑</a></footer></div>'
      + '<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Photo album" hidden></div><div class="viewer" id="vw" role="dialog" aria-modal="true" aria-label="Photo" hidden></div>';
    $('#app').innerHTML = h;
  }

  function bindPublic() {
    document.querySelectorAll('.proj').forEach(function (p) {
      var th = p.querySelector('.thumb'); if (reduce) return;
      p.addEventListener('pointermove', function (e) { var r = th.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; th.style.transform = 'rotateY(' + (x * 16) + 'deg) rotateX(' + (-y * 16) + 'deg) scale(1.03)'; });
      p.addEventListener('pointerleave', function () { th.style.transform = ''; });
    });
    var cb = $('#copyb');
    if (cb) cb.addEventListener('click', function () {
      var t = $('#mailv');
      function ok() { cb.textContent = 'Copied'; }
      function fb() { try { var r = document.createRange(); r.selectNodeContents(t); var g = getSelection(); g.removeAllRanges(); g.addRange(r); cb.textContent = 'Selected'; } catch (e) { } }
      try { navigator.clipboard.writeText(t.textContent).then(ok, fb); } catch (e) { fb(); }
    });
    document.querySelectorAll('.album').forEach(function (b) { b.addEventListener('click', function () { openAlbum(+b.getAttribute('data-album')); }); });
  }

  /* ---------- gallery ---------- */
  var lbAlbum = null, lbIdx = -1, lastFocus = null;
  function openAlbum(i) {
    var a = arr(S.albums)[i]; if (!a) return;
    var ph = arr(a.photos).filter(function (p) { return p && p.image; });
    lbAlbum = { a: a, ph: ph }; lastFocus = document.activeElement;
    var lb = $('#lb');
    lb.innerHTML = '<div class="lb-in"><div class="lb-top"><div><h3>' + esc(a.title) + '</h3>' + (a.desc ? '<p>' + esc(a.desc) + '</p>' : '') + '</div><button class="x" id="lbx" type="button" aria-label="Close album">✕</button></div>'
      + (ph.length ? '<div class="pics">' + ph.map(function (p, n) { return '<button class="pic" type="button" data-i="' + n + '" aria-label="Open photo ' + (n + 1) + '"><img src="' + esc(asset(p.image)) + '" alt="' + esc(p.cap) + '" loading="lazy"></button>'; }).join('') + '</div>' : '<p class="empty">No photos in this album yet.</p>') + '</div>';
    lb.hidden = false; document.body.style.overflow = 'hidden';
    $('#lbx').focus(); $('#lbx').addEventListener('click', closeAlbum);
    lb.querySelectorAll('.pic').forEach(function (b) { b.addEventListener('click', function () { openPhoto(+b.getAttribute('data-i')); }); });
  }
  function closeAlbum() { $('#lb').hidden = true; lbAlbum = null; document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function openPhoto(i) {
    if (!lbAlbum || !lbAlbum.ph.length) return;
    var ph = lbAlbum.ph; lbIdx = (i + ph.length) % ph.length; var p = ph[lbIdx], v = $('#vw');
    v.innerHTML = '<div class="stage"><button class="x vx" id="vx" type="button" aria-label="Close photo">✕</button>'
      + (ph.length > 1 ? '<button class="nav prev" id="vp" type="button" aria-label="Previous photo">←</button><button class="nav next" id="vn" type="button" aria-label="Next photo">→</button>' : '')
      + '<img src="' + esc(asset(p.image)) + '" alt="' + esc(p.cap) + '"></div><p class="cap">' + esc(p.cap) + (p.cap ? ' · ' : '') + (lbIdx + 1) + ' / ' + ph.length + '</p>';
    v.hidden = false; $('#vx').focus(); $('#vx').addEventListener('click', closePhoto);
    if ($('#vp')) { $('#vp').addEventListener('click', function () { openPhoto(lbIdx - 1); }); $('#vn').addEventListener('click', function () { openPhoto(lbIdx + 1); }); }
  }
  function closePhoto() { $('#vw').hidden = true; lbIdx = -1; if ($('#lbx')) $('#lbx').focus(); }
  document.addEventListener('keydown', function (e) {
    if ($('#vw') && !$('#vw').hidden) { if (e.key === 'Escape') closePhoto(); else if (e.key === 'ArrowLeft') openPhoto(lbIdx - 1); else if (e.key === 'ArrowRight') openPhoto(lbIdx + 1); }
    else if ($('#lb') && !$('#lb').hidden && e.key === 'Escape') closeAlbum();
  });

  /* ---------- chatbot ---------- */
  var DEFCHIPS = ['What do you do?', 'Show your projects', 'What are your skills?', 'How can I contact you?'];
  function botCfg() {
    var b = S.bot || {};
    return { on: b.on !== false, ai: b.ai === true, name: b.name || 'Pixel', greeting: b.greeting || '', extra: b.extra || '', faq: arr(b.faq).filter(function (f) { return f && f.q && f.a; }), chips: arr(b.chips).filter(Boolean).length ? arr(b.chips).filter(Boolean) : DEFCHIPS };
  }
  function mascot() {
    return '<svg viewBox="0 0 64 64" role="img" aria-label="Chat assistant mascot">'
      + '<line x1="32" y1="4" x2="32" y2="13" stroke="#f5f1f0" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="5" r="3.5" fill="#ffffff"/>'
      + '<rect x="2" y="27" width="7" height="14" rx="3.5" fill="#a3121b"/><rect x="55" y="27" width="7" height="14" rx="3.5" fill="#a3121b"/>'
      + '<rect x="7" y="13" width="50" height="42" rx="20" fill="#e3262e"/><rect x="12" y="19" width="40" height="30" rx="15" fill="#140b0c"/>'
      + '<g class="eye"><circle cx="24" cy="32" r="5" fill="#ffffff"/><circle cx="25.5" cy="33" r="2.2" fill="#140b0c"/></g>'
      + '<g class="eye"><circle cx="40" cy="32" r="5" fill="#ffffff"/><circle cx="41.5" cy="33" r="2.2" fill="#140b0c"/></g>'
      + '<path d="M26 41 Q32 46.5 38 41" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>'
      + '<circle cx="17" cy="40" r="2.6" fill="#ff6a72" fill-opacity="0.7"/><circle cx="47" cy="40" r="2.6" fill="#ff6a72" fill-opacity="0.7"/></svg>';
  }
  var STOP = ' the and you your what are for with about have has any tell can how who why his her him she that this from there where when does did was were will would could should please yes not too also very just into over some than then them they their our out one get got let may might much many more most such only other its it is to of in on at by an as or if so me my we do be '.split(' ');
  function toks(x) { return String(x || '').toLowerCase().replace(/[^a-z0-9ঀ-৿\s]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 1 && STOP.indexOf(w) < 0; }); }
  function overlap(a, b) { var n = 0; a.forEach(function (w) { if (b.indexOf(w) >= 0) n++; }); return n; }
  function has(q, list) { return list.some(function (k) { return q.indexOf(k) >= 0; }); }

  function answerLocal(raw) {
    var cfg = botCfg(), s = S.site, c = S.contact, nm = s.name, projects = arr(S.projects), albums = arr(S.albums), skills = arr(S.skills);
    var q = ' ' + String(raw).toLowerCase().replace(/[^a-z0-9ঀ-৿\s@.]/g, ' ') + ' ', qt = toks(raw);
    var best = null, bs = 0;
    cfg.faq.forEach(function (f) { var ft = toks(f.q), o = overlap(qt, ft), sc = ft.length ? o / ft.length : 0; if (o >= 1 && sc > bs) { bs = sc; best = f; } });
    if (best && bs >= .6) return best.a;
    var ex = '', es = 0;
    String(cfg.extra).split(/\n+|[.!?]\s+/).forEach(function (sn) { var o = overlap(qt, toks(sn)); if (o > es) { es = o; ex = sn.trim(); } });
    if (es >= 2 && ex) return ex;
    var words = q.trim().split(/\s+/);
    if (words.length <= 4 && has(q, [' hi ', ' hello ', ' hey ', ' hola ', ' salam ', ' assalamu ', ' assalamualaikum ', ' nomoskar ', ' kemon acho ', ' ki khobor ']))
      return 'Hello! I can tell you about ' + nm + "'s work, skills, projects, education or how to get in touch. What would you like to know?";
    if (has(q, [' thanks ', ' thank ', ' thx ', ' dhonnobad ', ' shukriya '])) return "You're welcome! Ask me anything else about " + nm + '.';
    if (has(q, [' bye ', ' goodbye ', ' see you ', ' allah hafez '])) return 'Bye! Thanks for visiting ' + nm + "'s portfolio.";
    for (var i = 0; i < projects.length; i++) {
      var p = projects[i], pt = toks(p.title);
      if ((p.title && q.indexOf(' ' + String(p.title).toLowerCase() + ' ') >= 0) || (pt.length > 1 && overlap(qt, pt) >= 2))
        return p.title + ' is a ' + p.cat + ' project. ' + nm + "'s role: " + p.role + '.' + (link(p.url) ? ' See it here: ' + link(p.url) : '');
    }
    if (has(q, [' contact ', ' email ', ' e mail ', ' mail ', ' reach ', ' phone ', ' number ', ' jogajog ', ' whatsapp ', ' facebook ', ' instagram ', ' messenger ', ' telegram ', ' linkedin ', ' behance ', ' dribbble ', ' github ', ' social ', ' message ', ' touch ']))
      return 'You can email ' + nm + ' at ' + c.email + '.' + (arr(c.links).length ? '\nAlso find them here:\n' + arr(c.links).map(function (l) { var k = chan(l); return '• ' + k.label + (k.url ? ': ' + k.url : ''); }).join('\n') : '');
    if (has(q, [' available ', ' availability ', ' freelance ', ' hire ', ' hiring ', ' open to ', ' book ', ' rate ', ' price ', ' cost ', ' charge ']))
      return s.avail + '. ' + c.free + '. For rates and timelines, email ' + nm + ' at ' + c.email + '.';
    if (has(q, [' project ', ' projects ', ' portfolio ', ' case stud', ' built ', ' made ', ' samples ', ' kaj ', ' kaj gulo ', ' works ', ' work ']))
      return nm + "'s selected projects:\n" + projects.map(function (p) { return '• ' + p.title + ' (' + p.cat + ')'; }).join('\n') + '\nAsk me about any of them.';
    if (has(q, [' skill ', ' skills ', ' tech ', ' tools ', ' stack ', ' expertise ', ' good at ', ' know ', ' language ', ' languages ', ' dokkho ', ' software ']))
      return nm + "'s skills: " + skills.join(', ') + '.\nStrengths: ' + arr(s.points).join(', ') + '.';
    if (has(q, [' education ', ' study ', ' studied ', ' degree ', ' university ', ' college ', ' school ', ' course ', ' certificate ', ' qualification ', ' shikkha ', ' poro ']))
      return 'Education:\n' + arr(S.education).map(function (e) { return '• ' + e.t + ' (' + e.y + ')'; }).join('\n') + (S.eduNote ? '\n' + S.eduNote : '');
    if (has(q, [' where ', ' location ', ' based ', ' live ', ' city ', ' country ', ' from ', ' kothay ', ' thake '])) return nm + ': ' + s.location + '.';
    if (has(q, [' process ', ' workflow ', ' steps ', ' approach ', ' method ']))
      return nm + "'s work process:\n" + arr(S.process).map(function (p, i) { return (i + 1) + '. ' + p.t + ' - ' + p.s; }).join('\n');
    if (has(q, [' photo ', ' photos ', ' gallery ', ' album ', ' albums ', ' picture ', ' pictures ', ' image ', ' images ', ' achievement ', ' achievements ', ' activity ', ' activities ', ' award ', ' awards ', ' event ', ' events ']))
      return albums.length ? 'Photo albums in the Gallery section:\n' + albums.map(function (a) { return '• ' + a.title + ' (' + arr(a.photos).length + ' photos)'; }).join('\n') : 'The gallery has no albums yet. Check back soon.';
    if (has(q, [' quote ', ' motto ', ' philosophy '])) return '"' + (S.quote || {}).text + '"';
    if (has(q, [' who ', ' name ', ' about ', ' introduce ', ' yourself ', ' naam ', ' ke ', ' what do you do ', ' do you do ', ' profession ', ' job ', ' role ', ' kore ']))
      return nm + ' is a ' + s.title + '. ' + s.intro + ' ' + s.location + '.';
    if (es >= 1 && ex) return ex;
    return "I don't have that information yet. You can ask " + nm + ' directly at ' + c.email + ', or ask me about their projects, skills, education or gallery.';
  }

  var chatHist = [];
  function ask(q) {
    var cfg = botCfg();
    if (!cfg.ai) return Promise.resolve(answerLocal(q));
    var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    return fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: q, history: chatHist.slice(-6) }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (!r.ok) throw new Error('chat'); return r.json(); })
      .then(function (d) { if (!d || !d.answer) throw new Error('empty'); return String(d.answer); })
      .catch(function () { return answerLocal(q); })
      .then(function (a) { clearTimeout(timer); return a; });
  }
  function initChat() {
    var cfg = botCfg(); if (!cfg.on) return;
    var launch = document.createElement('button'); launch.type = 'button'; launch.className = 'chatbtn'; launch.setAttribute('aria-label', 'Chat with ' + cfg.name);
    launch.innerHTML = mascot() + '<span class="ping"></span>';
    var tip = document.createElement('div'); tip.className = 'ctip'; tip.textContent = 'Hi! Ask me anything about ' + S.site.name + '.';
    var box = document.createElement('section'); box.className = 'chat'; box.hidden = true; box.setAttribute('aria-label', 'Chat with ' + cfg.name);
    box.innerHTML = '<div class="chat-head"><span class="av">' + mascot() + '</span><div class="t"><b></b><small></small></div><button class="x" type="button" aria-label="Close chat" style="width:36px;height:36px;font-size:15px">✕</button></div>'
      + '<div class="msgs" role="log" aria-live="polite"></div><div class="cchips"></div>'
      + '<form class="cform"><input type="text" maxlength="300" placeholder="Type your question" aria-label="Your question" autocomplete="off"><button type="submit">Send</button></form>';
    $('b', box).textContent = cfg.name; $('small', box).textContent = "Ask me about " + S.site.name + "'s work";
    document.body.append(tip, launch, box);
    var msgs = $('.msgs', box), chips = $('.cchips', box), form = $('.cform', box), inp = $('input', form), sendB = $('button', form), busy = false, greeted = false;
    function add(who, text) { var m = document.createElement('div'); m.className = 'm ' + who; m.textContent = text; msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight; return m; }
    function send(q) {
      q = String(q || '').trim().slice(0, 300); if (!q || busy) return;
      busy = true; sendB.disabled = true; chips.hidden = true; add('me', q); chatHist.push({ r: 'me', t: q });
      var typing = document.createElement('div'); typing.className = 'm bot dots'; typing.innerHTML = '<span></span><span></span><span></span>'; msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
      ask(q).then(function (a) { typing.remove(); add('bot', a); chatHist.push({ r: 'bot', t: a }); }, function () { typing.remove(); add('bot', answerLocal(q)); })
        .then(function () { busy = false; sendB.disabled = false; inp.focus(); });
    }
    cfg.chips.slice(0, 6).forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.className = 'cchip'; b.textContent = c; b.addEventListener('click', function () { send(c); }); chips.appendChild(b); });
    function openChat() {
      tip.hidden = true; launch.hidden = true; box.hidden = false;
      if (!greeted) { greeted = true; add('bot', cfg.greeting || ("Hi! I'm " + cfg.name + ', ' + S.site.name + "'s assistant. Ask me about their work, skills or how to get in touch.")); }
      inp.focus();
    }
    function closeChat() { box.hidden = true; launch.hidden = false; launch.focus(); }
    launch.addEventListener('click', openChat); $('.x', box).addEventListener('click', closeChat); tip.addEventListener('click', openChat);
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = inp.value; inp.value = ''; send(v); });
    box.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeChat(); });
    setTimeout(function () { tip.hidden = true; }, 12000);
  }

  /* ---------- 3D object ---------- */
  function loadGLTF(cb) {
    if (window.THREE && THREE.GLTFLoader) return cb();
    var sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    sc.onload = function () { cb(); }; sc.onerror = function () { cb(true); };
    document.head.appendChild(sc);
  }
  function init3d() {
    var o = S.object3d || {}; if (o.enabled === false) return;
    var canvas = $('#orb'); if (!canvas || !window.THREE) return;
    var T = THREE, renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var accent = hex((S.theme || {}).accent, '#e3262e'), bodyC = hex(o.color, '#140b0c'), glow = hex(o.accentColor, accent);
    var speed = num(o.speed, 1, 0, 5), size = num(o.size, 1, .4, 1.8);
    var scene = new T.Scene(), camera = new T.PerspectiveCamera(40, 1, .1, 100); camera.position.set(0, 0, 9);
    scene.add(new T.AmbientLight(new T.Color(accent).multiplyScalar(.28), 1.4));
    var key = new T.PointLight(new T.Color(glow), 2.2, 40); key.position.set(-5, 3, 5); scene.add(key);
    var rim = new T.PointLight(0xffffff, 1.1, 40); rim.position.set(5, -2, 4); scene.add(rim);
    var back = new T.PointLight(new T.Color(accent), 1.8, 40); back.position.set(0, 4, -4); scene.add(back);
    var group = new T.Group(); scene.add(group);
    var mat = new T.MeshStandardMaterial({ color: bodyC, metalness: .9, roughness: .28 });
    var morphGeo = null, base = null, wire = null, ring = null, ring2 = null;

    function addMesh(geo, flat) { var m = new T.Mesh(geo, flat ? new T.MeshStandardMaterial({ color: bodyC, metalness: .8, roughness: .3, flatShading: true }) : mat); group.add(m); return m; }
    function build(sh) {
      var main;
      if (sh === 'knot') main = addMesh(new T.TorusKnotGeometry(1.25, .4, 220, 32, 2, 3));
      else if (sh === 'crystal') main = addMesh(new T.IcosahedronGeometry(1.9, 0), true);
      else if (sh === 'torus') main = addMesh(new T.TorusGeometry(1.6, .6, 40, 120));
      else { morphGeo = new T.IcosahedronGeometry(1.7, 4); base = morphGeo.attributes.position.array.slice(); main = addMesh(morphGeo); }
      if (o.wireframe !== false) {
        var wg = sh === 'blob' || !sh ? new T.IcosahedronGeometry(1.74, 2) : main.geometry;
        wire = new T.Mesh(wg, new T.MeshBasicMaterial({ color: new T.Color(glow), wireframe: true, transparent: true, opacity: .22 }));
        if (sh !== 'blob' && sh) wire.scale.setScalar(1.015);
        group.add(wire);
      }
    }
    var shape = o.shape || 'blob';
    if (shape === 'model' && o.model) {
      loadGLTF(function (err) {
        if (err || !T.GLTFLoader) { build('blob'); return; }
        new T.GLTFLoader().load(asset(o.model), function (g) {
          var m = g.scene, b = new T.Box3().setFromObject(m), sz = b.getSize(new T.Vector3()), c = b.getCenter(new T.Vector3()), mx = Math.max(sz.x, sz.y, sz.z) || 1;
          m.position.sub(c); var w = new T.Group(); w.add(m); w.scale.setScalar(3.6 / mx); group.add(w);
          if (reduce) draw(2);
        }, undefined, function () { build('blob'); if (reduce) draw(2); });
      });
    } else build(shape === 'model' ? 'blob' : shape);

    if (o.rings !== false) {
      ring = new T.Mesh(new T.TorusGeometry(2.7, .018, 8, 160), new T.MeshBasicMaterial({ color: new T.Color(glow) })); ring.rotation.x = 1.2; group.add(ring);
      ring2 = new T.Mesh(new T.TorusGeometry(3.2, .012, 8, 160), new T.MeshBasicMaterial({ color: 0xf5f1f0, transparent: true, opacity: .35 })); ring2.rotation.x = 1.9; ring2.rotation.y = .5; group.add(ring2);
    }
    var N = 260, pp = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) { pp[i * 3] = (Math.random() - .5) * 16; pp[i * 3 + 1] = (Math.random() - .5) * 10; pp[i * 3 + 2] = (Math.random() - .5) * 8 - 2; }
    var pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pp, 3));
    var pts = new T.Points(pg, new T.PointsMaterial({ color: new T.Color(glow).lerp(new T.Color(0xffffff), .35), size: .03, transparent: true, opacity: .7 })); scene.add(pts);

    var mx = 0, my = 0, tx = 0, ty = 0;
    addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
    function resize() { var r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return; renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); group.scale.setScalar(size * (r.width < 700 ? .8 : 1)); }
    resize(); addEventListener('resize', function () { resize(); if (reduce) draw(2); });
    function morph(t) {
      var a = morphGeo.attributes.position, ar = a.array;
      for (var i = 0; i < ar.length; i += 3) { var x = base[i], y = base[i + 1], z = base[i + 2], d = 1 + .12 * Math.sin(x * 2.1 + t * 1.1) * Math.cos(y * 1.9 + t * .9) + .08 * Math.sin(z * 3 + t * 1.4); ar[i] = x * d; ar[i + 1] = y * d; ar[i + 2] = z * d; }
      a.needsUpdate = true; morphGeo.computeVertexNormals();
    }
    var clock = new T.Clock();
    function draw(t) {
      var st = t * speed;
      if (morphGeo) morph(st);
      tx += (mx - tx) * .05; ty += (my - ty) * .05;
      group.rotation.y = st * .18 + tx * 1.2; group.rotation.x = ty * .8 + Math.sin(st * .3) * .1;
      if (ring) ring.rotation.z = st * .25; if (ring2) ring2.rotation.z = -st * .18;
      if (wire && shape === 'blob') wire.rotation.y = -st * .1;
      pts.rotation.y = t * .02; key.position.x = -5 + tx * 4;
      renderer.render(scene, camera);
    }
    function loop() { draw(clock.getElapsedTime()); requestAnimationFrame(loop); }
    if (reduce) draw(2); else requestAnimationFrame(loop);
  }

  /* ---------- start ---------- */
  function defaults(d) {
    d = d || {};
    d.site = d.site || {}; d.contact = d.contact || {}; d.quote = d.quote || {}; d.theme = d.theme || {}; d.object3d = d.object3d || {}; d.bot = d.bot || {};
    return d;
  }
  fetch('content/site.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (d) { S = defaults(d); applyTheme(); render(); bindPublic(); init3d(); initChat(); })
    .catch(function (e) {
      $('#app').innerHTML = '<p style="padding:40px 16px;font-family:system-ui,sans-serif;color:#f5f1f0">Could not load content/site.json. If you opened index.html by double clicking it, run a small local server instead (see README.md).</p>';
      if (window.console) console.error(e);
    });
})();

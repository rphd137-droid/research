// =====================================================================
//  YOUR SUPABASE PROJECT  (the only lines you may need to edit)
// =====================================================================
var SUPABASE_URL = 'https://azohqqfsorgutpnyolgp.supabase.co';
var SUPABASE_KEY = 'sb_publishable_7dLi3ojMwpcUv16ulh5EFQ_0GwYXWnQ';
// =====================================================================

/* ---------------- Supabase client (login + database) ---------------- */
var SB = (function () {
  var base = SUPABASE_URL.replace(/\/$/, '');
  var KEY = 'rq_admin_session';
  var session = null;
  try { session = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}

  function save(s) {
    session = s;
    try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch (e) {}
  }
  function fromAuth(d) {
    return {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      email: d.user && d.user.email
    };
  }
  async function readJson(r) {
    var t = await r.text();
    try { return t ? JSON.parse(t) : null; } catch (e) { return t; }
  }
  async function authCall(path, body, token, method) {
    var h = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
    if (token) h.Authorization = 'Bearer ' + token;
    var r = await fetch(base + '/auth/v1/' + path, { method: method || 'POST', headers: h, body: JSON.stringify(body || {}) });
    var d = (await readJson(r)) || {};
    if (!r.ok) throw new Error(d.error_description || d.msg || d.message || d.error || ('Error ' + r.status));
    return d;
  }
  async function login(email, password) {
    var d = await authCall('token?grant_type=password', { email: email, password: password });
    save(fromAuth(d));
    return session;
  }
  async function refresh() {
    if (!session) return null;
    try {
      var d = await authCall('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
      var email = session.email;
      save(fromAuth(d));
      if (!session.email) { session.email = email; save(session); }
    } catch (e) { save(null); }
    return session;
  }
  async function token() {
    if (!session) return null;
    if (session.expires_at - 60 < Date.now() / 1000) await refresh();
    return session ? session.access_token : null;
  }
  async function logout() {
    var t = session && session.access_token;
    save(null);
    if (t) { try { await authCall('logout', {}, t); } catch (e) {} }
  }
  function recover(email, redirectTo) {
    return authCall('recover' + (redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : ''), { email: email });
  }
  function setPassword(accessToken, password) {
    return authCall('user', { password: password }, accessToken, 'PUT');
  }
  async function rest(method, path, body, opts) {
    opts = opts || {};
    var h = { apikey: SUPABASE_KEY };
    var t = opts.anon ? null : await token();
    if (t) h.Authorization = 'Bearer ' + t;
    else if (SUPABASE_KEY.indexOf('eyJ') === 0) h.Authorization = 'Bearer ' + SUPABASE_KEY;
    if (body !== undefined) h['Content-Type'] = 'application/json';
    if (opts.prefer) h.Prefer = opts.prefer;
    var r = await fetch(base + '/rest/v1/' + path, {
      method: method, headers: h, body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (r.status === 401 && t && !opts.retried) {
      await refresh();
      if (session) return rest(method, path, body, Object.assign({}, opts, { retried: true }));
    }
    var data = await readJson(r);
    if (!r.ok) {
      var err = new Error((data && (data.message || data.hint || data.msg)) || ('Error ' + r.status));
      err.status = r.status; err.code = data && data.code;
      throw err;
    }
    return { data: data, headers: r.headers };
  }
  return {
    login: login, logout: logout, refresh: refresh, recover: recover, setPassword: setPassword, rest: rest,
    get session() { return session; }
  };
})();

/* ---------------- Small helpers ---------------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function paras(text) { // plain text -> safe paragraphs
  return String(text || '').split(/\n{2,}/).map(function (p) {
    return p.trim() ? '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>' : '';
  }).join('');
}
function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 30) || 'opt';
}
function uid(prefix) { return (prefix || '') + Math.random().toString(36).slice(2, 8); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function deepMerge(base, over) {
  var out = clone(base);
  (function merge(a, b) {
    Object.keys(b || {}).forEach(function (k) {
      if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') merge(a[k], b[k]);
      else if (b[k] !== undefined) a[k] = b[k];
    });
  })(out, over);
  return out;
}

/* ---------------- Settings, themes, fonts ---------------- */
var RESPONDENT_FIELDS = [
  { key: 'name', label: 'Full name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Mobile number', type: 'tel' },
  { key: 'address', label: 'Address', type: 'textarea' },
  { key: 'city', label: 'City / District', type: 'text' },
  { key: 'state', label: 'State', type: 'text' },
  { key: 'pincode', label: 'PIN code', type: 'text' },
  { key: 'organisation', label: 'Organisation / Institution', type: 'text' },
  { key: 'designation', label: 'Designation', type: 'text' }
];

var FONTS = {
  system: { label: 'System default', css: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  roboto: { label: 'Roboto', css: '"Roboto", sans-serif', google: 'Roboto:wght@400;500;700' },
  opensans: { label: 'Open Sans', css: '"Open Sans", sans-serif', google: 'Open+Sans:wght@400;600;700' },
  lato: { label: 'Lato', css: '"Lato", sans-serif', google: 'Lato:wght@400;700' },
  poppins: { label: 'Poppins', css: '"Poppins", sans-serif', google: 'Poppins:wght@400;500;600' },
  noto: { label: 'Noto Sans (English + हिन्दी)', css: '"Noto Sans", "Noto Sans Devanagari", sans-serif', google: 'Noto+Sans:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700' },
  merriweather: { label: 'Merriweather (serif)', css: '"Merriweather", Georgia, serif', google: 'Merriweather:wght@400;700' },
  georgia: { label: 'Georgia (classic serif)', css: 'Georgia, "Times New Roman", serif' },
  times: { label: 'Times New Roman', css: '"Times New Roman", Times, serif' }
};

var THEME_PRESETS = {
  classic: { label: 'Classic Blue', primary: '#1f4e8c', background: '#f5f6f8', card: '#ffffff', text: '#1d2433' },
  green: { label: 'Fresh Green', primary: '#1e7a4f', background: '#f2f7f4', card: '#ffffff', text: '#18291f' },
  maroon: { label: 'University Maroon', primary: '#7a1f2b', background: '#f8f4f2', card: '#ffffff', text: '#2a1a1c' },
  saffron: { label: 'Saffron', primary: '#c2570c', background: '#fdf7f0', card: '#ffffff', text: '#2b1d10' },
  slate: { label: 'Slate Grey', primary: '#334155', background: '#f1f5f9', card: '#ffffff', text: '#0f172a' },
  dark: { label: 'Dark', primary: '#60a5fa', background: '#0f172a', card: '#1e293b', text: '#e2e8f0' }
};

function defaultSettings() {
  var fields = {};
  RESPONDENT_FIELDS.forEach(function (f) { fields[f.key] = { on: false, required: false }; });
  return {
    theme: { preset: 'classic', primary: '#1f4e8c', background: '#f5f6f8', card: '#ffffff', text: '#1d2433', font: 'system', fontSize: 16, radius: 12 },
    texts: {
      intro: '',
      thankYou: 'Thank you for your valuable time and participation in this research study.',
      submitLabel: 'Submit Response',
      closedMessage: 'This questionnaire is not accepting responses at the moment. Thank you for your interest.'
    },
    respondent: { mode: 'anonymous', heading: 'Your details', fields: fields },
    consent: { on: false, text: 'I have read the information above and I voluntarily agree to take part in this research study.' },
    rules: { oneResponsePerDevice: false, showProgress: true, numberQuestions: true }
  };
}
function fullSettings(s) { return deepMerge(defaultSettings(), s || {}); }

function loadFont(key) {
  var f = FONTS[key];
  if (!f || !f.google || document.getElementById('font-' + key)) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.id = 'font-' + key;
  l.href = 'https://fonts.googleapis.com/css2?family=' + f.google + '&display=swap';
  document.head.appendChild(l);
}
function hexToRgb(h) {
  var m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return [31, 78, 140];
  var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function mix(hex, withHex, amount) {
  var a = hexToRgb(hex), b = hexToRgb(withHex);
  return 'rgb(' + a.map(function (v, i) { return Math.round(v * (1 - amount) + b[i] * amount); }).join(',') + ')';
}
function themeVars(theme) {
  var t = theme, f = FONTS[t.font] || FONTS.system;
  var dark = hexToRgb(t.background).reduce(function (s, v) { return s + v; }, 0) < 300;
  return {
    '--primary': t.primary, '--bg': t.background, '--card': t.card, '--ink': t.text,
    '--muted': mix(t.text, t.card, 0.35), '--line': mix(t.text, t.card, dark ? 0.75 : 0.85),
    '--soft': mix(t.primary, t.card, dark ? 0.75 : 0.88), '--font': f.css,
    '--size': (Number(t.fontSize) || 16) + 'px', '--radius': (Number(t.radius) || 0) + 'px'
  };
}
function applyTheme(el, theme) {
  loadFont(theme.font);
  var v = themeVars(theme);
  Object.keys(v).forEach(function (k) { el.style.setProperty(k, v[k]); });
}

/* ---------------- Questionnaire structure helpers ---------------- */
var QUESTION_TYPES = {
  single: 'Single choice (one answer)',
  multi: 'Multiple choice (tick many)',
  dropdown: 'Dropdown list',
  likert: 'Rating scale / Likert (statements)',
  short: 'Short text',
  long: 'Long text (paragraph)',
  number: 'Number',
  date: 'Date'
};
var SCALE_PRESETS = {
  agree5: { label: '5-point Agree (5 = Strongly Agree … 1 = Strongly Disagree)', scale: [[5, 'Strongly Agree'], [4, 'Agree'], [3, 'Neutral'], [2, 'Disagree'], [1, 'Strongly Disagree']] },
  agree5asc: { label: '5-point Agree (1 = Strongly Disagree … 5 = Strongly Agree)', scale: [[1, 'Strongly Disagree'], [2, 'Disagree'], [3, 'Neutral'], [4, 'Agree'], [5, 'Strongly Agree']] },
  agree7: { label: '7-point Agree', scale: [[7, 'Strongly Agree'], [6, 'Agree'], [5, 'Somewhat Agree'], [4, 'Neutral'], [3, 'Somewhat Disagree'], [2, 'Disagree'], [1, 'Strongly Disagree']] },
  satisfied5: { label: '5-point Satisfaction', scale: [[5, 'Very Satisfied'], [4, 'Satisfied'], [3, 'Neutral'], [2, 'Dissatisfied'], [1, 'Very Dissatisfied']] },
  frequency5: { label: '5-point Frequency', scale: [[5, 'Always'], [4, 'Often'], [3, 'Sometimes'], [2, 'Rarely'], [1, 'Never']] },
  importance5: { label: '5-point Importance', scale: [[5, 'Very Important'], [4, 'Important'], [3, 'Moderately Important'], [2, 'Slightly Important'], [1, 'Not Important']] }
};
function scaleOf(q) {
  var s = q.scale && q.scale.length ? q.scale : SCALE_PRESETS.agree5.scale;
  return s.map(function (x) { return { value: Number(x[0]), label: String(x[1]) }; });
}
function choiceOptions(q) { // options shown to respondent, incl. Other
  var o = (q.options || []).slice();
  if (q.other) o.push('Other');
  return o;
}
function allItems(questions) {
  var out = [];
  ((questions && questions.sections) || []).forEach(function (s) { (s.items || []).forEach(function (q) { out.push(q); }); });
  return out;
}
function numbering(questions, on) { // id -> display number
  var map = {}, n = 0;
  if (!on) return map;
  allItems(questions).forEach(function (q) {
    if (q.type === 'likert') (q.statements || []).forEach(function (st) { map[st.code] = ++n; });
    else map[q.code] = ++n;
  });
  return map;
}
function validateQuestions(questions) {
  var seen = {}, errors = [];
  function check(code, where) {
    if (!/^[A-Za-z][A-Za-z0-9_]{0,59}$/.test(code || '')) errors.push(where + ': code "' + (code || '') + '" must start with a letter and use only letters, numbers and _');
    else if (seen[code.toLowerCase()]) errors.push(where + ': code "' + code + '" is used twice');
    seen[(code || '').toLowerCase()] = true;
  }
  allItems(questions).forEach(function (q, i) {
    var where = 'Question ' + (i + 1) + (q.text ? ' ("' + q.text.slice(0, 40) + '")' : '');
    check(q.code, where);
    if (!q.text && q.type !== 'likert') errors.push(where + ': question text is empty');
    if (['single', 'multi', 'dropdown'].indexOf(q.type) >= 0 && !(q.options || []).length) errors.push(where + ': add at least one option');
    if (q.type === 'likert') {
      if (!(q.statements || []).length) errors.push(where + ': add at least one statement');
      (q.statements || []).forEach(function (st, j) { check(st.code, where + ', statement ' + (j + 1)); });
    }
  });
  return errors;
}

/* ---------------- Turning answers into tables ---------------- */
function mean(a) { return a.length ? a.reduce(function (s, v) { return s + v; }, 0) / a.length : null; }
function sd(a) {
  if (a.length < 2) return null;
  var m = mean(a); return Math.sqrt(a.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0) / (a.length - 1));
}
function round(v, d) { return v == null || isNaN(v) ? null : Math.round(v * Math.pow(10, d || 2)) / Math.pow(10, d || 2); }
function fmtDate(iso) {
  var d = new Date(iso); if (isNaN(d)) return iso || '';
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
}
function respondentMean(q, answers) {
  var vals = (q.statements || []).map(function (st) { return Number(answers[st.code]); }).filter(function (v) { return !isNaN(v) && v !== 0; });
  return vals.length ? mean(vals) : null;
}

// Builds: columns, rows (labels), coded rows (numbers), codebook
function buildDataset(survey, subs) {
  var S = fullSettings(survey.settings), Q = survey.questions || { sections: [] };
  var cols = [{ key: '_id', label: 'Response ID', q: 'Response ID' }, { key: '_date', label: 'Submitted at', q: 'Date and time submitted' }];
  var respKeys = RESPONDENT_FIELDS.filter(function (f) {
    return (S.respondent.mode === 'details' && S.respondent.fields[f.key].on) ||
      subs.some(function (s) { return s.respondent && s.respondent[f.key]; });
  });
  respKeys.forEach(function (f) { cols.push({ key: 'r_' + f.key, label: f.label, q: 'Respondent: ' + f.label, resp: f.key }); });
  if (S.consent.on) cols.push({ key: '_consent', label: 'Consent', q: S.consent.text, consent: true });

  var meanCols = [];
  allItems(Q).forEach(function (q) {
    var opts = choiceOptions(q);
    if (q.type === 'single' || q.type === 'dropdown') {
      cols.push({ key: q.code, label: q.code, q: q.text, src: q.code, kind: 'choice', options: opts });
      if (q.other) cols.push({ key: q.code + '_other_text', label: q.code + '_other_text', q: q.text + ' - Other (specified)', src: q.code + '__other' });
    } else if (q.type === 'multi') {
      opts.forEach(function (o) {
        cols.push({ key: q.code + '_' + slugify(o), label: q.code + '_' + slugify(o), q: q.text + ' - ' + o, multi: q.code, opt: o, kind: 'flag' });
      });
      if (q.other) cols.push({ key: q.code + '_other_text', label: q.code + '_other_text', q: q.text + ' - Other (specified)', src: q.code + '__other' });
    } else if (q.type === 'likert') {
      var sc = scaleOf(q);
      (q.statements || []).forEach(function (st) {
        cols.push({ key: st.code, label: st.code, q: st.text, src: st.code, kind: 'num', scale: sc });
      });
      meanCols.push({ key: q.code + '_mean', label: q.code + '_mean', q: 'Mean score: ' + (q.dimension || q.text || q.code), likert: q, kind: 'num' });
    } else {
      cols.push({ key: q.code, label: q.code, q: q.text, src: q.code, kind: q.type === 'number' ? 'num' : 'text' });
    }
  });
  cols = cols.concat(meanCols);

  var rows = [], coded = [];
  subs.forEach(function (s) {
    var a = s.answers || {}, row = {}, crow = {};
    cols.forEach(function (c) {
      var v = '', cv;
      if (c.key === '_id') v = s.id;
      else if (c.key === '_date') v = fmtDate(s.submitted_at);
      else if (c.resp) v = (s.respondent || {})[c.resp] || '';
      else if (c.consent) v = (s.respondent || {})._consent ? 'Yes' : '';
      else if (c.multi) v = (a[c.multi] || []).indexOf(c.opt) >= 0 ? 1 : 0;
      else if (c.likert) v = round(respondentMean(c.likert, a), 2);
      else if (c.src) v = a[c.src] == null ? '' : a[c.src];
      if (c.kind === 'num' && v !== '' && v != null) v = Number(v);
      cv = v;
      if (c.kind === 'choice' && v !== '') { var i = c.options.indexOf(v); cv = i >= 0 ? i + 1 : v; }
      row[c.key] = v == null ? '' : v; crow[c.key] = cv == null ? '' : cv;
    });
    rows.push(row); coded.push(crow);
  });

  var codebook = cols.map(function (c) {
    var values = '';
    if (c.kind === 'choice') values = c.options.map(function (o, i) { return (i + 1) + ' = ' + o; }).join('; ');
    else if (c.kind === 'flag') values = '1 = selected; 0 = not selected';
    else if (c.scale) values = c.scale.map(function (x) { return x.value + ' = ' + x.label; }).join('; ');
    else if (c.likert) values = 'Average of the statements (blank answers ignored)';
    return { column: c.label, question: c.q || '', values: values };
  });
  return { cols: cols, rows: rows, coded: coded, codebook: codebook };
}

// Summary of every question (used by results screen, Word and PDF)
function summarize(survey, subs) {
  var Q = survey.questions || { sections: [] }, n = subs.length, out = [];
  var nums = numbering(Q, fullSettings(survey.settings).rules.numberQuestions);
  allItems(Q).forEach(function (q) {
    var item = { q: q, num: nums[q.code] };
    if (q.type === 'single' || q.type === 'dropdown' || q.type === 'multi') {
      var counts = {}, answered = 0;
      choiceOptions(q).forEach(function (o) { counts[o] = 0; });
      subs.forEach(function (s) {
        var v = (s.answers || {})[q.code];
        if (v == null || v === '' || (Array.isArray(v) && !v.length)) return;
        answered++;
        (Array.isArray(v) ? v : [v]).forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      });
      item.kind = 'choice'; item.answered = answered;
      item.rows = Object.keys(counts).map(function (o) {
        return { label: o, count: counts[o], pct: answered ? counts[o] / answered * 100 : 0 };
      });
      item.others = subs.map(function (s) { return (s.answers || {})[q.code + '__other']; }).filter(Boolean);
    } else if (q.type === 'likert') {
      var sc = scaleOf(q);
      item.kind = 'likert'; item.scale = sc;
      item.rows = (q.statements || []).map(function (st) {
        var vals = subs.map(function (s) { return Number((s.answers || {})[st.code]); }).filter(function (v) { return !isNaN(v) && v; });
        var dist = sc.map(function (x) { var c = vals.filter(function (v) { return v === x.value; }).length; return { value: x.value, count: c, pct: vals.length ? c / vals.length * 100 : 0 }; });
        return { code: st.code, num: nums[st.code], text: st.text, n: vals.length, mean: round(mean(vals)), sd: round(sd(vals)), dist: dist };
      });
      var means = subs.map(function (s) { return respondentMean(q, s.answers || {}); }).filter(function (v) { return v != null; });
      item.dimMean = round(mean(means)); item.dimSd = round(sd(means)); item.dimN = means.length;
    } else if (q.type === 'number') {
      var nv = subs.map(function (s) { return (s.answers || {})[q.code]; }).filter(function (v) { return v !== '' && v != null && !isNaN(Number(v)); }).map(Number);
      item.kind = 'number'; item.n = nv.length; item.mean = round(mean(nv)); item.sd = round(sd(nv));
      item.min = nv.length ? Math.min.apply(null, nv) : null; item.max = nv.length ? Math.max.apply(null, nv) : null;
    } else {
      item.kind = 'text';
      item.texts = subs.map(function (s) { return (s.answers || {})[q.code]; }).filter(function (v) { return v != null && String(v).trim() !== ''; });
    }
    out.push(item);
  });
  return { n: n, items: out };
}

// Dimension means split by a grouping question
function compareBy(survey, subs, groupCode) {
  var Q = survey.questions || { sections: [] };
  var gq = allItems(Q).filter(function (q) { return q.code === groupCode; })[0];
  var likerts = allItems(Q).filter(function (q) { return q.type === 'likert'; });
  if (!gq) return null;
  var groups = choiceOptions(gq).map(function (o) {
    var g = subs.filter(function (s) { return (s.answers || {})[groupCode] === o; });
    return {
      label: o, n: g.length,
      means: likerts.map(function (q) {
        var m = g.map(function (s) { return respondentMean(q, s.answers || {}); }).filter(function (v) { return v != null; });
        return { mean: round(mean(m)), sd: round(sd(m)) };
      })
    };
  }).filter(function (g) { return g.n > 0; });
  return { question: gq, dims: likerts.map(function (q) { return q.dimension || q.text || q.code; }), groups: groups };
}

/* ---------------- File builders: ZIP, Excel (.xlsx), Word (.docx) ---------------- */
var ZIP = (function () {
  var table = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = table[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  return function (files) { // [{name, text}]
    var enc = new TextEncoder(), parts = [], central = [], offset = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = enc.encode(f.text), c = crc(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, 0, true); h.setUint16(12, 0x21, true); h.setUint32(14, c, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      var d = new DataView(new ArrayBuffer(46));
      d.setUint32(0, 0x02014b50, true); d.setUint16(4, 20, true); d.setUint16(6, 20, true); d.setUint16(8, 0x0800, true);
      d.setUint16(10, 0, true); d.setUint16(12, 0, true); d.setUint16(14, 0x21, true); d.setUint32(16, c, true);
      d.setUint32(20, data.length, true); d.setUint32(24, data.length, true); d.setUint16(28, name.length, true);
      d.setUint32(42, offset, true);
      central.push(new Uint8Array(d.buffer), name);
      offset += 30 + name.length + data.length;
    });
    var csize = central.reduce(function (s, p) { return s + p.length; }, 0);
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, csize, true); e.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [new Uint8Array(e.buffer)]));
  };
})();

function xmlEsc(s) {
  return String(s == null ? '' : s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

// sheets: [{name, rows: [[cell,...],...], widths:[..]}]  (first row = bold header)
function makeXlsx(sheets) {
  function colName(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  var used = {};
  sheets.forEach(function (sh, i) {
    var nm = String(sh.name || 'Sheet' + (i + 1)).replace(/[\[\]:*?\/\\]/g, ' ').slice(0, 31);
    while (used[nm.toLowerCase()]) nm = nm.slice(0, 28) + ' ' + i;
    used[nm.toLowerCase()] = true; sh.safe = nm;
  });
  var files = [];
  files.push({ name: '[Content_Types].xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    sheets.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') + '</Types>' });
  files.push({ name: '_rels/.rels', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' });
  files.push({ name: 'xl/workbook.xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
    sheets.map(function (s, i) { return '<sheet name="' + xmlEsc(s.safe) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets></workbook>' });
  files.push({ name: 'xl/_rels/workbook.xml.rels', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    sheets.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
    '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' });
  files.push({ name: 'xl/styles.xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8EEF8"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' });
  sheets.forEach(function (sh, si) {
    var cols = '';
    if (sh.widths) cols = '<cols>' + sh.widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols>';
    var body = sh.rows.map(function (r, ri) {
      return '<row r="' + (ri + 1) + '">' + r.map(function (v, ci) {
        var ref = colName(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : (sh.wrap ? ' s="2"' : '');
        if (v === '' || v == null) return ri === 0 ? '<c r="' + ref + '"' + st + '/>' : '';
        if (typeof v === 'number' && isFinite(v)) return '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>';
        return '<c r="' + ref + '"' + st + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(String(v).slice(0, 32000)) + '</t></is></c>';
      }).join('') + '</row>';
    }).join('');
    files.push({ name: 'xl/worksheets/sheet' + (si + 1) + '.xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' + cols + '<sheetData>' + body + '</sheetData></worksheet>' });
  });
  return ZIP(files);
}

// blocks: [{type:'title'|'h1'|'h2'|'p'|'table', text, rows:[[..]], widths}]
function makeDocx(blocks) {
  function run(t, bold) { return '<w:r>' + (bold ? '<w:rPr><w:b/></w:rPr>' : '') + '<w:t xml:space="preserve">' + xmlEsc(t) + '</w:t></w:r>'; }
  function para(t, style, bold) { return '<w:p>' + (style ? '<w:pPr><w:pStyle w:val="' + style + '"/></w:pPr>' : '') + String(t == null ? '' : t).split('\n').map(function (line, i) { return (i ? '<w:r><w:br/></w:r>' : '') + run(line, bold); }).join('') + '</w:p>'; }
  var b = '<w:tblBorders>' + ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(function (s) { return '<w:' + s + ' w:val="single" w:sz="4" w:space="0" w:color="B8C2D1"/>'; }).join('') + '</w:tblBorders>';
  var body = blocks.map(function (bl) {
    if (bl.type === 'title') return para(bl.text, 'Title');
    if (bl.type === 'h1') return para(bl.text, 'Heading1');
    if (bl.type === 'h2') return para(bl.text, 'Heading2');
    if (bl.type === 'p') return para(bl.text, null, bl.bold);
    if (bl.type === 'table') {
      var total = 9600, w = bl.widths || bl.rows[0].map(function () { return 1; });
      var sum = w.reduce(function (s, x) { return s + x; }, 0);
      var tw = w.map(function (x) { return Math.round(x / sum * total); });
      return '<w:tbl><w:tblPr><w:tblW w:w="' + total + '" w:type="dxa"/>' + b + '<w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' +
        tw.map(function (x) { return '<w:gridCol w:w="' + x + '"/>'; }).join('') + '</w:tblGrid>' +
        bl.rows.map(function (r, ri) {
          return '<w:tr>' + (ri === 0 ? '<w:trPr><w:tblHeader/></w:trPr>' : '') + r.map(function (c, ci) {
            return '<w:tc><w:tcPr><w:tcW w:w="' + tw[ci] + '" w:type="dxa"/>' + (ri === 0 ? '<w:shd w:val="clear" w:color="auto" w:fill="E8EEF8"/>' : '') + '</w:tcPr>' + para(c == null ? '' : c, 'TableText', ri === 0) + '</w:tc>';
          }).join('') + '</w:tr>';
        }).join('') + '</w:tbl>' + para('');
    }
    return '';
  }).join('');
  var files = [
    { name: '[Content_Types].xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>' },
    { name: '_rels/.rels', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>' },
    { name: 'word/_rels/document.xml.rels', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
    { name: 'word/styles.xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Mangal" w:eastAsia="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
      '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="200"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3B63"/><w:sz w:val="36"/></w:rPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1F3B63"/><w:sz w:val="28"/></w:rPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style>' +
      '<w:style w:type="paragraph" w:styleId="TableText"><w:name w:val="Table Text"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="20"/></w:rPr></w:style></w:styles>' },
    { name: 'word/document.xml', text: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>' }
  ];
  return ZIP(files);
}

function downloadBlob(blob, filename, type) {
  var b = type ? new Blob([blob], { type: type }) : blob;
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

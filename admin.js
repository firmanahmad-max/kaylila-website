// ===== admin.js — dashboard admin sederhana (client-side) =====
// CATATAN KEAMANAN: Ini proteksi kata sandi sisi-klien (bukan enkripsi sungguhan).
// Cukup untuk mencegah orang iseng, TIDAK untuk data sangat rahasia.
// Ganti ADMIN_PASSWORD di bawah ini sesuai keinginan.
const ADMIN_PASSWORD = "lila2026";

function tryLogin(){
  const val = document.getElementById('pwInput').value;
  if (val === ADMIN_PASSWORD) {
    sessionStorage.setItem('lila_admin_ok', '1');
    document.getElementById('loginGate').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAll();
  } else {
    document.getElementById('pwError').style.display = 'block';
  }
}
if (sessionStorage.getItem('lila_admin_ok') === '1') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginGate').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    renderAll();
  });
}

// Working copy of data
let WORK = JSON.parse(JSON.stringify(window.SITE_DATA || {}));

const SCHEMAS = {
  education: { listId: 'educationList', fields: [
    {key:'level', label:'Jenjang (SD/SMP/SMA)', type:'text'},
    {key:'institution', label:'Nama Sekolah', type:'text'},
    {key:'period', label:'Periode', type:'text'},
    {key:'note', label:'Keterangan', type:'textarea'}
  ]},
  organizations: { listId:'orgList', fields:[
    {key:'title', label:'Judul Kegiatan/Jabatan', type:'text'},
    {key:'org', label:'Organisasi/Penyelenggara', type:'text'},
    {key:'period', label:'Periode', type:'text'},
    {key:'desc', label:'Deskripsi', type:'textarea'}
  ]},
  achievements: { listId:'achList', fields:[
    {key:'title', label:'Nama Prestasi', type:'text'},
    {key:'event', label:'Ajang/Penyelenggara', type:'text'},
    {key:'year', label:'Tahun', type:'text'}
  ]},
  writings: { listId:'writeList', fields:[
    {key:'title', label:'Judul', type:'text'},
    {key:'type', label:'Jenis (mis. Cerpen / Karya Tulis Ilmiah)', type:'text'},
    {key:'desc', label:'Ringkasan/Isi', type:'textarea'}
  ]},
  books: { listId:'bookList', fields:[
    {key:'title', label:'Kategori/Judul', type:'text'},
    {key:'desc', label:'Deskripsi', type:'textarea'}
  ]}
};

function renderAll(){
  Object.keys(SCHEMAS).forEach(renderSection);
  renderProfile();
}

function renderSection(key){
  const schema = SCHEMAS[key];
  const wrap = document.getElementById(schema.listId);
  wrap.innerHTML = "";
  (WORK[key] || []).forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    let fieldsHtml = "";
    schema.fields.forEach(f => {
      const val = (item[f.key] || "").toString().replace(/"/g,'&quot;');
      if (f.type === 'textarea') {
        fieldsHtml += `<label>${f.label}</label><textarea onchange="updateField('${key}',${idx},'${f.key}',this.value)">${val}</textarea>`;
      } else {
        fieldsHtml += `<label>${f.label}</label><input type="text" value="${val}" onchange="updateField('${key}',${idx},'${f.key}',this.value)">`;
      }
    });
    card.innerHTML = fieldsHtml + `<div class="entry-actions"><button class="btn-sm btn-del" onclick="removeEntry('${key}',${idx})">Hapus</button></div>`;
    wrap.appendChild(card);
  });
}

function updateField(key, idx, field, value){
  WORK[key][idx][field] = value;
}

function addEntry(key){
  const schema = SCHEMAS[key];
  const blank = {};
  schema.fields.forEach(f => blank[f.key] = "");
  if (!WORK[key]) WORK[key] = [];
  WORK[key].push(blank);
  renderSection(key);
}

function removeEntry(key, idx){
  if (!confirm("Hapus data ini?")) return;
  WORK[key].splice(idx,1);
  renderSection(key);
}

// ---- Profile ----
const PROFILE_FIELDS = [
  {key:'name', label:'Nama Lengkap', type:'text'},
  {key:'nickname', label:'Nama Panggilan', type:'text'},
  {key:'tagline', label:'Tagline', type:'text'},
  {key:'school', label:'Sekolah Saat Ini', type:'text'},
  {key:'grade', label:'Kelas', type:'text'},
  {key:'targetCampus', label:'Target Kampus (pisahkan dengan koma)', type:'text', isList:true},
  {key:'photo', label:'Path/URL Foto (kosongkan untuk placeholder)', type:'text'},
  {key:'intro', label:'Paragraf Perkenalan', type:'textarea'},
  {key:'about', label:'Paragraf Tentang Saya', type:'textarea'},
  {key:'email', label:'Email Kontak', type:'text'},
  {key:'instagram', label:'Instagram (opsional, tanpa @)', type:'text'}
];

function renderProfile(){
  const wrap = document.getElementById('profileFields');
  wrap.innerHTML = "";
  if (!WORK.profile) WORK.profile = {};
  PROFILE_FIELDS.forEach(f => {
    let val = WORK.profile[f.key];
    if (f.isList) val = (val || []).join(", ");
    val = (val || "").toString().replace(/"/g,'&quot;');
    if (f.type === 'textarea') {
      wrap.insertAdjacentHTML('beforeend', `<label>${f.label}</label><textarea onchange="updateProfile('${f.key}',this.value,${!!f.isList})">${val}</textarea>`);
    } else {
      wrap.insertAdjacentHTML('beforeend', `<label>${f.label}</label><input type="text" value="${val}" onchange="updateProfile('${f.key}',this.value,${!!f.isList})">`);
    }
  });
}

function updateProfile(key, value, isList){
  WORK.profile[key] = isList ? value.split(',').map(s=>s.trim()).filter(Boolean) : value;
}

// ---- Export ----
function exportData(){
  const json = JSON.stringify(WORK, null, 2);
  const content = `// ============================================================\n// DATA KONTEN WEBSITE PORTOFOLIO — diekspor dari dashboard admin\n// ============================================================\nwindow.SITE_DATA = ${json};\n`;
  const blob = new Blob([content], {type:'text/javascript'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  a.click();
  URL.revokeObjectURL(url);
  alert('File data.js berhasil diunduh. Ganti file data.js lama di folder website dengan file ini, lalu upload ulang ke hosting.');
}

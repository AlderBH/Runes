/* ==========================
   Rune Decoder — script.js
   Complete rewrite: modular, ES6 style, built-in Base64 default decoder,
   preserved original features (preview, output, drag/drop, export, modal).
   ========================== */

const STORAGE_KEY = 'rune_decoder_v1';
const LABELS_KEY = 'rune_show_output_labels';

/* --------------------------
   Built-in default decoder (base64-encoded JSON)
   - Decoded and persisted to localStorage on first run if no stored decoder.
*/
const DEFAULT_DECODER_BASE64 = "JTdCJTIyMTAwMTEwMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIySiUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJqb2tlJTIyJTdEJTJDJTIyMTAwMTExMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyS0glMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIycnVha2glMjIlN0QlMkMlMjIxMDAxMTExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJVSCUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJidWclMjIlN0QlMkMlMjIxMDEwMDEwMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJFRSUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJiZWUlMjIlN0QlMkMlMjIxMDEwMDExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJJRSUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJndXklMjIlN0QlMkMlMjIxMDExMDAxMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJQJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMnB1biUyMiU3RCUyQyUyMjEwMTEwMTAwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMk4lMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIybmV3JTIyJTdEJTJDJTIyMTAxMTAxMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyQiUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJidWclMjIlN0QlMkMlMjIxMDExMDExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJFSCUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJlbmQlMjIlN0QlMkMlMjIxMDExMTExMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJXJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMndvbiUyMiU3RCUyQyUyMjEwMTExMTExJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyTk9SRSUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJ5b3VyJTIyJTdEJTJDJTIyMTEwMDAwMDElMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyQVklMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIybWF5JTIyJTdEJTJDJTIyMTEwMDEwMDElMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyT1clMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyaG93JTIyJTdEJTJDJTIyMTEwMDExMTElMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIySUUlMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyYml0ZSUyMiU3RCUyQyUyMjExMDEwMDAwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMk0lMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIybWVuJTIyJTdEJTJDJTIyMTEwMTAwMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyU0glMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyc2hvZSUyMiU3RCUyQyUyMjExMDEwMTAwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMlMlMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyc3VuJTIyJTdEJTJDJTIyMTEwMTAxMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIySCUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJoaSUyMiU3RCUyQyUyMjExMDExMDAwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyQlRIJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMm1vdGglMjIlN0QlMkMlMjIxMTAxMTAxMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJMJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMmxvdyUyMiU3RCUyQyUyMjExMDExMDExJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMkxMJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMkh1bGwlMjIlN0QlMkMlMjIxMTAxMTExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJBUiUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJhcm0lMjIlN0QlMkMlMjIxMTEwMDAwMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJPSSUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJ0b3klMjIlN0QlMkMlMjIxMTEwMDEwMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJFUkUlMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyYWlyJTIyJTdEJTJDJTIyMTExMDAxMTElMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIySUUlMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIySGlnaCUyMiU3RCUyQyUyMjExMTAxMDAxJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMk9PJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMm1vbyUyMiU3RCUyQyUyMjExMTEwMDAwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyTlQlMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIydG9wJTIyJTdEJTJDJTIyMTExMTAxMDAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyRiUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJmdW4lMjIlN0QlMkMlMjIxMTExMDExMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJZJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMnllcyUyMiU3RCUyQyUyMjExMTEwMTExJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMkFIJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMmdsYXNzJTIyJTdEJTJDJTIyMTExMTEwMDAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyVEglMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIydGhhbmtzJTIyJTdEJTJDJTIyMTExMTEwMTElMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyQSUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJhbmQlMjIlN0QlMkMlMjIwMDAwMDExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJPJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMnRvZSUyMiU3RCUyQyUyMjAxMTEwMTEwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMkslMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyY2F0JTIyJTdEJTJDJTIyMDEwMTExMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyRCUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJkb2clMjIlN0QlMkMlMjIwMTExMDEwMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJHJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMmdvJTIyJTdEJTJDJTIyMDEwMTExMDAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyUiUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJyb3clMjIlN0QlMkMlMjIwMTExMTExMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJWJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMnZhbiUyMiU3RCUyQyUyMjAwMDEwMTEwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMlolMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyemlwJTIyJTdEJTJDJTIyMDAxMTExMTAlMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyQ0glMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyY2hpcCUyMiU3RCUyQyUyMjAxMDExMDEwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyTkclMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyd2luZyUyMiU3RCUyQyUyMjAxMTEwMTEyJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyT1UlMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIyd29sZiUyMiU3RCUyQyUyMjAwMTEwMTEwJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyRUglMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIydGhlJTIyJTdEJTJDJTIyMDEwMDEwMTElMjIlM0ElN0IlMjJwaG9uZW1lJTIyJTNBJTIyRUVSJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMmZlYXIlMjIlN0QlMkMlMjIwMDEwMTExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJFVyUyMiUyQyUyMmV4YW1wbGUlMjIlM0ElMjJmZXclMjIlN0QlMkMlMjIwMDAxMTExMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJJJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMmJpdCUyMiU3RCUyQyUyMjAwMTEwMTExJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMklSJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMmJpcmQlMjIlN0QlMkMlMjIwMTAxMTAxMSUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJJTkclMjIlMkMlMjJleGFtcGxlJTIyJTNBJTIycmluZyUyMiU3RCUyQyUyMjAxMDExMTExJTIyJTNBJTdCJTIycGhvbmVtZSUyMiUzQSUyMkFIJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMnN3YW4lMjIlN0QlMkMlMjIwMTAxMDEwMCUyMiUzQSU3QiUyMnBob25lbWUlMjIlM0ElMjJYJTIyJTJDJTIyZXhhbXBsZSUyMiUzQSUyMm1peCUyMiU3RCU3RA==";

function decodeBase64ToObject(b64) {
  try {
    // atob returns a binary string; decodeURIComponent handles UTF-8 percent-encoding
    const jsonStr = decodeURIComponent(atob(b64));
    const obj = JSON.parse(jsonStr);
    if (obj && typeof obj === 'object') return obj;
  } catch (e) {
    // decoding failed
  }
  return null;
}

/* --------------------------
   App state
*/
const mapping = {
  '1':'lineBL','2':'vowel','3':'lineBR','4':'lineL','5':'lineM','6':'lineR','7':'lineTL','8':null,'9':'lineTR',
  '0':'space','.':'period','+':'clear','-':'editLast','*':'comma'
};

const state = {
  lineTL:false,lineTR:false,lineL:false,lineM:false,lineR:false,lineBL:false,lineBR:false,vowel:false
};

const selectionOrder = [];
const output = []; // array of items: { type:'rune'|'space'|'punct', state?, punct?, code?, index?, dom? }
let editingIndex = null;
let selectedOutputIndex = null;

/* --------------------------
   Visual constants
*/
const coords = {
  leftX:30,leftTopY:36,leftBottomY:200,
  rightX:106,rightTopY:36,rightBottomY:200,
  midX:68,topY:12,midBottomY:160
};
const STROKE_WIDTH = 10;
const STROKE_ON = '#111';
const STROKE_OFF = '#eee';
const LIGHT_LINE = '#e9e9ea';
const VOWEL_RADIUS = 14;
const VOWEL_STROKE = STROKE_WIDTH;
const DIAMOND_SIZE = 26;
const DIAMOND_FILLED_STROKE = 2;
const DIAMOND_EMPTY_STROKE = 5;
const DIAMOND_DOT_GAP = 28;
const DIAMOND_DOT_RADIUS = 10;

/* --------------------------
   DOM helpers (create SVG primitives)
*/
function createSVG(w=60,h=86){
  const ns='http://www.w3.org/2000/svg';
  const s=document.createElementNS(ns,'svg');
  s.setAttribute('width',w);
  s.setAttribute('height',h);
  s.setAttribute('viewBox','0 0 136 240');
  return s;
}
function makeLineExact(x1,y1,x2,y2,color,width=STROKE_WIDTH){
  const ns='http://www.w3.org/2000/svg';
  const p=document.createElementNS(ns,'path');
  p.setAttribute('d',`M ${x1} ${y1} L ${x2} ${y2}`);
  p.setAttribute('fill','none');
  p.setAttribute('stroke',color);
  p.setAttribute('stroke-width',width);
  p.setAttribute('stroke-linecap','butt');
  p.setAttribute('stroke-linejoin','miter');
  p.classList.add('clickable');
  p.style.cursor='pointer';
  return p;
}
function makeDiamond(cx,cy,s,filled=true,strokeColor=STROKE_ON,fillColor=STROKE_ON,strokeWidth=1.5){
  const ns='http://www.w3.org/2000/svg';
  const points=[[cx,cy-s],[cx+s,cy],[cx,cy+s],[cx-s,cy]].map(p=>p.join(',')).join(' ');
  const poly=document.createElementNS(ns,'polygon');
  poly.setAttribute('points',points);
  poly.setAttribute('stroke',strokeColor);
  poly.setAttribute('stroke-width',strokeWidth);
  poly.setAttribute('stroke-linejoin','round');
  poly.setAttribute('fill', filled?fillColor:'none');
  return poly;
}
function makeDot(cx,cy,r,fillColor='#000'){
  const ns='http://www.w3.org/2000/svg';
  const c=document.createElementNS(ns,'circle');
  c.setAttribute('cx',cx);
  c.setAttribute('cy',cy);
  c.setAttribute('r',r);
  c.setAttribute('fill', fillColor);
  return c;
}

/* --------------------------
   Selection helpers
*/
function pushSelection(name){
  const i = selectionOrder.indexOf(name);
  if (i !== -1) selectionOrder.splice(i,1);
  selectionOrder.push(name);
}
function removeSelection(name){
  const i = selectionOrder.indexOf(name);
  if (i !== -1) selectionOrder.splice(i,1);
}

/* --------------------------
   Decoder initialization
*/
let decoder = (function(){
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    const builtIn = decodeBase64ToObject(DEFAULT_DECODER_BASE64);
    if (builtIn) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(builtIn)); } catch(e){}
      return builtIn;
    }
  } catch(e){}
  return {};
})();

/* --------------------------
   Rune code helpers
*/
function currentRuneCodeFromState(s){
  return [s.lineTL,s.lineTR,s.lineL,s.lineM,s.lineR,s.lineBL,s.lineBR,s.vowel].map(b=>b?'1':'0').join('');
}
function runeStateFromCode(code){
  return {
    lineTL: code[0]==='1',
    lineTR: code[1]==='1',
    lineL:  code[2]==='1',
    lineM:  code[3]==='1',
    lineR:  code[4]==='1',
    lineBL: code[5]==='1',
    lineBR: code[6]==='1',
    vowel:  code[7]==='1'
  };
}

/* --------------------------
   Preview rendering
*/
function toggleLine(name){
  if (name === 'vowel') {
    state.vowel = !state.vowel;
    state.vowel ? pushSelection('vowel') : removeSelection('vowel');
  } else {
    state[name] = !state[name];
    state[name] ? pushSelection(name) : removeSelection(name);
  }
  renderPreview();
}

function createSegmentElement(name, on){
  const color = on ? STROKE_ON : STROKE_OFF;
  let el;
  switch(name){
    case 'lineTL': el = makeLineExact(coords.leftX, coords.leftTopY, coords.midX, coords.topY, color); break;
    case 'lineTR': el = makeLineExact(coords.rightX, coords.rightTopY, coords.midX, coords.topY, color); break;
    case 'lineL':  el = makeLineExact(coords.leftX, coords.leftTopY, coords.leftX, coords.leftBottomY, color); break;
    case 'lineM':  el = makeLineExact(coords.midX, coords.topY, coords.midX, coords.midBottomY, color); break;
    case 'lineR':  el = makeLineExact(coords.rightX, coords.rightTopY, coords.rightX, coords.rightBottomY, color); break;
    case 'lineBL': el = makeLineExact(coords.leftX, coords.leftBottomY, coords.midX, coords.midBottomY, color); break;
    case 'lineBR': el = makeLineExact(coords.rightX, coords.rightBottomY, coords.midX, coords.midBottomY, color); break;
    default: el = document.createElementNS('http://www.w3.org/2000/svg','path'); break;
  }
  el.addEventListener('click', (e)=>{ e.stopPropagation(); toggleLine(name); });
  return el;
}

function updatePreviewPhoneme(){
  const code = currentRuneCodeFromState(state);
  const entry = decoder[code];
  const phonemeEl = document.getElementById('previewPhonemeText');
  const exampleEl = document.getElementById('previewExampleText');
  if (entry && entry.phoneme) {
    phonemeEl.textContent = entry.phoneme;
    exampleEl.textContent = entry.example ? ('as in ' + entry.example) : '';
    phonemeEl.style.color = 'var(--ink)';
    exampleEl.style.color = '#666';
  } else {
    phonemeEl.textContent = 'No mapping for current rune';
    exampleEl.textContent = '';
    phonemeEl.style.color = 'var(--muted)';
    exampleEl.style.color = '#999';
  }
}

function renderPreview(){
  const inline = document.getElementById('inputDecoderInline');
  if (inline && inline.classList.contains('active')) return;

  const area = document.getElementById('canvasArea');
  area.innerHTML = '';
  const svg = createSVG(140,220);

  const all = ['lineTL','lineTR','lineL','lineM','lineR','lineBL','lineBR'];
  all.forEach(n => { if (!state[n]) svg.appendChild(createSegmentElement(n,false)); });
  selectionOrder.forEach(n => { if (state[n]) svg.appendChild(createSegmentElement(n,true)); });
  all.forEach(n => { if (state[n] && selectionOrder.indexOf(n) === -1) svg.appendChild(createSegmentElement(n,true)); });

  const rawCenter = Math.round((coords.leftTopY + coords.leftBottomY)/2);
  const centerCy = rawCenter - 6;
  const belowCy = coords.midBottomY + 48;
  const cy = state.lineM ? belowCy : centerCy;

  const svgNS='http://www.w3.org/2000/svg';
  const circle = document.createElementNS(svgNS,'circle');
  circle.setAttribute('cx', coords.midX);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', VOWEL_RADIUS);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', state.vowel ? STROKE_ON : LIGHT_LINE);
  circle.setAttribute('stroke-width', VOWEL_STROKE);
  circle.classList.add('clickable');
  circle.style.cursor = 'pointer';
  circle.addEventListener('click', (e)=>{ e.stopPropagation(); toggleLine('vowel'); });
  svg.appendChild(circle);

  area.appendChild(svg);
  updatePreviewPhoneme();
}

/* --------------------------
   Output rendering & drag/drop
*/
function renderOutputArea(){
  const out = document.getElementById('outputArea');
  out.innerHTML = '';
  for (let i=0;i<output.length;i++){
    output[i].index = i;
    const slot = createOutputSlot(output[i]);
    output[i].dom = slot;
    out.appendChild(slot);
  }

  out.addEventListener('dragover', (e)=>{ e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
  out.addEventListener('drop', (e)=>{ 
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    const src = parseInt(data,10);
    if (isNaN(src)) return;
    moveOutputItem(src, output.length-1, true);
  });
}

function createOutputSlot(item){
  const wrapper = document.createElement('div');
  wrapper.className = 'slot';
  wrapper.setAttribute('draggable','true');
  wrapper.dataset.type = item.type || 'rune';
  wrapper.dataset.index = (typeof item.index === 'number') ? item.index : output.indexOf(item);

  // drag handlers
  wrapper.addEventListener('dragstart', (ev)=>{
    ev.stopPropagation();
    const idx = wrapper.dataset.index;
    ev.dataTransfer.setData('text/plain', String(idx));
    ev.dataTransfer.effectAllowed = 'move';
    wrapper.classList.add('dragging');
  });
  wrapper.addEventListener('dragend', (ev)=>{
    ev.stopPropagation();
    wrapper.classList.remove('dragging');
    document.querySelectorAll('.slot.drag-over').forEach(n=>n.classList.remove('drag-over'));
  });
  wrapper.addEventListener('dragover', (ev)=>{
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.slot.drag-over').forEach(n=>{ if(n!==wrapper) n.classList.remove('drag-over'); });
    wrapper.classList.add('drag-over');
  });
  wrapper.addEventListener('dragleave', ()=> wrapper.classList.remove('drag-over'));
  wrapper.addEventListener('drop', (ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    wrapper.classList.remove('drag-over');
    const data = ev.dataTransfer.getData('text/plain');
    if(!data) return;
    const src = parseInt(data,10);
    const dst = parseInt(wrapper.dataset.index,10);
    if(isNaN(src) || isNaN(dst)) return;
    moveOutputItem(src, dst, false);
  });

  // space
  if (item.type === 'space') {
    const svg = createSVG(60,104);
    const ns='http://www.w3.org/2000/svg';
    const rect = document.createElementNS(ns,'rect');
    rect.setAttribute('x',36); rect.setAttribute('y',76); rect.setAttribute('width',30); rect.setAttribute('height',6);
    rect.setAttribute('fill',LIGHT_LINE); rect.setAttribute('rx',3);
    svg.appendChild(rect);
    wrapper.appendChild(svg);
    const lab = document.createElement('div'); lab.className='label empty'; lab.textContent=''; 
    const ex = document.createElement('div'); ex.className='example empty'; ex.textContent='';
    wrapper.appendChild(lab); wrapper.appendChild(ex);
    wrapper.dataset.type='space';
    wrapper.addEventListener('click', (ev)=>{ ev.stopPropagation(); selectOutputSlot(item.index); });
    return wrapper;
  }

  // punctuation
  if (item.type === 'punct') {
    const svg = createSVG(60,104);
    const cx = 68;
    const cy = 110;
    if (item.punct === 'period') svg.appendChild(makeDiamond(cx, cy, DIAMOND_SIZE, true, STROKE_ON, STROKE_ON, DIAMOND_FILLED_STROKE));
    else if (item.punct === 'comma') svg.appendChild(makeDiamond(cx, cy, DIAMOND_SIZE, false, STROKE_ON, 'none', DIAMOND_EMPTY_STROKE));
    else if (item.punct === 'period_dot') { svg.appendChild(makeDiamond(cx, cy, DIAMOND_SIZE, true, STROKE_ON, STROKE_ON, DIAMOND_FILLED_STROKE)); svg.appendChild(makeDot(cx, cy + DIAMOND_SIZE + DIAMOND_DOT_GAP, DIAMOND_DOT_RADIUS, '#000')); }
    else if (item.punct === 'comma_dot') { svg.appendChild(makeDiamond(cx, cy, DIAMOND_SIZE, false, STROKE_ON, 'none', DIAMOND_EMPTY_STROKE)); svg.appendChild(makeDot(cx, cy + DIAMOND_SIZE + DIAMOND_DOT_GAP, DIAMOND_DOT_RADIUS, '#000')); }
    wrapper.appendChild(svg);
    const lab = document.createElement('div'); lab.className='label empty'; lab.textContent=''; 
    const ex = document.createElement('div'); ex.className='example empty'; ex.textContent='';
    wrapper.appendChild(lab); wrapper.appendChild(ex);
    wrapper.dataset.type='punct';
    wrapper.addEventListener('click', (ev)=>{ ev.stopPropagation(); selectOutputSlot(item.index); });
    return wrapper;
  }

  // rune
  const s = item.state;
  const svg = createSVG(60,104);
  const order = ['lineTL','lineTR','lineL','lineM','lineR','lineBL','lineBR'];
  order.forEach(name => {
    if (!s[name]) return;
    switch(name){
      case 'lineTL': svg.appendChild(makeLineExact(coords.leftX,coords.leftTopY,coords.midX,coords.topY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineTR': svg.appendChild(makeLineExact(coords.rightX,coords.rightTopY,coords.midX,coords.topY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineL':  svg.appendChild(makeLineExact(coords.leftX,coords.leftTopY,coords.leftX,coords.leftBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineM':  svg.appendChild(makeLineExact(coords.midX,coords.topY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineR':  svg.appendChild(makeLineExact(coords.rightX,coords.rightTopY,coords.rightX,coords.rightBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineBL': svg.appendChild(makeLineExact(coords.leftX,coords.leftBottomY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineBR': svg.appendChild(makeLineExact(coords.rightX,coords.rightBottomY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
    }
  });

  if (s.vowel) {
    const rawCenter = Math.round((coords.leftTopY + coords.leftBottomY)/2);
    const centerCy = rawCenter - 6;
    const belowCy = coords.midBottomY + 48;
    const cy = s.lineM ? belowCy : centerCy;
    const svgNS='http://www.w3.org/2000/svg';
    const circle = document.createElementNS(svgNS,'circle');
    circle.setAttribute('cx', coords.midX);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', VOWEL_RADIUS);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', STROKE_ON);
    circle.setAttribute('stroke-width', VOWEL_STROKE);
    svg.appendChild(circle);
  }

  wrapper.appendChild(svg);

  const code = item.code || currentRuneCodeFromState(item.state);
  const entry = decoder[code];
  const lab = document.createElement('div'); lab.className='label';
  const ex = document.createElement('div'); ex.className='example';
  if (entry) {
    lab.textContent = entry.phoneme;
    ex.textContent = entry.example ? ('as in ' + entry.example) : '';
  } else {
    lab.textContent = '';
    lab.classList.add('empty');
    ex.textContent = '';
    ex.classList.add('empty');
  }

  wrapper.appendChild(lab);
  wrapper.appendChild(ex);

  wrapper.dataset.type='rune';
  wrapper.addEventListener('click', (ev)=>{
    ev.stopPropagation();
    if (ev.detail === 1) { selectOutputSlot(item.index); return; }
    if (ev.detail === 2) { startEditing(item.index); return; }
    if (ev.detail === 3) { assignDecoderForIndex(item.index); return; }
  });

  return wrapper;
}

/* --------------------------
   Output management
*/
function appendOutputItem(item){
  item.index = output.length;
  if (item.type === 'rune') item.code = currentRuneCodeFromState(item.state);
  output.push(item);
  renderOutputArea();
}
function replaceOutputItem(index, newItem){
  if (!output[index]) return;
  newItem.index = index;
  if (newItem.type === 'rune') newItem.code = currentRuneCodeFromState(newItem.state);
  output[index] = newItem;
  renderOutputArea();
}
function removeOutputItem(index){
  if (!output[index]) return;
  output.splice(index,1);
  for (let i=0;i<output.length;i++) output[i].index = i;
  selectedOutputIndex = null;
  editingIndex = null;
  renderOutputArea();
}
function selectOutputSlot(index){
  if (editingIndex !== null && output[editingIndex] && output[editingIndex].dom) output[editingIndex].dom.classList.remove('editing');
  editingIndex = null;
  if (selectedOutputIndex !== null && output[selectedOutputIndex] && output[selectedOutputIndex].dom) output[selectedOutputIndex].dom.classList.remove('selected');
  selectedOutputIndex = index;
  if (output[index] && output[index].dom) output[index].dom.classList.add('selected');
}

/* Move item helper */
function moveOutputItem(srcIndex, dstIndex, dropOnEmpty){
  if (srcIndex === dstIndex) return;
  if (srcIndex < 0 || srcIndex >= output.length) return;
  if (dstIndex < 0) dstIndex = 0;
  if (dstIndex >= output.length) dstIndex = output.length - 1;
  const [item] = output.splice(srcIndex,1);
  let insertAt = dstIndex;
  if (dropOnEmpty) {
    output.push(item);
  } else {
    output.splice(insertAt, 0, item);
  }
  for (let i=0;i<output.length;i++) output[i].index = i;

  // adjust selection/editing indices
  if (selectedOutputIndex === srcIndex) selectedOutputIndex = output.indexOf(item);
  else if (selectedOutputIndex !== null) {
    if (srcIndex < selectedOutputIndex && dstIndex >= selectedOutputIndex) selectedOutputIndex--;
    else if (srcIndex > selectedOutputIndex && dstIndex <= selectedOutputIndex) selectedOutputIndex++;
  }
  if (editingIndex === srcIndex) editingIndex = output.indexOf(item);
  else if (editingIndex !== null) {
    if (srcIndex < editingIndex && dstIndex >= editingIndex) editingIndex--;
    else if (srcIndex > editingIndex && dstIndex <= editingIndex) editingIndex++;
  }

  renderOutputArea();
}

/* --------------------------
   Commit / edit / assign decoder
*/
function commitRune(){
  const anySelected = Object.values(state).some(v => v === true);
  if (!anySelected && editingIndex === null) return;

  const stored = {
    lineTL: !!state.lineTL,
    lineTR: !!state.lineTR,
    lineL:  !!state.lineL,
    lineM:  !!state.lineM,
    lineR:  !!state.lineR,
    lineBL: !!state.lineBL,
    lineBR: !!state.lineBR,
    vowel:  !!state.vowel
  };

  if (editingIndex !== null) {
    replaceOutputItem(editingIndex, { type: 'rune', state: stored });
    if (output[editingIndex] && output[editingIndex].dom) output[editingIndex].dom.classList.remove('editing');
    editingIndex = null;
  } else {
    appendOutputItem({ type: 'rune', state: stored });
  }

  // reset input state
  for (const k in state) state[k] = false;
  selectionOrder.length = 0;
  selectedOutputIndex = null;
  editingIndex = null;
  renderPreview();
}

function startEditing(index){
  if (!output[index]) return;
  if (output[index].type !== 'rune') { selectOutputSlot(index); return; }
  const s = output[index].state;
  for (const k in state) state[k] = !!s[k];
  selectionOrder.length = 0;
  ['lineTL','lineTR','lineL','lineM','lineR','lineBL','lineBR'].forEach(n => { if (state[n]) selectionOrder.push(n); });
  if (editingIndex !== null && output[editingIndex] && output[editingIndex].dom) output[editingIndex].dom.classList.remove('editing');
  editingIndex = index;
  if (output[index].dom) output[index].dom.classList.add('editing');
  if (selectedOutputIndex !== null && output[selectedOutputIndex] && output[selectedOutputIndex].dom) output[selectedOutputIndex].dom.classList.remove('selected');
  selectedOutputIndex = null;
  renderPreview();
}

function assignDecoderForIndex(index){
  if (!output[index] || output[index].type !== 'rune') return;
  const code = output[index].code || currentRuneCodeFromState(output[index].state);
  const current = decoder[code];
  const currentText = current ? `${current.phoneme}|${current.example}` : '';
  const input = prompt('Assign phoneme and example for this rune (format: PHONEME|example). Example: B|bug', currentText);
  if (!input) return;
  const parts = input.split('|').map(s=>s.trim());
  if (parts.length === 0 || parts[0] === '') return;
  const phoneme = parts[0];
  const example = parts[1] || '';
  decoder[code] = { phoneme, example };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(decoder)); } catch(e){}
  replaceOutputItem(index, { type:'rune', state: output[index].state });
}

/* --------------------------
   Keyboard & UI wiring
*/
window.addEventListener('keydown', (ev)=>{
  let key = ev.key;
  if (ev.code && ev.code.startsWith('Numpad')) {
    const num = ev.code.replace('Numpad','');
    if (num === 'Decimal') key = '.';
    else if (num === 'Add') key = '+';
    else if (num === 'Subtract') key = '-';
    else if (num === 'Multiply') key = '*';
    else key = num;
  }

  if (selectedOutputIndex !== null && (key === 'Delete' || key === 'Backspace' || key === '-')) {
    ev.preventDefault();
    removeOutputItem(selectedOutputIndex);
    selectedOutputIndex = null;
    return;
  }

  if (key === ' ') {
    ev.preventDefault();
    appendOutputItem({ type:'space' });
    return;
  }

  if (mapping.hasOwnProperty(key) || key === 'Enter') {
    ev.preventDefault();

    if (key === '-' && selectedOutputIndex === null) {
      for (let i = output.length - 1; i >= 0; i--) {
        if (output[i].type === 'rune') { startEditing(i); return; }
      }
      return;
    }

    if (key === 'Enter') { commitRune(); return; }
    if (key === '0') { appendOutputItem({ type:'space' }); return; }
    if (key === '.') { appendOutputItem({ type:'punct', punct:'period' }); return; }
    if (key === '*') { appendOutputItem({ type:'punct', punct:'comma' }); return; }
    if (key === '+') { for (const k in state) state[k] = false; selectionOrder.length = 0; renderPreview(); return; }

    const map = mapping[key];
    if (!map) return;
    if (map === 'vowel') {
      state.vowel = !state.vowel;
      state.vowel ? pushSelection('vowel') : removeSelection('vowel');
      renderPreview();
      return;
    }
    if (['lineTL','lineTR','lineL','lineM','lineR','lineBL','lineBR'].includes(map)) {
      state[map] = !state[map];
      state[map] ? pushSelection(map) : removeSelection(map);
      renderPreview();
    }
  }
});

/* --------------------------
   Buttons & controls
*/
document.getElementById('spaceBtn').addEventListener('click', ()=> appendOutputItem({ type:'space' }));
document.getElementById('diamondEmptyBtn').addEventListener('click', ()=> appendOutputItem({ type:'punct', punct:'comma' }));
document.getElementById('diamondFilledBtn').addEventListener('click', ()=> appendOutputItem({ type:'punct', punct:'period' }));
document.getElementById('diamondEmptyDotBtn').addEventListener('click', ()=> appendOutputItem({ type:'punct', punct:'comma_dot' }));
document.getElementById('diamondFilledDotBtn').addEventListener('click', ()=> appendOutputItem({ type:'punct', punct:'period_dot' }));
document.getElementById('clearOutputBtn').addEventListener('click', ()=>{
  if (!confirm('Clear all output symbols?')) return;
  output.length = 0;
  selectedOutputIndex = null;
  renderOutputArea();
});
document.getElementById('deleteSelectedBtn').addEventListener('click', ()=>{ if (selectedOutputIndex !== null) removeOutputItem(selectedOutputIndex); selectedOutputIndex = null; });

/* Toggle labels visibility */
let showOutputLabels = true;
function setOutputLabelsVisible(visible){
  showOutputLabels = !!visible;
  const out = document.getElementById('outputArea');
  if (!out) return;
  if (!showOutputLabels) out.classList.add('labels-hidden'); else out.classList.remove('labels-hidden');
  const btn = document.getElementById('toggleOutputLabelsBtn');
  if (btn) btn.textContent = showOutputLabels ? 'Hide labels' : 'Show labels';
  try { localStorage.setItem(LABELS_KEY, showOutputLabels ? '1' : '0'); } catch(e){}
}
document.getElementById('toggleOutputLabelsBtn').addEventListener('click', ()=> setOutputLabelsVisible(!showOutputLabels));

/* Decoder export/import */
function updateStatus(msg){ const el = document.getElementById('decoderStatus'); if (el) el.textContent = msg; }

document.getElementById('generateCodeBtn').addEventListener('click', ()=>{
  try {
    const code = btoa(encodeURIComponent(JSON.stringify(decoder)));
    document.getElementById('decoderCodeBox').value = code;
    updateStatus('Code generated.');
  } catch(e) { updateStatus('Export failed.'); }
});

document.getElementById('loadCodeBtn').addEventListener('click', ()=>{
  const code = (document.getElementById('decoderCodeBox').value || '').trim();
  if (!code) { updateStatus('Paste a code into the box first.'); return;
  }
  try {
    const json = decodeURIComponent(atob(code));
    const obj = JSON.parse(json);
    if (typeof obj !== 'object' || obj === null) throw new Error('bad');
    decoder = obj;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decoder));
    updateStatus('Decoder imported.');
    for (let i=0;i<output.length;i++) if (output[i].type === 'rune') replaceOutputItem(i, { type:'rune', state: output[i].state });
    renderPreview();
  } catch(e) {
    updateStatus('Failed to import decoder: invalid code.');
  }
});

document.getElementById('clearDecoderBtn').addEventListener('click', ()=>{
  if (!confirm('Clear all decoder mappings from memory?')) return;
  decoder = {};
  try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
  updateStatus('Decoder cleared.');
  for (let i=0;i<output.length;i++) if (output[i].type === 'rune') replaceOutputItem(i, { type:'rune', state: output[i].state });
});

/* --------------------------
   Export output area as PNG
*/
async function exportOutputAsImage(filename = 'rune-output.png') {
  const out = document.getElementById('outputArea');
  if (!out) return;
  const rect = out.getBoundingClientRect();
  const width = Math.max(out.scrollWidth, rect.width);
  const height = Math.max(out.scrollHeight, rect.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * devicePixelRatio);
  canvas.height = Math.ceil(height * devicePixelRatio);
  const ctx = canvas.getContext('2d');
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.fillStyle = window.getComputedStyle(out).backgroundColor || '#ffffff';
  ctx.fillRect(0,0,width,height);

  const slots = Array.from(out.querySelectorAll('.slot'));
  const labelFont = '700 14px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const exampleFont = '500 11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (const slot of slots) {
    const slotRect = slot.getBoundingClientRect();
    const outRect = out.getBoundingClientRect();
    const x = slotRect.left - outRect.left;
    const y = slotRect.top - outRect.top;
    const svg = slot.querySelector('svg');
    if (svg) {
      const clone = svg.cloneNode(true);
      clone.setAttribute('width', svg.getAttribute('width') || svg.clientWidth);
      clone.setAttribute('height', svg.getAttribute('height') || svg.clientHeight);
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clone);
      const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob);
      try {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => { ctx.drawImage(img, Math.round(x), Math.round(y), slotRect.width, slotRect.height - 20); URL.revokeObjectURL(url); resolve(); };
          img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
          img.src = url;
        });
      } catch(e){}
    }

    const outputHasHidden = out.classList.contains('labels-hidden');
    if (!outputHasHidden) {
      const lab = slot.querySelector('.label');
      const ex = slot.querySelector('.example');
      const centerX = x + slotRect.width/2;
      if (lab && lab.textContent && !lab.classList.contains('empty')) {
        ctx.font = labelFont;
        ctx.fillStyle = '#111';
        const labelY = y + (slotRect.height - 36);
        ctx.fillText(lab.textContent, centerX, labelY);
      }
      if (ex && ex.textContent && !ex.classList.contains('empty')) {
        ctx.font = exampleFont;
        ctx.fillStyle = '#666';
        const exampleY = y + (slotRect.height - 18);
        ctx.fillText(ex.textContent, centerX, exampleY);
      }
    }
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
  }, 'image/png');
}

document.getElementById('exportImageBtn').addEventListener('click', async ()=>{
  const btn = document.getElementById('exportImageBtn');
  btn.disabled = true;
  btn.textContent = 'Exporting…';
  try {
    await exportOutputAsImage();
  } catch(e) {
    alert('Export failed.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Export image';
  }
});

/* --------------------------
   Decoder modal & inline input panel
*/
const modal = document.getElementById('decoderModal');
const consonantList = document.getElementById('consonantList');
const vowelList = document.getElementById('vowelList');
const consonantEmpty = document.getElementById('consonantEmpty');
const vowelEmpty = document.getElementById('vowelEmpty');

function createDecoderItem(code, phoneme, example){
  const stateObj = runeStateFromCode(code);
  const el = document.createElement('div');
  el.className = 'decoder-item';
  const svg = createSVG(72,96);
  const order = ['lineTL','lineTR','lineL','lineM','lineR','lineBL','lineBR'];
  order.forEach(name => {
    if (!stateObj[name]) return;
    switch(name){
      case 'lineTL': svg.appendChild(makeLineExact(coords.leftX,coords.leftTopY,coords.midX,coords.topY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineTR': svg.appendChild(makeLineExact(coords.rightX,coords.rightTopY,coords.midX,coords.topY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineL':  svg.appendChild(makeLineExact(coords.leftX,coords.leftTopY,coords.leftX,coords.leftBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineM':  svg.appendChild(makeLineExact(coords.midX,coords.topY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineR':  svg.appendChild(makeLineExact(coords.rightX,coords.rightTopY,coords.rightX,coords.rightBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineBL': svg.appendChild(makeLineExact(coords.leftX,coords.leftBottomY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineBR': svg.appendChild(makeLineExact(coords.rightX,coords.rightBottomY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
    }
  });
  if (stateObj.vowel) {
    const rawCenter = Math.round((coords.leftTopY + coords.leftBottomY)/2);
    const centerCy = rawCenter - 6;
    const belowCy = coords.midBottomY + 48;
    const cy = stateObj.lineM ? belowCy : centerCy;
    const svgNS='http://www.w3.org/2000/svg';
    const circle = document.createElementNS(svgNS,'circle');
    circle.setAttribute('cx', coords.midX);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', VOWEL_RADIUS);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', STROKE_ON);
    circle.setAttribute('stroke-width', VOWEL_STROKE);
    svg.appendChild(circle);
  }
  el.appendChild(svg);
  const lab = document.createElement('div'); lab.className='label'; lab.textContent = phoneme || ''; if (!phoneme) lab.classList.add('empty');
  const ex = document.createElement('div'); ex.className='example'; ex.textContent = example ? ('as in ' + example) : ''; if (!example) ex.classList.add('empty');
  el.appendChild(lab); el.appendChild(ex);
  return el;
}

function populateDecoderModal(){
  consonantList.innerHTML = '';
  vowelList.innerHTML = '';
  const entries = Object.keys(decoder).sort();
  const consonants = [];
  const vowels = [];
  for (const code of entries) {
    const entry = decoder[code];
    if (!entry || !entry.phoneme) continue;
    const hasVowel = code[7] === '1';
    if (hasVowel) vowels.push({ code, phoneme: entry.phoneme, example: entry.example });
    else consonants.push({ code, phoneme: entry.phoneme, example: entry.example });
  }

  consonantEmpty.style.display = consonants.length === 0 ? 'block' : 'none';
  vowelEmpty.style.display = vowels.length === 0 ? 'block' : 'none';

  consonants.forEach(it => consonantList.appendChild(createDecoderItem(it.code, it.phoneme, it.example)));
  vowels.forEach(it => vowelList.appendChild(createDecoderItem(it.code, it.phoneme, it.example)));
}

function openDecoderModal(){
  populateDecoderModal();
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  document.getElementById('decoderCloseBtn').focus();
}
function closeDecoderModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
  document.getElementById('viewDecoderBtn').focus();
}
document.getElementById('viewDecoderBtn').addEventListener('click', openDecoderModal);
document.getElementById('decoderCloseBtn').addEventListener('click', closeDecoderModal);
modal.addEventListener('click', (e)=>{ if (e.target === modal) closeDecoderModal(); });

/* --------------------------
   Inline input decoder panel (replaces canvas)
*/
const inputInline = document.getElementById('inputDecoderInline');
const inputConsonantListInline = document.getElementById('inputConsonantListInline');
const inputVowelListInline = document.getElementById('inputVowelListInline');
const inputConsonantEmptyInline = document.getElementById('inputConsonantEmptyInline');
const inputVowelEmptyInline = document.getElementById('inputVowelEmptyInline');
const inputDecoderBtn = document.getElementById('inputDecoderBtn');

let inputDecoderActive = false;

function toggleInputDecoderPanel(){
  inputDecoderActive = !inputDecoderActive;
  if (inputDecoderActive) openInputDecoderPanel(); else closeInputDecoderPanel();
  if (inputDecoderActive) {
    inputDecoderBtn.classList.add('active');
    inputDecoderBtn.textContent = 'Input with Rune Symbol';
  } else {
    inputDecoderBtn.classList.remove('active');
    inputDecoderBtn.textContent = 'Input with Decoder';
  }
}

function openInputDecoderPanel(){
  populateInputDecoderPanelInline();
  document.getElementById('canvasArea').classList.add('hidden');
  inputInline.classList.add('active');
  inputInline.setAttribute('aria-hidden','false');
  const first = inputInline.querySelector('.decoder-item');
  if (first && first.focus) first.focus();
}

function closeInputDecoderPanel(){
  document.getElementById('canvasArea').classList.remove('hidden');
  inputInline.classList.remove('active');
  inputInline.setAttribute('aria-hidden','true');
  inputDecoderActive = false;
  inputDecoderBtn.classList.remove('active');
  inputDecoderBtn.textContent = 'Input with Decoder';
  renderPreview();
}

function createInputDecoderItemInline(code, phoneme, example){
  const stateObj = runeStateFromCode(code);
  const el = document.createElement('div');
  el.className = 'decoder-item';
  const svg = createSVG(56,76);
  svg.setAttribute('width','56'); svg.setAttribute('height','76');
  const order = ['lineTL','lineTR','lineL','lineM','lineR','lineBL','lineBR'];
  order.forEach(name => {
    if (!stateObj[name]) return;
    switch(name){
      case 'lineTL': svg.appendChild(makeLineExact(coords.leftX,coords.leftTopY,coords.midX,coords.topY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineTR': svg.appendChild(makeLineExact(coords.rightX,coords.rightTopY,coords.midX,coords.topY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineL':  svg.appendChild(makeLineExact(coords.leftX,coords.leftTopY,coords.leftX,coords.leftBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineM':  svg.appendChild(makeLineExact(coords.midX,coords.topY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineR':  svg.appendChild(makeLineExact(coords.rightX,coords.rightTopY,coords.rightX,coords.rightBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineBL': svg.appendChild(makeLineExact(coords.leftX,coords.leftBottomY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
      case 'lineBR': svg.appendChild(makeLineExact(coords.rightX,coords.rightBottomY,coords.midX,coords.midBottomY,STROKE_ON,STROKE_WIDTH)); break;
    }
  });
  if (stateObj.vowel) {
    const rawCenter = Math.round((coords.leftTopY + coords.leftBottomY)/2);
    const centerCy = rawCenter - 6;
    const belowCy = coords.midBottomY + 48;
    const cy = stateObj.lineM ? belowCy : centerCy;
    const svgNS='http://www.w3.org/2000/svg';
    const circle = document.createElementNS(svgNS,'circle');
    circle.setAttribute('cx', coords.midX);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', VOWEL_RADIUS);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', STROKE_ON);
    circle.setAttribute('stroke-width', VOWEL_STROKE);
    svg.appendChild(circle);
  }
  el.appendChild(svg);
  const lab = document.createElement('div'); lab.className='label'; lab.textContent = phoneme || ''; if (!phoneme) lab.classList.add('empty');
  el.appendChild(lab);

  el.addEventListener('click', (ev)=>{
    ev.stopPropagation();
    appendOutputItem({ type:'rune', state: stateObj });
  });

  return el;
}

function populateInputDecoderPanelInline(){
  inputConsonantListInline.innerHTML = '';
  inputVowelListInline.innerHTML = '';

  const consonants = [];
  const vowels = [];
  for (const code of Object.keys(decoder || {})) {
    const entry = decoder[code];
    if (!entry || !entry.phoneme) continue;
    const hasVowel = code[7] === '1';
    const item = { code, phoneme: entry.phoneme, example: entry.example || '' };
    if (hasVowel) vowels.push(item); else consonants.push(item);
  }

  const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });
  consonants.sort((a,b)=>collator.compare(a.phoneme || '', b.phoneme || ''));
  vowels.sort((a,b)=>collator.compare(a.phoneme || '', b.phoneme || ''));

  inputConsonantEmptyInline.style.display = consonants.length === 0 ? 'block' : 'none';
  inputVowelEmptyInline.style.display = vowels.length === 0 ? 'block' : 'none';

  consonants.forEach(it => inputConsonantListInline.appendChild(createInputDecoderItemInline(it.code, it.phoneme, it.example)));
  vowels.forEach(it => inputVowelListInline.appendChild(createInputDecoderItemInline(it.code, it.phoneme, it.example)));
}

inputDecoderBtn.addEventListener('click', toggleInputDecoderPanel);
window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && inputDecoderActive) toggleInputDecoderPanel(); });

/* --------------------------
   Init
*/
(function init(){
  try {
    const stored = localStorage.getItem(LABELS_KEY);
    if (stored === '0') setOutputLabelsVisible(false);
    else setOutputLabelsVisible(true);
  } catch(e) { setOutputLabelsVisible(true); }

  renderPreview();
  renderOutputArea();
  updateStatus(Object.keys(decoder).length ? `Decoder loaded (${Object.keys(decoder).length} entries).` : 'No decoder mappings in storage.');
})();

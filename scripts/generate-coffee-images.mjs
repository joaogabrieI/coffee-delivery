/**
 * Gera as ilustrações SVG originais dos cafés (vista de cima, 120x120),
 * a imagem do hero e a ilustração da tela de sucesso.
 *
 * Criado com auxílio de IA (Claude Code) — ver docs/AI_USAGE.md (interação 3).
 * Uso: npm run generate:images
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'coffees')
mkdirSync(outDir, { recursive: true })

// Paleta das bebidas
const C = {
  espresso: '#3B2116',
  americano: '#4A2A1B',
  crema: '#A9672F',
  creamLight: '#E8C9A0',
  milk: '#F4E6D2',
  latte: '#C99A6B',
  chocolate: '#5A2E1D',
  mint: '#4FA36B',
  coconut: '#FFFDF8',
  whip: '#FFF8EE',
  cinnamon: '#8B4A1F',
}

// Xícara branca com pires (vista superior). `cup` permite trocar por copo de vidro.
function cupBase({ glass = false } = {}) {
  if (glass) {
    return `
    <ellipse cx="62" cy="64" rx="50" ry="50" fill="#000" opacity=".12"/>
    <circle cx="60" cy="60" r="46" fill="#DCEFF7" stroke="#B9DCEA" stroke-width="3"/>`
  }
  return `
    <ellipse cx="62" cy="65" rx="54" ry="53" fill="#000" opacity=".12"/>
    <circle cx="60" cy="60" r="54" fill="#F7F3EE"/>
    <circle cx="60" cy="60" r="54" fill="none" stroke="#E5DDD3" stroke-width="2"/>
    <rect x="94" y="52" width="24" height="16" rx="8" fill="#EFE8DF" stroke="#E0D6CA" stroke-width="2"/>
    <circle cx="60" cy="60" r="40" fill="#FFFFFF" stroke="#E9E1D7" stroke-width="2"/>`
}

const liquid = (color, r = 34) => `<circle cx="60" cy="60" r="${r}" fill="${color}"/>`
const shine = `<path d="M42 44a24 24 0 0 1 16-9" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round" fill="none"/>`

const heart = (color) =>
  `<path d="M60 74c-12-8-18-14-18-21a8 8 0 0 1 18-4 8 8 0 0 1 18 4c0 7-6 13-18 21z" fill="${color}"/>`

const rosetta = (color) => `
  <g fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round">
    <path d="M60 40v40"/>
    <path d="M48 46c6 3 18 3 24 0"/><path d="M46 54c8 4 20 4 28 0"/>
    <path d="M46 62c8 4 20 4 28 0"/><path d="M49 70c6 3 16 3 22 0"/>
  </g>`

const swirl = (color, width = 3) =>
  `<path d="M60 60m-4 0a4 4 0 1 1 8 0a9 9 0 1 1-17 0a14 14 0 1 1 27 0a19 19 0 1 1-37 0" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`

const dots = (color, points) =>
  points.map(([x, y, r = 1.6]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join('')

const ice = (positions) =>
  positions
    .map(
      ([x, y, rot]) =>
        `<rect x="${x}" y="${y}" width="16" height="16" rx="4" transform="rotate(${rot} ${x + 8} ${y + 8})" fill="#EAF7FC" fill-opacity=".85" stroke="#FFFFFF" stroke-width="1.5"/>`,
    )
    .join('')

const mintLeaf = (x, y, rot) =>
  `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${C.mint}"/><path d="M${x - 8} ${y}h16" stroke="#2F7A48" stroke-width="1.2"/></g>`

const starAnise = (x, y) => {
  const arms = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    return `<ellipse cx="${x + Math.cos(a) * 5}" cy="${y + Math.sin(a) * 5}" rx="4" ry="2" transform="rotate(${(i * 45).toFixed(0)} ${x + Math.cos(a) * 5} ${y + Math.sin(a) * 5})" fill="#7A3B1A"/>`
  })
  return `<g>${arms.join('')}<circle cx="${x}" cy="${y}" r="2" fill="#4A230F"/></g>`
}

const whipped = `
  <g fill="${C.whip}" stroke="#EADBC6" stroke-width="1.5">
    <circle cx="60" cy="60" r="22"/>
    <circle cx="60" cy="60" r="15"/>
    <circle cx="60" cy="60" r="8"/>
  </g>`

const coffees = {
  'expresso-tradicional': `${cupBase()}${liquid(C.espresso)}${liquid(C.crema, 26)}${liquid(C.espresso, 20)}${shine}`,
  'expresso-americano': `${cupBase()}${liquid(C.americano)}${shine}`,
  'expresso-cremoso': `${cupBase()}${liquid(C.crema)}${swirl(C.creamLight, 3)}${shine}`,
  'expresso-gelado': `${cupBase({ glass: true })}${liquid(C.espresso, 38)}${ice([
    [44, 38, 12],
    [62, 46, -18],
    [46, 62, 28],
    [64, 64, 6],
  ])}`,
  'cafe-com-leite': `${cupBase()}${liquid(C.latte)}${liquid('#D9B48C', 22)}${shine}`,
  latte: `${cupBase()}${liquid(C.latte)}${rosetta(C.milk)}`,
  capuccino: `${cupBase()}${liquid(C.crema)}${liquid(C.creamLight, 28)}${dots(C.cinnamon, [
    [52, 52], [60, 48], [68, 54], [56, 62], [66, 64], [60, 70], [50, 66], [70, 60, 1.2], [48, 58, 1.2],
  ])}`,
  macchiato: `${cupBase()}${liquid(C.espresso)}${liquid(C.crema, 26)}${liquid(C.milk, 12)}`,
  mocaccino: `${cupBase()}${liquid(C.chocolate)}${heart(C.milk)}`,
  'chocolate-quente': `${cupBase()}${liquid(C.chocolate)}${swirl('#7A4430', 4)}${dots('#3A1A0E', [
    [46, 50, 2.2], [74, 52, 2.2], [52, 76, 2.2], [72, 70, 2.2],
  ])}`,
  cubano: `${cupBase({ glass: true })}${liquid('#5B331F', 38)}${liquid(C.creamLight, 22)}${mintLeaf(52, 52, -30)}${mintLeaf(68, 58, 40)}${mintLeaf(58, 70, 5)}`,
  havaiano: `${cupBase()}${liquid(C.latte)}${liquid(C.coconut, 18)}${dots('#FFFFFF', [
    [44, 50, 2.4], [76, 56, 2.4], [48, 74, 2.4], [72, 74, 2.4], [60, 42, 2.4],
  ])}<path d="M78 34c-6 2-10 7-10 12" stroke="#4FA36B" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  arabe: `${cupBase()}${liquid('#2E1A12')}${starAnise(60, 60)}${dots('#C9A26A', [
    [44, 48, 1.6], [76, 50, 1.6], [70, 76, 1.6], [46, 72, 1.6],
  ])}`,
  irlandes: `${cupBase({ glass: true })}${liquid('#3A2014', 38)}${whipped}${dots(C.cinnamon, [[56, 56, 1.4], [64, 62, 1.4], [60, 52, 1.4]])}`,
}

for (const [name, body] of Object.entries(coffees)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-hidden="true">${body}</svg>\n`
  writeFileSync(join(outDir, `${name}.svg`), svg)
}

// ---------- Hero: copo grande com grãos ao redor ----------
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360" aria-hidden="true">
  <defs>
    <linearGradient id="cup" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8047F8"/><stop offset="1" stop-color="#4B2995"/>
    </linearGradient>
    <linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#DBAC2C"/><stop offset="1" stop-color="#C47F17"/>
    </linearGradient>
  </defs>
  <ellipse cx="240" cy="330" rx="150" ry="18" fill="#000" opacity=".1"/>
  <path d="M168 92h144l-20 230a14 14 0 0 1-14 12h-76a14 14 0 0 1-14-12z" fill="url(#cup)"/>
  <rect x="152" y="70" width="176" height="30" rx="10" fill="#4B2995"/>
  <rect x="166" y="52" width="148" height="24" rx="10" fill="#8047F8"/>
  <path d="M176 170h128l-8 82H184z" fill="url(#sleeve)"/>
  <g transform="translate(240 211)" fill="#FFFFFF">
    <path d="M0-26a14 14 0 0 0-14 14c0 11 14 23 14 23s14-12 14-23a14 14 0 0 0-14-14z"/>
    <ellipse cx="0" cy="-12" rx="5" ry="7" fill="#C47F17"/>
    <path d="M0-19c-2 4-2 10 0 14" stroke="#FFF" stroke-width="1.6" fill="none"/>
  </g>
  <g fill="#4A2A1B">
    ${[
      [92, 120, -30], [110, 250, 20], [70, 190, 60], [380, 140, 35], [400, 250, -20], [360, 300, 70], [130, 320, -60], [420, 190, 10],
    ]
      .map(
        ([x, y, r]) =>
          `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="14" ry="19"/><path d="M${x} ${y - 16}c-6 10-6 22 0 32" stroke="#C99A6B" stroke-width="2.4" fill="none"/></g>`,
      )
      .join('')}
  </g>
  <g fill="none" stroke="#DBAC2C" stroke-width="6" stroke-linecap="round" opacity=".9">
    <path d="M222 40c-10-12 10-18 0-32"/><path d="M258 40c-10-12 10-18 0-32"/>
  </g>
</svg>\n`
writeFileSync(join(root, 'public', 'hero.svg'), hero)

// ---------- Sucesso: entregador de scooter ----------
const delivery = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 293" width="492" height="293" aria-hidden="true">
  <ellipse cx="246" cy="276" rx="210" ry="12" fill="#000" opacity=".1"/>
  <g stroke="#DBAC2C" stroke-width="6" stroke-linecap="round" opacity=".8">
    <path d="M20 170h70"/><path d="M40 200h60"/><path d="M10 230h80"/>
  </g>
  <!-- rodas -->
  <circle cx="150" cy="240" r="34" fill="#272221"/><circle cx="150" cy="240" r="14" fill="#E6E5E5"/>
  <circle cx="380" cy="240" r="34" fill="#272221"/><circle cx="380" cy="240" r="14" fill="#E6E5E5"/>
  <!-- scooter -->
  <path d="M120 228c0-40 30-62 70-62h90l30 40h70c20 0 34 12 34 30H120z" fill="#8047F8"/>
  <path d="M300 206l40-110h22" stroke="#4B2995" stroke-width="12" stroke-linecap="round" fill="none"/>
  <rect x="352" y="84" width="40" height="12" rx="6" fill="#272221"/>
  <rect x="190" y="150" width="96" height="18" rx="9" fill="#4B2995"/>
  <!-- baú de entrega -->
  <rect x="100" y="80" width="100" height="84" rx="12" fill="#DBAC2C"/>
  <rect x="100" y="80" width="100" height="20" rx="10" fill="#C47F17"/>
  <g transform="translate(150 132)" fill="#FFFFFF">
    <path d="M-14-10h28v8a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z"/>
    <path d="M14-6h3a4 4 0 0 1 0 8h-3" stroke="#FFF" stroke-width="3" fill="none"/>
  </g>
  <!-- entregador -->
  <path d="M236 150l20-58h44l12 58z" fill="#C47F17"/>
  <rect x="246" y="92" width="50" height="40" rx="14" fill="#DBAC2C"/>
  <circle cx="276" cy="62" r="26" fill="#8D5A3B"/>
  <path d="M248 60a28 28 0 0 1 56 0z" fill="#4B2995"/>
  <rect x="244" y="56" width="64" height="8" rx="4" fill="#272221" opacity=".9"/>
  <path d="M292 108l52-10" stroke="#8D5A3B" stroke-width="10" stroke-linecap="round"/>
  <path d="M252 150l-10 46" stroke="#403937" stroke-width="14" stroke-linecap="round"/>
  <path d="M290 150l18 46" stroke="#403937" stroke-width="14" stroke-linecap="round"/>
</svg>\n`
writeFileSync(join(root, 'public', 'delivery.svg'), delivery)

console.log(`Geradas ${Object.keys(coffees).length} ilustrações de café + hero + delivery.`)

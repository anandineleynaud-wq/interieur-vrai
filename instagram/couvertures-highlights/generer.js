const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = process.argv[2], out = process.argv[3];
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
const C = { cream:'#F6F0E6', terra:'#C98B68', sage:'#93A28F', blue:'#B4C3C8', blush:'#DDB4A0', sand:'#E3CBB2', ink:'#6B5A4E' };
const grain = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .3  0 0 0 0 .25  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
const paper = (fill) => `<rect width="1080" height="1080" fill="${fill}"/><rect width="1080" height="1080" fill="${fill}" filter="url(#g)"/>`;
const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1080" viewBox="0 0 1080 1080"><defs>${grain}</defs>${inner}</svg>`;

// ---------- line icons (centred on 540,540, ~360px) ----------
const icon = {
  accompagnement: `<circle cx="470" cy="530" r="125"/><circle cx="610" cy="530" r="125"/>`,
  immersions: `<path d="M340 680 L480 470 L560 580 L620 500 L740 680"/><circle cx="650" cy="390" r="38"/><path d="M330 740 Q430 710 540 740 T750 740"/>`,
  apropos: `<path d="M540 760 V420"/><path d="M540 560 C470 550 430 500 425 440 C495 445 535 495 540 560"/><path d="M540 480 C610 470 650 420 655 360 C585 365 545 415 540 480"/><path d="M540 660 C600 650 640 610 650 560 C590 565 550 605 540 660"/>`,
  contact: `<rect x="350" y="420" width="380" height="260" rx="28"/><path d="M360 440 L540 580 L720 440"/>`,
};
const keys = ['accompagnement','immersions','apropos','contact'];
const labels = { accompagnement:'Accompagnement', immersions:'Immersions', apropos:'À propos', contact:'Contact' };

// ---------- 1. Fragments : formes papier découpé du logo ----------
const frag = {
  accompagnement: `<path d="M330 700 C300 560 360 400 470 390 C540 385 560 470 545 560 C530 660 460 730 390 735 C355 737 336 725 330 700Z" fill="${C.terra}"/>
                   <path d="M750 690 C780 560 730 430 640 430 C575 430 555 500 565 580 C578 670 640 735 700 735 C730 735 745 715 750 690Z" fill="${C.blue}"/>
                   <ellipse cx="540" cy="760" rx="260" ry="45" fill="${C.sage}"/>`,
  immersions: `<path d="M290 740 L520 380 C530 365 550 365 560 380 L790 740Z" fill="${C.sage}"/>
               <circle cx="700" cy="380" r="70" fill="${C.terra}"/>
               <path d="M250 740 C380 690 470 790 600 745 C700 710 770 760 830 740 L830 800 L250 800Z" fill="${C.blue}"/>`,
  apropos: `<ellipse cx="540" cy="745" rx="190" ry="62" fill="${C.sand}"/>
            <path d="M400 690 C400 590 470 560 540 560 C610 560 680 590 680 690Z" fill="${C.terra}"/>
            <circle cx="540" cy="480" r="82" fill="${C.sage}"/>
            <path d="M480 390 C470 330 510 290 545 290 C585 290 615 330 600 390Z" fill="${C.blue}"/>`,
  contact: `<path d="M330 450 C330 380 380 340 450 340 L640 340 C710 340 760 380 760 450 L760 580 C760 650 710 690 640 690 L520 690 L420 770 L440 690 C370 690 330 650 330 580Z" fill="${C.blush}"/>
            <circle cx="470" cy="515" r="26" fill="${C.cream}"/><circle cx="545" cy="515" r="26" fill="${C.cream}"/><circle cx="620" cy="515" r="26" fill="${C.cream}"/>`,
};
const p1 = k => svg(paper(C.cream) + `<g transform="translate(540 545) scale(1.4) translate(-540 -555)">${frag[k]}</g>`);

// ---------- 2. Terre : aplat couleur + icône trait crème ----------
const bg2 = { accompagnement:C.terra, immersions:C.sage, apropos:C.blush, contact:C.blue };
const p2 = k => svg(paper(bg2[k]) + `<g transform="translate(540 540) scale(1.35) translate(-540 -560)" fill="none" stroke="${C.cream}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">${icon[k]}</g>`);

// ---------- 3. Arche : photo du feed dans une arche, accent du logo ----------
const photo = { accompagnement:'p_chemin.png', immersions:'p_cascade.png', apropos:'p_fleurs.png', contact:'p_rocher.png' };
const accent = { accompagnement:C.terra, immersions:C.sage, apropos:C.blush, contact:C.blue };
const arch = 'M370 820 L370 480 C370 370 450 290 540 290 C630 290 710 370 710 480 L710 820Z';
const p3 = k => svg(paper(C.cream) +
  `<g transform="translate(540 540) scale(1.45) translate(-540 -560)"><circle cx="720" cy="760" r="95" fill="${accent[k]}"/>
   <clipPath id="a"><path d="${arch}"/></clipPath>
   <image href="${b64(photo[k])}" x="370" y="290" width="340" height="530" preserveAspectRatio="xMidYMid slice" clip-path="url(#a)"/>
   <path d="${arch}" fill="none" stroke="${C.cream}" stroke-width="8"/></g>`);

const sets = [['1-fragments', p1, 'Fragments', 'Les formes découpées de votre logo'], ['2-terre', p2, 'Terre', 'Aplats de couleur + icône au trait'], ['3-arche', p3, 'Arche', 'Vos photos nature dans une arche']];

(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1080 } });
  fs.mkdirSync(out, { recursive: true });
  const files = {};
  for (const [id, fn] of sets) {
    fs.mkdirSync(path.join(out, id), { recursive: true });
    for (const k of keys) {
      await pg.setContent(`<html><body style="margin:0">${fn(k)}</body></html>`);
      const f = path.join(out, id, `${k}.png`);
      await pg.screenshot({ path: f, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
      (files[id] ||= []).push(f);
    }
  }
  // planche de comparaison façon profil Instagram
  const row = ([id, , name, desc]) => `<div class="row"><div class="t"><b>${name}</b><span>${desc}</span></div><div class="hs">${keys.map((k, i) =>
    `<div class="h"><div class="ring"><img src="${b64(path.relative(dir, files[id][i]))}"></div><p>${labels[k]}</p></div>`).join('')}</div></div>`;
  const cur = `<div class="row"><div class="t"><b>Actuel</b><span>Pour comparer</span></div><div class="hs"><img class="cur" src="${b64('bubbles.png')}"></div></div>`;
  await pg.setViewportSize({ width: 1080, height: 1500 });
  await pg.setContent(`<html><head><style>
    body{margin:0;background:#fff;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#222;padding:30px 30px}
    .row{padding:26px 0;border-bottom:1px solid #eee}.t b{font-size:34px;margin-right:16px}.t span{font-size:26px;color:#777}
    .hs{display:flex;gap:44px;margin-top:22px;padding-left:24px}.h{text-align:center;width:200px}
    .ring{width:196px;height:196px;border-radius:50%;border:2px solid #dbdbdb;padding:7px;box-sizing:border-box}
    .ring img{width:100%;height:100%;border-radius:50%;display:block}.h p{font-size:27px;margin:12px 0 0}
    .cur{width:960px;margin-left:-24px}</style></head><body>${cur}${sets.map(row).join('')}</body></html>`);
  await pg.screenshot({ path: path.join(out, 'comparaison.png'), fullPage: true });
  await br.close();
})();

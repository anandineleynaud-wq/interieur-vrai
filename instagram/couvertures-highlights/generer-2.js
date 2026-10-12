const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = process.argv[2], out = process.argv[3];
const b64 = (f, t='image/png') => `data:${t};base64,` + fs.readFileSync(path.join(dir, f)).toString('base64');
const C = { cream:'#F6F0E6', terra:'#C98B68', sage:'#93A28F', blue:'#B4C3C8', blush:'#DDB4A0', sand:'#E3CBB2', ink:'#5E4E43' };
const fonts = `<style>@font-face{font-family:Cav;src:url(${b64('caveat.ttf','font/ttf')});font-weight:100 900}
@font-face{font-family:Cor;font-style:italic;src:url(${b64('cormorant-italic.ttf','font/ttf')});font-weight:300 700}
body{margin:0}.tile{width:1080px;height:1080px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.grain{position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply}</style>`;
const grain = `<svg class="grain" viewBox="0 0 1080 1080"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .28  0 0 0 .12 0"/></filter><rect width="1080" height="1080" filter="url(#g)"/></svg>`;
const keys = ['accompagnement','immersions','apropos','contact'];
const labels = { accompagnement:'Accompagnement', immersions:'Immersions', apropos:'À propos', contact:'Contact' };
const word = { accompagnement:'écoute', immersions:'nature', apropos:'moi', contact:'écrire' };

// 4. Écrit : un mot en italique éditorial sur papier crème
const p4 = k => `<div class="tile" style="background:${C.cream}">${grain}
  <div style="text-align:center;position:relative"><div style="font-family:Cor;font-style:italic;font-weight:500;font-size:${k==='apropos'?420:310}px;color:${C.ink};line-height:1">${word[k]}</div>
  <div style="width:150px;height:8px;background:${C.terra};margin:40px auto 0;border-radius:2px"></div></div></div>`;

// 5. Matière : textures nature plein cadre, légèrement réchauffées
const tex = { accompagnement:'t_eau.png', immersions:'t_cascade.png', apropos:'t_feuilles.png', contact:'t_fougere.png' };
const p5 = k => `<div class="tile"><img src="${b64(tex[k])}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.8) sepia(.15) contrast(1.02) brightness(1.04)">${grain}</div>`;

// 6. Collage : forme découpée couleur logo + mot manuscrit qui la chevauche
const blob = {
  accompagnement:['M300 330 C420 230 700 250 790 380 C870 500 800 700 640 760 C480 820 290 760 250 600 C220 490 230 390 300 330Z', C.terra],
  immersions:['M190 770 C250 430 410 300 540 300 C670 300 830 430 890 770Z', C.sage],
  apropos:['M540 250 C700 250 800 380 800 540 C800 720 690 820 540 820 C390 820 280 720 280 540 C280 380 380 250 540 250Z', C.blush],
  contact:['M300 330 L780 330 C810 330 830 350 830 380 L830 680 C830 710 810 730 780 730 L520 730 L420 820 L440 730 L300 730 C270 730 250 710 250 680 L250 380 C250 350 270 330 300 330Z', C.blue],
};
const p6 = k => `<div class="tile" style="background:${C.cream}">
  <svg viewBox="0 0 1080 1080" style="position:absolute;inset:0"><path transform="translate(540 540) scale(1.3) translate(-540 -540)" d="${blob[k][0]}" fill="${blob[k][1]}"/></svg>${grain}
  <div style="position:relative;font-family:Cav;font-weight:500;font-size:${k==='apropos'?330:250}px;color:${C.cream};transform:rotate(-4deg);margin-top:20px">${word[k]}</div></div>`;

// Bannières Facebook 1640x624 (zone sûre mobile au centre)
const fbBase = inner => `<div style="width:1640px;height:624px;position:relative;overflow:hidden;background:${C.cream};display:flex;align-items:center;justify-content:center">${inner}<svg class="grain" viewBox="0 0 1640 624" style="position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply"><filter id="h"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .28  0 0 0 .12 0"/></filter><rect width="1640" height="624" filter="url(#h)"/></svg></div>`;
const fb = {
  '4-ecrit': fbBase(`<div style="text-align:center"><div style="font-family:Cor;font-style:italic;font-size:150px;color:${C.ink};line-height:1">Intérieur Vrai</div><div style="width:90px;height:4px;background:${C.terra};margin:30px auto;border-radius:2px"></div><div style="font-family:Cor;font-style:italic;font-size:54px;color:${C.ink};opacity:.8">revenir à soi · Ardèche</div></div>`),
  '5-matiere': fbBase(`<div style="position:absolute;inset:0;display:flex">${keys.map(k=>`<img src="${b64(tex[k])}" style="flex:1;width:25%;height:100%;object-fit:cover;filter:saturate(.8) sepia(.15) brightness(1.04)">`).join('')}</div>
     <div style="position:relative;background:${C.cream};padding:40px 80px;text-align:center"><div style="font-family:Cor;font-style:italic;font-size:110px;color:${C.ink};line-height:1">Intérieur Vrai</div><div style="font-family:Cor;font-style:italic;font-size:44px;color:${C.ink};opacity:.8;margin-top:14px">revenir à soi</div></div>`),
  '6-collage': fbBase(`<svg viewBox="0 0 1640 624" style="position:absolute;inset:0"><circle cx="190" cy="520" r="210" fill="${C.sage}"/><path d="M1380 -60 C1560 -60 1720 80 1700 240 C1680 380 1520 380 1420 300 C1330 230 1250 120 1290 20Z" fill="${C.terra}"/><circle cx="1480" cy="560" r="70" fill="${C.blue}"/><ellipse cx="330" cy="70" rx="90" ry="60" fill="${C.blush}"/></svg>
     <div style="position:relative;text-align:center;font-family:Cav;color:${C.ink}"><div style="font-size:170px;font-weight:600;line-height:1">Intérieur Vrai</div><div style="font-size:70px;margin-top:10px">revenir à soi</div></div>`),
};
const sets = [['4-ecrit', p4, 'Écrit', 'Un mot, comme une page de carnet'], ['5-matiere', p5, 'Matière', 'Vos paysages en gros plan, sans rien dessus'], ['6-collage', p6, 'Collage', 'Forme du logo + mot écrit à la main']];

(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1080, height: 1080 } });
  const files = {};
  for (const [id, fn] of sets) {
    fs.mkdirSync(path.join(out, id), { recursive: true });
    for (const k of keys) {
      await pg.setContent(`<html><head>${fonts}</head><body>${fn(k)}</body></html>`); await pg.evaluate(() => document.fonts.ready);
      const f = path.join(out, id, `${k}.png`); await pg.screenshot({ path: f, clip: { x: 0, y: 0, width: 1080, height: 1080 } }); (files[id] ||= []).push(f);
    }
    await pg.setViewportSize({ width: 1640, height: 624 });
    await pg.setContent(`<html><head>${fonts}</head><body>${fb[id]}</body></html>`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, id, 'banniere-facebook.png'), clip: { x: 0, y: 0, width: 1640, height: 624 } });
    await pg.setViewportSize({ width: 1080, height: 1080 });
  }
  const row = ([id, , name, desc]) => `<div class="row"><div class="t"><b>${name}</b><span>${desc}</span></div><div class="hs">${keys.map((k, i) =>
    `<div class="h"><div class="ring"><img src="${b64(path.relative(dir, files[id][i]))}"></div><p>${labels[k]}</p></div>`).join('')}</div>
    <div class="fbl">Bannière Facebook</div><img class="fb" src="${b64(path.relative(dir, path.join(out, id, 'banniere-facebook.png')))}"></div>`;
  await pg.setViewportSize({ width: 1080, height: 1500 });
  await pg.setContent(`<html><head><style>
    body{margin:0;background:#fff;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#222;padding:10px 30px}
    .row{padding:26px 0;border-bottom:1px solid #eee}.t b{font-size:34px;margin-right:16px}.t span{font-size:26px;color:#777}
    .hs{display:flex;gap:44px;margin-top:22px;padding-left:24px}.h{text-align:center;width:200px}
    .ring{width:196px;height:196px;border-radius:50%;border:2px solid #dbdbdb;padding:7px;box-sizing:border-box}
    .ring img{width:100%;height:100%;border-radius:50%;display:block}.h p{font-size:27px;margin:12px 0 0}
    .fbl{font-size:22px;color:#999;margin:22px 0 8px 24px}.fb{width:960px;margin-left:24px;border-radius:10px;display:block}</style></head><body>${sets.map(row).join('')}</body></html>`);
  await pg.screenshot({ path: path.join(out, 'comparaison-2.png'), fullPage: true });
  await br.close();
})();

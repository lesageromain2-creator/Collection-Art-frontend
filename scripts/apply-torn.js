const fs = require('fs');
const path = require('path');
const shapes = require('../public/images/landing/torn-shapes.json');
const grainSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.28  0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>";
const grain = `data:image/svg+xml,${encodeURIComponent(grainSvg)}`;
const css = `
/* Papier dechire */
.greenBar {
  border-radius: 0;
  clip-path: ${shapes.header};
  padding-bottom: 62px;
}
.blobSage,
.blobPink {
  border-radius: 0;
  opacity: 0.95;
}
.blobSage { clip-path: ${shapes.photoB}; background: #93a888; }
.blobPink { clip-path: ${shapes.note}; background: #f4c6d2; }
.frame,
.portraitMain,
.portraitSide {
  border-radius: 0;
  box-shadow: none;
  filter: drop-shadow(0 14px 16px rgba(48, 34, 24, 0.16));
  background: #fffdf8;
}
.frameMain { clip-path: ${shapes.photo}; padding: 14px 12px 28px; }
.frameSide { clip-path: ${shapes.photoB}; padding: 12px 11px 22px; }
.frameLow { clip-path: ${shapes.photoC}; padding: 12px 11px 22px; }
.note,
.sticker {
  border-radius: 0;
  box-shadow: none;
  filter: drop-shadow(0 8px 12px rgba(48, 34, 24, 0.12));
}
.note { clip-path: ${shapes.note}; }
.sticker { clip-path: ${shapes.sticker}; }
.agenda,
.portraits {
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
}
.agenda {
  clip-path: ${shapes.panel};
  filter: drop-shadow(0 16px 22px rgba(55, 62, 48, 0.16));
  padding: 38px 32px 36px;
  background-image: url("${grain}");
  background-size: 180px 180px;
}
.agenda::before { display: none; }
.portraits {
  clip-path: ${shapes.panelB};
  filter: drop-shadow(0 16px 22px rgba(90, 50, 60, 0.12));
  padding: 30px 24px 32px;
  background-image: url("${grain}");
  background-size: 180px 180px;
}
.portraitMain { clip-path: ${shapes.photo}; }
.portraitSide { clip-path: ${shapes.photoC}; }
.split { position: relative; }
.scrapOut,
.scrapOutB {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}
.agenda,
.portraits {
  z-index: 1;
}
.scrapOut {
  left: -36px;
  bottom: 18px;
  width: 110px;
  height: 140px;
  background: #f6d5de;
  clip-path: ${shapes.note};
  transform: rotate(-12deg);
}
.scrapOutB {
  right: -24px;
  top: -18px;
  width: 92px;
  height: 78px;
  background: #d5e7df;
  clip-path: ${shapes.sticker};
  transform: rotate(8deg);
}
.note {
  width: 178px;
  padding: 30px 24px 36px;
  font-size: 17px;
}
.sticker {
  padding: 18px 20px 20px;
  right: 22px;
  top: 18px;
}
.agenda {
  padding: 52px 64px 46px 44px;
}
.frameMain { padding: 16px 14px 34px; }
.frameSide,
.frameLow { padding: 14px 12px 26px; }
`;
const target = path.join(__dirname, '../styles/landing.module.css');
const current = fs.readFileSync(target, 'utf8');
const marker = '/* Papier dechire */';
const next = current.includes(marker) ? current.slice(0, current.indexOf(marker)) + css : current + css;
fs.writeFileSync(target, next);
console.log('css updated', next.length);

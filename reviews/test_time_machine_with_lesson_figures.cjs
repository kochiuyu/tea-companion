'use strict';
// Run from any directory: node reviews/test_time_machine_with_lesson_figures.cjs
// The historical time-machine suite freezes the pre-game lesson text. Later,
// authorized static lesson figures are additive, but its original comparison
// does not know their markers. Remove only those blocks from in-memory reads of
// the three trade-history QMDs; do not edit the suite, files, baseline, game
// data, JavaScript, or its state/mechanics assertions. Broader preservation of
// all lessons is independently covered by test_lesson_illustrations.py.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const targets = new Set(['', 'zh-hant-hk/', 'zh-hans/'].map(prefix =>
  path.join(root, prefix, 'modules/module-03/01-trade-history.qmd')));
const readFileSync = fs.readFileSync;
fs.readFileSync = function (file, ...args) {
  const contents = readFileSync.call(this, file, ...args);
  if (typeof file !== 'string' || typeof contents !== 'string' ||
      !targets.has(path.resolve(file))) return contents;
  return contents.replace(
    /\n<!-- lesson-illustration:([a-z-]+):start -->\n[\s\S]*?<!-- lesson-illustration:\1:end -->\n/g,
    '');
};
try {
  require('./test_time_machine.cjs');
} finally {
  fs.readFileSync = readFileSync;
}

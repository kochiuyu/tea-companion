'use strict';
// The older suite freezes pre-illustration lesson text. Strip only the newer
// marked blocks from in-memory QMD reads, then run its unchanged state tests.
// Source preservation against PR #49 is tested separately by Python.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const targets=new Set(['','zh-hant-hk/','zh-hans/'].map(prefix=>path.join(root,prefix,'modules/module-03/01-trade-history.qmd')));
const read=fs.readFileSync;
fs.readFileSync=function(file,...args){const contents=read.call(this,file,...args);if(typeof file!=='string'||typeof contents!=='string'||!targets.has(path.resolve(file)))return contents;return contents.replace(/\n<!-- history-illustration:([a-z-]+):start -->\n[\s\S]*?<!-- history-illustration:\1:end -->\n/g,'');};
try{require('./test_time_machine_with_lesson_figures.cjs')}finally{fs.readFileSync=read}

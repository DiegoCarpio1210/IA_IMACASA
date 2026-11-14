const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../app/static/synthetic-image.js'),'utf8'),context);
const image = context.window.syntheticInspectionImage;
test('same inspection retains image; repeated scenario gets different artwork',()=>{
 const first={id:51,station:'PC08',defect:'Golpes'};
 assert.equal(image(first).url,image({...first}).url);
 const next=image({...first,id:52});
 assert.notEqual(image(first).url,next.url);
 const artwork = x => decodeURIComponent(x.url.split(',').slice(1).join(','));
 const strokes = x => artwork(x).match(/<path d="M\d+\.\d+[^>]+/g).join();
 assert.notEqual(strokes(image(first)),strokes(next));
 assert.match(artwork(next),/IMAGEN SIMULADA/);
 assert.match(artwork(next),/no es una captura real de IMACASA/);
});
test('empty events have no image and metadata is escaped',()=>{
 assert.equal(image(null),null);
 assert.equal(image({id:NaN}),null);
 assert.ok(image({id:1,station:'<script>'}).url.includes('%26lt%3Bscript%26gt%3B'));
});

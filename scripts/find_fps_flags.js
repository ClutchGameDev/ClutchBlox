import fs from 'fs';

const buf = fs.readFileSync('C:/Users/jacks/AppData/Local/Roblox/Versions/version-e7d81637d42c4b23/RobloxPlayerBeta.exe');
const target = Buffer.from('TaskSchedulerTargetFps', 'utf8');
const idx = buf.indexOf(target);
console.log('Index:', idx);
const chunk = buf.subarray(Math.max(0, idx - 400), Math.min(buf.length, idx + 400));
console.log(chunk.toString('utf8').replace(/[\x00-\x1F\x7F-\xFF]/g, '\n'));

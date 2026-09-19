import fs from 'fs';

const buf = fs.readFileSync('C:/Users/jacks/AppData/Local/Roblox/Versions/version-e7d81637d42c4b23/RobloxPlayerBeta.exe');
const chunk = buf.subarray(115665000, 115670000);
const strings = chunk.toString('utf8').split(/[\x00-\x1F\x7F-\xFF]+/).filter(s => s.length >= 3);
console.log(strings.join('\n'));

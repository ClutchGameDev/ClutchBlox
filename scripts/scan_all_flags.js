import fs from 'fs';

const buf = fs.readFileSync('C:/Users/jacks/AppData/Local/Roblox/Versions/version-e7d81637d42c4b23/RobloxPlayerBeta.exe');
const str = buf.toString('latin1');

// Match any identifier containing Sky, Atmosphere, or Cloud
const regex = /\b[A-Za-z0-9_]*(?:Sky|Atmosphere|Cloud)[A-Za-z0-9_]*\b/g;
const set = new Set();
let m;
while ((m = regex.exec(str)) !== null) {
  if (m[0].length >= 5 && m[0].length <= 50) {
    set.add(m[0]);
  }
}

console.log(`Found ${set.size} identifiers with Sky/Atmosphere/Cloud:`);
const arr = Array.from(set).filter(s => /^(?:Debug|Render|Graphics|Fix|Enable|Disable|Use|Force|Allow|F|DF)/i.test(s));
console.log(`Config/Flag candidates (${arr.length}):`);
console.log(arr.sort().join('\n'));

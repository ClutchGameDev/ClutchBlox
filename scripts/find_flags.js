import fs from 'fs';

const buf = fs.readFileSync('C:/Users/jacks/AppData/Local/Roblox/Versions/version-e7d81637d42c4b23/RobloxPlayerBeta.exe');
const target = Buffer.from('DebugSkyGray', 'utf8');
const idx = buf.indexOf(target);

// Search for any other "DebugSky" or "Sky" flags near it
const sub = buf.subarray(idx - 1000, idx + 1000);
const matches = sub.toString('latin1').match(/[A-Za-z0-9_]{4,40}/g) || [];
console.log('Words near DebugSkyGray:');
console.log(matches.filter(m => /Sky|Color|Debug|Gray|Atmosphere/i.test(m)));

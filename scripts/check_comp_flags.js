import fs from 'fs';

const buf = fs.readFileSync('C:/Users/jacks/AppData/Local/Roblox/Versions/version-e7d81637d42c4b23/RobloxPlayerBeta.exe');
const str = buf.toString('latin1');

const testFlags = [
  'DFIntTaskSchedulerTargetFps',
  'TaskSchedulerTargetFps',
  'FFlagDebugSkyGray',
  'DebugSkyGray',
  'FFlagDebugDisableMSAA',
  'DebugDisableMSAA',
  'FFlagSimDualProcessFastWait',
  'FIntFRMMinFPS',
  'FFlagHandleAltEnterFullscreenManually',
  'FFlagFastGPULightBugs',
  'FFlagGraphicsDisableVsync',
  'FFlagDisablePostFx',
  'FFlagDebugGraphicsDisableDirect3D11'
];

console.log('Checking flags in RobloxPlayerBeta.exe:');
for (const flag of testFlags) {
  const has = str.includes(flag);
  console.log(`${flag.padEnd(36)}: ${has}`);
}

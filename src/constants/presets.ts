import { GameModePreset } from "../types";

export const PRESETS: GameModePreset[] = [
  {
    id: "Competitive_Pro",
    name: "Competitive Gaming Pro",
    simpleDescription: "Gives you maximum speed, removes tall grass, stops sun glare, and makes enemies super easy to see.",
    colorHex: "#ff4b33",
    iconType: "crosshair",
    whatItDoes: "This mode makes your game run smoother, faster, and clearer! It turns the sky flat gray so bright sunlight won't blind you, removes tall grass so players can't hide, smooths rough edges, and unlocks high frame rates so you can react faster.",
    allowedGames: [
      "Works in all games!"
    ],
    extendedFeatures: [
      {
        title: "Server Radar & Auto-Ping Fixer",
        description: "Checks what city your server is in and tests your ping. If it's laggy, it automatically finds a closer server (up to 3 tries)!"
      },
      {
        title: "P-Core Power & Fast 0.5ms Timer",
        description: "Tells your computer to use its fastest processor cores for Roblox and speeds up your mouse clicks so your shots land instantly."
      },
      {
        title: "Smart Game Profile Switcher",
        description: "Automatically turns on flat gray sky and zero grass in shooting games like Rivals, but keeps pretty lights and graphics when playing fun obbies or hangout games!"
      },
      {
        title: "Flat Gray Sky",
        description: "Turns off blinding sun glare, fog, and clouds so you can spot other players from far away."
      },
      {
        title: "No Tall Grass",
        description: "Removes tall grass and bushes so hiding enemies cannot sneak up on you."
      },
      {
        title: "Smooth Edges (4x Anti-Aliasing)",
        description: "Cleans up jagged stair-step lines on blocks and player models for a crisp, smooth view."
      },
      {
        title: "Sharp 1:1 Pixel Vision",
        description: "Stops your screen from looking blurry so your crosshair and distant targets stay sharp."
      },
      {
        title: "Steady Shadow Lighting",
        description: "Freezes dark shadow shifts so dark rooms and corners stay easy to see inside."
      },
      {
        title: "Unlocked 240 FPS Speed",
        description: "Allows super high frame rates for butter-smooth camera movement and aiming."
      },
      {
        title: "Faster Click Speed (Low Latency)",
        description: "Cuts down input delay so your mouse clicks and movements happen instantly."
      },
      {
        title: "Clean Screen (No Motion Blur)",
        description: "Turns off dizzy motion blur and glowing screen bloom when you spin around."
      },
      {
        title: "Sharp Weapon & Player Textures",
        description: "Forces high texture sharpness on player skins, weapon sights, and objects."
      }
    ]
  },
  {
    id: "Default",
    name: "Stock Roblox",
    simpleDescription: "The normal Roblox look. Turns off all extra gaming boosts and puts regular game graphics and grass back.",
    colorHex: "#3f3f46",
    iconType: "sun",
    whatItDoes: "This resets everything back to normal Roblox! It turns off competitive boosts, brings back normal blue skies and green grass, and resets regular game settings.",
    allowedGames: [
      "Works in all games!"
    ],
    extendedFeatures: [
      {
        title: "Original Roblox Look",
        description: "Restores original blue skies, sunshine, and moving clouds."
      },
      {
        title: "Standard Game Settings",
        description: "Puts natural grass, shadows, and default graphics settings back to normal."
      }
    ]
  }
];


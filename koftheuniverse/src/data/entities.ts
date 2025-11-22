export interface Entity {
  id: string;
  name: string;
  description: string;
  spatialScale: string; // Text representation like "2 µm"
  powerWatts: number; // Normalized power in Watts (J/s)
  image?: string; // Placeholder for image path or emoji
  category: 'biological' | 'industrial' | 'cosmic';
}

export const entities: Entity[] = [
  {
    id: 'bacterium',
    name: 'Single Bacterium (E. coli)',
    description: 'A single celled organism relying on diffusion. Length ≈ 2 µm, diameter ≈ 1 µm.',
    spatialScale: '2 µm',
    powerWatts: 6.67e-13, // 4e-11 J/min
    category: 'biological',
    image: '🦠'
  },
  {
    id: 'neuron',
    name: 'Single Neuron',
    description: 'Soma ≈ 20 µm diameter, dendrites spread over a few hundred µm. Total arbor length can reach centimeters.',
    spatialScale: '~100 µm arbor',
    powerWatts: 5.0e-10, // 3e-8 J/min
    category: 'biological',
    image: '🧠'
  },
  {
    id: 'slime-starved',
    name: 'Slime Mold (Starved)',
    description: 'A 1g plasmodium in a quiescent state. Radius ≈ 2–3 cm.',
    spatialScale: '2-3 cm',
    powerWatts: 3.33e-4, // 2e-2 J/min
    category: 'biological',
    image: '🦠'
  },
  {
    id: 'slime-healthy',
    name: 'Slime Mold (Healthy)',
    description: 'A 1g plasmodium actively foraging. Radius ≈ 2–3 cm.',
    spatialScale: '2-3 cm',
    powerWatts: 1.0e-3, // 6e-2 J/min
    category: 'biological',
    image: '🦠'
  },
  {
    id: 'dolphin-1',
    name: 'Single Dolphin',
    description: 'Individual dolphin: length 2–4 m; mass ≈ 150–200 kg. Resting + moderate swimming metabolic rate.',
    spatialScale: '3 m',
    powerWatts: 433, // 2.6e4 J/min
    category: 'biological',
    image: '🐬'
  },
  {
    id: 'dolphin-3',
    name: 'Dolphin Pod (1st Order)',
    description: 'Small social group of 3 dolphins.',
    spatialScale: '~10 m',
    powerWatts: 1300, // 7.8e4 J/min
    category: 'biological',
    image: '🐬'
  },
  {
    id: 'song-coal',
    name: 'Song Dynasty Coal Furnace',
    description: 'Northern China heavily used bituminous coal. 1 kg burned uniformly over 1 hour in a furnace.',
    spatialScale: '2-3 m',
    powerWatts: 6700, // 6.7e3 J/s
    category: 'industrial',
    image: '🔥'
  },
  {
    id: 'dolphin-10',
    name: 'Dolphin Society (2nd Order)',
    description: 'Larger group of 10 dolphins. Dolphin societies organize into nested hierarchies.',
    spatialScale: '~20 m',
    powerWatts: 4333, // 2.6e5 J/min
    category: 'biological',
    image: '🐬'
  },
  {
    id: 'dolphin-30',
    name: 'Dolphin Society (3rd Order)',
    description: 'Large group of 30 dolphins. Fission-fusion dynamics lead to fluid social structures.',
    spatialScale: '~50 m',
    powerWatts: 13000, // 7.8e5 J/min
    category: 'biological',
    image: '🐬'
  },
  {
    id: 'iter-magnet',
    name: 'ITER Toroidal Magnet',
    description: 'Energy stored in the toroidal field system over 10 mins.',
    spatialScale: '10 m',
    powerWatts: 6.67e7, // 4e9 J/min
    category: 'industrial',
    image: '🧲'
  },
  {
    id: 'iter-plasma',
    name: 'ITER Tokamak Plasma',
    description: 'Expected plasma thermal energy during high-performance operation. Fusion power ≈ 500 MW.',
    spatialScale: '15-20 m',
    powerWatts: 5e8, // 500 MW
    category: 'industrial',
    image: '⚛️'
  },
  {
    id: 'fengman-hydropower',
    name: 'Fengman Hydropower Station',
    description: 'Major NE China plant on the Songhua River. Installed capacity ≈ 1 GW.',
    spatialScale: '~1 km',
    powerWatts: 1e9, // 1 GW
    category: 'industrial',
    image: '💧'
  },
  {
    id: 'daqing-oil',
    name: 'Daqing Oilfield',
    description: 'China’s largest oilfield. Peak production ≈ 40 Mt/year.',
    spatialScale: '>6 000 km²',
    powerWatts: 4.1e10, // ~1.3e18 J/yr
    category: 'industrial',
    image: '🛢️'
  },
  {
    id: 'planet-earth',
    name: 'Planet Earth',
    description: 'Total energy outputted by Earth. Input: 1.74e17 Watts.',
    spatialScale: '12 742 km',
    powerWatts: 4.4e11, // 4.4 * 10^11 Watts
    category: 'cosmic',
    image: '🌍'
  },
  {
    id: 'solar-system',
    name: 'Solar System (Sun)',
    description: 'Total luminosity of the Sun.',
    spatialScale: '1.4M km',
    powerWatts: 3.8e26,
    category: 'cosmic',
    image: '☀️'
  },
  {
    id: 'milky-way',
    name: 'Milky Way Galaxy',
    description: 'Estimated total luminosity of the Milky Way galaxy.',
    spatialScale: '100 000 ly',
    powerWatts: 1e37,
    category: 'cosmic',
    image: '🌌'
  }
];


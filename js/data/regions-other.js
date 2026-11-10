// New World / Arctic / Enbesa region data — extracted from knowledge/data/population-needs-v2.json
// (real per-tier consumption, converted t/sec -> t/min by *60), production-buildings-v2.json
// (real production chains, filtered to each region's regions[] list), and fertilities-resources.json
// (verified fertilities/resources/abundances per region). DLC-gated needs and skyscraper buckets
// are excluded, same convention as Old World. Needs with consumption_t_per_sec: null (service
// buildings like Market/Chapel/Canteen/Post Office) are also excluded — they have no good/rate.
window.ANNO_REGIONS = window.ANNO_REGIONS || {};

window.ANNO_REGIONS['new-world'] = {
  label: 'New World',
  tiers: [
    { key: 'jornaleros', label: 'Jornaleros', baseCapacity: 10, order: 1 },
    { key: 'obreros', label: 'Obreros', baseCapacity: 20, order: 2 },
    { key: 'artistas', label: 'Artistas', baseCapacity: 40, order: 3 }
  ],
  fertilities: ['Plantains', 'Sugar Cane', 'Cotton', 'Caoutchouc', 'Corn', 'Coffee Beans', 'Pearls', 'Tobacco', 'Cocoa', 'Herbs (DLC)', 'Orchid (DLC)'],
  resources: ['Clay', 'Gold Ore', 'Oil', 'Bauxite (DLC)', 'Helium (DLC)', 'Iron (DLC)', 'Minerals (DLC)'],
  abundances: ['Fish Oil', 'Alpaca Wool', 'Beef', 'Nandu Leather (DLC)', 'Calamari (DLC)', 'Forests (DLC)', 'Orchard (DLC)', 'Industrial Oil Press (DLC)'],
  needs: [
    { tier: 'jornaleros', good: 'Fried Plantains', type: 'basic', rate: 0.0285714, unlockType: 'local', unlockCount: 50 },
    { tier: 'jornaleros', good: 'Ponchos', type: 'basic', rate: 0.025, unlockType: 'local', unlockCount: 200 },
    { tier: 'jornaleros', good: 'Rum', type: 'luxury', rate: 0.0142857, unlockType: 'local', unlockCount: 100 },
    { tier: 'jornaleros', good: 'Work Clothes', type: 'lifestyle', rate: 0.015 },
    { tier: 'jornaleros', good: 'Felt', type: 'lifestyle', rate: 0.0225 },

    { tier: 'obreros', good: 'Fried Plantains', type: 'basic', rate: 0.0571429 },
    { tier: 'obreros', good: 'Ponchos', type: 'basic', rate: 0.05 },
    { tier: 'obreros', good: 'Tortillas', type: 'basic', rate: 0.0285714 },
    { tier: 'obreros', good: 'Coffee', type: 'basic', rate: 0.0117647, unlockType: 'local', unlockCount: 300 },
    { tier: 'obreros', good: 'Bombins', type: 'basic', rate: 0.0266667, unlockType: 'local', unlockCount: 600 },
    { tier: 'obreros', good: 'Sewing Machines', type: 'basic', rate: 0.025, unlockType: 'local', unlockCount: 1000 },
    { tier: 'obreros', good: 'Rum', type: 'luxury', rate: 0.0285715 },
    { tier: 'obreros', good: 'Beer', type: 'luxury', rate: 0.0266667, unlockType: 'local', unlockCount: 600 },
    { tier: 'obreros', good: 'Cigars', type: 'luxury', rate: 0.0111111, unlockType: 'local', unlockCount: 1000 },
    { tier: 'obreros', good: 'Spectacles', type: 'lifestyle', rate: 0.008 },

    { tier: 'artistas', good: 'Tortillas', type: 'basic', rate: 0.0285714 },
    { tier: 'artistas', good: 'Sewing Machines', type: 'basic', rate: 0.025 },
    { tier: 'artistas', good: 'Coffee', type: 'basic', rate: 0.0117647 },
    { tier: 'artistas', good: 'Bombins', type: 'basic', rate: 0.0266667 },
    { tier: 'artistas', good: 'Soccer Balls', type: 'basic', rate: 0.025, unlockType: 'local', unlockCount: 2 },
    { tier: 'artistas', good: 'Mezcal', type: 'basic', rate: 0.0571429 },
    { tier: 'artistas', good: 'Jalea', type: 'basic', rate: 0.033, unlockType: 'local', unlockCount: 900 },
    { tier: 'artistas', good: 'Perfumes', type: 'basic', rate: 0.05, unlockType: 'local', unlockCount: 2700 },
    { tier: 'artistas', good: 'Fans', type: 'basic', rate: 0.00312, unlockType: 'local', unlockCount: 4000 },
    { tier: 'artistas', good: 'Scooter', type: 'basic', rate: 0.0017388, unlockType: 'local', unlockCount: 6000 },
    { tier: 'artistas', good: 'Beer', type: 'luxury', rate: 0.0533333 },
    { tier: 'artistas', good: 'Cigars', type: 'luxury', rate: 0.0111111 },
    { tier: 'artistas', good: 'Ice Cream', type: 'luxury', rate: 0.005394, unlockType: 'local', unlockCount: 1800 },
    { tier: 'artistas', good: 'Light Bulbs', type: 'lifestyle', rate: 0.02 },
    { tier: 'artistas', good: 'Champagne', type: 'lifestyle', rate: 0.018 },
    { tier: 'artistas', good: 'Jewelry', type: 'lifestyle', rate: 0.02 }
  ],
  chains: [
    { finalGood: 'Fried Plantains', name: 'Fried Plantains chain', builds: [
      { name: 'Plantain Plantation', good: 'Plantains', outputRate: 2, count: 1, inputs: [] },
      { name: 'Fish Oil Factory', good: 'Fish Oil', outputRate: 2, count: 1, inputs: [] },
      { name: 'Fried Plantain Kitchen', good: 'Fried Plantains', outputRate: 2, count: 1, inputs: [{ good: 'Fish Oil', rate: 2, category: 'agricultural' }, { good: 'Plantains', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Ponchos', name: 'Ponchos chain', builds: [
      { name: 'Alpaca Farm', good: 'Alpaca Wool', outputRate: 2, count: 1, inputs: [] },
      { name: 'Poncho Darner', good: 'Ponchos', outputRate: 2, count: 1, inputs: [{ good: 'Alpaca Wool', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Rum', name: 'Rum chain', builds: [
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Sugar Cane Plantation', good: 'Sugar Cane', outputRate: 2, count: 2, inputs: [] },
      { name: 'Rum Distillery', good: 'Rum', outputRate: 2, count: 2, inputs: [{ good: 'Wood', rate: 4, category: 'agricultural' }, { good: 'Sugar Cane', rate: 4, category: 'agricultural' }] }
    ]},
    { finalGood: 'Felt', name: 'Felt chain', builds: [
      { name: 'Alpaca Farm', good: 'Alpaca Wool', outputRate: 2, count: 1, inputs: [] },
      { name: 'Felt Producer', good: 'Felt', outputRate: 2, count: 1, inputs: [{ good: 'Alpaca Wool', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Tortillas', name: 'Tortillas chain', builds: [
      { name: 'Cattle Farm', good: 'Beef', outputRate: 1, count: 2, inputs: [] },
      { name: 'Corn Farm', good: 'Corn', outputRate: 1, count: 2, inputs: [] },
      { name: 'Tortilla Maker', good: 'Tortillas', outputRate: 2, count: 1, inputs: [{ good: 'Beef', rate: 2, category: 'agricultural' }, { good: 'Corn', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Coffee', name: 'Coffee chain', builds: [
      { name: 'Coffee Plantation', good: 'Coffee Beans', outputRate: 1, count: 2, inputs: [] },
      { name: 'Coffee Roaster', good: 'Coffee', outputRate: 2, count: 1, inputs: [{ good: 'Coffee Beans', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Bombins', name: 'Bombins chain', builds: [
      { name: 'Cotton Plantation', good: 'Cotton', outputRate: 1, count: 2, inputs: [] },
      { name: 'Cotton Mill', good: 'Cotton Fabric', outputRate: 2, count: 1, inputs: [{ good: 'Cotton', rate: 2, category: 'agricultural' }] },
      { name: 'Alpaca Farm', good: 'Alpaca Wool', outputRate: 2, count: 1, inputs: [] },
      { name: 'Felt Producer', good: 'Felt', outputRate: 2, count: 1, inputs: [{ good: 'Alpaca Wool', rate: 2, category: 'agricultural' }] },
      { name: 'Bombín Weaver', good: 'Bombins', outputRate: 2, count: 1, inputs: [{ good: 'Cotton Fabric', rate: 2, category: 'intermediate' }, { good: 'Felt', rate: 2, category: 'intermediate' }] }
    ]},
    { finalGood: 'Sewing Machines', name: 'Sewing Machines chain', builds: [
      { name: 'Bauxite Mine', good: 'Bauxite', outputRate: 6, count: 1, inputs: [] },
      { name: 'Charcoal Kiln', good: 'Coal', outputRate: 2, count: 1, inputs: [] },
      { name: 'Aluminium Smelter', good: 'Aluminium Profiles', outputRate: 0.667, count: 3, inputs: [{ good: 'Bauxite', rate: 2, category: 'raw' }, { good: 'Coal', rate: 2, category: 'raw' }] },
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Sewing Machine Factory', good: 'Sewing Machines', outputRate: 2, count: 1, inputs: [{ good: 'Wood', rate: 2, category: 'agricultural' }, { good: 'Aluminium Profiles', rate: 2, category: 'intermediate' }] }
    ], note: 'New World variant uses Aluminium Profiles instead of Steel — Old World/Cape Trelawney Sewing Machine Factory uses Wood + Steel instead.' },
    { finalGood: 'Beer', name: 'Beer chain', builds: [
      { name: 'Hacienda Grain Farm', good: 'Grain', outputRate: 1, count: 1, inputs: [] },
      { name: 'Corn Farm', good: 'Corn', outputRate: 1, count: 1, inputs: [] },
      { name: 'Hacienda Beer Brewery', good: 'Beer', outputRate: 1, count: 1, inputs: [{ good: 'Grain', rate: 1, category: 'agricultural' }, { good: 'Corn', rate: 1, category: 'agricultural' }] }
    ], note: "New World variant (Hacienda Beer Brewery) uses Grain + Corn instead of the Old World's Hops + Malt." },
    { finalGood: 'Cigars', name: 'Cigars chain', builds: [
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Marquetry Workshop', good: 'Wood Veneers', outputRate: 1, count: 2, inputs: [{ good: 'Wood', rate: 2, category: 'agricultural' }] },
      { name: 'Tobacco Plantation', good: 'Tobacco', outputRate: 0.5, count: 4, inputs: [] },
      { name: 'Cigar Factory', good: 'Cigars', outputRate: 2, count: 1, inputs: [{ good: 'Wood Veneers', rate: 2, category: 'intermediate' }, { good: 'Tobacco', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Soccer Balls', name: 'Soccer Balls chain', builds: [
      { name: 'Nandu Farm', good: 'Nandu Leather', outputRate: 2, count: 1, inputs: [] },
      { name: 'Caoutchouc Plantation', good: 'Caoutchouc', outputRate: 1, count: 2, inputs: [] },
      { name: 'Ball Manufactory', good: 'Soccer Balls', outputRate: 2, count: 1, inputs: [{ good: 'Nandu Leather', rate: 2, category: 'agricultural' }, { good: 'Caoutchouc', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Mezcal', name: 'Mezcal chain', builds: [
      { name: 'Orchard: Citrus', good: 'Citrus', outputRate: 2, count: 1, inputs: [] },
      { name: 'Sugar Cane Plantation', good: 'Sugar Cane', outputRate: 2, count: 1, inputs: [] },
      { name: 'Sugar Refinery', good: 'Sugar', outputRate: 2, count: 1, inputs: [{ good: 'Sugar Cane', rate: 2, category: 'agricultural' }] },
      { name: 'Herb Garden', good: 'Herbs', outputRate: 2, count: 1, inputs: [] },
      { name: 'Mezcal Bar', good: 'Mezcal', outputRate: 2, count: 1, inputs: [{ good: 'Citrus', rate: 2, category: 'agricultural' }, { good: 'Sugar', rate: 2, category: 'intermediate' }, { good: 'Herbs', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Jalea', name: 'Jalea chain', builds: [
      { name: 'Calamari Fishery', good: 'Calamari', outputRate: 1, count: 2, inputs: [] },
      { name: 'Herb Garden', good: 'Herbs', outputRate: 2, count: 1, inputs: [] },
      { name: 'Corn Farm', good: 'Corn', outputRate: 1, count: 2, inputs: [] },
      { name: 'Jalea Kitchen', good: 'Jalea', outputRate: 2, count: 1, inputs: [{ good: 'Calamari', rate: 2, category: 'agricultural' }, { good: 'Herbs', rate: 2, category: 'agricultural' }, { good: 'Corn', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Perfumes', name: 'Perfumes chain', builds: [
      { name: 'Orchid Farm', good: 'Orchid', outputRate: 2, count: 1, inputs: [] },
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Corn Farm', good: 'Corn', outputRate: 1, count: 2, inputs: [] },
      { name: 'Chemical Plant: Ethanol', good: 'Ethanol', outputRate: 2, count: 1, inputs: [{ good: 'Wood', rate: 2, category: 'agricultural' }, { good: 'Corn', rate: 2, category: 'agricultural' }] },
      { name: 'Orchard: Coconut Oil', good: 'Coconut Oil', outputRate: 2, count: 1, inputs: [] },
      { name: 'Perfume Mixer', good: 'Perfumes', outputRate: 1, count: 2, inputs: [{ good: 'Orchid', rate: 2, category: 'agricultural' }, { good: 'Ethanol', rate: 2, category: 'intermediate' }, { good: 'Coconut Oil', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Ice Cream', name: 'Ice Cream chain', builds: [
      { name: 'Pasture', good: 'Milk', outputRate: 1, count: 2, inputs: [] },
      { name: 'Sugar Cane Plantation', good: 'Sugar Cane', outputRate: 2, count: 1, inputs: [] },
      { name: 'Sugar Refinery', good: 'Sugar', outputRate: 2, count: 1, inputs: [{ good: 'Sugar Cane', rate: 2, category: 'agricultural' }] },
      { name: 'Cocoa Plantation', good: 'Cocoa', outputRate: 1, count: 2, inputs: [] },
      { name: 'Chocolate Factory', good: 'Chocolate', outputRate: 2, count: 1, inputs: [{ good: 'Sugar', rate: 2, category: 'intermediate' }, { good: 'Cocoa', rate: 2, category: 'agricultural' }] },
      { name: 'Orchard: Citrus', good: 'Citrus', outputRate: 2, count: 1, inputs: [] },
      { name: 'Ice Cream Factory', good: 'Ice Cream', outputRate: 1, count: 2, inputs: [{ good: 'Milk', rate: 2, category: 'agricultural' }, { good: 'Chocolate', rate: 2, category: 'intermediate' }, { good: 'Citrus', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Fans', name: 'Fans chain', builds: [
      { name: 'Fan Factory', good: 'Fans', outputRate: 1, count: 1, inputs: [{ good: 'Motor', rate: 1, category: 'intermediate' }, { good: 'Aluminium Profiles', rate: 1, category: 'intermediate' }] }
    ], note: "Motor has no chain modeled yet (it needs Electric Cables + Celluloid + Steel, each a multi-step chain of its own) — this shows a permanent Motor deficit in Supply Chain until that's built out. Aluminium Profiles is already modeled above in the Sewing Machines chain."},
    { finalGood: 'Scooter', name: 'Scooter chain', builds: [
      { name: 'Scooter Factory', good: 'Scooter', outputRate: 0.5, count: 1, inputs: [{ good: 'Motor', rate: 0.5, category: 'intermediate' }, { good: 'Pigments', rate: 0.5, category: 'intermediate' }, { good: 'Caoutchouc', rate: 0.5, category: 'agricultural' }] }
    ], note: 'Motor and Pigments have no chains modeled yet — permanent deficits for both in Supply Chain until built out. Caoutchouc is already modeled above in the Soccer Balls chain.'}
  ]
};

window.ANNO_REGIONS['arctic'] = {
  label: 'Arctic',
  tiers: [
    { key: 'explorers', label: 'Explorers', baseCapacity: 10, order: 1 },
    { key: 'technicians', label: 'Technicians', baseCapacity: 20, order: 2 }
  ],
  fertilities: ['Forests', 'Whales (Whale Oil)', 'Caribou (Caribou Meat)', 'Seals (Seal Skin)', 'Bears (Bear Fur)', 'Fur'],
  resources: ['Gold Ore', 'Arctic Gas'],
  abundances: ['Geese (Goose Feathers)', 'Huskies'],
  needs: [
    { tier: 'explorers', good: 'Pemmican', type: 'basic', rate: 0.012, unlockType: 'local', unlockCount: 100 },
    { tier: 'explorers', good: 'Oil Lamps', type: 'basic', rate: 0.006, unlockType: 'local', unlockCount: 500 },
    { tier: 'explorers', good: 'Sleeping Bags', type: 'luxury', rate: 0.009, unlockType: 'local', unlockCount: 250 },
    { tier: 'explorers', good: 'Schnapps', type: 'luxury', rate: 0.015, unlockType: 'local', unlockCount: 500 },
    { tier: 'explorers', good: 'Bread', type: 'lifestyle', rate: 0.01 },
    { tier: 'explorers', good: 'Tallow', type: 'lifestyle', rate: 0.03 },

    { tier: 'technicians', good: 'Pemmican', type: 'basic', rate: 0.024 },
    { tier: 'technicians', good: 'Oil Lamps', type: 'basic', rate: 0.012 },
    { tier: 'technicians', good: 'Canned Food', type: 'basic', rate: 0.012, unlockType: 'local', unlockCount: 300 },
    { tier: 'technicians', good: 'Husky Sleds', type: 'basic', rate: 0.018, unlockType: 'local', unlockCount: 750 },
    { tier: 'technicians', good: 'Sleeping Bags', type: 'luxury', rate: 0.018 },
    { tier: 'technicians', good: 'Schnapps', type: 'luxury', rate: 0.03 },
    { tier: 'technicians', good: 'Parkas', type: 'luxury', rate: 0.024, unlockType: 'local', unlockCount: 300 },
    { tier: 'technicians', good: 'Coffee', type: 'luxury', rate: 0.024, unlockType: 'local', unlockCount: 750 },
    { tier: 'technicians', good: 'Rum', type: 'lifestyle', rate: 0.03 },
    { tier: 'technicians', good: 'Dynamite', type: 'lifestyle', rate: 0.006 }
  ],
  chains: [
    { finalGood: 'Pemmican', name: 'Pemmican chain', builds: [
      { name: 'Whaling Station', good: 'Whale Oil', outputRate: 1, count: 1, inputs: [] },
      { name: 'Caribou Hunting Cabin', good: 'Caribou Meat', outputRate: 1, count: 1, inputs: [] },
      { name: 'Pemmican Cookhouse', good: 'Pemmican', outputRate: 1, count: 1, inputs: [{ good: 'Whale Oil', rate: 1, category: 'agricultural' }, { good: 'Caribou Meat', rate: 1, category: 'agricultural' }] }
    ]},
    { finalGood: 'Sleeping Bags', name: 'Sleeping Bags chain', builds: [
      { name: 'Seal Hunting Docks', good: 'Seal Skin', outputRate: 2, count: 1, inputs: [] },
      { name: 'Goose Farm', good: 'Goose Feathers', outputRate: 0.5, count: 2, inputs: [] },
      { name: 'Sleeping Bag Factory', good: 'Sleeping Bags', outputRate: 1, count: 1, inputs: [{ good: 'Seal Skin', rate: 1, category: 'agricultural' }, { good: 'Goose Feathers', rate: 1, category: 'agricultural' }] }
    ]},
    { finalGood: 'Husky Sleds', name: 'Husky Sleds chain', builds: [
      { name: 'Husky Farm', good: 'Huskies', outputRate: 0.5, count: 2, inputs: [] },
      { name: 'Seal Hunting Docks', good: 'Seal Skin', outputRate: 2, count: 1, inputs: [] },
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Sled Frame Factory', good: 'Sleds', outputRate: 1, count: 1, inputs: [{ good: 'Seal Skin', rate: 1, category: 'agricultural' }, { good: 'Wood', rate: 1, category: 'agricultural' }] },
      { name: 'Husky Sled Factory', good: 'Husky Sleds', outputRate: 1, count: 1, inputs: [{ good: 'Huskies', rate: 1, category: 'agricultural' }, { good: 'Sleds', rate: 1, category: 'intermediate' }] }
    ]},
    { finalGood: 'Parkas', name: 'Parkas chain', builds: [
      { name: 'Bear Hunting Cabin', good: 'Bear Fur', outputRate: 0.667, count: 3, inputs: [] },
      { name: 'Seal Hunting Docks', good: 'Seal Skin', outputRate: 2, count: 1, inputs: [] },
      { name: 'Parka Factory', good: 'Parkas', outputRate: 0.667, count: 3, inputs: [{ good: 'Bear Fur', rate: 2, category: 'agricultural' }, { good: 'Seal Skin', rate: 2, category: 'agricultural' }] }
    ]}
  ]
};

window.ANNO_REGIONS['enbesa'] = {
  label: 'Enbesa',
  tiers: [
    { key: 'shepherds', label: 'Shepherds', baseCapacity: 10, order: 1 },
    { key: 'elders', label: 'Elders', baseCapacity: 20, order: 2 }
  ],
  fertilities: ['Linseed', 'Hibiscus', 'Teff', 'Indigo', 'Spice', 'Lobster', 'Bee'],
  resources: ['Clay'],
  abundances: ['Wanza Trees', 'Goats', 'Salt', 'Sanga Cows'],
  needs: [
    { tier: 'shepherds', good: 'Goat Milk', type: 'basic', rate: 0.03, unlockType: 'local', unlockCount: 50 },
    { tier: 'shepherds', good: 'Finery', type: 'basic', rate: 0.015, unlockType: 'local', unlockCount: 150 },
    { tier: 'shepherds', good: 'Dried Meat', type: 'basic', rate: 0.021, unlockType: 'local', unlockCount: 300 },
    { tier: 'shepherds', good: 'Hibiscus Tea', type: 'luxury', rate: 0.012, unlockType: 'local', unlockCount: 300 },
    { tier: 'shepherds', good: 'Grain', type: 'lifestyle', rate: 0.00875 },
    { tier: 'shepherds', good: 'Ponchos', type: 'lifestyle', rate: 0.032 },
    { tier: 'shepherds', good: 'Canned Food', type: 'lifestyle', rate: 0.01 },

    { tier: 'elders', good: 'Goat Milk', type: 'basic', rate: 0.06 },
    { tier: 'elders', good: 'Finery', type: 'basic', rate: 0.03 },
    { tier: 'elders', good: 'Dried Meat', type: 'basic', rate: 0.042 },
    { tier: 'elders', good: 'Ceramics', type: 'basic', rate: 0.024 },
    { tier: 'elders', good: 'Seafood Stew', type: 'basic', rate: 0.0222, unlockType: 'local', unlockCount: 300 },
    { tier: 'elders', good: 'Illuminated Script', type: 'basic', rate: 0.0108, unlockType: 'local', unlockCount: 600 },
    { tier: 'elders', good: 'Lanterns', type: 'basic', rate: 0.018, unlockType: 'local', unlockCount: 1000 },
    { tier: 'elders', good: 'Hibiscus Tea', type: 'luxury', rate: 0.024 },
    { tier: 'elders', good: 'Tapestries', type: 'luxury', rate: 0.021 },
    { tier: 'elders', good: 'Clay Pipes', type: 'luxury', rate: 0.009, unlockType: 'local', unlockCount: 300 },
    { tier: 'elders', good: 'Spectacles', type: 'luxury', rate: 0.0072, unlockType: 'local', unlockCount: 600 },
    { tier: 'elders', good: 'Cotton Fabric', type: 'lifestyle', rate: 0.06 },
    { tier: 'elders', good: 'Sewing Machines', type: 'lifestyle', rate: 0.018 },
    { tier: 'elders', good: 'Soap', type: 'lifestyle', rate: 0.01 }
  ],
  chains: [
    { finalGood: 'Goat Milk', name: 'Goat Milk chain', builds: [
      { name: 'Goat Farm', good: 'Goat Milk', outputRate: 1, count: 1, inputs: [] }
    ]},
    { finalGood: 'Finery', name: 'Finery chain', builds: [
      { name: 'Linseed Farm', good: 'Linseed', outputRate: 1, count: 2, inputs: [] },
      { name: 'Linen Mill', good: 'Linen', outputRate: 2, count: 1, inputs: [{ good: 'Linseed', rate: 2, category: 'agricultural' }] },
      { name: 'Embroiderer', good: 'Finery', outputRate: 1, count: 2, inputs: [{ good: 'Linen', rate: 2, category: 'intermediate' }] }
    ]},
    { finalGood: 'Dried Meat', name: 'Dried Meat chain', builds: [
      { name: 'Sanga Farm', good: 'Sanga Cow', outputRate: 1, count: 2, inputs: [] },
      { name: 'Salt Works', good: 'Salt', outputRate: 2, count: 1, inputs: [] },
      { name: 'Dry-House', good: 'Dried Meat', outputRate: 2, count: 1, inputs: [{ good: 'Sanga Cow', rate: 2, category: 'agricultural' }, { good: 'Salt', rate: 2, category: 'raw' }] }
    ]},
    { finalGood: 'Hibiscus Tea', name: 'Hibiscus Tea chain', builds: [
      { name: 'Hibiscus Farm', good: 'Hibiscus Petals', outputRate: 1, count: 2, inputs: [] },
      { name: 'Tea Spicer', good: 'Hibiscus Tea', outputRate: 0.667, count: 3, inputs: [{ good: 'Hibiscus Petals', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Ceramics', name: 'Ceramics chain', builds: [
      { name: 'Clay Collector', good: 'Clay', outputRate: 4, count: 1, inputs: [] },
      { name: 'Indigo Farm', good: 'Indigo Dye', outputRate: 1, count: 2, inputs: [] },
      { name: 'Ceramics Workshop', good: 'Ceramics', outputRate: 2, count: 1, inputs: [{ good: 'Clay', rate: 2, category: 'raw' }, { good: 'Indigo Dye', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Seafood Stew', name: 'Seafood Stew chain', builds: [
      { name: 'Teff Farm', good: 'Teff', outputRate: 1, count: 2, inputs: [] },
      { name: 'Spice Farm', good: 'Spices', outputRate: 1, count: 2, inputs: [] },
      { name: 'Teff Mill', good: 'Spiced Flour', outputRate: 2, count: 1, inputs: [{ good: 'Teff', rate: 2, category: 'agricultural' }, { good: 'Spices', rate: 2, category: 'agricultural' }] },
      { name: 'Lobster Fishery', good: 'Lobster', outputRate: 1, count: 2, inputs: [] },
      { name: 'Wat Kitchen', good: 'Seafood Stew', outputRate: 1, count: 2, inputs: [{ good: 'Lobster', rate: 2, category: 'agricultural' }, { good: 'Spiced Flour', rate: 2, category: 'intermediate' }] }
    ]},
    { finalGood: 'Tapestries', name: 'Tapestries chain', builds: [
      { name: 'Linseed Farm', good: 'Linseed', outputRate: 1, count: 2, inputs: [] },
      { name: 'Linen Mill', good: 'Linen', outputRate: 2, count: 1, inputs: [{ good: 'Linseed', rate: 2, category: 'agricultural' }] },
      { name: 'Indigo Farm', good: 'Indigo Dye', outputRate: 1, count: 2, inputs: [] },
      { name: 'Tapestry Looms', good: 'Tapestries', outputRate: 2, count: 1, inputs: [{ good: 'Linen', rate: 2, category: 'intermediate' }, { good: 'Indigo Dye', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Illuminated Script', name: 'Illuminated Script chain', builds: [
      { name: 'Indigo Farm', good: 'Indigo Dye', outputRate: 1, count: 1, inputs: [] },
      { name: 'Paper Mill', good: 'Paper', outputRate: 4, count: 1, inputs: [{ good: 'Wood', rate: 4, category: 'raw' }] },
      { name: 'Luminer', good: 'Illuminated Script', outputRate: 1, count: 1, inputs: [{ good: 'Indigo Dye', rate: 1, category: 'agricultural' }, { good: 'Paper', rate: 1, category: 'intermediate' }] }
    ], note: "Paper Mill needs Wood, which has no Enbesa source in the knowledge base (Lumberjack's Hut isn't tagged for this region) — permanent Wood deficit until Trade brings it in."},
    { finalGood: 'Lanterns', name: 'Lanterns chain', builds: [
      { name: 'Apiary', good: 'Beeswax', outputRate: 2, count: 1, inputs: [] },
      { name: 'Chandler', good: 'Ornate Candles', outputRate: 2, count: 1, inputs: [{ good: 'Beeswax', rate: 2, category: 'agricultural' }, { good: 'Cotton', rate: 2, category: 'agricultural' }] },
      { name: 'Lanternsmith', good: 'Lanterns', outputRate: 1, count: 1, inputs: [{ good: 'Ornate Candles', rate: 1, category: 'intermediate' }, { good: 'Glass', rate: 1, category: 'intermediate' }] }
    ], note: 'Cotton (Chandler) and Glass (Lanternsmith) have no Enbesa source in the knowledge base — permanent deficits here until Trade brings them in from New World/Old World.'},
    { finalGood: 'Clay Pipes', name: 'Clay Pipes chain', builds: [
      { name: 'Clay Collector', good: 'Clay', outputRate: 4, count: 1, inputs: [] },
      { name: 'Pipe Maker', good: 'Clay Pipes', outputRate: 0.667, count: 1, inputs: [{ good: 'Clay', rate: 0.667, category: 'raw' }, { good: 'Tobacco', rate: 0.667, category: 'agricultural' }] }
    ], note: "Tobacco has no Enbesa source (it's a New World fertility good) — permanent deficit until Trade brings it in. Also fixed a naming mismatch: the Elders need entry said \"Clay Pipe\" (singular), which wouldn't have matched this building's actual output good in Supply Chain."}
  ]
};

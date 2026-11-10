// Old World region data — migrated from the hand-authored index.html, same numbers, no changes.
window.ANNO_REGIONS = window.ANNO_REGIONS || {};
window.ANNO_REGIONS['old-world'] = {
  label: 'Old World',
  tiers: [
    { key: 'farmers', label: 'Farmers', baseCapacity: 10, order: 1 },
    { key: 'workers', label: 'Workers', baseCapacity: 20, order: 2 },
    { key: 'artisans', label: 'Artisans', baseCapacity: 30, order: 3 },
    { key: 'engineers', label: 'Engineers', baseCapacity: 40, order: 4 },
    { key: 'investors', label: 'Investors', baseCapacity: 50, order: 5 }
  ],
  fertilities: ['Potatoes', 'Grain', 'Hops', 'Red Peppers', 'Furs', 'Saltpetre', 'Grapes'],
  resources: ['Iron', 'Clay', 'Coal', 'Cement', 'Copper', 'Zinc', 'Oil'],
  abundances: ['Fish', 'Wool', 'Pigs', 'Quartz Sand', 'Beef', 'Forests', 'Orchard (DLC)'],
  needs: [
    { tier: 'farmers', good: 'Fish', type: 'basic', rate: 0.025 },
    { tier: 'farmers', good: 'Work Clothes', type: 'basic', rate: 0.0307692 },
    { tier: 'farmers', good: 'Schnapps', type: 'luxury', rate: 0.0333336 },
    { tier: 'farmers', good: 'Local Mail', type: 'lifestyle', rate: 0.016 },
    { tier: 'farmers', good: 'Regional Mail', type: 'lifestyle', rate: 0.008 },
    { tier: 'farmers', good: 'Overseas Mail', type: 'lifestyle', rate: 0.003 },
    { tier: 'farmers', good: 'Flour', type: 'lifestyle', rate: 0.024 },
    { tier: 'farmers', good: 'Sugar', type: 'lifestyle', rate: 0.012 },
    { tier: 'farmers', good: 'Jam', type: 'lifestyle', rate: 0.02 },
    { tier: 'farmers', good: 'Soap', type: 'lifestyle', rate: 0.0035 },
    { tier: 'farmers', good: 'Herbs', type: 'lifestyle', rate: 0.017 },
    { tier: 'farmers', good: 'Hibiscus Petals', type: 'lifestyle', rate: 0.01 },

    { tier: 'workers', good: 'Fish', type: 'basic', rate: 0.05 },
    { tier: 'workers', good: 'Work Clothes', type: 'basic', rate: 0.0615385 },
    { tier: 'workers', good: 'Sausages', type: 'basic', rate: 0.02 },
    { tier: 'workers', good: 'Bread', type: 'basic', rate: 0.0181818 },
    { tier: 'workers', good: 'Soap', type: 'basic', rate: 0.0083333, unlockType: 'local', unlockCount: 300 },
    { tier: 'workers', good: 'Schnapps', type: 'luxury', rate: 0.0666667 },
    { tier: 'workers', good: 'Beer', type: 'luxury', rate: 0.0153846, unlockType: 'local', unlockCount: 500 },
    { tier: 'workers', good: 'Local Mail', type: 'lifestyle', rate: 0.0325 },
    { tier: 'workers', good: 'Regional Mail', type: 'lifestyle', rate: 0.008 },
    { tier: 'workers', good: 'Overseas Mail', type: 'lifestyle', rate: 0.0075 },
    { tier: 'workers', good: 'Rum', type: 'lifestyle', rate: 0.02 },
    { tier: 'workers', good: 'Penny Farthings', type: 'lifestyle', rate: 0.008 },
    { tier: 'workers', good: 'Hot Sauce', type: 'lifestyle', rate: 0.01 },
    { tier: 'workers', good: 'Beef', type: 'lifestyle', rate: 0.0125 },
    { tier: 'workers', good: 'Soccer Balls', type: 'lifestyle', rate: 0.01 },
    { tier: 'workers', good: 'Clay Pipes', type: 'lifestyle', rate: 0.0066667 },

    { tier: 'artisans', good: 'Sausages', type: 'basic', rate: 0.04 },
    { tier: 'artisans', good: 'Bread', type: 'basic', rate: 0.0363637 },
    { tier: 'artisans', good: 'Soap', type: 'basic', rate: 0.0166667 },
    { tier: 'artisans', good: 'Canned Food', type: 'basic', rate: 0.0102564 },
    { tier: 'artisans', good: 'Sewing Machines', type: 'basic', rate: 0.0285714, unlockType: 'local', unlockCount: 250 },
    { tier: 'artisans', good: 'Fur Coats', type: 'basic', rate: 0.0266666, unlockType: 'local', unlockCount: 900 },
    { tier: 'artisans', good: 'Beer', type: 'luxury', rate: 0.0307693 },
    { tier: 'artisans', good: 'Rum', type: 'luxury', rate: 0.0571429, unlockType: 'local', unlockCount: 500 },
    { tier: 'artisans', good: 'Local Mail', type: 'lifestyle', rate: 0.046 },
    { tier: 'artisans', good: 'Regional Mail', type: 'lifestyle', rate: 0.011 },
    { tier: 'artisans', good: 'Overseas Mail', type: 'lifestyle', rate: 0.01 },
    { tier: 'artisans', good: 'Wool', type: 'lifestyle', rate: 0.06 },
    { tier: 'artisans', good: 'Clay', type: 'lifestyle', rate: 0.08 },
    { tier: 'artisans', good: 'Paper', type: 'lifestyle', rate: 0.03 },
    { tier: 'artisans', good: 'Soccer Balls', type: 'lifestyle', rate: 0.02 },
    { tier: 'artisans', good: 'Perfumes', type: 'lifestyle', rate: 0.0075 },
    { tier: 'artisans', good: 'Scooter', type: 'lifestyle', rate: 0.0065 },

    { tier: 'engineers', good: 'Canned Food', type: 'basic', rate: 0.0205128 },
    { tier: 'engineers', good: 'Sewing Machines', type: 'basic', rate: 0.0571429 },
    { tier: 'engineers', good: 'Fur Coats', type: 'basic', rate: 0.0533333 },
    { tier: 'engineers', good: 'Spectacles', type: 'basic', rate: 0.0088889 },
    { tier: 'engineers', good: 'Coffee', type: 'basic', rate: 0.0470588, unlockType: 'local', unlockCount: 1000 },
    { tier: 'engineers', good: 'Light Bulbs', type: 'basic', rate: 0.0125, unlockType: 'local', unlockCount: 1750 },
    { tier: 'engineers', good: 'Rum', type: 'luxury', rate: 0.1142857 },
    { tier: 'engineers', good: 'Penny Farthings', type: 'luxury', rate: 0.025, unlockType: 'local', unlockCount: 500 },
    { tier: 'engineers', good: 'Pocket Watches', type: 'luxury', rate: 0.0078431, unlockType: 'local', unlockCount: 1000 },
    { tier: 'engineers', good: 'Soap', type: 'lifestyle', rate: 0.03125 },
    { tier: 'engineers', good: 'Chocolate', type: 'lifestyle', rate: 0.015 },

    { tier: 'investors', good: 'Spectacles', type: 'basic', rate: 0.0177778 },
    { tier: 'investors', good: 'Coffee', type: 'basic', rate: 0.0941176 },
    { tier: 'investors', good: 'Light Bulbs', type: 'basic', rate: 0.025 },
    { tier: 'investors', good: 'Champagne', type: 'basic', rate: 0.02352 },
    { tier: 'investors', good: 'Cigars', type: 'basic', rate: 0.0222222, unlockType: 'local', unlockCount: 750 },
    { tier: 'investors', good: 'Chocolate', type: 'basic', rate: 0.0533333, unlockType: 'local', unlockCount: 1750 },
    { tier: 'investors', good: 'Steam Carriages', type: 'basic', rate: 0.0066667, unlockType: 'local', unlockCount: 5000 },
    { tier: 'investors', good: 'Penny Farthings', type: 'luxury', rate: 0.05 },
    { tier: 'investors', good: 'Pocket Watches', type: 'luxury', rate: 0.0156863 },
    { tier: 'investors', good: 'Jewellery', type: 'luxury', rate: 0.0210526, unlockType: 'local', unlockCount: 1750 },
    { tier: 'investors', good: 'Gramophones', type: 'luxury', rate: 0.005262, unlockType: 'local', unlockCount: 3000 },
    { tier: 'investors', good: 'Furs', type: 'lifestyle', rate: 0.016 }
  ],
  chains: [
    { finalGood: 'Fish', name: 'Fish chain', builds: [
      { name: 'Fishery', good: 'Fish', outputRate: 2, count: 1, inputs: [] }
    ]},
    { finalGood: 'Work Clothes', name: 'Work Clothes chain', builds: [
      { name: 'Sheep Farm', good: 'Wool', outputRate: 2, count: 1, inputs: [] },
      { name: 'Framework Knitters', good: 'Work Clothes', outputRate: 2, count: 1, inputs: [{ good: 'Wool', rate: 2, category: 'agricultural' }] }
    ], note: 'Framework Knitters rate is low-confidence in the knowledge base — inferred, not independently sourced.'},
    { finalGood: 'Schnapps', name: 'Schnapps chain', builds: [
      { name: 'Potato Farm', good: 'Potatoes', outputRate: 2, count: 2, inputs: [] },
      { name: 'Schnapps Distillery', good: 'Schnapps', outputRate: 2, count: 2, inputs: [{ good: 'Potatoes', rate: 2, category: 'agricultural' }] }
    ]},
    { finalGood: 'Sausages', name: 'Sausages chain', builds: [
      { name: 'Pig Farm', good: 'Pigs', outputRate: 1, count: 1, inputs: [] },
      { name: 'Slaughterhouse', good: 'Sausages', outputRate: 1, count: 1, inputs: [{ good: 'Pigs', rate: 1, category: 'agricultural' }] }
    ]},
    { finalGood: 'Bread', name: 'Bread chain', builds: [
      { name: 'Grain Farm', good: 'Grain', outputRate: 1, count: 2, inputs: [] },
      { name: 'Flour Mill', good: 'Flour', outputRate: 2, count: 1, inputs: [{ good: 'Grain', rate: 2, category: 'agricultural' }] },
      { name: 'Bakery', good: 'Bread', outputRate: 1, count: 2, inputs: [{ good: 'Flour', rate: 1, category: 'intermediate' }] }
    ]},
    { finalGood: 'Soap', name: 'Soap chain', builds: [
      { name: 'Pig Farm', good: 'Pigs', outputRate: 1, count: 2, inputs: [] },
      { name: 'Rendering Works', good: 'Tallow', outputRate: 1, count: 2, inputs: [{ good: 'Pigs', rate: 1, category: 'agricultural' }] },
      { name: 'Soap Factory', good: 'Soap', outputRate: 2, count: 1, inputs: [{ good: 'Tallow', rate: 2, category: 'intermediate' }] }
    ]},
    { finalGood: 'Beer', name: 'Beer chain', builds: [
      { name: 'Hop Farm', good: 'Hops', outputRate: 0.67, count: 3, inputs: [] },
      { name: 'Grain Farm', good: 'Grain', outputRate: 1, count: 2, inputs: [] },
      { name: 'Malthouse', good: 'Malt', outputRate: 2, count: 1, inputs: [{ good: 'Grain', rate: 2, category: 'agricultural' }] },
      { name: 'Brewery', good: 'Beer', outputRate: 1, count: 2, inputs: [{ good: 'Hops', rate: 1, category: 'agricultural' }, { good: 'Malt', rate: 1, category: 'intermediate' }] }
    ], note: "Malthouse's exact rate is unverified in the knowledge base — Grain/Malt here assume it keeps pace with the Breweries." },
    { finalGood: 'Canned Food', name: 'Canned Food chain', builds: [
      { name: 'Cattle Ranch', good: 'Beef', outputRate: 0.5, count: 4, inputs: [] },
      { name: 'Red Pepper Farm', good: 'Red Peppers', outputRate: 0.5, count: 4, inputs: [] },
      { name: 'Iron Mine', good: 'Iron', outputRate: 4, count: 1, inputs: [] },
      { name: 'Artisanal Kitchen', good: 'Goulash', outputRate: 0.5, count: 4, inputs: [{ good: 'Beef', rate: 0.5, category: 'agricultural' }, { good: 'Red Peppers', rate: 0.5, category: 'agricultural' }] },
      { name: 'Cannery', good: 'Canned Food', outputRate: 0.667, count: 3, inputs: [{ good: 'Goulash', rate: 0.667, category: 'intermediate' }, { good: 'Iron', rate: 0.667, category: 'raw' }] }
    ], note: 'Red Peppers fertility is currently Missing on this island (see Resources above) — this chain can\'t actually run in-game right now even though it\'s modeled structurally. Rates and the 3 Cannery : 4 Artisanal Kitchen balance are confirmed from the full game-data extraction.'},
    { finalGood: 'Sewing Machines', name: 'Sewing Machines chain', builds: [
      { name: 'Iron Mine', good: 'Iron', outputRate: 4, count: 1, inputs: [] },
      { name: 'Coal Mine', good: 'Coal', outputRate: 4, count: 1, inputs: [] },
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Furnace', good: 'Steel', outputRate: 2, count: 2, inputs: [{ good: 'Iron', rate: 2, category: 'raw' }, { good: 'Coal', rate: 2, category: 'raw' }] },
      { name: 'Sewing Machine Factory', good: 'Sewing Machines', outputRate: 2, count: 2, inputs: [{ good: 'Wood', rate: 2, category: 'raw' }, { good: 'Steel', rate: 2, category: 'intermediate' }] }
    ], note: 'Confirmed from the full game-data extraction: Sewing Machine Factory runs 1 Wood : 1 Steel : 1 Sewing Machines (2 t/min each, 30s cycle). This chain was previously missing even though both Artisans and Engineers need the good.'},
    { finalGood: 'Spectacles', name: 'Spectacles chain', builds: [
      { name: 'Sand Mine', good: 'Quartz Sand', outputRate: 2, count: 1, inputs: [] },
      { name: 'Zinc Mine', good: 'Zinc', outputRate: 2, count: 1, inputs: [] },
      { name: 'Copper Mine', good: 'Copper', outputRate: 2, count: 1, inputs: [] },
      { name: 'Glassmakers', good: 'Glass', outputRate: 2, count: 3, inputs: [{ good: 'Quartz Sand', rate: 2, category: 'raw' }] },
      { name: 'Brass Smeltery', good: 'Brass', outputRate: 1, count: 1, inputs: [{ good: 'Zinc', rate: 1, category: 'raw' }, { good: 'Copper', rate: 1, category: 'raw' }] },
      { name: 'Spectacle Factory', good: 'Spectacles', outputRate: 0.667, count: 1, inputs: [{ good: 'Glass', rate: 0.667, category: 'intermediate' }, { good: 'Brass', rate: 0.667, category: 'intermediate' }] }
    ], note: 'Zinc and Copper deposits are currently 0 on this island (see Resources above) — these mines can\'t actually run yet even though modeled structurally. "Spectacles" is the same good the wiki called "Glasses" — one good, two localized names.'},
    { finalGood: 'Light Bulbs', name: 'Light Bulbs chain', builds: [
      { name: 'Coal Mine', good: 'Coal', outputRate: 4, count: 1, inputs: [] },
      { name: 'Filament Factory', good: 'Filaments', outputRate: 1, count: 1, inputs: [{ good: 'Coal', rate: 1, category: 'raw' }] },
      { name: 'Light Bulb Factory', good: 'Light Bulbs', outputRate: 1, count: 1, inputs: [{ good: 'Glass', rate: 1, category: 'intermediate' }, { good: 'Filaments', rate: 1, category: 'intermediate' }] }
    ], note: 'Coal deposits are currently 0 on this island (see Resources above). Glass is shared with the Spectacles chain — Supply Chain sums demand for it from every chain, not just this one.'},
    { finalGood: 'Penny Farthings', name: 'Penny Farthings chain', builds: [
      { name: 'Furnace', good: 'Steel', outputRate: 2, count: 1, inputs: [{ good: 'Iron', rate: 2, category: 'raw' }, { good: 'Coal', rate: 2, category: 'raw' }] },
      { name: 'Bicycle Factory', good: 'Penny Farthings', outputRate: 2, count: 1, inputs: [{ good: 'Steel', rate: 2, category: 'intermediate' }, { good: 'Caoutchouc', rate: 2, category: 'intermediate' }] }
    ], note: "Caoutchouc has no Old World source — it's a New World good, so this chain shows a permanent deficit for it in Supply Chain until a real Trade link exists." },
    { finalGood: 'Pocket Watches', name: 'Pocket Watches chain', builds: [
      { name: 'Clockmakers', good: 'Pocket Watches', outputRate: 0.667, count: 1, inputs: [{ good: 'Glass', rate: 0.667, category: 'intermediate' }, { good: 'Gold', rate: 0.667, category: 'intermediate' }] }
    ], note: "Gold needs Gold Ore, which isn't an Old World resource — it's imported (New World/Arctic), so Gold shows a permanent deficit here until Trade is real." },
    { finalGood: 'Champagne', name: 'Champagne chain', builds: [
      { name: 'Champagne Cellar', good: 'Champagne', outputRate: 2, count: 1, inputs: [{ good: 'Grapes', rate: 2, category: 'agricultural' }, { good: 'Glass', rate: 2, category: 'intermediate' }] }
    ], note: 'Grapes fertility is currently Missing on this island (see Resources above) — this chain shows a permanent Grapes deficit until that changes.'},
    { finalGood: 'Coffee', name: 'Coffee chain', builds: [
      { name: 'Grain Farm', good: 'Grain', outputRate: 1, count: 2, inputs: [] },
      { name: 'Malthouse', good: 'Malt', outputRate: 2, count: 1, inputs: [{ good: 'Grain', rate: 2, category: 'agricultural' }] },
      { name: 'Advanced Coffee Roaster', good: 'Coffee', outputRate: 1, count: 2, inputs: [{ good: 'Malt', rate: 1, category: 'intermediate' }] }
    ], note: "Was previously not modeled at all — confirmed from the game-data extraction: the Old World has its own 'Advanced Coffee Roaster' (Malt -> Coffee, 1:1), a different recipe than New World's Coffee Roaster. Shares Grain/Malt with the Beer chain above; Supply Chain sums demand for both from every chain."},
    { finalGood: 'Rum', name: 'Rum chain', builds: [
      { name: 'Potato Farm', good: 'Potatoes', outputRate: 2, count: 1, inputs: [] },
      { name: 'Coal Mine', good: 'Coal', outputRate: 4, count: 1, inputs: [] },
      { name: 'Advanced Rum Distillery', good: 'Rum', outputRate: 1, count: 2, inputs: [{ good: 'Coal', rate: 1, category: 'raw' }, { good: 'Potatoes', rate: 1, category: 'agricultural' }] }
    ], note: "Was previously not modeled at all — confirmed from the game-data extraction: the Old World has its own 'Advanced Rum Distillery' (Coal + Potatoes -> Rum), a different recipe than the New World's Rum Distillery (Wood + Sugar Cane). Shares Potatoes with the Schnapps chain above."},
    { finalGood: 'Fur Coats', name: 'Fur Coats chain', builds: [
      { name: 'Hunting Cabin', good: 'Furs', outputRate: 1, count: 2, inputs: [] },
      { name: 'Sheep Farm', good: 'Wool', outputRate: 2, count: 1, inputs: [] },
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Advanced Cotton Mill', good: 'Cotton Fabric', outputRate: 1, count: 2, inputs: [{ good: 'Wool', rate: 1, category: 'agricultural' }, { good: 'Wood', rate: 1, category: 'raw' }] },
      { name: 'Fur Dealer', good: 'Fur Coats', outputRate: 2, count: 1, inputs: [{ good: 'Furs', rate: 2, category: 'agricultural' }, { good: 'Cotton Fabric', rate: 2, category: 'intermediate' }] }
    ], note: "Was previously not modeled at all — confirmed from the game-data extraction: the Old World's 'Advanced Cotton Mill' makes Cotton Fabric locally from Wool + Wood, so unlike the New World this chain needs no cross-region import."},
    { finalGood: 'Gramophones', name: 'Gramophones chain', builds: [
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Marquetry Workshop', good: 'Wood Veneers', outputRate: 1, count: 1, inputs: [{ good: 'Wood', rate: 1, category: 'raw' }] },
      { name: 'Zinc Mine', good: 'Zinc', outputRate: 2, count: 1, inputs: [] },
      { name: 'Copper Mine', good: 'Copper', outputRate: 2, count: 1, inputs: [] },
      { name: 'Brass Smeltery', good: 'Brass', outputRate: 1, count: 1, inputs: [{ good: 'Zinc', rate: 1, category: 'raw' }, { good: 'Copper', rate: 1, category: 'raw' }] },
      { name: 'Gramophone Factory', good: 'Gramophones', outputRate: 0.5, count: 1, inputs: [{ good: 'Wood Veneers', rate: 0.5, category: 'intermediate' }, { good: 'Brass', rate: 0.5, category: 'intermediate' }] }
    ], note: 'Was previously not modeled at all. Zinc/Copper/Brass are shared with the Spectacles chain above — Supply Chain sums demand for them from every chain.'},
    { finalGood: 'Jewellery', name: 'Jewellery chain', builds: [
      { name: 'Jewellers', good: 'Jewellery', outputRate: 2, count: 1, inputs: [{ good: 'Pearls', rate: 2, category: 'agricultural' }, { good: 'Gold', rate: 2, category: 'intermediate' }] }
    ], note: 'Both Pearls (New World) and Gold (needs Gold Ore, New World/Arctic) have no Old World source — permanent deficits for both until Trade is real, same situation as the Pocket Watches chain above, which also needs Gold.'},
    { finalGood: 'Steam Carriages', name: 'Steam Carriages chain', builds: [
      { name: 'Iron Mine', good: 'Iron', outputRate: 4, count: 1, inputs: [] },
      { name: 'Coal Mine', good: 'Coal', outputRate: 4, count: 1, inputs: [] },
      { name: "Lumberjack's Hut", good: 'Wood', outputRate: 4, count: 1, inputs: [] },
      { name: 'Zinc Mine', good: 'Zinc', outputRate: 2, count: 1, inputs: [] },
      { name: 'Copper Mine', good: 'Copper', outputRate: 2, count: 1, inputs: [] },
      { name: 'Furnace', good: 'Steel', outputRate: 2, count: 1, inputs: [{ good: 'Iron', rate: 2, category: 'raw' }, { good: 'Coal', rate: 2, category: 'raw' }] },
      { name: 'Brass Smeltery', good: 'Brass', outputRate: 1, count: 2, inputs: [{ good: 'Zinc', rate: 1, category: 'raw' }, { good: 'Copper', rate: 1, category: 'raw' }] },
      { name: 'Motor Assembly Line', good: 'Steam Motors', outputRate: 0.667, count: 2, inputs: [{ good: 'Steel', rate: 0.667, category: 'intermediate' }, { good: 'Brass', rate: 0.667, category: 'intermediate' }] },
      { name: 'Coachmakers', good: 'Chassis', outputRate: 0.5, count: 2, inputs: [{ good: 'Wood', rate: 0.5, category: 'raw' }, { good: 'Caoutchouc', rate: 0.5, category: 'intermediate' }] },
      { name: 'Cab Assembly Line', good: 'Steam Carriages', outputRate: 1, count: 1, inputs: [{ good: 'Chassis', rate: 1, category: 'intermediate' }, { good: 'Steam Motors', rate: 1, category: 'intermediate' }] }
    ], note: "Caoutchouc has no Old World source (New World good) — permanent deficit until Trade is real, same as the Penny Farthings chain above. Everything else here (Steel, Brass, Steam Motors, Chassis via Coachmakers) is fully Old-World-sourced and was previously not modeled at all."}
  ]
};

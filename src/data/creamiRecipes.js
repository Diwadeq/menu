export const CREAMI_RECIPES = [
  // ── YT RECIPES ──────────────────────────────────────────────────────────────
  {
    id: 'c1', group: 'YT', emoji: '🍫',
    title: 'Maximum Flavor Chocolate',
    subtitle: '160 Cal',
    desc: 'The everyday low-calorie chocolate staple.',
    tags: ['Chocolate', 'Low Cal', 'Easy'],
    ytUrl: 'https://www.youtube.com/watch?v=YyNNWmWGtI4',
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: '1% Milk', a: '160g' }, { n: 'Unsweetened Almond Milk', a: '280g' },
        { n: 'Vanilla Extract', a: '2.1g' }, { n: 'Erythritol (Swerve)', a: '50g' },
        { n: 'Cocoa Powder', a: '8g' }, { n: 'Salt', a: '1g' }, { n: 'Gelatin', a: '4g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Mix all dry ingredients in a small bowl.',
        'Mix wet ingredients in the pint container.',
        'Slowly add dry mix to wet while blending (immersion blender recommended).',
        'Freeze for 24 hours.',
        'Run outside of pint under hot water for 60s.',
        "Spin: 'Light Ice Cream'.",
        'Respin if crumbly.',
      ]},
    ],
  },
  {
    id: 'c2', group: 'YT', emoji: '🍫',
    title: 'High Protein Chocolate (Egg Yolk)',
    subtitle: '',
    desc: 'Richer texture using real chocolate and egg yolk.',
    tags: ['Chocolate', 'High Protein', 'Rich'],
    ytUrl: 'https://www.youtube.com/watch?v=YyNNWmWGtI4',
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: '1% Milk', a: '410g' }, { n: 'Egg Yolk', a: '1' },
        { n: 'Vanilla Extract', a: '2.1g' }, { n: 'Semisweet Chocolate (melted)', a: '14g' },
        { n: 'Erythritol', a: '50g' }, { n: 'Cocoa Powder', a: '10g' },
        { n: 'Salt', a: '1g' }, { n: 'Gelatin', a: '4g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Mix milk, yolk, and vanilla.',
        'Microwave wet mix briefly to reach 80–90°F (warm enough to keep chocolate melted).',
        'Melt semisweet chocolate separately and whisk into warm milk.',
        'Blend in dry ingredients.',
        'Freeze for 36 hours (due to heated liquid).',
        "Spin: 'Light Ice Cream'.",
      ]},
    ],
  },
  {
    id: 'c3', group: 'YT', emoji: '🍩',
    title: 'Fudge Brownie Ice Cream',
    subtitle: '',
    desc: 'Includes a homemade low-calorie brownie recipe.',
    tags: ['Chocolate', 'Mix-in', 'High Protein'],
    ytUrl: 'https://www.youtube.com/watch?v=z6_YxcMwvHQ',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: '1% Milk', a: '410g' }, { n: 'Egg Yolk', a: '1' },
        { n: 'Vanilla', a: '2.1g' }, { n: 'Coffee Extract', a: '6 drops' },
        { n: 'Chocolate Whey', a: '27.8g' }, { n: 'Erythritol', a: '20g' },
        { n: 'Cocoa Powder', a: '12g' }, { n: 'Salt', a: '0.5g' }, { n: 'Gelatin', a: '4g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Homemade Brownies', a: '44g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Brownie Prep: Mix 55g milk, 28g peanut oil, 1 egg, 1 bag Zero Sugar Brownie Mix. Bake 350°F for 26–30 mins. Freeze chunks.',
        'Base: Blend milk, yolk, extracts, and dry ingredients.',
        'Freeze base 24h.',
        "Spin: 'Light Ice Cream'.",
        'Add 44g frozen brownie chunks to a hole in the center.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c4', group: 'YT', emoji: '🍪',
    title: 'Perfect Oreo Ice Cream',
    subtitle: '',
    desc: "Uses the 'Milk Dunk' technique for soft cookies.",
    tags: ['Mix-in', 'High Protein', 'Classic'],
    ytUrl: 'https://www.youtube.com/watch?v=HbvidbBT-iA',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: 'Fat-Free Milk', a: '410g' }, { n: 'Vanilla Extract', a: '4.2g' },
        { n: 'Whole Oreo (for base)', a: '1' }, { n: 'Vanilla/Cookies & Cream Whey', a: '32g' },
        { n: 'Erythritol', a: '10g' }, { n: 'Black Cocoa Powder', a: '4g' },
        { n: 'Salt', a: '0.5g' }, { n: 'Gelatin', a: '2g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Oreos (milk-dunked, then frozen)', a: '6–8' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Blend base ingredients + 1 Oreo.',
        'Freeze 24h.',
        'Prep Mix-ins: Dunk Oreos in milk for 15s, put in bag, freeze solid.',
        "Spin Base: 'Sorbet' setting (for thickness).",
        'Add frozen milk-dunked Oreos to center.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c5', group: 'YT', emoji: '🍦',
    title: 'Vanilla Bean King',
    subtitle: '',
    desc: 'The ultimate vanilla using real beans and egg yolk.',
    tags: ['Classic', 'Vanilla', 'Easy'],
    ytUrl: 'https://www.youtube.com/watch?v=PXYceRAaIdI',
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: '2% Milk', a: '430g' }, { n: 'Egg Yolk', a: '1' },
        { n: 'Vanilla Extract', a: '5g' }, { n: 'Seeds of Vanilla Bean', a: '½ bean' },
        { n: 'Erythritol', a: '45g' }, { n: 'Salt', a: '1g' }, { n: 'Gelatin', a: '4g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Scrape vanilla bean seeds into milk/yolk mixture.',
        'Blend in dry ingredients thoroughly (immersion blender essential to suspend seeds).',
        'Freeze 24h.',
        "Spin: 'Ice Cream'.",
        'Respin.',
      ]},
    ],
  },
  {
    id: 'c6', group: 'YT', emoji: '🌿',
    title: 'Mint Chocolate Chip',
    subtitle: '',
    desc: 'With homemade chocolate chips that melt in your mouth.',
    tags: ['Mix-in', 'High Protein', 'Classic'],
    ytUrl: 'https://www.youtube.com/watch?v=ZkWjvlVDZRI',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: '1% Milk', a: '430g' }, { n: 'Vanilla', a: '4.2g' },
        { n: 'Green Food Colouring', a: '8 drops' }, { n: 'McCormick Mint Extract', a: '12 drops' },
        { n: 'Vanilla Whey', a: '1 scoop' }, { n: 'Erythritol', a: '20g' },
        { n: 'Salt', a: '0.5g' }, { n: 'Gelatin', a: '2g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Homemade Choc Chips', a: '~30g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Make chips: Melt chocolate with oil, spread thin on parchment, freeze, chop.',
        'Blend base. Freeze 24h.',
        "Spin: 'Sorbet'.",
        'Add 30g homemade chips.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c7', group: 'YT', emoji: '🍪',
    title: 'Cookie Dough Ice Cream',
    subtitle: '',
    desc: 'High protein cookie dough chunks.',
    tags: ['Mix-in', 'High Protein', 'Classic'],
    ytUrl: 'https://www.youtube.com/watch?v=ZkWjvlVDZRI',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: '2% Milk', a: '430g' }, { n: 'Vanilla', a: '4.2g' },
        { n: 'Vanilla Protein', a: '32g' }, { n: 'Erythritol', a: '10g' },
        { n: 'Salt', a: '0.5g' }, { n: 'Gelatin', a: '2g' },
      ]},
      { label: 'Cookie Dough', type: 'ing', items: [
        { n: 'Flour (heat-treated)', a: '90g' }, { n: 'Vanilla Protein', a: '48g' },
        { n: 'Butter (melted)', a: '21g' }, { n: 'Egg + 1 Yolk', a: '1 egg' },
        { n: 'Erythritol', a: '24g' }, { n: 'Brown Sugar Sub', a: '24g' },
        { n: 'Mini Choc Chips', a: '21g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Dough: Mix wet ingredients, slowly add dry, fold in chips. Refrigerate.',
        'Base: Blend and freeze 24h.',
        "Spin Base: 'Sorbet'.",
        'Add 50g Cookie Dough chunks.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c8', group: 'YT', emoji: '🍉',
    title: 'Watermelon Sorbet',
    subtitle: 'Under 100 Cal',
    desc: 'Under 100 calories — light and refreshing.',
    tags: ['Sorbet', 'Dairy-Free', 'Fruit', 'Low Cal'],
    ytUrl: 'https://www.youtube.com/watch?v=MUU71EH9URw',
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: 'Watermelon Juice (blended flesh)', a: '330g' },
        { n: 'Water', a: '120g' }, { n: 'Erythritol', a: '20g' }, { n: 'Salt', a: '0.5g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Blend watermelon flesh to juice.',
        'Mix with water, sweetener, and salt.',
        'Freeze 24h.',
        "Spin: 'Sorbet'. Respin x2.",
      ]},
    ],
  },
  {
    id: 'c9', group: 'YT', emoji: '🍑',
    title: 'Peach Sorbet',
    subtitle: 'White Peach',
    desc: 'White peaches recommended for best flavour.',
    tags: ['Sorbet', 'Dairy-Free', 'Fruit', 'Low Cal'],
    ytUrl: 'https://www.youtube.com/watch?v=MUU71EH9URw',
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: 'Peaches (pitted)', a: '300g' }, { n: 'Water', a: '140g' },
        { n: 'Erythritol', a: '30g' }, { n: 'Salt', a: '0.5g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Blend peaches with water and dry ingredients.',
        'Freeze 24h.',
        "Spin: 'Sorbet'. Respin.",
      ]},
    ],
  },
  {
    id: 'c10', group: 'YT', emoji: '🍒',
    title: 'Cherry Garcia Protein',
    subtitle: '',
    desc: 'A protein-packed take on the classic.',
    tags: ['High Protein', 'Mix-in', 'Fruit'],
    ytUrl: 'https://www.youtube.com/watch?v=ILEOkNrHdek',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: 'Bing Cherry Juice', a: '20g' }, { n: '2% Milk', a: '380g' },
        { n: 'Egg Yolks', a: '2' }, { n: 'Vanilla Extract', a: '4g' },
        { n: 'Vanilla Casein/Whey', a: '16g' }, { n: 'Erythritol', a: '40g' },
        { n: 'Gelatin', a: '3.2g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Pressed Bing Cherries', a: 'to taste' }, { n: 'Dark Chocolate', a: '15g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Prep: Press cherries in paper towels to remove moisture.',
        'Blend base ingredients. Freeze 24h.',
        "Spin: 'Sorbet'.",
        'Add cherries and chocolate.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c11', group: 'YT', emoji: '🥣',
    title: 'Cinnamon Toast Crunch',
    subtitle: 'Cereal Milk',
    desc: 'Cereal milk flavor with a crunchy finish.',
    tags: ['Cereal', 'Mix-in', 'Easy'],
    ytUrl: 'https://www.youtube.com/watch?v=QTtkus690oo',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: '1% Milk', a: '160g' }, { n: 'Almond Milk', a: '280g' },
        { n: 'Vanilla Extract', a: '4.2g' }, { n: 'Erythritol', a: '50g' },
        { n: 'Cinnamon', a: '1.5g' }, { n: 'Salt', a: '1g' }, { n: 'Gelatin', a: '4g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Cinnamon Toast Crunch cereal', a: '10g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Blend base. Freeze 24h.',
        "Spin: 'Ice Cream'. Respin.",
        'Add cereal.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c12', group: 'YT', emoji: '🌈',
    title: 'Fruity Pebbles',
    subtitle: '',
    desc: 'Secret ingredient: syrup.',
    tags: ['Cereal', 'Mix-in', 'Easy'],
    ytUrl: 'https://www.youtube.com/watch?v=QTtkus690oo',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: 'Milk', a: '160g' }, { n: 'Almond Milk', a: '265g' },
        { n: 'Vanilla', a: '4.2g' }, { n: 'Fruity Pebbles Syrup', a: '15g' },
        { n: 'Erythritol', a: '40g' }, { n: 'Salt', a: '1g' }, { n: 'Gelatin', a: '4g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Fruity Pebbles cereal', a: '9g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Blend base. Freeze 24h.',
        "Spin: 'Ice Cream'. Respin.",
        'Add cereal.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },
  {
    id: 'c13', group: 'YT', emoji: '🥛',
    title: 'Eggnog Protein Ice Cream',
    subtitle: '',
    desc: 'Better than the carton.',
    tags: ['High Protein', 'Seasonal', 'Easy'],
    ytUrl: 'https://www.youtube.com/watch?v=IwVD9_SOxI8',
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: '1% Milk', a: '290g' }, { n: 'Almond Breeze Eggnog', a: '120g' },
        { n: 'Vanilla', a: '4.2g' }, { n: 'Egg Yolk', a: '1' },
        { n: 'Vanilla Protein', a: '20g' }, { n: 'Erythritol', a: '40g' },
        { n: 'Cinnamon', a: '1g' }, { n: 'Salt', a: '1g' },
        { n: 'Gelatin', a: '4g' }, { n: 'Nutmeg', a: 'dash' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Bloom gelatin: mix with 2 tbsp cold water, microwave 15s until dissolved.',
        'Blend all ingredients.',
        'Freeze 24h.',
        "Spin: 'Ice Cream'. Respin.",
      ]},
    ],
  },
  {
    id: 'c14', group: 'YT', emoji: '🥧',
    title: 'Apple Pie Ice Cream',
    subtitle: '',
    desc: 'With Apple Pie Toast Crunch mix-in.',
    tags: ['Seasonal', 'Mix-in', 'High Protein'],
    ytUrl: 'https://www.youtube.com/watch?v=IwVD9_SOxI8',
    sections: [
      { label: 'Ice Cream Base', type: 'ing', items: [
        { n: '1% Milk', a: '410g' }, { n: 'Vanilla', a: '4.2g' },
        { n: 'Egg Yolk', a: '1' }, { n: 'Snickerdoodle Protein', a: '20g' },
        { n: 'Erythritol', a: '40g' }, { n: 'Apple Pie Spice', a: '1g' },
      ]},
      { label: 'Mix-ins', type: 'ing', items: [
        { n: 'Apple Pie Toast Crunch', a: '12g' }, { n: 'Fresh Apple Slivers', a: '20g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Blend base. Freeze 24h.',
        "Spin: 'Ice Cream'.",
        'Add cereal and apple slices.',
        "Spin: 'Mix-in'.",
      ]},
    ],
  },

  // ── RANDOM / SCRIBD RECIPES ─────────────────────────────────────────────────
  {
    id: 'c15', group: 'Random', emoji: '🍉',
    title: 'Watermelon Italian Ice',
    subtitle: '92 Cal',
    desc: 'Just 92 calories. Light and refreshing — no dairy needed.',
    tags: ['Sorbet', 'Dairy-Free', 'Fruit', 'Low Cal'],
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: 'Watermelon (blended to juice)', a: '350g' }, { n: 'Water', a: '80g' },
        { n: 'Erythritol', a: '20g' }, { n: 'Lime Juice', a: '15g' }, { n: 'Salt', a: '0.5g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Blend watermelon flesh until smooth.',
        'Mix in water, erythritol, lime juice, and salt.',
        'Pour into pint container. Freeze 24h.',
        "Spin: 'Sorbet'. Respin x2 for smoothest texture.",
      ]},
    ],
  },
  {
    id: 'c16', group: 'Random', emoji: '🍓',
    title: 'Strawberry Italian Ice',
    subtitle: '96 Cal',
    desc: '96 calories of pure strawberry — bright, tart, dairy-free.',
    tags: ['Sorbet', 'Dairy-Free', 'Fruit', 'Low Cal'],
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: 'Frozen Strawberries', a: '300g' }, { n: 'Water', a: '150g' },
        { n: 'Erythritol', a: '25g' }, { n: 'Lemon Juice', a: '10g' }, { n: 'Salt', a: '0.5g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Blend frozen strawberries with water until smooth.',
        'Add sweetener, lemon juice, and salt. Blend again.',
        'Freeze 24h.',
        "Spin: 'Sorbet'. Respin x2.",
      ]},
    ],
  },
  {
    id: 'c17', group: 'Random', emoji: '🍋',
    title: 'Lemon Sorbet',
    subtitle: '80 Cal',
    desc: 'Zingy and refreshing. Only 80 calories.',
    tags: ['Sorbet', 'Dairy-Free', 'Fruit', 'Low Cal'],
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: 'Water', a: '350g' }, { n: 'Fresh Lemon Juice', a: '90g' },
        { n: 'Erythritol', a: '50g' }, { n: 'Lemon Zest', a: '1 tsp' }, { n: 'Salt', a: '0.5g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Mix all ingredients until sweetener dissolves.',
        'Pour into pint. Freeze 24h.',
        "Spin: 'Sorbet'. Respin.",
      ]},
    ],
  },
  {
    id: 'c18', group: 'Random', emoji: '🫐',
    title: 'Blueberry Cheesecake',
    subtitle: 'High Protein',
    desc: 'Cream cheese base with blueberry swirl. Blend thoroughly.',
    tags: ['Cheesecake', 'High Protein', 'Fruit'],
    sections: [
      { label: 'Ingredients', type: 'ing', items: [
        { n: 'Fat-Free Milk', a: '300g' }, { n: 'Fat-Free Cream Cheese', a: '60g' },
        { n: 'Vanilla Protein', a: '30g' }, { n: 'Erythritol', a: '40g' },
        { n: 'Lemon Juice', a: '15g' }, { n: 'Blueberry Jam (sugar-free)', a: '30g' },
        { n: 'Salt', a: '0.5g' },
      ]},
      { label: 'Instructions', type: 'steps', items: [
        'Blend cream cheese into milk thoroughly until lump-free.',
        'Add remaining ingredients, blend again.',
        'Swirl in blueberry jam last.',
        'Freeze 24h.',
        "Spin: 'Ice Cream'. Respin.",
      ]},
    ],
  },
];

export const CREAMI_TAGS = [
  'All', 'Chocolate', 'Vanilla', 'Sorbet', 'High Protein',
  'Mix-in', 'Low Cal', 'Fruit', 'Cereal', 'Classic', 'Dairy-Free',
];

const LEGACY_COLORS = {
  'berry-red': '#e04556',
  'pumpkin-orange': '#f0982d',
  'lagoon-blue': '#109dc0',
  'pink-tulip': '#f97394',
  'light-mud': '#c7a57b',
  'orange-peel': '#fab623',
  'bright-moss': '#a5c261',
  'antique-blue': '#6c99bb',
  'dark-granite': '#8b8680',
  'lagune-blue': '#00b4b1',
  'sunny-grass': '#bfca02',
  'morning-sky': '#52bad5',
  'light-orange': '#ffc66d',
  'midnight-blue': '#004d73',
  'tank-green': '#8aa177',
  'gun-metal': '#355263',
  'wet-moss': '#4a8753',
  'red-burgundy': '#ad5f7d',
  'light-concrete': '#afb0a4',
  'apricot-red': '#fc736d',
  'desert-sand': '#edcb76',
  'navy-blue': '#166a8f',
  'egg-yellow': '#f7d036',
  'coral-green': '#2b6a6c',
  'light-cocoa': '#87564a',
};

module.exports.up = async (knex) => {
  await knex.transaction(async (trx) => {
    const labels = await trx('label').select('id', 'color');

    for (const label of labels) {
      const hexColor = LEGACY_COLORS[label.color] || LEGACY_COLORS['desert-sand'];
      await trx('label')
        .where('id', label.id)
        .update({ color: hexColor });
    }
  });
};

module.exports.down = async (knex) => {
  await knex.transaction(async (trx) => {
    const reverseLegacyColors = Object.fromEntries(
      Object.entries(LEGACY_COLORS).map(([name, hex]) => [hex, name])
    );

    const labels = await trx('label').select('id', 'color');

    for (const label of labels) {
      const legacyColor = reverseLegacyColors[label.color] || 'desert-sand';
      await trx('label')
        .where('id', label.id)
        .update({ color: legacyColor });
    }
  });
};

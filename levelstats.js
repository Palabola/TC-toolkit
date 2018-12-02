const gt_read = require("./gt_read");
const query_handler = require("./db_manager/database_query_handler");

const npc_damage = gt_read.load_gt("./gt/NpcDamageByClassExp7.txt");
const npc_health = gt_read.load_gt("./gt/NpcTotalHpExp7.txt");
const combatratings = gt_read.load_gt("./gt/CombatRatings.txt");
const armor = gt_read.load_gt("./gt/ArmorMitigationByLvl.txt");
const itemlevel = gt_read.load_gt("./gt/itemlevelbylevel.txt");
const base_mp = gt_read.load_gt("./gt/BaseMp.txt");

// These calulatios are just accurate to provide playable enviroment!

generate_creature_stats();

async function generate_creature_stats() {
  let creature_types = [1, 2, 4, 8];
  let query_data = [];
  let unique_values = [];

  creature_types.map(creture_class => {
    for (let i = 1; i <= 123; i++) {
      let stats = {};

      stats.level = i;
      stats.class = creture_class;
      stats.basemana = 0;
      //console.log(armor.data[i][1]);
      stats.armor = calculate_armor(armor.data[i][1], 0.25);

      if (stats.class == 2) {
        stats.basemana = base_mp.data[i][2];
      }
      if (stats.class == 8) {
        stats.basemana = base_mp.data[i][4];
        stats.armor *= 0.8;
      }

      query_data.push(stats);
    }
  });

  query_handler.replace_creature_classlevelstats(query_data);
}

function calculate_armor(coeff_in, target_in) {
  let coeff = Number(coeff_in);
  let target = Number(target_in);

  for (let i = 1; i < 100000; i++) {
    let test_target = i / (coeff + i);

    if (test_target > target) {
      return i;
    }
  }
}

//generate_char_stats();

async function generate_char_stats() {
  let char_base_info = await query_handler.select_charbaseinfo();

  let query_data = [];

  char_base_info.map(race_class => {
    for (let i = 1; i <= 120; i++) {
      let pry_coeff = 0;
      let stam_coeff = 0;
      let stats = {};

      stats.race = race_class.RaceID;
      stats.class = race_class.ClassID;

      stats.level = i;

      // lvl1 paladin  stg 17         stam 17 = 136hp
      // lvl15 paladin stg 51         stam 43 = 344hp
      // lvl28 paladin stg 72         stam 63 = 630hp
      // lvl56 pala stg 128           stam 108 = 1620hp
      // lvl110 paladin stg 363       stam 300 = 6000hp
      // lvl120 paladin(ret) stg 1467 stam 1001 = 20000hp

      if (i <= 28) {
        pry_coeff = nthroot(128 / 17, 28);
        stam_coeff = nthroot(108 / 17, 28);

        stats.str = Math.round(Math.pow(pry_coeff, i) * 17);
        stats.agi = Math.round(Math.pow(pry_coeff, i) * 17);
        stats.inte = Math.round(Math.pow(pry_coeff, i) * 17);
        stats.sta = Math.round(Math.pow(stam_coeff, i) * 17);
      }
      if (i > 28 && i <= 56) {
        pry_coeff = nthroot(128 / 72, 28);
        stam_coeff = nthroot(108 / 63, 28);

        stats.str = Math.round(Math.pow(pry_coeff, i - 28) * 72);
        stats.agi = Math.round(Math.pow(pry_coeff, i - 28) * 72);
        stats.inte = Math.round(Math.pow(pry_coeff, i - 28) * 72);
        stats.sta = Math.round(Math.pow(stam_coeff, i - 28) * 63);
      }
      if (i > 56 && i <= 110) {
        // stg +346
        // stam +283

        pry_coeff = nthroot(363 / 128, 64);
        stam_coeff = nthroot(300 / 108, 64);

        stats.str = Math.round(Math.pow(pry_coeff, i - 56) * 128);
        stats.agi = Math.round(Math.pow(pry_coeff, i - 56) * 128);
        stats.inte = Math.round(Math.pow(pry_coeff, i - 56) * 128);
        stats.sta = Math.round(Math.pow(stam_coeff, i - 56) * 108);
      }
      if (i > 110) {
        pry_coeff = nthroot(1467 / 363, 10);
        stam_coeff = nthroot(1001 / 300, 10);

        stats.str = Math.round(Math.pow(pry_coeff, i - 110) * 363);
        stats.agi = Math.round(Math.pow(pry_coeff, i - 110) * 363);
        stats.inte = Math.round(Math.pow(pry_coeff, i - 110) * 363);
        stats.sta = Math.round(Math.pow(stam_coeff, i - 110) * 300);
      }

      query_data.push(stats);
    }
  });

  query_handler.replace_player_levelstats(query_data);
}

function nthroot(x, n) {
  ng = n % 2;
  if (ng == 1 || x < 0) x = -x;
  var r = Math.pow(x, 1 / n);
  n = Math.pow(r, n);

  if (Math.abs(x - n) < 1 && x > 0 === n > 0) return ng ? -r : r;
}

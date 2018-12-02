const fs = require("fs");

fs.writeFileSync("gerenated_sai.sql", "");

// Todo
const query_handler = require("./db_manager/database_query_handler");
// AI Templates
// Spell filter
// Load datas

// Disabled Spells
const disabled_spell = [125801, 225832, 195802, 58511, 224762, 250569, 276880];

// Spell data query
const spell_data_query =
  "SELECT * FROM  db_spellname_27075 A LEFT JOIN `db_spellmisc_27075` B ON A.ID = B.Spell_ID LEFT JOIN db_spellrange_27075 C ON B.RangeIndex = C.ID where A.ID = ?";

class AI_templates {
  constructor(entry) {
    this.sai_generator(entry);
  }

  async sai_generator(entry) {
    try {
      let creature_parse = await query_handler.select_generic_dev(
        "SELECT * FROM `creature_parse` WHERE `entry` = ?",
        entry
      );

      creature_parse = creature_parse[0];

      if (creature_parse.spell1 == 0) return;

      if (creature_parse.spell5 > 0) {
        // Too many spell manual check!
        return "Manual check!";
      }

      let creature_equip_data = await query_handler.select_generic_world(
        "SELECT * FROM `creature_equip_template` WHERE `CreatureID` = ?",
        entry
      );

      let spell_array = [
        creature_parse.spell1,
        creature_parse.spell2,
        creature_parse.spell3,
        creature_parse.spell4
      ];

      // SmartAI Modifiers!

      let ranged_weapon = 0; // Has Equip data2
      let melee_weapon = 0; // Has Equip data1

      if (creature_equip_data[0]) {
        creature_equip_data = creature_equip_data[0];
        melee_weapon = creature_equip_data.ItemID1;
        ranged_weapon = creature_equip_data.ItemID3;
      }

      let shoot_spells = []; // Range beetwen 5-40
      let summon_spell = []; // Has spell with name Summon
      let self_cast_spell = []; // Self cast!
      let other_spells = []; // Other spells

      // Spell Check loop for extra data
      for (let i = 0; i < spell_array.length; i++) {
        if (
          spell_array[i] > 0 &&
          disabled_spell.indexOf(spell_array[i]) == -1
        ) {
          let spell_data = await query_handler.select_generic_dev(
            spell_data_query,
            spell_array[i]
          );

          spell_data = spell_data[0];
          spell_data.Name_Lang = spell_data.Name_Lang.replace(/'/g, "");

          if (spell_data.minrange >= 5 && spell_data.maxrange <= 45) {
            shoot_spells.push({
              id: spell_data.Spell_ID,
              name: spell_data.Name_Lang,
              minrange: spell_data.minrange,
              maxrange: spell_data.maxrange
            });
            continue;
          }

          if (spell_data.Name_Lang.toLowerCase().search("summon") > -1) {
            summon_spell.push({
              id: spell_data.Spell_ID,
              name: spell_data.Name_Lang
            });
            continue;
          }

          if (spell_data.RangeIndex == 1) {
            self_cast_spell.push({
              id: spell_data.Spell_ID,
              name: spell_data.Name_Lang
            });
            continue;
          }

          other_spells.push({
            id: spell_data.Spell_ID,
            name: spell_data.Name_Lang
          });
        }
      }

      // Base
      let query_text =
        "/* creature_template */ UPDATE `creature_template` SET `AIName` = 'SmartAI' WHERE `entry` = " +
        entry +
        "; \n /* smart_scripts */ DELETE FROM `smart_scripts` WHERE (source_type = 0 AND entryorguid = " +
        entry +
        "); \n INSERT INTO `smart_scripts` (`entryorguid`, `source_type`, `id`, `link`, `event_type`, `event_phase_mask`, `event_chance`, `event_flags`, `event_param1`, `event_param2`, `event_param3`, `event_param4`, `action_type`, `action_param1`, `action_param2`, `action_param3`, `action_param4`, `action_param5`, `action_param6`, `target_type`, `target_param1`, `target_param2`, `target_param3`, `target_x`, `target_y`, `target_z`, `target_o`, `comment`) VALUES \n";

      // Say on Aggro!
      query_text +=
        "(" +
        entry +
        ", 0, 0, 0, 4, 0, 100, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'On Aggro - Say Line 0 Generated'), \n";

      if (melee_weapon > 0) {
        // Has melee weapon
        query_text +=
          "(" +
          entry +
          ", 0, 1, 0, 4, 0, 100, 0, 0, 0, 0, 0, 40, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'On Aggro - Set Sheath Melee'), \n";
      }

      let smart_id = 2;

      if (ranged_weapon > 0 && shoot_spells.length > 0) {
        // Has ranged weapon and Shoot spell
        query_text +=
          "(" +
          entry +
          ", 0, 1, 0, 4, 0, 100, 0, 0, 0, 0, 0, 40, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'On Aggro - Set Sheath Ranged'), \n";

        if (melee_weapon > 0) {
          query_text +=
            "(" +
            entry +
            ", 0, 2, 0, 9, 0, 100, 0, 0, 10, 3000, 3000, 40, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'Within 0-10 Range - Set Sheath Melee'), \n";

          query_text +=
            "(" +
            entry +
            ", 0, 3, 0, 9, 0, 100, 0, 10, 40, 3000, 3000, 40, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'Within 0-10 Range - Set Sheath Ranged'), \n";
          smart_id = 4;
        }
      }

      shoot_spells.forEach(spell => {
        query_text +=
          "(" +
          entry +
          ", 0, " +
          smart_id +
          ", 0, 9, 0, 100, 0, " + // Range Event
          spell.minrange +
          ", " +
          spell.maxrange +
          ", 5000, 10000, 11, " +
          spell.id +
          ", 68, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'In Range - Cast " +
          spell.name +
          "'), \n";

        smart_id++;

        has_shoot = 1;
      });

      self_cast_spell.forEach(spell => {
        let coeff = smart_id - 1;

        query_text +=
          "(" +
          entry +
          ", 0, " +
          smart_id +
          ", 0, 0, 0, 100, 0, " +
          coeff * 4500 +
          ", " +
          (coeff + 1) * 4500 +
          ", 9000, 25000, 11, " +
          spell.id +
          ", 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 'In Combat - Cast " +
          spell.name +
          "'), \n";

        smart_id++;
      });

      other_spells.forEach(spell => {
        let coeff = smart_id - 1;

        query_text +=
          "(" +
          entry +
          ", 0, " +
          smart_id +
          ", 0, 0, 0, 100, 0, " +
          coeff * 2500 +
          ", " +
          (coeff + 1) * 2500 +
          ", 9000, 25000, 11, " +
          spell.id +
          ", 4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 'In Combat - Cast ??? " +
          spell.name +
          "'), \n";

        smart_id++;
      });

      query_text = query_text.slice(0, -3) + "; \n"; // Last element close query

      fs.appendFileSync("gerenated_sai.sql", query_text);
    } catch (e) {}
  }
}

for (let i = 120000; i < 145898; i++) {
  let sai = new AI_templates(i);
}

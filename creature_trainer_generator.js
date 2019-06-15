const query_handler = require("./db_manager/database_query_handler");

const fs = require("fs");

const file_name = "gerenated_trainer_fix.sql";

fs.writeFileSync(file_name, "");

async function generate() {
  let select_creature_bad_trainers = await query_handler.select_creature_bad_trainers();

  let trainer_id = 0;
  let query_text = "";

  select_creature_bad_trainers.map(row => {
    switch (row.subname) {
      case "Engineering Trainer":
        trainer_id = 407;
        break;
      case "First Aid Trainer":
        break;
      case "Blacksmithing Trainer":
        trainer_id = 27;
        break;
      case "Alchemy Trainer":
        trainer_id = 122;
        break;
      case "Tailoring Trainer":
        trainer_id = 163;
        break;
      case "Jewelcrafting Trainer":
        trainer_id = 29;
        break;
      case "Mining Trainer":
        trainer_id = 91;
        break;
      case "Cooking Trainer":
        break;
      case "Herbalism Trainer":
        trainer_id = 133;
        break;
      case "Skinning Trainer":
        trainer_id = 196;
        break;
      case "Leatherworking Trainer":
        trainer_id = 56;
        break;
      case "Inscription Trainer":
        trainer_id = 791;
        break;
      case "Enchanting Trainer":
        trainer_id = 62;
        break;
      case "Fishing Trainer":
        break;
      default:
        trainer_id = 0;
        break;
    }

    if (row.gossip_menu_id == 0 && trainer_id != 0) {
      query_text =
        "REPLACE INTO `creature_default_trainer` (`CreatureId`, `TrainerId`) VALUES (" +
        row.entry +
        ", " +
        trainer_id +
        "); \n";
    }

    if (row.gossip_menu_id > 0 && trainer_id != 0) {
      query_text =
        "REPLACE INTO `gossip_menu_option_trainer` (`MenuId`, `OptionIndex`, `TrainerId`) VALUES (" +
        row.gossip_menu_id +
        ", '0', " +
        trainer_id +
        "); \n";
    }

    fs.appendFileSync(file_name, query_text);
  });
}

generate();

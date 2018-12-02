const query_handler = require("./db_manager/database_query_handler");
const fs = require("fs");

function reset_log(filename) {
  fs.writeFile(filename, "", function(err) {
    if (err) throw err;
  });
}

function write_log(filename, content) {
  fs.appendFileSync(filename, content, function(err) {
    if (err) console.log(err);
  });
}

async function creature_template_addon_solver() {
  let creature_addon = await query_handler.select_creature_template_addon();

  let filename = "creature_template_addon.sql";

  reset_log(filename);
  //creature_addon = creature_addon.slice(0, 100);

  creature_addon.map(creature_addon => {
    if (creature_addon.auras == "" || creature_addon.auras === null) {
      return;
    }

    let auras = creature_addon.auras.split(" ");

    let new_auras = [...new Set(auras)].join(" ");

    let query =
      "UPDATE creature_template_addon SET auras = '" +
      new_auras +
      "' WHERE entry = " +
      creature_addon.entry +
      "; \n";

    write_log(filename, query);
  });

  console.log("Done!");
}

async function creature_addon_solver() {
  let creature_addon = await query_handler.select_creature_addon();

  let filename = "creature_addon.sql";

  reset_log(filename);
  //creature_addon = creature_addon.slice(0, 100);

  creature_addon.map(creature_addon => {
    if (creature_addon.auras == "" || creature_addon.auras === null) {
      return;
    }

    let auras = creature_addon.auras.split(" ");

    let new_auras = [...new Set(auras)].join(" ");

    let query =
      "UPDATE creature_addon SET auras = '" +
      new_auras +
      "' WHERE guid = " +
      creature_addon.guid +
      "; \n";

    write_log(filename, query);
  });

  console.log("Done!");
}

creature_template_addon_solver();
creature_addon_solver();

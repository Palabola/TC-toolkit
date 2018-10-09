const query_handler = require("./database_query_handler");

async function generate() {
  let creature_parse1 = await query_handler.select_creature_template();

  let creature_parse2 = await query_handler.select_creature_template2();

  let creature_template_merg = [];

  creature_parse1.map(creature_temp => {
    creature_parse2.find(creature_temp2 => {
      if (creature_temp.entry == creature_temp2.entry) {
        let creature_merged = Object.assign(creature_temp, creature_temp2);

        creature_template_merg.push(creature_merged);
        return;
      }
    });
  });

  //console.log(creature_template_merg.length);
  creature_template_merg.map(creature_template => {
    query_handler.replace_creature_template(creature_template);
  });

  console.log("Done");
}

generate();

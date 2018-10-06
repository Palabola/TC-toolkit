const query_handler = require("./database_query_handler");

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

async function generate() {
  let item_template = await query_handler.select_item_template();

  let item_disenchantloot_template = await query_handler.select_item_disenchantloot_template();

  let disenchant_loot_template = await query_handler.select_disenchant_loot_template();

  let disenchant_template = item_disenchantloot_template.map(disenchant => {
    let result = {};
    result.id = disenchant.ID;

    result.item = item_template.filter(item => {
      if (
        item.ExpansionID == disenchant.ExpansionID &&
        item.ClassID == disenchant.RelationshipData &&
        item.ItemLevel >= disenchant.MinLevel &&
        item.ItemLevel <= disenchant.MaxLevel &&
        item.OverallQualityID == disenchant.Quality &&
        item.ID > 0
      ) {
        return item;
      }
    });

    if (result.item.length) {
      //console.log(result.item.length);

      for (let i = 0; i < result.item.length; i++) {
        let shuffled_array = shuffle(result.item);

        if (i > 20) break;

        // Some Disenchant template did not match with any item
        result.example_loot = disenchant_loot_template.filter(template => {
          if (template.Entry == shuffled_array[0].ID) {
            template.Entry = result.id;
            // Insert disenchant with new template ID
            let insert = query_handler.replace_disenchant_loot_template(
              template
            );
          }
        });
      }
    }
  });
}

generate();

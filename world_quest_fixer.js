const query_handler = require("./db_manager/database_query_handler");

async function generate() {
  let quest_treasure_reward = await query_handler.select_quest_treasure_reward();

  //console.log(quest_treasure_reward);

  // Flags
  const is_money = 1;
  const is_currency = 2;
  const is_item = 4;

  let quest_reward_type = {};

  let money_types = [];

  quest_treasure_reward.map(quest => {
    if (!quest_reward_type[quest.ID]) {
      quest_reward_type[quest.ID] = {};
    }

    if (quest.money > 0) {
      quest_reward_type[quest.ID].money = quest.money;

      console.log(quest.ID, quest_reward_type[quest.ID].money);
    }

    //console.log(quest);
  });

  console.log("Done");
}

generate();

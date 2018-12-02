const query_handler = require("./db_manager/database_query_handler");

async function creature_scaling_generator(map) {
  try {
    let creature_data = await query_handler.select_creature_by_map(map);
    let zone_data = await query_handler.select_scaling_zone_data();

    let query_data = [];
    let unique_values = [];

    creature_data.map(creature => {
      let current_zone = zone_data.find(zone => {
        if (zone.ID == creature.zoneId) return zone;
      });

      if (current_zone) {
        // Entry  LevelScalingMin  LevelScalingMax LevelScalingDeltaMin LevelScalingDeltaMax VerifiedBuild
        let scale_data = [
          creature.id,
          current_zone.LevelRangeMin,
          current_zone.LevelRangeMax,
          0,
          0,
          11111
        ];

        if (unique_values.indexOf(creature.id) == -1) {
          query_data.push(scale_data);
          unique_values.push(creature.id);
        }
      }
    });

    query_handler.insert_creature_template_scaling(query_data);
  } catch (e) {}
}

creature_scaling_generator(1);

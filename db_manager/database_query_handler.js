require("dotenv").config();
//const logger = require("../logger.js");

const mysql = require("mysql2/promise");

/* Init Databases*/
const pool_dev_db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB_dev,
  connectionLimit: 100
});

const pool_world_db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB_world,
  connectionLimit: 100
});

/* Init Databases*/
const db_build = process.env.DB_BUILD;

class query_handler {
  async select_generic_dev(query, parameters) {
    try {
      let [rows, fields] = await pool_dev_db.query(query, parameters);

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_generic_world(query, parameters) {
    try {
      let [rows, fields] = await pool_world_db.query(query, parameters);

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_creature_template() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT `entry`, `KillCredit1`, `KillCredit2`, `modelid1`, `modelid2`, `modelid3`, `modelid4`, `name`, `femaleName`, `subname`, `TitleAlt`, `IconName`, `HealthScalingExpansion`, `RequiredExpansion`, `VignetteID`, `rank`, `family`, `type`, `type_flags`, `type_flags2`, `HealthModifier`, `ManaModifier`, `RacialLeader`, `movementId`, `VerifiedBuild` FROM `creature_template`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_creature_template2() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT `entry`, `gossip_menu_id`, `minlevel`, `maxlevel`, `faction`, `npcflag`, `speed_walk`, `speed_run`, `BaseAttackTime`, `RangeAttackTime`, `unit_class`, `unit_flags`, `unit_flags2`, `unit_flags3`, `dynamicflags`, `VehicleId`, `HoverHeight` FROM `creature_template2`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async replace_creature_template(array) {
    try {
      let [rows, fields] = await pool_dev_db.query(
        "REPLACE INTO `creature_template` SET ?",
        array
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_item_template() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT * FROM `db_itemsparse_" +
          db_build +
          "` as A inner join db_item_" +
          db_build +
          " as B on A.ID = B.ID "
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_item_disenchantloot_template() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT * FROM `db_itemdisenchantloot_" + db_build + "`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_scaling_zone_data() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT A.ID,A.AreaName_Lang,A.ContinentID,B.LevelRangeMin,B.LevelRangeMax FROM `db_areatable_" +
          db_build +
          "` as A RIGHT JOIN `db_uimap_" +
          db_build +
          "` as B ON A.AreaName_Lang = B.Name_Lang where B.Type = 3 AND B.LevelRangeMin > 0 AND A.ContinentID IN (0,1);"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async insert_creature_template_scaling(object) {
    try {
      let any = await pool_world_db.query(
        "INSERT IGNORE INTO `creature_template_scaling` (`Entry`, `LevelScalingMin`, `LevelScalingMax`, `LevelScalingDeltaMin`, `LevelScalingDeltaMax`, `VerifiedBuild`) VALUE ?;",
        [object]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async select_creature_by_map(map) {
    try {
      let [rows, fields] = await pool_world_db.query(
        "SELECT * FROM `creature` WHERE map = '?'",
        map
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_disenchant_loot_template() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT * FROM `disenchant_loot_template`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_charbaseinfo() {
    try {
      let [rows, fields] = await pool_dev_db.execute(
        "SELECT * FROM `db_charbaseinfo_" + db_build + "`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async replace_creature_classlevelstats(object) {
    try {
      let object_array = object.map(item => {
        return [item.level, item.class, item.basemana, item.armor];
      });

      let any = await pool_world_db.query(
        "REPLACE INTO `creature_classlevelstats` (`level`, `class`, `basemana`, `basearmor`) VALUES ?;",
        [object_array]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async replace_player_levelstats(object) {
    try {
      let object_array = object.map(item => {
        return [
          item.race,
          item.class,
          item.level,
          item.str,
          item.agi,
          item.sta,
          item.inte
        ];
      });

      let any = await pool_world_db.query(
        "REPLACE INTO `player_levelstats` (`race`, `class`, `level`, `str`, `agi`, `sta`, `inte`) VALUES ?;",
        [object_array]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async replace_disenchant_loot_template(object) {
    try {
      let any = await pool_dev_db.query(
        "REPLACE INTO `disenchant_loot_template` SET ?;",
        object
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async select_creature_addon() {
    try {
      let [rows, fields] = await pool_world_db.execute(
        "SELECT * FROM `creature_addon`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }

  async select_creature_template_addon() {
    try {
      let [rows, fields] = await pool_world_db.execute(
        "SELECT * FROM `creature_template_addon`"
      );

      return rows;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new query_handler();

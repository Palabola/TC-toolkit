require("dotenv").config();
//const logger = require("../logger.js");

const mysql = require("mysql2/promise");

const pool_dev_db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB_dev
});

const pool_world_db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB_world
});

const db_build = process.env.DB_BUILD;

class query_handler {
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
}

module.exports = new query_handler();

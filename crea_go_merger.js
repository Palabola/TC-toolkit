require("dotenv").config();
//const logger = require("../logger.js");

const mysql = require("mysql2/promise");

/* Init Databases*/
const pool_test = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "800_test",
  connectionLimit: 100
});

class query_handler {
  async select_creature_things() {
    try {
      let [rows, fields] = await pool_test.execute(
        "SELECT * FROM `creature` as A LEFT JOIN creature_addon as B ON A.guid = B.guid;"
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async insert_creature(object) {
    try {
      let any = await pool_test.query(
        "INSERT INTO `creature2` (`guid`, `id`, `map`, `zoneId`, `areaId`, `spawnDifficulties`, `phaseUseFlags`, `PhaseId`, `PhaseGroup`, `terrainSwapMap`, `modelid`, `equipment_id`, `position_x`, `position_y`, `position_z`, `orientation`, `spawntimesecs`, `spawndist`, `currentwaypoint`, `curhealth`, `curmana`, `MovementType`, `npcflag`, `unit_flags`, `dynamicflags`, `ScriptName`, `VerifiedBuild`, `unit_flags2`, `unit_flags3`, `WorldEffectID`) VALUE ?;",
        [object]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async insert_creature_addon(object) {
    try {
      let any = await pool_test.query(
        "INSERT INTO `creature_addon2` (`guid`, `path_id`, `mount`, `bytes1`, `bytes2`, `bytes3`, `emote`, `aiAnimKit`, `movementAnimKit`, `meleeAnimKit`, `auras`, `animkit`) VALUE ?;",
        [object]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async select_gameobject_things() {
    try {
      let [rows, fields] = await pool_test.execute(
        "SELECT * FROM `gameobject` as A LEFT JOIN gameobject_addon as B ON A.guid = B.guid;"
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async insert_gameobject(object) {
    try {
      let any = await pool_test.query(
        "INSERT INTO `gameobject2` (`guid`, `id`, `map`, `zoneId`, `areaId`, `spawnDifficulties`, `phaseUseFlags`, `PhaseId`, `phaseMask`, `PhaseGroup`, `terrainSwapMap`, `position_x`, `position_y`, `position_z`, `orientation`, `rotation0`, `rotation1`, `rotation2`, `rotation3`, `spawntimesecs`, `animprogress`, `state`, `ScriptName`, `VerifiedBuild`) VALUE ?;",
        [object]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async insert_gameobject_addon(object) {
    try {
      let any = await pool_test.query(
        "INSERT INTO `gameobject_addon2` (`guid`, `parent_rotation0`, `parent_rotation1`, `parent_rotation2`, `parent_rotation3`, `invisibilityType`, `invisibilityValue`, `WorldEffectID`) VALUE ?;",
        [object]
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async generate_gameobject(startguid) {
    let datas = await this.select_gameobject_things();

    let gameobject_query_array = [];
    let gameobject_addon_query_array = [];

    datas.map(rows => {
      gameobject_query_array.push([
        startguid,
        rows.id,
        rows.map,
        rows.zoneId,
        rows.areaId,
        rows.spawnDifficulties,
        rows.phaseUseFlags,
        rows.PhaseId,
        rows.phaseMask,
        rows.PhaseGroup,
        rows.terrainSwapMap,
        rows.position_x,
        rows.position_y,
        rows.position_z,
        rows.orientation,
        rows.rotation0,
        rows.rotation1,
        rows.rotation2,
        rows.rotation3,
        rows.spawntimesecs,
        rows.animprogress,
        rows.state,
        rows.ScriptName,
        rows.VerifiedBuild
      ]);

      if (rows.parent_rotation0 !== null) {
        gameobject_addon_query_array.push([
          startguid,
          rows.parent_rotation0,
          rows.parent_rotation1,
          rows.parent_rotation2,
          rows.parent_rotation3,
          rows.invisibilityType,
          rows.invisibilityValue,
          rows.WorldEffectID
        ]);
      }

      startguid++;
    });

    this.insert_gameobject(gameobject_query_array);
    this.insert_gameobject_addon(gameobject_addon_query_array);
  }

  async generate_creature(startguid) {
    let datas = await this.select_creature_things();

    let creautre_query_array = [];
    let creautre_addon_query_array = [];

    datas.map(rows => {
      creautre_query_array.push([
        startguid,
        rows.id,
        rows.map,
        rows.zoneId,
        rows.areaId,
        rows.spawnDifficulties,
        rows.phaseUseFlags,
        rows.PhaseId,
        rows.PhaseGroup,
        rows.terrainSwapMap,
        rows.modelid,
        rows.equipment_id,
        rows.position_x,
        rows.position_y,
        rows.position_z,
        rows.orientation,
        rows.spawntimesecs,
        rows.spawndist,
        rows.currentwaypoint,
        rows.curhealth,
        rows.curmana,
        rows.MovementType,
        rows.npcflag,
        rows.unit_flags,
        rows.dynamicflags,
        rows.ScriptName,
        rows.VerifiedBuild,
        rows.unit_flags2,
        rows.unit_flags3,
        rows.WorldEffectID
      ]);

      if (rows.path_id !== null) {
        creautre_addon_query_array.push([
          startguid,
          rows.path_id,
          rows.mount,
          rows.bytes1,
          rows.bytes2,
          rows.bytes3,
          rows.emote,
          rows.aiAnimKit,
          rows.movementAnimKit,
          rows.meleeAnimKit,
          rows.auras,
          rows.animkit
        ]);
      }

      startguid++;
    });

    this.insert_creature(creautre_query_array);
    this.insert_creature_addon(creautre_addon_query_array);
  }
}

let worker = new query_handler();

//worker.generate_creature(134154339);

//worker.generate_gameobject(3100505);

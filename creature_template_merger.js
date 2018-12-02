const query_handler = require("./db_manager/database_query_handler");

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

/*

TRUNCATE `development`.`creature_template`;
TRUNCATE `development`.`creature_template2`;

ALTER TABLE `creature_template` ADD `modelid1` MEDIUMINT(8) NOT NULL DEFAULT '0' AFTER `KillCredit2`;
ALTER TABLE `creature_template` ADD `modelid2` MEDIUMINT(8) NOT NULL DEFAULT '0' AFTER `modelid1`;
ALTER TABLE `creature_template` ADD `modelid3` MEDIUMINT(8) NOT NULL DEFAULT '0' AFTER `modelid2`;
ALTER TABLE `creature_template` ADD `modelid4` MEDIUMINT(8) NOT NULL DEFAULT '0' AFTER `modelid3`;


DROP TABLE IF EXISTS `creature_template_model`;
CREATE TABLE `creature_template_model`(
  `CreatureID` int(10) unsigned NOT NULL,
  `Idx` int(10) unsigned NOT NULL DEFAULT '0',
  `CreatureDisplayID` int(10) unsigned NOT NULL,
  `DisplayScale` float NOT NULL DEFAULT '1',
  `Probability` float NOT NULL DEFAULT '0',
  `VerifiedBuild` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`CreatureID`,`CreatureDisplayID`)
) ENGINE=MYISAM CHARSET=utf8mb4;

INSERT IGNORE INTO `creature_template_model` (`CreatureID`,`Idx`,`CreatureDisplayID`,`DisplayScale`,`Probability`,`VerifiedBuild`) SELECT `entry`,0,`modelid1`,`scale`,1,`VerifiedBuild` FROM `creature_template` WHERE `modelid1`!=0;
INSERT IGNORE INTO `creature_template_model` (`CreatureID`,`Idx`,`CreatureDisplayID`,`DisplayScale`,`Probability`,`VerifiedBuild`) SELECT `entry`,1,`modelid2`,`scale`,1,`VerifiedBuild` FROM `creature_template` WHERE `modelid2`!=0;
INSERT IGNORE INTO `creature_template_model` (`CreatureID`,`Idx`,`CreatureDisplayID`,`DisplayScale`,`Probability`,`VerifiedBuild`) SELECT `entry`,2,`modelid3`,`scale`,1,`VerifiedBuild` FROM `creature_template` WHERE `modelid3`!=0;
INSERT IGNORE INTO `creature_template_model` (`CreatureID`,`Idx`,`CreatureDisplayID`,`DisplayScale`,`Probability`,`VerifiedBuild`) SELECT `entry`,3,`modelid4`,`scale`,1,`VerifiedBuild` FROM `creature_template` WHERE `modelid4`!=0;

UPDATE `creature_template` SET `scale`=1;

ALTER TABLE `creature_template`
  DROP `modelid1`,
  DROP `modelid2`,
  DROP `modelid3`,
  DROP `modelid4`;


SELECT `entry`, `difficulty_entry_1`, `difficulty_entry_2`, `difficulty_entry_3`, `KillCredit1`, `KillCredit2`, `name`, `femaleName`, `subname`, `TitleAlt`, `IconName`, `minlevel`, `maxlevel`, `HealthScalingExpansion`, `RequiredExpansion`, `VignetteID`, `faction`, `npcflag`, `speed_walk`, `speed_run`, `scale`, `rank`, `dmgschool`, `BaseAttackTime`, `RangeAttackTime`, `BaseVariance`, `RangeVariance`, `unit_class`, `unit_flags`, `unit_flags2`, `unit_flags3`, `dynamicflags`, `family`, `trainer_class`, `type`, `type_flags`, `type_flags2`, `VehicleId`, `MovementType`, `HoverHeight`, `HealthModifier`, `HealthModifierExtra`, `ManaModifier`, `ManaModifierExtra`, `ArmorModifier`, `DamageModifier`, `ExperienceModifier`, `RacialLeader`, `movementId`, `RegenHealth`, `VerifiedBuild` 

FROM development.`creature_template` 

WHERE `name` != '' and entry in (SELECT `entry` FROM 800_world.`creature_template` WHERE `VerifiedBuild` = 32767 or `VerifiedBuild` = 11111 or `VerifiedBuild` = 0);





*/

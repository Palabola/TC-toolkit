SELECT * FROM `creature_loot_template` WHERE `Item` IN (SELECT `ID` FROM development.`db_itemsparse_27075` WHERE `Flags_1` = 2048);

SELECT * FROM `gameobject_loot_template` WHERE `Item` IN (SELECT `ID` FROM `db_itemsparse_27075` WHERE `Flags_1` = 2048);


SELECT * FROM `gameobject_loot_template` WHERE `Item` IN (SELECT `ID` FROM development.`db_itemsparse_27075` WHERE `Flags_1` = 2048);


SELECT * FROM `creature_loot_template` WHERE `Chance` > 85 AND `QuestRequired` = 1 ;



delete FROM `gameobject_loot_template` WHERE `Entry` IN (SELECT `Entry` FROM development.`gameobject_loot_template`);



SELECT * FROM `creature_loot_template` WHERE `Item` IN (SELECT `ID` FROM development.`db_itemsparse_27075` WHERE `Flags_1` = 2048) and `Chance` > 10 and `Chance` < 60;


SELECT * FROM `creature_loot_template` WHERE `Item` IN (SELECT `ID` FROM development.`db_itemsparse_27075` WHERE `Flags_1` = `Flags_1`| 2048) and `Chance` > 10 and `Chance` < 80 and `QuestRequired` = 0;

SELECT * FROM `creature_loot_template` WHERE `Item` IN (SELECT `ID` FROM development.`db_itemsparse_27075` WHERE `Flags_2` = 8192) and `Chance` > 10 and `Chance` < 80 and `QuestRequired` = 0


insert ignore into `creature_template_scaling` (`Entry`, `LevelScalingMin`, `LevelScalingMax`, `LevelScalingDeltaMin`, `LevelScalingDeltaMax`, `VerifiedBuild`) 
SELECT entry,110,120,0,0,22222 FROM `creature_template` 
WHERE `minlevel` >= 110 AND `HealthScalingExpansion` = 7;




/* Quest item drop */

SELECT * FROM `creature_loot_template` WHERE `QuestRequired` = 1 and `Item` IN (SELECT `ObjectID` FROM `quest_objectives` WHERE `Type` = 1 and `ObjectID` < 100000);



UPDATE `gossip_menu_option` SET `OptionType` = '5', `OptionNpcFlag` = '16', `VerifiedBuild` = '28153' WHERE `OptionText` LIKE '%Train me%';


UPDATE `gossip_menu_option` SET `OptionType` = '3', `OptionNpcFlag` = '128' WHERE `OptionText` LIKE '%let me browse%';

UPDATE `gossip_menu_option` SET `OptionType` = '3', `OptionNpcFlag` = '128' WHERE `OptionText` LIKE '%I would like to buy%';


/* Elevator fixer */

SELECT * FROM `gameobject_template_addon` WHERE `flags` != `flags` | 8 and entry IN (select entry from gameobject_template where type = 11);



/* Loot */

SELECT * FROM `creature_template` WHERE `entry` IN (select entry from creature_loot_template);


SELECT * FROM `creature_template` WHERE `entry` IN (select entry from creature_loot_template) and `lootid` = 0;

UPDATE `creature_template` SET `lootid` = `entry` WHERE `entry` IN (select entry from creature_loot_template) and `lootid` = 0;



SELECT * FROM `creature` WHERE `spawntimesecs` = 7200


WHERE `spawntimesecs` = 7200
DELETE `character_achievement_progress` 
FROM `character_achievement_progress` 
LEFT JOIN characters  ON `character_achievement_progress`.guid = characters.guid where characters.guid is NULL;


DELETE `item_instance` 
FROM `item_instance` 
LEFT JOIN characters  ON `item_instance`.owner_guid = characters.guid where characters.guid is NULL and item_instance.owner_guid !=0;

TRUNCATE item_soulbound_trade_data;


DELETE `character_inventory` 
FROM `character_inventory` 
LEFT JOIN characters  ON `character_inventory`.guid = characters.guid where characters.guid is NULL;

DELETE `character_reputation` 
FROM `character_reputation` 
LEFT JOIN characters  ON `character_reputation`.guid = characters.guid where characters.guid is NULL;

DELETE `character_queststatus_rewarded` 
FROM `character_queststatus_rewarded` 
LEFT JOIN characters  ON `character_queststatus_rewarded`.guid = characters.guid where characters.guid is NULL;

DELETE `character_skills` 
FROM `character_skills` 
LEFT JOIN characters  ON `character_skills`.guid = characters.guid where characters.guid is NULL;


--    Transfering

SELECT `guid`, `account`, `name`, `slot`, `race`, `class`, `gender`, `level`, `xp`, `money`, `skin`, `face`, `hairStyle`, `hairColor`, `facialStyle`, `customDisplay1`, `customDisplay2`, `customDisplay3`, `bankSlots`, `restState`, `playerFlags`, `position_x`, `position_y`, `position_z`, `map`, `instance_id`, `dungeonDifficulty`, `raidDifficulty`, `legacyRaidDifficulty`, `orientation`, `taximask`, `online`, `cinematic`, `totaltime`, `leveltime`, `logout_time`, `is_logout_resting`, `rest_bonus`, `resettalents_cost`, `resettalents_time`, `primarySpecialization`, `trans_x`, `trans_y`, `trans_z`, `trans_o`, `transguid`, `extra_flags`, `stable_slots`, `at_login`, `zone`, `death_expire_time`, `taxi_path`, `totalKills`, `todayKills`, `yesterdayKills`, `chosenTitle`, `watchedFaction`, `drunk`, `health`, `power1`, `power2`, `power3`, `power4`, `power5`, `power6`, `latency`, `activeTalentGroup`, `lootSpecId`, `exploredZones`, `equipmentCache`, `knownTitles`, `actionBars`, `grantableLevels`, `deleteInfos_Account`, `deleteInfos_Name`, `deleteDate`, `currentpetslot` 

FROM `characters` 
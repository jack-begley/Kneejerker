-- MySQLShell dump 1.0.2  Distrib Ver 8.0.26 for Win64 on x86_64 - for MySQL 8.0.26 (MySQL Community Server (GPL)), for Win64 (x86_64)
--
-- Host: localhost    Database: 2023_2024_bootstrapstatic    Table: elements
-- ------------------------------------------------------
-- Server version	8.0.26

--
-- Table structure for table `elements`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `elements` (
  `chance_of_playing_next_round` int DEFAULT NULL,
  `chance_of_playing_this_round` int DEFAULT NULL,
  `code` int DEFAULT NULL,
  `cost_change_event` int DEFAULT NULL,
  `cost_change_event_fall` int DEFAULT NULL,
  `cost_change_start` int DEFAULT NULL,
  `cost_change_start_fall` int DEFAULT NULL,
  `dreamteam_count` int DEFAULT NULL,
  `element_type` int DEFAULT NULL,
  `ep_next` float DEFAULT NULL,
  `ep_this` float DEFAULT NULL,
  `event_points` int DEFAULT NULL,
  `first_name` text,
  `form` float DEFAULT NULL,
  `id` int DEFAULT NULL,
  `in_dreamteam` int DEFAULT NULL,
  `news` text,
  `news_added` text,
  `now_cost` int DEFAULT NULL,
  `photo` text,
  `points_per_game` float DEFAULT NULL,
  `second_name` text,
  `selected_by_percent` float DEFAULT NULL,
  `special` int DEFAULT NULL,
  `squad_number` int DEFAULT NULL,
  `status` text,
  `team` int DEFAULT NULL,
  `team_code` int DEFAULT NULL,
  `total_points` int DEFAULT NULL,
  `transfers_in` int DEFAULT NULL,
  `transfers_in_event` int DEFAULT NULL,
  `transfers_out` int DEFAULT NULL,
  `transfers_out_event` int DEFAULT NULL,
  `value_form` float DEFAULT NULL,
  `value_season` float DEFAULT NULL,
  `web_name` text,
  `minutes` int DEFAULT NULL,
  `goals_scored` int DEFAULT NULL,
  `assists` int DEFAULT NULL,
  `clean_sheets` int DEFAULT NULL,
  `goals_conceded` int DEFAULT NULL,
  `own_goals` int DEFAULT NULL,
  `penalties_saved` int DEFAULT NULL,
  `penalties_missed` int DEFAULT NULL,
  `yellow_cards` int DEFAULT NULL,
  `red_cards` int DEFAULT NULL,
  `saves` int DEFAULT NULL,
  `bonus` int DEFAULT NULL,
  `bps` int DEFAULT NULL,
  `influence` float DEFAULT NULL,
  `creativity` float DEFAULT NULL,
  `threat` float DEFAULT NULL,
  `ict_index` float DEFAULT NULL,
  `starts` int DEFAULT NULL,
  `expected_goals` float DEFAULT NULL,
  `expected_assists` float DEFAULT NULL,
  `expected_goal_involvements` float DEFAULT NULL,
  `expected_goals_conceded` float DEFAULT NULL,
  `influence_rank` int DEFAULT NULL,
  `influence_rank_type` int DEFAULT NULL,
  `creativity_rank` int DEFAULT NULL,
  `creativity_rank_type` int DEFAULT NULL,
  `threat_rank` int DEFAULT NULL,
  `threat_rank_type` int DEFAULT NULL,
  `ict_index_rank` int DEFAULT NULL,
  `ict_index_rank_type` int DEFAULT NULL,
  `corners_and_indirect_freekicks_order` int DEFAULT NULL,
  `corners_and_indirect_freekicks_text` text,
  `direct_freekicks_order` int DEFAULT NULL,
  `direct_freekicks_text` text,
  `penalties_order` int DEFAULT NULL,
  `penalties_text` text,
  `expected_goals_per_90` int DEFAULT NULL,
  `saves_per_90` int DEFAULT NULL,
  `expected_assists_per_90` int DEFAULT NULL,
  `expected_goal_involvements_per_90` int DEFAULT NULL,
  `expected_goals_conceded_per_90` int DEFAULT NULL,
  `goals_conceded_per_90` int DEFAULT NULL,
  `now_cost_rank` int DEFAULT NULL,
  `now_cost_rank_type` int DEFAULT NULL,
  `form_rank` int DEFAULT NULL,
  `form_rank_type` int DEFAULT NULL,
  `points_per_game_rank` int DEFAULT NULL,
  `points_per_game_rank_type` int DEFAULT NULL,
  `selected_rank` int DEFAULT NULL,
  `selected_rank_type` int DEFAULT NULL,
  `starts_per_90` int DEFAULT NULL,
  `clean_sheets_per_90` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

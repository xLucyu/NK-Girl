import RaceTop75 from "./race/race_event_top_75percent.png";
import RaceTop50 from "./race/race_event_top_50percent.png";
import RaceTop25 from "./race/race_event_top_25percent.png";
import RaceTop10 from "./race/race_event_top_10percent.png";
import RaceTop1 from "./race/race_event_top_1percent.png";
import RaceTop50Placement from "./race/race_event_top_50.png";
import RaceThird from "./race/race_event_3rd.png";
import RaceSecond from "./race/race_event_2nd.png";
import RaceFirst from "./race/race_event_1st.png";

import BossTop75 from "./boss/ranked/standard/boss_event_top_75percent.png";
import BossTop50 from "./boss/ranked/standard/boss_event_top_50percent.png";
import BossTop25 from "./boss/ranked/standard/boss_event_top_25percent.png";
import BossTop10 from "./boss/ranked/standard/boss_event_top_10percent.png";
import BossTop1 from "./boss/ranked/standard/boss_event_top_1percent.png";
import BossTop50Placement from "./boss/ranked/standard/boss_event_top_50.png";
import BossThird from "./boss/ranked/standard/boss_event_3rd.png";
import BossSecond from "./boss/ranked/standard/boss_event_2nd.png";
import BossFirst from "./boss/ranked/standard/boss_event_1st.png";

import EliteBossTop75 from "./boss/ranked/elite/elite_boss_event_top_75percent.png";
import EliteBossTop50 from "./boss/ranked/elite/elite_boss_event_top_50percent.png";
import EliteBossTop25 from "./boss/ranked/elite/elite_boss_event_top_25percent.png";
import EliteBossTop10 from "./boss/ranked/elite/elite_boss_event_top_10percent.png";
import EliteBossTop1 from "./boss/ranked/elite/elite_boss_event_top_1percent.png";
import EliteBossTop50Placement from "./boss/ranked/elite/elite_boss_event_top_50.png";
import EliteBossThird from "./boss/ranked/elite/elite_boss_event_3rd.png";
import EliteBossSecond from "./boss/ranked/elite/elite_boss_event_2nd.png";
import EliteBossFirst from "./boss/ranked/elite/elite_boss_event_1st.png";

import CTGlobalTop75 from ".ct/global_player/ct_global_top_75percent.png";
import CTGlobalTop50 from ".ct/global_player/ct_global_top_50percent.png";
import CTGlobalTop25 from ".ct/global_player/ct_global_top_25percent.png";
import CTGlobalTop10 from ".ct/global_player/ct_global_top_10percent.png";
import CTGlobalTop1 from ".ct/global_player/ct_global_top_1percent.png";
import CTGlobalTop100 from ".ct/global_player/ct_global_top_100.png";
import CTGlobalTop25Placement from ".ct/global_player/ct_global_top_25.png";

import CTGlobalTeamsTop75 from ".ct/global_teams/global_teams_top_75percent.png";
import CTGlobalTeamsTop25 from ".ct/global_teams/global_teams_top_25percent.png";
import CTGlobalTeamsTop10 from ".ct/global_teams/global_teams_top_10percent.png";
import CTGlobalTeamsTop1 from ".ct/global_teams/global_teams_top_1percent.png";
import CTGlobalTeamsTop100 from ".ct/global_teams/global_teams_top_100.png";
import CTGlobalTeamsTop25Placement from ".ct/global_teams/global_teams_top_25.png";
import CTGlobalTeamsThird from ".ct/global_teams/global_teams_3rd.png";
import CTGlobalTeamsSecond from ".ct/global_teams/global_teams_2nd.png";
import CTGlobalTeamsFirst from ".ct/global_teams/global_teams_1st.png";

export const MedalImages = {
  Race: {
    Top75: RaceTop75,
    Top50: RaceTop50,
    Top25: RaceTop25,
    Top10: RaceTop10,
    Top1: RaceTop1,
    Top50Placement: RaceTop50Placement,
    Third: RaceThird,
    Second: RaceSecond,
    First: RaceFirst,
  },

  Boss: {
    Ranked: {
      Standard: {
        Top75: BossTop75,
        Top50: BossTop50,
        Top25: BossTop25,
        Top10: BossTop10,
        Top1: BossTop1,
        Top50Placement: BossTop50Placement,
        Third: BossThird,
        Second: BossSecond,
        First: BossFirst,
      },

      Elite: {
        Top75: EliteBossTop75,
        Top50: EliteBossTop50,
        Top25: EliteBossTop25,
        Top10: EliteBossTop10,
        Top1: EliteBossTop1,
        Top50Placement: EliteBossTop50Placement,
        Third: EliteBossThird,
        Second: EliteBossSecond,
        First: EliteBossFirst,
      },
    },
  },

  ContestedTerritory: {

    GlobalPlayers: {
      Top75: CTGlobalTop75,
      Top50: CTGlobalTop50,
      Top25: CTGlobalTop25,
      Top10: CTGlobalTop10,
      Top1: CTGlobalTop1,
      Top100: CTGlobalTop100,
      Top25Placement: CTGlobalTop25Placement,
    },

    GlobalTeams: {
      Top75: CTGlobalTeamsTop75,
      Top25: CTGlobalTeamsTop25,
      Top10: CTGlobalTeamsTop10,
      Top1: CTGlobalTeamsTop1,
      Top100: CTGlobalTeamsTop100,
      Top25Placement: CTGlobalTeamsTop25Placement,
      Third: CTGlobalTeamsThird,
      Second: CTGlobalTeamsSecond,
      First: CTGlobalTeamsFirst,
    },
  },
} 
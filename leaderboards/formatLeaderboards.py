from leaderboards.base import BaseLeaderboard
from utils.dataclasses.leaderboard import Leaderboard, Body
from utils.dataclasses.bossLB import BossLB, Team
from utils.assets.medals import MEDALS
from cogs.baseCommand import BaseCommand

class FormatLeaderboards(BaseLeaderboard):

    def __init__(self,
                 url: str,
                 lbType: str,
                 difficulty: str,
                 page: int,
                 emojis: dict,
                 totalScores: int):

        self.url = url 
        self.lbType = lbType
        self.difficulty = difficulty
        self.page = page 
        self.emojis = emojis 
        self.totalScores = totalScores


    def handleFormatting(self):

        if self.lbType == "Boss":
            return self._formatBossLeaderboard()

        return self._formatRegularLeaderboard()

    def _formatRegularLeaderboard(self):
        
        data = BaseCommand.useApiCall(f"{self.url}?page={self.page}")
        leaderboardData = BaseCommand.transformDataToDataClass(Leaderboard, data)

        entriesPerPage = 50 if self.lbType == "Race" else 25 
        maxNameLength = max(len(player.displayName.replace("(disbanded)", "").strip()) for player in leaderboardData.body)
        mode = MEDALS[f"{self.lbType}{self.difficulty}"] if self.lbType != "Race" else MEDALS[self.lbType]

        lbPlayerData = ""

        for position, player in enumerate(leaderboardData.body, start = 1):

            currentPosition = entriesPerPage * (self.page - 1) + position 
            playerName = player.displayName.replace("(disbanded)", "").strip() # mainly for CT

            medal = self.getMedalForPosition(self.emojis, currentPosition, self.totalScores, mode)
            formattedScore = self._getScoringType(player)

            lbPlayerData += f"{medal} `{currentPosition:02}` `{playerName.ljust(maxNameLength)} {str(formattedScore).rjust(10)}`\n"

        return lbPlayerData, self.totalScores


    def _getScoringType(self, player: Body) -> str | int:

        if self.lbType == "Race":
            return self.convertMsToTime(player.score)
        
        return player.score


    def _formatBossLeaderboard(self): 

        data = BaseCommand.useApiCall(self.url)
        leaderboardData = BaseCommand.transformDataToDataClass(BossLB, data)
        bossTiersMedal = f"<:BossTiers:{self.emojis.get('BossTiers')}>"
        totalScores = leaderboardData.totalScores
        mode = MEDALS[self.difficulty]

        lbPlayerData = ""

        for team in leaderboardData.teams[(self.page-1) * 25:self.page*25]:

            medal = self.getMedalForPosition(self.emojis, team.position, totalScores, mode)
            members = ", ".join(member.displayName for member in team.members)

            score = self._getBossLbScoringType(leaderboardData.scoringType, team)

            lbPlayerData += f"{medal} `{team.position:02}` {bossTiersMedal} `{team.scoreParts.bossTier}` `{members}` `{score:<42}`\n"

        return lbPlayerData, totalScores


    def _getBossLbScoringType(self, scoringType: str, team: Team) -> str:

        match scoringType:

            case "LeastCash":
                score = f"${team.scoreParts.score:,} ({self.convertMsToTime(team.scoreParts.secondScore)})"

            case "LeastTiers":
                score = f"{team.scoreParts.score}T ({self.convertMsToTime(team.scoreParts.secondScore)})"

            case _:
                score = self.convertMsToTime(team.scoreParts.score)

        return score

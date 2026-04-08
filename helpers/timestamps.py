from datetime import datetime, timezone

def getCurrentTimeStamp() -> int:
    return int(
        datetime
            .now(timezone.utc)
            .timestamp() * 1000
        )

def timeStampToUTCTimeFormat(timeStamp: int) -> str:
    return (
        datetime
            .fromtimestamp(timeStamp / 1000, tz = timezone.utc)
            .strftime('%Y-%m-%d %H:%M:%S UTC')
        )

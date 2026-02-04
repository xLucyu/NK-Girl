from datetime import datetime, timezone

def getCurrentTimeStamp() -> int:
    return int(
        datetime
            .now(timezone.utc)
            .timestamp() * 1000
        )

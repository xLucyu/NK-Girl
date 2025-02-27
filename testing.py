from datetime import datetime, timedelta
import pytz 

# Define 9 AM German time (CET = UTC+1)
german_tz = pytz.timezone("Europe/Berlin")
today_9am = datetime(2025, 2, 23, 9, 0, tzinfo=german_tz)

# Calculate the timestamp for day 0
days_to_subtract = 2388
day_0 = today_9am - timedelta(days=days_to_subtract)

# Get the Unix timestamp in milliseconds
timestamp_day_0 = int(day_0.timestamp() * 1000)

print(f"Timestamp for day 0: {timestamp_day_0}")

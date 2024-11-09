from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to get PPG for a specific season
def get_ppg_for_season(player_name, season):
    test_url = f'https://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season={season}&SeasonType=Regular%20Season&StatCategory=PTS'
    try:
        r = requests.get(url=test_url).json()
        row_set = r['resultSet']['rowSet']
        for player in row_set:
            if player_name.lower() in player[2].lower():
                return player[23]
    except Exception as e:
        print(f"Error fetching data for season {season}: {e}")
    return None

# Function to calculate the average PPG depending on the number of seasons requested
def get_avg_ppg(player_name, num_seasons=2):
    current_year = 2024
    seasons = [f"{current_year - i}-{(current_year - i + 1) % 100:02}" for i in range(num_seasons)]
    ppgs = []
    for season in seasons:
        ppg = get_ppg_for_season(player_name, season)
        if ppg is not None:
            ppgs.append(ppg)
    if ppgs:
        return sum(ppgs) / len(ppgs)
    return None


@app.get("/api/ppg/{player_name}/{num_seasons}")
async def get_avg_ppg_endpoint(player_name: str, num_seasons: int = 2):
    avg_ppg = get_avg_ppg(player_name, num_seasons)
    if avg_ppg is None:
        raise HTTPException(status_code=404, detail=f"Player '{player_name}' not found.")
    return {"player": player_name, "num_seasons": num_seasons, "avg_ppg": avg_ppg}

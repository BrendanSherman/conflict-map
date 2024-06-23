# Backend API implementation using FastAPI
# Author - Brendan Sherman

from datetime import date
from fastapi import FastAPI, Query
from sqlalchemy import create_engine, func, text
from sqlalchemy.orm import sessionmaker
from typing import List, Optional

from db_insert import Base, Event

# Setup API and Connect to postgre db
app = FastAPI()
DATABASE_URL = "postgresql://acled_access:eventdata2024@localhost/conflict_db"
engine = create_engine(DATABASE_URL)
LocalSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define events endpoint
@app.get("/events/")
async def get_events(
    start_date: date = Query(None),
    end_date: date = Query(None),
    event_type: str = Query(None),
    limit: int = Query(default=100, le=1000),
):
    db = LocalSession()

    # Query selects all events
    query = db.query(Event)

    # Filter by optional parameters if necessary
    if start_date:
        query = query.filter(Event.date >= start_date)
    if end_date:
        query = query.filter(Event.date <= end_date)
    if event_type:
        query = query.filter(Event.type == event_type)

    events = query.limit(limit).all()
    db.close()

    # Return list of 'event' dictionaries
    return [event.__dict__ for event in events]

# Define heatmap endpoint, accepting zoom_level and bounding box parameters
@app.get("/heatmap/")
async def get_heatmap_data(
    zoom_level: int = Query(..., ge=0, le=22),
    bbox : str = Query(...),
):
    db = LocalSession()
    # Parse bbox string into float values
    min_lon, min_lat, max_lon, max_lat = map(float, bbox.split(','))

    # SQL query selects all events within bbox, groups them into grid cells.
    # Returns average position and count of events per cell via GeoJSON. 
    query = text(""" 
        SELECT ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(AVG(longitude), AVG(latitude)), 4326)) as geom,
            count(*) as weight
        FROM events
        WHERE longitude BETWEEN :min_lon AND :max_lon
            AND latitude BETWEEN :min_lat AND :max_lat
        GROUP BY ST_SnapToGrid(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326), 
                                (:max_lon - :min_lon) / (256 * pow(2, :zoom_level))) 
    """)

    # Execute query and process results into list of dictionaries
    try:
        result = db.execute(query, {
            "min_lon": min_lon,
            "min_lat": min_lat,
            "max_lon": max_lon,
            "max_lat": max_lat,
            "zoom_level": zoom_level
        })  
        heatmap_data = [{"geom": row.geom, "weight": row.weight} for row in result]
        return heatmap_data
    except Exception as e:
        print(f"Error: {e}")
        return {"error": "Error occurred fetching heatmap data from backend API."}
    finally:
        db.close()

def main():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == '__main__':
    main()
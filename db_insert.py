import json
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

# load data from json file
with open('acled_data.json', 'r') as file:
    event_data = json.load(file)

# initiate db connection (need to add credentials)
eng = create_engine('postgresql://acled_access:eventdata2024@localhost:5432/conflict_db')
Base = declarative_base()

# event model
class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True)
    date = Column(Date)
    type = Column(String)
    actors = Column(String)
    location = Column(String)
    region = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    fatalities = Column(Integer)
    source = Column(String)

# create table in db
Base.metadata.create_all(eng)

# start session
Session = sessionmaker(bind=eng)
session = Session()

# Insert processed into db from file 
try:
    for event in event_data:
        event_obj = Event(
            date=datetime.strptime(event['date'], '%Y-%m-%d'),
            type=event['type'],
            actors=', '.join(event['actors']),
            location=event['location'],
            region=', '.join(event['region']),
            latitude=event['latitude'],
            longitude=event['longitude'],
            fatalities=event['fatalities'],
            source=event['source']
        )
        session.add(event_obj)
    session.commit()
except Exception as e:
    print(f"db session error: {e}")
    session.rollback()
finally: 
    session.close()
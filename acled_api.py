# Request and save data from ACLED API
# Author: Brendan Sherman (brendansherman11@gmail.com)

import requests
import json

api_url = 'https://api.acleddata.com/acled/read/'
api_key = '0H71pgwICr7u!IpF0Gvj'
api_email = 'shermabk@bc.edu'
output_file = 'acled_data.json'

def fetch_acled_data():
    params = {
        'key': api_key,
        'email': api_email,
        'limit': 2000
    }
    response = requests.get(api_url, params = params)
    data = response.json()
    return data['data']

def parse_acled_data(data):
    events = []
    for event in data:
        event_date = event['event_date']
        event_type = event['event_type']
        location = event['location']
        latitude, longitude = event['latitude'], event['longitude']
        fatalities = event['fatalities']
        source = event['source']
        notes = event['notes']
        
        # Include all recorded actors
        actors = [event['actor1'], event['actor2']]
        actors = list(filter(None, actors))
        
        # Include existing subregional information
        region_tags = [event['admin1'], event['admin2'], event['admin3']]
        region_tags = list(filter(None, region_tags))

        events.append({
            'date': event_date,
            'type': event_type,
            'actors': actors,
            'location': location,
            'region': region_tags,
            'latitude': latitude,
            'longitude': longitude,
            'fatalities': fatalities,
            'source': source,
            'notes': notes
        })
    return events

def write_json(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

if __name__ == '__main__':
    acled_data = fetch_acled_data()
    processed_data = parse_acled_data(acled_data)
    write_json(data=processed_data, file_path=output_file)



![Alt text](public/images/logo_200.png?raw=true "openinghours logo")

# Opening hours api

 :exclamation:  :exclamation: NOT PRODUCTION READY YET  :exclamation: :exclamation:

## Installation

### local
1. git clone this repository
2. (install npm)
3. npm install
4. (install mysql file into your mysql)
5. Set your db credentials
6. run node server.js

### heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. press the button above.
2. add clearDB to your heroku application
3. upload the mysql file in the ClearDB instance


## API

### Endpoints

#### GET /api/v1/openinghours/ENT_ID/CHANNEL_ID
retrieves opening hours for entity ENT_ID and their channel CHANNEL_ID.

url parameters:
* from (e.g. 2017-12-31)
* to (e.g. 2017-12-31)


#### GET /api/v1/openinghours/ENT_ID
Retrieve channels and their opening hours from an entity.

url parameters:
* from (e.g. 2017-12-31)
* to (e.g. 2017-12-31)


#### GET /api/v1/openinghours
retrieves all opening hours for this week grouped by entity and channel and day.

url parameters:
* from (e.g. 2017-12-31)
* to (e.g. 2017-12-31)

#### GET /api/v1/open/ENT_ID/CHANNEL_ID
Is this specific channel CHANNEL_ID for entity ENT_ID open or not?

url parameters
* timestamp: the timestamp to check if channel is opened (defaults to NOW)

#### GET /api/v1/open/ENT_ID
Retrieves the open channels for entity ENT_ID

url parameters
* timestamp: the timestamp to check if channels are opened (defaults to NOW)

#### GET /api/v1/open
Retrieves the open channels for all entities grouped per entity

url parameters
* timestamp: the timestamp to check if channels are opened (defaults to NOW)

#### GET api/v1/channels
List all the available channels.

#### GET api/v1/entities
List all the available entities.

#### GET api/v1/entities/ENT_ID
Show the entity detail

## editing

### entities
On the overview page "entities" you can add/edit the system's entities.
Each entity has a set of channels (phone/email/...)

### channels
A chat is for example chat, email, phone, ...
Each entity can have their own blend of channels and opening hours for each of these.
For the moment channels is global, you enter channels and every entity can add opening hours for them for this channel.

## overview page.
On the overview page one can
- jump to the opening hours of different channels of different entities.
- jump to opening hours of samen entity / different channel
- copy opening hours schemas from one channel to another or across entities, and this for longer periods (until the end of the year).
- enter as much timeslots per weekday as wanted (not limited) e.g.: form 9 to 10, from 10 to 11, from 11 to 12, from 13 to 14.
- delete timeslots (close opening hours) (= disable channel)


## datastructure

### entity

- ID
- name
- link to remote source
- created (timestamp)
- created_by (user_id)

### channel

- ID
- name
- created (timestamp)
- created_by (user_id)

### opening_hours

- ID
- entity_id
- channel_id
- day (2017-12-31)
- start_time (timestamp)
- end_time (timestamp)
- created (timestamp)
- created_by (user_id)


### user

- ID
- name
- email
- password (hashed + salted)
- created (timestamp)
- created_by (user_id)

### log

- ID
- user_id
- action
- reference (channel/entity/opening_hous)
- value (serialized objects)

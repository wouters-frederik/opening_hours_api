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

#### GET /api/v1/openinghours/ORG_ID/CHANNEL_ID
retrieves opening hours for organisation ORG_ID and their channel CHANNEL_ID.

url parameters:
* from (e.g. 2017-12-31)
* to (e.g. 2017-12-31)


#### GET /api/v1/openinghours/ORG_ID
Retrieve channels and their opening hours from an organisation.

url parameters:
* from (e.g. 2017-12-31)
* to (e.g. 2017-12-31)


#### GET /api/v1/openinghours
retrieves all opening hours for this week grouped by organisation and channel and day.

url parameters:
* from (e.g. 2017-12-31)
* to (e.g. 2017-12-31)

#### GET /api/v1/open/ORG_ID/CHANNEL_ID
Is this specific channel CHANNEL_ID for organisation ORG_ID open or not?

url parameters
* timestamp: the timestamp to check if channel is opened (defaults to NOW)

#### GET /api/v1/open/ORG_ID
Retrieves the open channels for organisation ORG_ID

url parameters
* timestamp: the timestamp to check if channels are opened (defaults to NOW)

#### GET /api/v1/open
Retrieves the open channels for all organisations grouped per organisation

url parameters
* timestamp: the timestamp to check if channels are opened (defaults to NOW)

#### GET api/v1/channels
List all the available channels.

#### GET api/v1/organisations
List all the available organisations.

#### GET api/v1/organisations/ORG_ID
Show the organisation detail

## editing

### organisations
On the overview page "organisations" you can add/edit the system's organisations.
Each organisation has a set of channels (phone/email/...)

### channels
A chat is for example chat, email, phone, ...
Each organisation can have their own blend of channels and opening hours for each of these.
For the moment channels is global, you enter channels and every organisation can add opening hours for them for this channel.

## overview page.
On the overview page one can
- jump to the opening hours of different channels of different organisations.
- jump to opening hours of samen organisation / different channel
- copy opening hours schemas from one channel to another or across organisations, and this for longer periods (until the end of the year).
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
- organisation_id
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

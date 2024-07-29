# diner app (ravintolasovellus) "dinerappthing"
## description
A user can log in, view restaurants (view: Google Maps API) based on info in a PostgreSQL database, log out, read reviews by other users and give their own review.
A selection of restaurants (and a couple of cafes and bars) is initialized as a PostgreSQL database, from which markers are placed
on the Google map based on Places API query that includes the name and address given in the PostgreSQL database.
Restaurants can be grouped by the admin according to some properties (WIP). The admin can delete reviews by rendering them invisible to others (we don't want to permanently delete the evidence c;). The admin can also delete comments by rendering them invisible. These two can be done irrespective of each other. The review ratings are ignored in calculation of grade average for a place.
The user can search for restaurants based on description and based on name. The admin can add new places according to a rough name and a rough address - the Places API will then search the official name and address and other info to be shown on map based on this. The rough name and address in the SQL db are updated to their official counterparts after they have been searched from the Places API. Only the official name and address are shown to the users.

their own reviews, including a comment and a rating/5.
## TO-DO:
- admin can create groups for restaurants based on properties, like "thai", "cafe", etc.
- clean-up

## Done
[x] add info, opening hours and sql-database-based ratings /5 to each custom location on the map
[x] possible for users to add comments and ratings
[x] admin can delete comments and ratings given by users (when they are clearly spam etc.)
[x] restaurant search (textbox search based on name OR place categories and description)
[x] rating list; top restaurants
[x] a user can search restaurants from the SQL database based on words of the desription / name
[x] add timestamps after comments and ratings
[x] restaurant categories are stored in DB, fetched from DB, using both admin-managed custom categories and descriptions fetched from the Places API

## Maybe some day..
- it would be awesome to save ALL info to the db after initial querying of the API so that the Places API wouldn't have to be used after that -> less use of the API (it's not free to use after initial trial), AND faster if your db lives closer to you than Google's servers.

## SQL tables
See schema.sql
- users         id      username (uniq.)    password            is_admin            email               
- restaurants   id      restaurant_name     street address      restaurant_visible
- ratings       id      restaurant_id       user_id             comment_id          rating (0...5)  created_at  rating_visible
- comments      id      user_id             restaurant_id       comment             visible         created_at
- restaurant_categories id  restaurant_id   category            category_visible

## WIP: premature manual (planning)
### AFTER GIT CLONING:
- run 'pip install requirement.txt' to install all the dependencies
- schema.sql has the list of PostgreSQL commands to be run to CREATE the necessary tables for the app:
    * 'psql < schema.sql' to execute the commands. In my case, I have to copy the schema.sql to my root/var/lib/postgresql, then 'su - \[userhere\]' -> input password for that user -> 'psql < schema.sql', every time, ((( see next line )))
(((- I personally installed PostgreSQL in ubuntu 22 by 'apt install postgresql', then 'sudo passwd \[userhere\]' -> create password for that user. Every time I want to access PostgreSQL, 'su - \[userhere\]' -> input password -> 'psql', which by default puts me in root/var/lib/\[userhere\])))
- on this coure, PostgreSQL is used:
    * in .env:
        * DATABASE_URL=postgresql:///\[your_postgresql_user_here\]
        * SECRET_KEY=\[for example in python3 you can run "import secrets"; "secrets.token_hex(16)"; copy-paste the generated key here\]

### gitignore
-.env
-.__pycache__
-venv

### env vars
- for example, to set the SECRET_KEY, in python3 you can run "import secrets"; "secrets.token_hex(16)"; copy-paste the generated key
- set DATABASE_URL=postgresql:///\[your_user_here\]
- ADMIN_PASSWORD should be set raw; in English, do not use hashing for the actual password string; instead type the ADMIN_PASSWORD as-is
GOOGLE_API_KEY: I'm using google api for the map services. For that, you'll need 
- a 39-character (in my case) API Key from Google Cloud. With that set as the GOOGLE_API_KEY environment variable, AND 
- when you enable 
    - Geocoder and 
    - Maps JavaScript API in your Google Cloud settings, 
you should be able to use the code as-is. As I understand, it's free and would warn you if you are near your free limit, and even then you would have to manually agree to pay if you exceed your usage limit. Let's hope I didn't misunderstand anything :p

### Google Maps API
First, see the GOOGLE_API_KEY above.
Here are some manuals regarding how I set up the thing:
- https://developers.google.com/maps/documentation/javascript/adding-a-google-map#maps_add_map-html adding a Google Map
- https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple infowindow; when clicking on a custom-made marker, how to show an info window
- https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement AdvancedMarkerElement; i.e. the markers you see on the map.
- https://developers.google.com/maps/documentation/javascript/places#find_place_from_query Places Library query; searching based on query, in my case, at least. You can also do much more with this.
- https://developers.google.com/maps/documentation/places/web-service/details places API; all the different things you could be fetching through the API, such as wheelchair-accessibility, photos, formatted phone number... etc

### other stuff
- star rating shenanigans: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_star_rating

### requirements.txt contents (i.e., dependencies)
- after git cloning onto your computer, run 'pip install requirement.txt' to install all the dependencies
- (((whenever a new 'pip install \[x\]' is done, run pip freeze > requirements.txt to update this dependency list to include \[x\] also)))
- list of requirements:
* Flask: for web dev with Python: Python micro web dev environment
* Jinja2: templating engine for writing python. For example Django uses this also.
* SQLAlchemy: for postgre-SQL
* Flask-SQLAlchemy: API for communication between these two
* psycopg2-binary: for communication between PostgreSQL db and Flask. PostgreSQL driver.
* python-dotenv: environment variables for python, you guessed it
* gunicorn: for fly.io, production dev (internet)
* Werkzeug: comes with Flask, for example generate_password_hash and check_password_hash are from this library
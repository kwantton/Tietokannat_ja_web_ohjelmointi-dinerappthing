# diner app (ravintolasovellus) "dinerappthing"
## description
A user can log in, view restaurants (view: Google Maps API) based on info in a PostgreSQL database, log out, read reviews by other users and give their own review.
A selection of restaurants (and a couple of cafes and bars) is initialized as a PostgreSQL database, from which markers are placed
on the Google map based on Places API query that includes the name and address given in the PostgreSQL database.
The admin can add new places on the map by querying based on a rough name and a rough address, hide existing places, as well as add and remove descriptions ("categories") of the places. The admin can delete reviews by rendering them invisible to others (we don't want to permanently delete the evidence c;). The admin can also delete comments by rendering them invisible. Deleting comments and reviews (non-permanently) can be done independently of each other. Hidden (non-permanently 'removed') ratings are ignored in calculation of grade average for a place.
The user can search (hide/show) the restaurants on the map, and on the list below, based on the description or the name of the place. After the abovementioned adding of new places based on an approximate name and an approximate address, the Places API will then search the official name and address and other info to be shown on map (these will be updated to the db only if the admin is logged in, however). The rough name and address in the SQL db are also updated to their official counterparts in this process. Only the official name and address are then shown to the users.

## TO-DO:

- refactor and clean-up

## Done
- [x] add info, opening hours and sql-database-based ratings /5 to each custom location on the map
- [x] possible for users to add comments and ratings
- [x] admin can delete comments and ratings given by users (when they are clearly spam etc.)
- [x] restaurant search (textbox search based on name OR place categories and description)
- [x] rating list; top restaurants
- [x] a user can search restaurants from the SQL database based on words of the desription / name
- [x] add timestamps after comments and ratings
- [x] restaurant categories are stored in DB, fetched from DB, using both admin-managed custom categories and descriptions fetched from the Places API
- [x] admin can toggle the visibility of each category (like 'asian' or 'thai') for each restaurant (i.e., admin can remove and reapply descriptions of each restaurant)
- [x] admin can add new categories for restaurants (like "thai", "cafe", "bar", etc.)
- [x] search functions: lowercase queries first in 'map.jinja'
- [x] "layout.jinja" to use as a template for all the pages (except the error page, too distracting there)
- [x] major refactorization of visibility toggling in 'app.py', saving about 100 rows of space (repetition out of the window)
- [x] admin can permanently DELETE categories (in addition to disabling them), and in case of a successful DELETE, the respective category with its associated buttons are "display.style = none"'d -> no need to refresh.
- [x] csrf_token for every POST, UPDATE or DELETE -kind of form, checking according to session.csrf_token in app.py

## Maybe some day..
- it would be awesome to save ALL info to the db after initial querying of the API so that the Places API wouldn't have to be used after that -> less use of the API (it's not free to use after initial trial), AND faster if your db lives closer to you than Google's servers.

## SQL tables
See schema.sql
- users:         id      username (uniq.)    password            is_admin            email               
- restaurants:   id      restaurant_name     street address      restaurant_visible
- ratings:       id      restaurant_id       user_id             comment_id          rating (0...5)  created_at  rating_visible
- comments:      id      user_id             restaurant_id       comment             visible         created_at
- restaurant_categories: id  restaurant_id   category            category_visible

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
- a 39-character (or the like) API Key from Google Cloud. With that set as the GOOGLE_API_KEY environment variable, AND 
- when you enable 
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
# diner app (ravintolasovellus) "dinerappthing"
## TO-DO:
- map of restaurants with info and opening hours
- ratings /5, comments, from different users
- when admin is logged in, they can do... admin stuff
- restaurant serch (textbox search based on name, description)
- rating list; top restaurants
- admin can delete comments
- groups for restaurants based on some (?) properties

## SQL tables
See schema.sql
- users         id      username (uniq.)    password            email               
- restaurants   id      restaurant_name     street address
- ratings       id      restaurant_id       user_id             rating (0...5)
- comments      id      user_id             restaurant_id       comment

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
- https://developers.google.com/maps/documentation/javascript/places#find_place_from_query Places Library; searching based on query, in my case, at least. You can also do much more with this.


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
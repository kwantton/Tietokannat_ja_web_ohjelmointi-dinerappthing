# diner app (ravintolasovellus) "dinerappthing"
## description
### for online testing!
Now the application can be used at https://dinerappthing.fly.dev/.

For peer reviews: admin password is 'admin1234', username is 'admin'.

If you want to get the admin password for testing, contact me (antton.kasslin@hotmail.com). This way you can add restaurants (and other places!), toggle visibility of restaurants to users, add new categories, hide and delete old categories, and toggle visibility of each rating and comment separately.

Currently, I've only added a few places on the map to conserve my limited free Google Places API.  It's possible to add more, and not just restaurants, in the admin page (/admin) but only if you have the admin password, of course.

Note! Ad blockers like uBlocker can prevent normal function, including CORS
functionality. For example also Foodora app doesn't work if you have adblocker - I had the same problem, I also have another random problem
that only happens when using adblocker.

### general

A user can log in, view restaurants (view: Google Maps API) based on info in a PostgreSQL database, log out, read reviews by other users and give their own review.
A selection of restaurants (and a couple of cafes and bars) is initialized as a PostgreSQL database, from which markers are placed
on the Google map based on Places API query that includes the name and address given in the PostgreSQL database.
Upon clicking each marker, you can see whether the place is currently open or closed, what its opening hours are, what categories (café, restaurant, bar etc) of services it has, the current sql-db-based ratings and comments (those that have 'visible'=TRUE in the db), and the user can leave their own rating and comment. If the user is not logged in, they will see a text with a link to login.
The admin can add new places on the map by querying based on a rough name and a rough address, hide existing places, as well as add and remove descriptions ("categories") of the places. The admin can delete reviews by rendering them invisible to others (we don't want to permanently delete the evidence c;). The admin can also delete comments by rendering them invisible. Deleting comments and reviews (non-permanently) can be done independently of each other. Hidden (non-permanently 'removed') ratings are ignored in calculation of grade average for a place.
The user can search (hide/show) the restaurants on the map, and on the list below, based on the description or the name of the place. After the abovementioned adding of new places based on an approximate name and an approximate address, the Places API will then search the official name and address and other info to be shown on map (these will be updated to the db only if the admin is logged in, however). The rough name and address in the SQL db are also updated to their official counterparts in this process. Only the official name and address are then shown to the users.

## TO-DO:
- refactor and clean-up

## Done
- [x] markers on the map; icon based on if it's a restaurant, bar, cafe, etc., and there's a text below each icon by default (this is also ctrl-f:ble!)
- [x] add info, opening hours and sql-database-based ratings /5 to each custom location on the map
- [x] is the place open right now? Visible in the info window after clicking.
- [x] possible for users to add comments and ratings
- [x] admin can delete comments and ratings given by users (when they are clearly spam etc.)
- [x] restaurant search (textbox search based on name OR place categories and description)
- [x] rating list; top restaurants, with another search box based on this list's restaurants' names
- [x] add timestamps after comments and ratings
- [x] restaurant categories are stored in DB, fetched from DB, using both admin-managed custom categories and descriptions fetched from the Places API
- [x] admin can toggle the visibility of each category (like 'asian' or 'thai') for each restaurant (i.e., admin can remove and reapply descriptions of each restaurant)
- [x] admin can add new categories for restaurants (like "thai", "cafe", "bar", etc.)
- [x] search functions: lowercase queries first in 'map.jinja'
- [x] "layout.jinja" to use as a template for all the pages (except the error page, too distracting there)
- [x] major refactorization of visibility toggling in 'app.py', saving about 100 rows of space (repetition out of the window)
- [x] admin can permanently DELETE categories (in addition to disabling them), and in case of a successful DELETE, the respective category with its associated buttons are "display.style = none"'d -> no need to refresh.
- [x] csrf_token for every POST, UPDATE or DELETE -kind of form, checking according to session.csrf_token in app.py
- [x] deployed in fly.io, testable at "https://dinerappthing.fly.dev/"! You can create a new account, look at the restaurant map, write comments and ratings, etc. I currently have only a couple so that I don't run out of my free Google Places API.
- [x] I'm always closing the previous infoWindow before adding the eventlisteners to the new one (onclick), so that the comment and rating are targeted towards only the currently open infoWindow. Since I use documentQuerySelector when handling the infoWindows, and since it was previously possible to open multiple infoWindows, the querySelectors were previously breaking down when the user tried to give a rating and a feedback comment when multiple boxes were open at the same time.

## Maybe some day..
- it would be awesome to save ALL info to the db after initial querying of the API so that the Places API wouldn't have to be used after that -> less use of the API (it's not free to use after initial trial), AND faster if your db lives closer to you than Google's servers.

## SQL tables
See schema.sql
- users:         id      username (uniq.)    password            is_admin            email               
- restaurants:   id      restaurant_name     street address      restaurant_visible
- ratings:       id      restaurant_id       user_id             comment_id          rating (0...5)  created_at  rating_visible
- comments:      id      user_id             restaurant_id       comment             visible         created_at
- restaurant_categories: id  restaurant_id   category            category_visible


## AFTER GIT CLONING, you MUST DO these if you want to test this locally instead of at https://dinerappthing.fly.dev/:
- run 'pip install requirements.txt' to install all the dependencies
- very important: if running locally, set in .env the 'WHERE' as 'local'. See more in section (1) env vars, below, which lists all the .env contents.
- schema.sql has the list of PostgreSQL commands to be run to CREATE the necessary tables for the app:
    * 'psql < schema.sql' to execute the commands. In my case, I have to copy the schema.sql to my root/var/lib/postgresql, then 'su - \[userhere\]' -> input password for that user -> 'psql < schema.sql', every time, ((( see next line )))
(((- I personally installed PostgreSQL in ubuntu 22 by 'apt install postgresql', then 'sudo passwd \[userhere\]' -> create password for that user. Every time I want to access PostgreSQL, 'su - \[userhere\]' -> input password -> 'psql', which by default puts me in root/var/lib/\[userhere\])))
- on this coure, PostgreSQL is used:
    * in .env, regarding PostgreSQL:
        * DATABASE_URL=postgresql:///\[your_postgresql_user_here\]
        * SECRET_KEY=\[for example in python3 you can run "import secrets"; "secrets.token_hex(16)"; copy-paste the generated key here\]
        * these are for the db, see below for the rest of the .env vars you have to set up!

### (1) env vars
- WHERE = 'local' if you are running locally ('flask run', when in venv, to run the app locally). If WHERE is 'local', then in layout.jinja, there is no \<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">\</meta>, which enforces https always when deployed online. When running in fly.io, WHERE = 'fly.io', and this enables this \<meta>\</meta> html, enforcing https: everywhere. This is to prevent mix-and match of http and https, which would result in error in the browser (this happened before adding the \<meta>\</meta>)
- for example, to set the SECRET_KEY, in python3 you can run "import secrets"; "secrets.token_hex(16)"; copy-paste the generated key
- set DATABASE_URL=postgresql:///\[your_user_here\]
- ADMIN_PASSWORD should be set raw; in English, do not use hashing for the actual password string; instead type the ADMIN_PASSWORD as-is
- GOOGLE_API_KEY: I'm using google api for the map services. For that, you'll need 
    - a 39-character (or the like) API Key from Google Cloud. With that set as the GOOGLE_API_KEY environment variable, AND 
    - when you enable 
        - Maps JavaScript API in your Google Cloud settings, 
        - Places API also in your Google Cloud settings,
you should be able to use the code as-is. 
As of 16.8.2024:
"You are not billed during your Free Trial \[that's 90 days\]. When the Free Trial ends, all resources you created during the trial are stopped and you will not be charged, unless you upgrade to a paid Cloud Billing account." The free trial seems to be 281 € / month, for the duration of 90 days (3 months), after which you'd have to pay for the following usage.

### (2) Google Maps API
First, see the GOOGLE_API_KEY above.
Here are some manuals regarding how I set up the thing:
- https://developers.google.com/maps/documentation/javascript/adding-a-google-map#maps_add_map-html adding a Google Map
- https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple infowindow; when clicking on a custom-made marker, how to show an info window
- https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement AdvancedMarkerElement; i.e. the markers you see on the map.
- https://developers.google.com/maps/documentation/javascript/places#find_place_from_query Places Library query; searching based on query, in my case, at least. You can also do much more with this.
- https://developers.google.com/maps/documentation/places/web-service/details places API; all the different things you could be fetching through the API, such as wheelchair-accessibility, photos, formatted phone number... etc

### other stuff
- star rating shenanigans: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_star_rating

#### if you want to set up a psql db for fly.io, NB!!! You'll need a utf-8-based db instead of the default sql_ASCII-based db!
Before connecting the app (dinerapp) to the db-app, (1) connect to the db-app (2) create a psql db with utf-8 encoding (3) ONLY THEN connect to that db specifically. Otherwise you might have ascii-unrecognized characters in your db, such as é (café) or @ (all the user emails)

#### requirements.txt contents (i.e., dependencies)
- after git cloning onto your computer, run 'pip install requirements.txt' to install all the dependencies
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

#### gitignore
- .env
- .__pycache__
- venv
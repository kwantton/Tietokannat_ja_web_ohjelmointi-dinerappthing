# diner app (ravintolasovellus) "dinerappthing"
# TO-DO:
- user login, new account creation
- map of restaurants with info and opening hours
- ratings /5, comments, from different users
- admin
- restaurant serch (textbox search based on name, description)
- rating list; top restaurants
- admin can delete comments
- groups for restaurants based on some (?) properties

## WIP: premature manual (planning)
### AFTER GIT CLONING:
- run 'pip install requirement.txt' to install all the dependencies
- on this coure, PostgreSQL is used
* DATABASE_URL=postgresql:///\[your_postgresql_user_here\]
* SECRET_KEY=\[for example in python3 you can run "import secrets"; "secrets.token_hex(16)"; copy-paste the generated key here\]

### gitignore
-.env
-.__pycache__
-venv

### env vars
- for example, to set the SECRET_KEY, in python3 you can run "import secrets"; "secrets.token_hex(16)"; copy-paste the generated key
- set DATABASE_URL=postgresql:///\[your_user_here\]

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
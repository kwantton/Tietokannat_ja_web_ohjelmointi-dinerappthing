import secrets                                          # for generating csrf token after login
from sqlalchemy import text                             # needed in new versions of SQLAlchemy, including the version I have (source: https://hy-tsoha.github.io/materiaali/osa-2/)
from app import app, where, getenv
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
# secrets', 'text' and the two hash functions are all related to database operations

if where == 'local':
    app.config['SQLALCHEMY_DATABASE_URI'] = getenv('DATABASE_URL') # NB! FOR LOCAL BUILD!, see material (https://hy-tsoha.github.io/materiaali/osa-3/)
    app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'    # no need to send my session cookies anywhere -> use Strict instead; don't send cookies elsewhere. I don't think the map itself has any automatic mystery cookies, so it shouldn't need these.
elif where == 'fly.io':
    app.config["SQLALCHEMY_DATABASE_URI"] = getenv("DATABASE_URL").replace("://", "ql://", 1) # NB! FOR fly.io BUILD! See course material (https://hy-tsoha.github.io/materiaali/osa-3/)
    app.config['SESSION_COOKIE_SAMESITE'] = 'Strict'
    #app.config['SESSION_COOKIE_SAMESITE'] = 'None'      # this allows cookies to be sent elsewhere also (cross-site cookies)
    #app.config['SESSION_COOKIE_SECURE'] = True          # this makes the secure sending of cookies possible; allows only HTTPS connections, and HTTPS encrypts cookies
db = SQLAlchemy(app)
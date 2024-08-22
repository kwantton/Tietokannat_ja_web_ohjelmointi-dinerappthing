from os import getenv
where = getenv('WHERE')

from flask import Flask
app = Flask(__name__)

import routes 
import api.admin, api.indexjs # (1) folder 'api', file 'admin' (2) folder 'api', file 'indexjs'

# NB! You can't import 'api.x' or 'routes' before 'app' is initialized above, otherwise you get 'circular import' error
# note: above I'm importing 'os' for getting the variable 'where' (as in 'where is the app running') here so that I can import 'where' alongside the 'app' itself from 'app.py' elsewhere, in other .py files -> less space taken by the imports of 'app' and 'where' elsewhere.
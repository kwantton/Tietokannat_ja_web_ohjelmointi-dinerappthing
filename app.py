from os import getenv
where = getenv('WHERE')

from flask import Flask
app = Flask(__name__)

import routes 
import api.admin, api.indexjs # folder api, file admin + folder api, file indexjs

# NB! You can't import 'api.x' or 'routes' before 'app' is initialized above, otherwise you get 'circular import' error
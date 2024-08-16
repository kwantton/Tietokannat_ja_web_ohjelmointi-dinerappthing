from os import getenv
where = getenv('WHERE')

from flask import Flask
app = Flask(__name__)

import api
import routes 

# NB! You can't import 'api' or 'routes' before 'app' is initialized above, otherwise you get 'circular import' error
from os import getenv
where = getenv('WHERE')

from flask import Flask
app = Flask(__name__)
import routes # can't import routes before app is initialized, otherwise you get 'circular import' error
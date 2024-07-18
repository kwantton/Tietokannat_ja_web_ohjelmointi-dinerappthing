from flask import Flask
from flask import redirect, render_template, request
from sqlalchemy import text                             # needed in new versions of SQLAlchemy, including the version I have (source: https://hy-tsoha.github.io/materiaali/osa-2/)
from flask_sqlalchemy import SQLAlchemy
from os import getenv

app = Flask(__name__)
db = SQLAlchemy(app)
app.secret_key = getenv("SECRET_KEY")

@app.route("/")
def index():
    return render_template('index.html')
from flask import Flask
from flask import redirect, render_template, request, session
from sqlalchemy import text                             # needed in new versions of SQLAlchemy, including the version I have (source: https://hy-tsoha.github.io/materiaali/osa-2/)
from flask_sqlalchemy import SQLAlchemy
from os import getenv

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = getenv('DATABASE_URL')
db = SQLAlchemy(app)
app.secret_key = getenv("SECRET_KEY")


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/login", methods=["POST"])
def login():
    username = request.form['username']
    password = request.form['password']
    sql = text('SELECT username, password FROM users WHERE username=:username')
    result = db.session.execute(sql, {"username":username})
    real_username, real_password = result.fetchone() # the row has two values: u_name and p_word.
    if real_username:   # if not None
        if real_password == password:
            session["username"] = username
            return redirect("/")
    # else:
        # return render_template("error.html", message="")
        
@app.route("/logout", methods=["GET"])                                                              # GET is already there by default, but just for practice!
def logout():
    del session["username"]
    return redirect("/")

@app.route("/register", methods=["GET","POST"])                                                     # 'GET' is there by default, but if you just write "POST", you'll override GET. Hence, both need to be listed
def register():
    if request.method == "GET":
        return render_template("register.html")
    if request.method == "POST":
        username = request.form["username"]
        password1 = request.form["password1"]
        password2 = request.form["password2"]
        if password1 != password2:
            return render_template("error.html", message="passwords don't match")
        else:                                                                                       # redundant else BUT I like clarity
            sql = text('INSERT INTO users (username, password) VALUES (:username, :password1)')
            result_after_inserting_into_users = db.session.execute(sql, {"username":username, "password1":password1})
            print("result after inserting into users a newly registered user:", result_after_inserting_into_users)


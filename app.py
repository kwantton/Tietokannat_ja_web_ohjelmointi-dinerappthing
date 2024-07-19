from flask import Flask
from flask import redirect, render_template, request, session
from sqlalchemy import text                             # needed in new versions of SQLAlchemy, including the version I have (source: https://hy-tsoha.github.io/materiaali/osa-2/)
from flask_sqlalchemy import SQLAlchemy
from os import getenv
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = getenv('DATABASE_URL')
db = SQLAlchemy(app)
app.secret_key = getenv("SECRET_KEY")
admin_password = getenv("ADMIN_PASSWORD")
API_key = getenv("GOOGLE_API_KEY")

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/map')
def map():
    return render_template('map.html', key=API_key)

@app.route("/login", methods=["POST"])
def login():
    username = request.form['username']
    password = str(request.form['password']) # if the input password is just numbers...?

    print("login username:", username)
    print("login password:", password)
    
    sql = text('SELECT username, password FROM users WHERE username=:username') # you CAN'T check the password here unless you first encrypt the password using werkzeug.security.generate_password_hash(pw_here)
    result = db.session.execute(sql, {"username":username, "password":password})  # HASHED pw into db
    
    if username == "admin":
        if password == admin_password:                          # admin_password is stored as env var
            session["username"] = username
            return redirect("/")
        else:
            return render_template("error.html", message="username or password is wrong")
    else:
        try:
            print("result:", result)
            user = result.fetchone()        # the row has two values: u_name and p_word.
            print("user:", user)
            print("real_username:", user.username)
            print("hashed_password:", user.password)
            if check_password_hash(user.password, password):
                session["username"] = username
                return redirect("/")
            else:
                return render_template("error.html", message="username or password is wrong")    
        except:
            print("couldn't get real_username, hashed_pw, returning error message:")
            return render_template("error.html", message="username or password is wrong")
        
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
        email = request.form["email"]
        if password1 != password2:
            # return '''<script> alert("passwords don't match")</script>'''
            return render_template("error.html", message="passwords don't match")
        elif len(username) < 3:
            return render_template("error.html", message="username should be over 3 characters")
        elif username == "admin":
            return render_template("error.html", message="username taken")
        elif len(password1) < 4:
            return render_template("error.html", message="password has to be at least 4 characters")
        else:
            sql = text('SELECT * from users WHERE username=:username')
            result = db.session.execute(sql, {'username':username})
            username_already_exists = result.fetchone()
            #print("username_already_exists:", username_already_exists) # ok. None if none was found; otherwise returns the user with that username. This check has to be done, as username is set as UNIQUE in db, and would cause error if left unchecked here
            if username_already_exists:
                return render_template("error.html", message="username is already taken")
            
            hash_value = generate_password_hash(password1)                                                                                       # redundant else BUT I like clarity
            sql = text('INSERT INTO users (username, password, email, is_admin) VALUES (:username, :password, :email, FALSE)')        # 'FALSE': not an admin account
            result = db.session.execute(sql, {"username":username, "password":hash_value, "email":email})
            db.session.commit() # remember to commit!
            return render_template("/registration-successful.html")


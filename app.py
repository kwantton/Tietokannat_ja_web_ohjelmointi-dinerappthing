from flask import Flask, jsonify
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

@app.route('/api/toggle-visibility-of-rating/<int:rating_id>')
def toggle_vis_of_rating(rating_id):
    sql = text('''SELECT * FROM ratings WHERE id=:rating_id''') 
    result = db.session.execute(sql, {'rating_id':rating_id})
    row = result.fetchone()
    rating_object = {'rating_id':row.id, 'user_id':row.user_id, 'restaurant_id':row.restaurant_id, 'rating':row.rating, 'created_at':row.created_at, 'rating_visible':row.rating_visible}
    if rating_object["rating_visible"]:
        sql = text('''UPDATE ratings SET rating_visible=FALSE WHERE id=:rating_id''')    # UPDATE doesn't return any rows!
    else:
        sql = text('''UPDATE ratings SET rating_visible=TRUE WHERE id=:rating_id''')     # UPDATE doesn't return any rows!
    db.session.execute(sql, {'rating_id':rating_id})
    db.session.commit()

    sql = text('''SELECT * FROM ratings WHERE id=:rating_id''')
    result = db.session.execute(sql, {'rating_id':rating_id})
    # print("result:", get_result)
    row = result.fetchone()
    # print("\nratings:", row)
    rating_object = {'rating_id':row.id, 'user_id':row.user_id, 'restaurant_id':row.restaurant_id, 'rating':row.rating, 'created_at':row.created_at, 'rating_visible':row.rating_visible}
    return jsonify(rating_object)

@app.route('/api/toggle-visibility-of-comment/<int:comment_id>')
def toggle_visibility_of_comment(comment_id):
    sql = text('''SELECT * FROM comments WHERE id=:comment_id''') 
    result = db.session.execute(sql, {'comment_id':comment_id})
    row = result.fetchone()
    comment_object = {'comment_id':row.id, 'user_id':row.user_id, 'restaurant_id':row.restaurant_id, 'comment':row.comment, 'created_at':row.created_at, 'visible':row.visible}
    if comment_object["visible"]:
        sql = text('''UPDATE comments SET visible=FALSE WHERE id=:comment_id''')    # UPDATE doesn't return any rows!
    else:
        sql = text('''UPDATE comments SET visible=TRUE WHERE id=:comment_id''')     # UPDATE doesn't return any rows!
    # print("\ncomment_id:", comment_id)
    
    db.session.execute(sql, {'comment_id':comment_id})
    db.session.commit()

    sql = text('''SELECT * FROM comments WHERE id=:comment_id''') 
    result = db.session.execute(sql, {'comment_id':comment_id})
    # print("result:", get_result)
    row = result.fetchone()
    # print("\ncomments:", row)
    comment_object = {'comment_id':row.id, 'user_id':row.user_id, 'restaurant_id':row.restaurant_id, 'comment':row.comment, 'created_at':row.created_at, 'visible':row.visible}
    return jsonify(comment_object)

@app.route('/admin')
def admin():
    # I need to have comments.id and ratings.id so I can conveniently toggle visibility of COMMENT and remove RATING; both need their own id. That's why I have to get specific below... sigh
    sql = text('''
                SELECT 
                    restaurants.id AS restaurant_id, 
                    restaurants.restaurant_name, 
                    restaurants.address, 
               
                    users.username, 
                    users.id AS user_id, 
               
                    comments.id AS comment_id, 
                    comments.comment, 
                    comments.visible AS comment_visible, 
               
                    ratings.id AS rating_id, 
                    ratings.created_at, 
                    ratings.rating, 
                    ratings.rating_visible
                FROM 
                    restaurants LEFT JOIN 
                ratings ON 
                    restaurants.id = ratings.restaurant_id LEFT JOIN 
                comments ON 
                    ratings.comment_id = comments.id LEFT JOIN
                users ON
                    ratings.user_id = users.id
               ''')
    result = db.session.execute(sql)
    ratings_with_comments = result.fetchall()
    ratings_with_comments_list = [{'restaurant_id': row.restaurant_id, 'restaurant_name': row.restaurant_name, 'address': row.address, 'username':row.username, 'user_id':row.user_id, 'comment_id':row.comment_id, 'created_at':row.created_at, 'rating':row.rating, 'rating_id':row.rating_id, 'comment':row.comment, 'comment_visible':row.comment_visible, 'rating_visible':row.rating_visible} for row in ratings_with_comments]
    sql = text('''SELECT * FROM restaurants;''')
    result = db.session.execute(sql)
    restaurants = result.fetchall()
    sql = text('''SELECT * FROM users;''')
    result = db.session.execute(sql)
    users = result.fetchall()
    return render_template('admin.html', ratings_with_comments_list=ratings_with_comments_list, restaurants=restaurants, users=users)

@app.route('/api/feedback/', methods=["POST"])
def feedback():
    data = request.get_json()
    print("data:", data)
    comment = data["comment"]
    username = session["username"]
    print("username (from session):", username)
    result = db.session.execute(text('SELECT * FROM users WHERE users.username = :username'), {'username':username})
    row = result.fetchone()
    user_id = row.id
    
    # comment_id is used in table 'ratings'
    # I'm saving also empty comments, in case someone sends grades without comments, the user reading those ratings will see that no comment was provided
    sql = text('INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (:user_id, :restaurant_id, :comment, NOW(), TRUE)')
    result = db.session.execute(sql, {'user_id':user_id, 'restaurant_id':data["restaurant_id"], 'comment':comment})
    db.session.commit()
    result = db.session.execute(text('SELECT COUNT (*) FROM comments')) # the latest one that was just added
    row = result.fetchone()
    comment_id = row.count # atomatically column 'count' as explained in the course material
    if 'rating' in data:    # if a rating was provided, put it into the db
        sql = text('INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (:user_id, :restaurant_id, :comment_id, :rating, NOW(), TRUE)')
        result = db.session.execute(sql, {'user_id':user_id, 'restaurant_id':data['restaurant_id'], 'comment_id':comment_id, 'rating':data['rating']})           
        db.session.commit()
    return jsonify({'status': 'success', 'message': 'Rating and feedback submitted successfully'}) # this just returns this json back to the index where the fetch (post) was done! c: cool

# This provides both the ratings AND the comments per each 'restaurant_id'
@app.route('/api/ratings/<int:restaurant_id>')      
def get_ratings_and_comments_by_restaurant_id(restaurant_id):
    sql = text('''SELECT * FROM 
               restaurants LEFT JOIN 
               ratings ON 
               restaurants.id = ratings.restaurant_id LEFT JOIN 
               comments ON 
               ratings.comment_id = comments.id LEFT JOIN
               users ON
               ratings.user_id = users.id WHERE
               restaurants.id = :restaurant_id''')
    result = db.session.execute(sql, {'restaurant_id':restaurant_id})
    ratings_with_comments = result.fetchall()
    ratings_with_comments_list = [{'restaurant_id': row.restaurant_id, 'restaurant_name': row.restaurant_name, 'address': row.address, 'username':row.username, 'user_id':row.user_id, 'comment_id':row.comment_id, 'created_at':row.created_at, 'rating':row.rating, 'comment':row.comment, 'comment_visible':row.visible, 'rating_visible':row.rating_visible} for row in ratings_with_comments]
    print("ratings_with_comments_list:", ratings_with_comments_list)
    return jsonify(ratings_with_comments_list)

# I'm not actually using this for anything real... I think?
@app.route('/api/ratings')
def get_ratings():
    sql = text('SELECT * FROM ratings')
    result = db.session.execute(sql)
    ratings = result.fetchall()
    rating_list = [{'id': row.id, 'user_id': row.user_id, 'restaurant_id': row.restaurant_id, 'comment_id':row.comment_id, 'rating':row.rating, 'created_at':row.created_at} for row in ratings]
    return jsonify(rating_list)

# I'm not actually using this for anything real... I think?
@app.route('/api/comments')
def get_comments():
    sql = text('SELECT * FROM comments')
    result = db.session.execute(sql)
    comments = result.fetchall()
    comment_list = [{'id': row.id, 'user_id': row.user_id, 'restaurant_id': row.restaurant_id, 'comment':row.comment, 'created_at':row.created_at} for row in comments]
    return jsonify(comment_list)

@app.route("/api/sessionuser")  # for providing session.user to 'index.js'
def get_sessionuser():
    try:
        session_user = session["username"]
    except:
        session_user = ''
    print("session_user:", session_user)
    return jsonify({'session_user':session_user}) # always '', why?

@app.route('/api/restaurants') # in index.js, I'll be using this: 'const response = await fetch('/api/restaurants')
def get_restaurants_json():
    sql = text('SELECT * FROM restaurants')
    result = db.session.execute(sql)
    restaurants = result.fetchall()
    restaurants_list = [{'id': row.id, 'name': row.restaurant_name, 'address': row.address} for row in restaurants] # list of dicts: [{id:1, name:some diner, address:Eskontie 101 Jämsäputaa}, {id:2, name:Another Diner,....}]
    return jsonify(restaurants_list)

@app.route('/restaurants')
def restaurants():
    sql = text('SELECT * FROM restaurants')
    result = db.session.execute(sql)
    restaurants = result.fetchall()
    return render_template('map.html', key=API_key, restaurants=restaurants)    # actual google maps API in use here
    # return render_template('restaurants.html', restaurants=restaurants)         # a simple view copy from google maps with restaurants chosen ("share or embed the map"; "jaa tai upota kartta" in Google Maps); 'iframe' is the name of the html element

@app.route("/login", methods=["POST"])
def login():
    username = request.form['username']
    password = str(request.form['password']) # if the input password is just numbers...?

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
            user = result.fetchone()        # the row has two values: u_name and p_word.
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
        
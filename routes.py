# THIS MODULE CONTAINS ALL THE URLS (like /map) that the USER sees
from app import app, where, getenv
from helpers import select_all
from flask import render_template, jsonify, redirect, request, session
from db import db, text, secrets, check_password_hash, generate_password_hash

if where == 'local':
    app.config['WHERE'] = 'local' # 'app.config' is for global variables. I tried session['WHERE'] = 'local', but that doesn't work here!; you can only set session['x'] from an 'app.route(...)': "The session object in Flask is tied to the request/response cycle. It's used to store information across requests for individual users, but it ONLY EXISTS WHEN A REQUEST IS BEING PROCESSED. When you try to set session['where'] during the application startup (outside a request context), Flask raises the RuntimeError you're seeing." -ChatGPT
elif where == 'fly.io':
    app.config['WHERE'] = 'fly.io'

API_key = getenv('GOOGLE_API_KEY')
app.secret_key = getenv('SECRET_KEY')
admin_password = getenv('ADMIN_PASSWORD')

# below, SECURITY CHECK: prevention of SQL injection (NB! ':table' can not be done! Hence I have to manually make sure no-one's trying an SQL injection. See below...)
# Why not :table? Because it's not allowed to use a variable for the table name! Tried that: 'In SQL, using placeholders for table names or column names in parameterized queries doesn't work because placeholders can only be used for values, not for SQL identifiers (like table names or column names). This is why your table name is being surrounded by quotes and treated as a string literal, not as a table name.' (ChatGPT). So yeah, I had that problem

@app.route('/')
def index():
    return render_template('index.jinja')

@app.route('/add-category/<int:restaurant_id>', methods=['POST'])
def add_category(restaurant_id):
    data = request.get_json()
    category = data.get('new_category')
    sql = text('INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (:restaurant_id,:category,TRUE);')
    try:
        db.session.execute(sql, {'restaurant_id':restaurant_id, 'category':category})
        db.session.commit()
        return jsonify({'status':'ok', 'message':'added category'}), 201 # 201 Created = created new resource successfully
    except Exception as e:
        print('Error while trying to add a new category:',e)
        return jsonify({'status':'error', 'message':str(e)}), 500

@app.route('/admin')
def admin():
    session['where'] = app.config.get('WHERE')
    # I need to have comments.id and ratings.id so I can conveniently toggle visibility of COMMENT and remove RATING; both need their own id. That's why I have to get specific below, 'AS comment_id', 'AS rating_id'
    sql = text('''
                SELECT 
                    restaurants.id AS restaurant_id, 
                    restaurant_name, 
                    address, 
                    restaurant_visible,
               
                    username, 
                    users.id AS user_id, 
               
                    comments.id AS comment_id, 
                    comment, 
                    visible AS comment_visible, 
               
                    ratings.id AS rating_id, 
                    ratings.created_at, 
                    rating, 
                    rating_visible

                FROM 
                    restaurants LEFT JOIN 
                ratings ON 
                    restaurants.id = ratings.restaurant_id LEFT JOIN 
                comments ON 
                    ratings.comment_id = comments.id LEFT JOIN
                users ON
                    ratings.user_id = users.id
                WHERE
                    rating IS NOT NULL OR comment IS NOT NULL
               ''')
    result = db.session.execute(sql)
    ratings_with_comments = result.fetchall()
    ratings_with_comments_list = [{'restaurant_id': row.restaurant_id, 'restaurant_name': row.restaurant_name, 'address': row.address, 'restaurant_visible':row.restaurant_visible, 'username':row.username, 'user_id':row.user_id, 'comment_id':row.comment_id, 'created_at':row.created_at, 'rating':row.rating, 'rating_id':row.rating_id, 'comment':row.comment, 'comment_visible':row.comment_visible, 'rating_visible':row.rating_visible} for row in ratings_with_comments]
    
    # if I were to left join with restaurants here, I'd get a list with the same restaurant a million times, and then I'd have to check if restaurant id matches the category's restaurant_id anyways in Jinja or JS - instead Imma just check in 'admin.jinja' ONCE for each category whether restaurant.id == category.restaurant_id, much more convenient!
    users = select_all('users')
    restaurants = select_all('restaurants')
    restaurant_categories = select_all('restaurant_categories')
    return render_template('admin.jinja', ratings_with_comments_list=ratings_with_comments_list, restaurants=restaurants, users=users, restaurant_categories=restaurant_categories)

@app.route('/map')
def restaurants():
    session['where'] = app.config.get('WHERE')
    session['map_token'] = secrets.token_hex(16) # the purpose of this is to ensure that the request is coming from the exact same site. For updating the db information regarding restaurant name, address and (some) categories, it's independent of the user - it doesn't matter if a user is logged in or not.
    try:
        restaurants = select_all('restaurants', 'restaurant_visible')
        restaurants = [{'id':row.id, 'restaurant_name':row.restaurant_name,'address':row.address, 'restaurant_visible':row.restaurant_visible} for row in restaurants]
        return render_template('map.jinja', key=API_key, restaurants=restaurants)    # actual google maps API in use here
    except Exception as e:
        print("ERROR in route '/map' when trying to fetchall() from all restaurants:", e)

@app.route('/login', methods=['POST'])
def login():
    session['csrf_token'] = secrets.token_hex(16)
    session['where'] = app.config.get('WHERE')
    username = request.form['username']
    password = request.form['password']

    sql = text('SELECT username, password FROM users WHERE username=:username')     # you CAN'T check the password here unless you first encrypt the password using werkzeug.security.generate_password_hash(pw_here)
    result = db.session.execute(sql, {'username':username, 'password':password})    # HASHED pw into db
    
    # PASSWORD CHECKING
    if username == 'admin':
        if password == admin_password:                  # admin_password is stored as env var (as-is), hence safe
            session['username'] = username
            return redirect('/')
        else:
            return render_template('error.jinja', message='username or password is wrong')
    else:
        try:
            user = result.fetchone()                    # the row has two values: u_name and p_word.
            if check_password_hash(user.password, password):
                session['username'] = username
                return redirect('/')
            else:
                return render_template('error.jinja', message='username or password is wrong')    
        except:
            print("couldn't get real_username, hashed_pw, returning error message:")
            return render_template('error.jinja', message='username or password is wrong')
        
@app.route('/logout')
def logout():
    if session['username']:                             # the user may try this url without being logged in, and that's what this check is for
        del session['username']
    if session['csrf_token']:
        del session['csrf_token']
    return redirect('/')

# btw there's no point in csrf tokening this. All they can do is add a user, that's it.
@app.route('/register', methods=['GET','POST'])         # 'GET' is there by default, but if you just write 'POST', you'll override GET. Hence, both need to be listed as the same url is used for both
def register():
    if request.method == 'POST':
        session['where'] = app.config.get('WHERE')
        if request.method == 'GET':
            return render_template('register.jinja')
        if request.method == 'POST':
            username = request.form['username']
            password1 = request.form['password1']
            password2 = request.form['password2']
            email = request.form['email']
            if password1 != password2:
                # return '''<script> alert('passwords don't match')</script>'''
                return render_template('error.jinja', message="passwords don't match")
            elif len(username) < 3:
                return render_template('error.jinja', message='username should be over 3 characters')
            elif username == 'admin':
                return render_template('error.jinja', message='username taken')
            elif len(password1) < 8:
                return render_template('error.jinja', message='password has to be at least 8 characters')
            else:
                sql = text('SELECT * from users WHERE username=:username')
                result = db.session.execute(sql, {'username':username})
                username_already_exists = result.fetchone()
                #print('username_already_exists:', username_already_exists) # ok. None if none was found; otherwise returns the user with that username. This check has to be done, as username is set as UNIQUE in db, and would cause error if left unchecked here
                if username_already_exists:
                    return render_template('error.jinja', message='username is already taken')
                
                hash_value = generate_password_hash(password1)                                                                                       # redundant else BUT I like clarity
                sql = text('INSERT INTO users (username, password, email, is_admin) VALUES (:username, :password, :email, FALSE)')        # 'FALSE': not an admin account
                result = db.session.execute(sql, {'username':username, 'password':hash_value, 'email':email})
                db.session.commit() # remember to commit!
                return render_template('/registration-successful.jinja')
    elif request.method == 'GET':
        sql = text('SELECT username FROM users;')
        result = db.session.execute(sql)
        tuplelist = result.fetchall() # returns a god-awful ' [('first_username_here',), ('second',), ('third',)]' so a list of tuples with one member per tuple. Disgusting.
        usernames = [username[0] for username in tuplelist]
        print("\n usernames:", usernames)
        return render_template('register.jinja', usernames = usernames)
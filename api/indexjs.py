# THIS MODULE CONTAINS ALL THE /api/-modules that are used in 'index.js'
from app import app
from db import db, text
from flask import session, jsonify, request
from helpers import select_all

@app.route('/api/sessioncsrf')         # for providing session['csrf_token'] to 'index.js'
def get_sessioncsrf():
    try:
        csrf_token = session['csrf_token']
    except:
        csrf_token = ''
    print('csrf_token:', csrf_token)
    return jsonify({'csrf_token':csrf_token}) 

@app.route('/api/map-token')            # for providing session['csrf_token'] to 'index.js'
def get_map_token():
    map_token = session['map_token']
    print('map_token:', map_token)
    return jsonify({'map_token':map_token}) 

# used in index.js
@app.route('/api/restaurants-visible') 
def get_restaurants_json():
    restaurants = select_all('restaurants', 'restaurant_visible')
    restaurants_list = [{'id': row.id, 'name': row.restaurant_name, 'address': row.address, 'restaurant_visible':row.restaurant_visible,} for row in restaurants] # list of dicts: [{id:1, name:some diner, address:Eskontie 101 Jämsäputaa}, {id:2, name:Another Diner,....}]
    return jsonify(restaurants_list)

# This provides both the ratings AND the comments per each 'restaurant_id', used in index.js
# NB! I'm filtering out the restaurants where restaurant_visible = FALSE, BUT I'm not filtering out comments or ratings here; I'm doing that filtering in the index.js JS
@app.route('/api/ratings/<int:restaurant_id>')      
def get_ratings_and_comments_by_restaurant_id(restaurant_id):
    only_visible_ratings = request.args.get('only_visible_ratings', default='0') == '1' # bool: True or False? This is the '?only_visible_ratings=1' or '...=0' from the request. Awesome!
    query = '''
            SELECT * 
                FROM 
                    restaurants 
                LEFT JOIN 
                    ratings 
                ON 
                    restaurants.id = ratings.restaurant_id 
                LEFT JOIN 
                    comments 
                ON
                    ratings.comment_id = comments.id 
                LEFT JOIN
                    users 
                ON
                    ratings.user_id = users.id 
                WHERE
                    restaurants.id = :restaurant_id
                    AND restaurants.restaurant_visible
               '''
    if only_visible_ratings:
        query += ' AND ratings.rating_visible'
    sql = text(query)
    result = db.session.execute(sql, {'restaurant_id':restaurant_id})
    ratings_with_comments = result.fetchall()
    ratings_with_comments_list = [{'restaurant_id': row.restaurant_id, 'restaurant_name': row.restaurant_name, 'address': row.address, 'restaurant_visible':row.restaurant_visible, 'username':row.username, 'user_id':row.user_id, 'comment_id':row.comment_id, 'created_at':row.created_at, 'rating':row.rating, 'comment':row.comment, 'comment_visible':row.visible, 'rating_visible':row.rating_visible} for row in ratings_with_comments]
    # print('ratings_with_comments_list:', ratings_with_comments_list)
    return jsonify(ratings_with_comments_list)

@app.route('/api/update-name-address-categories', methods=['POST']) # used in index.js, IF admin is logged in - this updates restaurant info according to the info fetched from Google Places API
def update_name_and_address():
    print('\nhello from update_name_and_address()!')
    try:
        map_token = request.headers.get('X-CSRF-Token') # it's still named the same
        if session['map_token'] != map_token:
            return jsonify({'status':'ERROR', 'message':'Bad CSRF'}), 403

        data = request.get_json()
        print('\tdata:', data)
        restaurant_name = data.get('restaurant_name')
        address = data.get('address')
        restaurant_id = data.get('restaurant_id')
        descriptions = data.get('descriptions')
        print('\tid:', restaurant_id)

        # check if the restaurant exists in the db
        test_sql = text('SELECT * FROM restaurants WHERE id=:id')
        rows = db.session.execute(test_sql, {'id': restaurant_id})
        test_result = rows.fetchall()
        print('\ttest_result:', test_result)  # Verify that the restaurant exists

        if not test_result:
            print('\tNo restaurant found with the given ID')
            return jsonify({'status': 'error', 'message': 'Restaurant not found'}), 404 # this would then be shown in the browser console

        existing_restaurant = test_result[0]
        print('\texisting_restaurant:', existing_restaurant)

        # check if the data is actually different. I was initially accidentally trying to update with the same name and address as before (mixup of variable names in index.js) and was wondering why nothing was updated - this was the reason...
        check_msg = ''
        if existing_restaurant.restaurant_name == restaurant_name and existing_restaurant.address == address:
            print('\tNo changes - not going to update name or address')
            response = jsonify({'status': 'success', 'message': 'No changes detected'})
        else:
            # since name and address are different, perform the sql table update
            sql = text('UPDATE restaurants SET restaurant_name=:restaurant_name, address=:address WHERE id=:id')
            result = db.session.execute(sql, {'restaurant_name': restaurant_name, 'address': address, 'id': restaurant_id})
            print('\tresult.rowcount:', result.rowcount)  # Print number of rows affected
            db.session.commit()
            print('\tSession state after commit:', db.session.info)  # Print session state

            # verify that name and address were changed
            rows_after_update = db.session.execute(test_sql, {'id': restaurant_id})
            result_after_update = rows_after_update.fetchall()
            print('\tresult_after_update:', result_after_update)  # Verify the update
            check_msg += 'Restaurant name and/or address updated! '

        # Check the old categories (sql db) AND the descriptions (from 'index.js' Places API). If some descriptions are not found in the db, then add them there, so the admin can see them too, and doesn't have to add them themselves separately (for example, if cafe is there already by Places API, then that's less work for the admin).
        sql = text('SELECT * FROM restaurant_categories WHERE restaurant_id = :restaurant_id')
        result = db.session.execute(sql, {'restaurant_id':restaurant_id})
        current_categories = result.fetchall()
        print('current categories:', current_categories)
        list_of_current_categories = [{'restaurant_id':row.restaurant_id, 'category':row.category, 'category_visible':row.category_visible} for row in current_categories]
        check_set = set()
        for item in list_of_current_categories:
            check_set.add(item['category'].lower())
        update_msg = False
        for description in descriptions:
            if description.lower() not in check_set:
                update_msg = True
                sql = text('''INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (:restaurant_id,:category,TRUE);''')
                db.session.execute(sql, {'restaurant_id':restaurant_id, 'category':description})
                db.session.commit()
        if update_msg:
            check_msg += 'Updated restaurant categories! '

        if update_msg == '':
            update_msg = 'no updates'
        response = jsonify({'status': 'success', 'updated': check_msg})
        return response
    except Exception as e:
        print('Error updating restaurant:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500     # error code 500, server error
    
@app.route('/api/sessionuser')  # for providing session['username'] to 'index.js'
def get_sessionuser():
    try:
        session_user = session['username']
    except:
        session_user = ''
    print('session_user:', session_user)
    return jsonify({'session_user':session_user})

@app.route('/api/get-categories/<int:restaurant_id>')   # used in index.js
def get_categories_by_restaurant_id(restaurant_id):
    sql = text('SELECT * FROM restaurant_categories WHERE restaurant_id = :restaurant_id AND category_visible')
    result = db.session.execute(sql, {'restaurant_id':restaurant_id})
    rows = result.fetchall()
    list_of_db_categories = [{'restaurant_id':row.restaurant_id, 'category':row.category, 'category_visible':row.category_visible} for row in rows]
    return jsonify(list_of_db_categories)

@app.route('/api/feedback/', methods=['POST'])      # map: used in index.js
def feedback():
    data = request.get_json()
    print('data:', data)
    comment = data['comment']
    username = session['username']
    csrf_token = request.headers.get('X-CSRF-Token')
    if session['csrf_token'] != csrf_token: # works; I checked by switching this from '!=' to '==', and it returns 403 forbidden  with the info 'Bad csrf' to the browser c:
            return jsonify({'status':'ERROR', 'message':'Bad CSRF'}), 403
    print('username (from session):', username)
    result = db.session.execute(text('SELECT * FROM users WHERE username = :username;'), {'username':username})
    row = result.fetchone()
    user_id = row.id
    
    # comment_id is used in table 'ratings'
    # I'm saving also empty comments (THEY SHOULDN'T EXIST THOUGH SINCE I CHECK FOR THAT IN JS in index.js, but it doesn't matter anyways c:), in case someone sends grades without comments, the user reading those ratings will see that no comment was provided
    sql = text('INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (:user_id, :restaurant_id, :comment, NOW(), TRUE);')
    result = db.session.execute(sql, {'user_id':user_id, 'restaurant_id':data['restaurant_id'], 'comment':comment})
    db.session.commit()
    result = db.session.execute(text('SELECT COUNT (*) FROM comments;')) # the latest one that was just added
    row = result.fetchone()
    comment_id = row.count # atomatically column 'count' as explained in the course material
    if 'rating' in data:    # if a rating was provided, put it into the db
        sql = text('INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (:user_id, :restaurant_id, :comment_id, :rating, NOW(), TRUE);')
        result = db.session.execute(sql, {'user_id':user_id, 'restaurant_id':data['restaurant_id'], 'comment_id':comment_id, 'rating':data['rating']})           
        db.session.commit()
    return jsonify({'status': 'success', 'message': 'Rating and feedback submitted successfully'}) # this just returns this json back to the index where the fetch (post) was done! c: cool
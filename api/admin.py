# THIS MODULE CONTAINS ALL THE /api/-modules that are used in url '/admin'
from app import app
from db import db, text
from flask import session, jsonify, request
from helpers import table_name_check

@app.route('/api/delete-category/<int:category_id>', methods=['DELETE'])
def delete_category_id(category_id):
    csrf_token = request.headers.get('X-CSRF-Token') # it's still named the same
    if session['csrf_token'] != csrf_token: # tried, it works. If you change this to ==, returns 403 forbidden, 'Bad CSRF'
        return jsonify({'status':'ERROR', 'message':'Bad CSRF'}), 403
    sql = text('DELETE from restaurant_categories WHERE id = :category_id')
    db.session.execute(sql, {'category_id':category_id})
    db.session.commit()
    return jsonify({'status':'ok', 'message':'DELETE ok'})

@app.route('/api/toggle-visibility-of/<table>/<int:id>', methods=['PUT']) # for example, target = 'restaurants', id = 1. There's no str:, so it's just <table>, not <str:table>, as I learned when asking about the problem from my old friend Chat Gavin Pierre Taurus (thanks, ChatGPT :D)
def toggle_visibility_of(table, id): # category_id, or restaurant_id, or rating_id, or comment_id
    csrf_token = request.headers.get('X-CSRF-Token')
    if session['csrf_token'] != csrf_token: # works; I checked by switching this from '!=' to '==', and it returns 403 forbidden  with the info 'Bad csrf' to the browser if you try hiding/showing a restaurant, category, comment or rating c:
        return jsonify({'status':'ERROR', 'message':'Bad CSRF'}), 403
    try:
        # SECURITY CHECK: prevention of SQL injection (NB! ':table' is not doable (read next comment); hence I have to manually make sure no-one's trying an SQL injection. See below...). table_name_check raises a valueError if you're trying to access anything else than these four, stopping the rest of the code from executing
        table_name_check(table)

        visibility_column_names = dict(zip('comments restaurants restaurant_categories ratings'.split(), 'visible restaurant_visible category_visible rating_visible'.split()))
        column_name = visibility_column_names[table]
        
        sql = text(f'SELECT {column_name} FROM {table} WHERE id=:id') # Why not :table? Because it's not allowed to use a variable for the table name. Tried that: 'In SQL, using placeholders for table names or column names in parameterized queries doesn't work because placeholders can only be used for values, not for SQL identifiers (like table names or column names). This is why your table name is being surrounded by quotes and treated as a string literal, not as a table name.' (ChatGPT). So yeah, I had that problem
        result = db.session.execute(sql, {'id':id}) # ':id', hence safe - variable id cannot escape, as per Flask mechanics
        row = result.fetchone()
        item_visible = row[0] # this is either True or False
        print('\nrow:', row)
        print('item_visible:', item_visible)
        if item_visible:
            sql = text(f'UPDATE {table} SET {column_name}=FALSE WHERE id=:id') # ONCE AGAIN remember, safety was already checked above. This is therefore ok c:
        else:
            sql = text(f'UPDATE {table} SET {column_name}=TRUE WHERE id=:id')
        db.session.execute(sql, {'id':id})
        db.session.commit()
        return jsonify({'status':'ok', 'message':'toggled visibility'})
    except Exception as e:
        print(f"Couldn't toggle visibility of ${table}/${id}. Reason:", str(e))
        return jsonify({'status':'ERROR', 'message':"couldn't toggle visibility"}), 500 # 5.. = server-side error
    
@app.route('/api/add-restaurant', methods=['POST'])
def add_a_restaurant():
    # I sent a json, not a form, in the POST to this address from the 'admin.jinja' page - so request.get_json() it is
    csrf_token = request.headers.get('X-CSRF-Token')
    if session['csrf_token'] != csrf_token: # works; I checked by switching this from '!=' to '==', and it returns 403 forbidden  with the info 'Bad csrf' to the browser c:
        return jsonify({'status':'ERROR', 'message':'Bad CSRF'}), 403
    data = request.get_json()   
    print('data:', data)
    restaurant_name = data.get('restaurant_name')
    address = data.get('address')
    sql = text('''
    INSERT INTO restaurants (restaurant_name, address, restaurant_visible) 
    VALUES (:restaurant_name, :address, TRUE)
    ''')
    db.session.execute(sql, {'restaurant_name':restaurant_name, 'address':address})
    db.session.commit()
    response = jsonify({'status': 'ok', 'message': 'restaurant added'})
    return response # this just returns this json back to where the fetch (post) was done! c: cool
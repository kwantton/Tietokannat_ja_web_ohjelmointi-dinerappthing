from db import db, text

def table_name_check(table):
    allowed_tables = {'restaurants','restaurant_categories','ratings','comments', 'users'}
    if table not in allowed_tables:
        raise ValueError("Invalid table name; if you're trying to toggle visibility of something new in SQL db, please include that in the safe list of table_name_check first!")
    
def visible_column_name_check(column_name):
    allowed_names = {'visible','restaurant_visible','rating_visible','category_visible'}
    if column_name not in allowed_names:
        raise ValueError("Invalid column name; if you're trying to toggle visibility of something new in SQL db, please include that in the safe list of visible_column_name_check first!")

def select_all(table, visible_column=None):
    # ':table' or ':visible' can not be done in text(...), hence I'm using the check function 'table_name_check' to check if a valid table is being accessed. If not, it raises ValueError
    table_name_check(table)
    if visible_column:
        visible_column_name_check(visible_column)
        # in table 'comments', the column name is just 'visible', in others, it's 'restaurant_visible', etc. - hence the name is given as a parameter to select_all
        sql = text(f'SELECT * FROM {table} WHERE {visible_column}') 
    if not visible_column:
        sql = text(f'SELECT * FROM {table}')
    result = db.session.execute(sql, {'visible_column':visible_column})
    rows = result.fetchall()
    return rows
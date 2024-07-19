CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    is_admin BOOLEAN,
    email TEXT NOT NULL
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY, 
    restaurant_name TEXT,
    address TEXT
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    rating INTEGER
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    comment TEXT
);
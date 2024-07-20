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
    address TEXT UNIQUE
);

INSERT INTO restaurants (restaurant_name, address) VALUES ('Krung Thep Thai Bistro Arabia', 'Hämeentie 153, 00560 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Thai Ravintola Meelom Oy', 'Koskelantie 56, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Egyptiläinen ravintola El Karim', 'Koskelantie 52, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Ravintola Käpygrilli', 'Osmontie 5, 00610 Helsinki');

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
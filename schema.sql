CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    is_admin BOOLEAN,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY, 
    restaurant_name TEXT,
    address TEXT
);

INSERT INTO restaurants (restaurant_name, address) VALUES ('Krung Thep Thai Bistro Arabia', 'Hämeentie 153, 00560 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Thai Ravintola Meelom Oy', 'Koskelantie 56, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Egyptiläinen ravintola El Karim', 'Koskelantie 52, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Ravintola Käpygrilli', 'Osmontie 5, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Hesburger Käpylä Drive-In', 'Vähänkyröntie 2, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Ravintola Nyyrikki', 'Pohjolankatu 2, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Ravintola Iso Paja', 'Radiokatu 3, 00240 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Burger King', 'Vähänkyröntie 2, 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Manse Seor Cafe', 'Intiankatu 33 00560 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Sotto Pizza & Bar Käpylä', 'Mäkelänkatu 87 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Ravintola Old Sophie', 'Koskelantie 9 00610 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('CoolHead Brew / CoolHead Taproom', 'Gardenia Päärakennus Koetilantie 1 00790 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Harju 8', 'Harjutori 8 00500 Helsinki Finland');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Platinum Lounge', 'Areenankuja 1 00240 Helsinki Finland');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Kahvila Aurinko', 'Jyrängöntie 2 00560 Helsinki Finland');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Frangipani Bakery & Café', 'Intiankatu 25 00560 Helsinki');
INSERT INTO restaurants (restaurant_name, address) VALUES ('Beer restaurant Oljenkorsi / Olutravintola Oljenkorsi', 'Intiankatu 18 00560 Helsinki');

CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    comment TEXT,
    created_at TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    comment_id INTEGER REFERENCES comments,
    rating INTEGER,
    created_at TIMESTAMP
);
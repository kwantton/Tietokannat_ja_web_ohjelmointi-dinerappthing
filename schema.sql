CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN,
    email TEXT UNIQUE NOT NULL
);

INSERT INTO users (username, password, is_admin, email) VALUES ('default','default1234', FALSE, 'testi@esimerkki.fi');

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

INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 1, 'Arabian Krung Thep Thai Bistro on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 2, 'Thai Meelom on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 3, 'El Karim on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 4, 'Käpygrilli on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 5, 'Hese on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 6, 'Nyyrikki on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 7, 'Iso Paja on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 8, 'BK on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 9, 'Seor Cafe on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 10, 'Sotto on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 11, 'Old Sophie on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 12, 'CoolHead Brew on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 13, 'Harju 8 on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 14, 'Platinum Lounge on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 15, 'Kahvila Aurinko on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 16, 'Frangipani on ebin mage :D', NOW());
INSERT INTO comments (user_id, restaurant_id, comment, created_at) VALUES (1, 17, 'Oljenkorsi on ebin mage :D galja on hywää c:', NOW());

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    comment_id INTEGER REFERENCES comments,
    rating INTEGER,
    created_at TIMESTAMP
);

INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 1, 1, 3, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 2, 2, 4, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 3, 3, 3, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 4, 5, 5, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 5, 6, 3, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 6, 7, 5, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 7, 8, 4, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 8, 9, 3, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 9, 10, 4, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 10, 10, 3, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 11, 11, 5, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 12, 12, 5, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 13, 13, 4, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 14, 14, 3, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 15, 15, 4, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 16, 16, 4, NOW());
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at) VALUES (1, 17, 17, 5, NOW());
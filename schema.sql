CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN,
    email TEXT UNIQUE NOT NULL
);

-- please note: this user is created because a user_id is needed for other tables. Since this password is not hashed, it should be, it cannot be input when you log in; you won't get in, as this password will be interpreted as a hashed value, while it's not hashed, as you can clearly see
INSERT INTO users (username, password, is_admin, email) VALUES ('dummy','doesnt_work_not_hashed', FALSE, 'testi@esimerkki.fi');

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    restaurant_name TEXT,
    address TEXT,
    restaurant_visible BOOLEAN
);

-- BY DEFAULT, I'm showing (restaurant_visible=TRUE) only 1 diner, 1 bar and 1 cafe. This is to prevent fetching 20 restaurants through the API by default; I don't want my free Cloud credits to run out before I can even deploy the app online, lol
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Krung Thep Thai Bistro Arabia', 'Hämeentie 153, 00560 Helsinki', TRUE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Thai Ravintola Meelom Oy', 'Koskelantie 56, 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Egyptiläinen ravintola El Karim', 'Koskelantie 52, 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Ravintola Käpygrilli', 'Osmontie 5, 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Hesburger Käpylä Drive-In', 'Vähänkyröntie 2, 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Ravintola Nyyrikki', 'Pohjolankatu 2, 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Ravintola Iso Paja', 'Radiokatu 3, 00240 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Burger King', 'Vähänkyröntie 2, 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Manse Seor Cafe', 'Intiankatu 33 00560 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Sotto Pizza & Bar Käpylä', 'Mäkelänkatu 87 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Ravintola Old Sophie', 'Koskelantie 9 00610 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('CoolHead Brew / CoolHead Taproom', 'Gardenia Päärakennus Koetilantie 1 00790 Helsinki', TRUE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Harju 8', 'Harjutori 8 00500 Helsinki Finland', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Platinum Lounge', 'Areenankuja 1 00240 Helsinki Finland', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Kahvila Aurinko', 'Jyrängöntie 2 00560 Helsinki Finland', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Frangipani Bakery & Café', 'Intiankatu 25 00560 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Beer restaurant Oljenkorsi / Olutravintola Oljenkorsi', 'Intiankatu 18 00560 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Ravintola Tandoori Villa Metsälä', 'Niittyläntie 2 00620 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Beer restaurant Jano / Olutravintola Jano', 'Mäkitorpantie 11 00620 Helsinki', FALSE);
INSERT INTO restaurants (restaurant_name, address, restaurant_visible) VALUES ('Cafe Amore', 'Oulunkyläntie 7 00600 Helsinki', TRUE);

-- this will include descriptions fetched from Google Places API, AND stuff that admin can add
CREATE TABLE restaurant_categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants (id),
    category TEXT NOT NULL,
    category_visible BOOLEAN
);

INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (1,'thai',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (1,'asian',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (2,'thai',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (2,'asian',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (3,'egyptian',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (4,'grill',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (4,'fried',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (5,'burger',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (5,'finnish',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (8,'burger',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (14,'lounge',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (18,'indian',TRUE);
INSERT INTO restaurant_categories (restaurant_id, category, category_visible) VALUES (18,'tandoori',TRUE);


CREATE TABLE comments (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    comment TEXT,
    created_at TIMESTAMP,
    visible BOOLEAN
);

INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 1, 'Arabian Krung Thep Thai Bistro on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 2, 'Thai Meelom on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 3, 'El Karim on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 4, 'Käpygrilli on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 5, 'Hese on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 6, 'Nyyrikki on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 7, 'Iso Paja on ebin mage :D olibas iso baja deillä. Bajabäänä dyggään govasdi :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 8, 'BK on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 9, 'Seor Cafe on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 10, 'Sotto on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 11, 'Old Sophie on ebin mage :D eigä Sophie niin wanha ole wielä :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 12, 'CoolHead Brew on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 13, 'Harju 8 on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 14, 'Platinum Lounge on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 15, 'Kahvila Aurinko on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 16, 'Frangipani on ebin mage :D', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 17, 'Oljenkorsi on ebin mage :D galja on hywää c:', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 18, 'Tandoori on ebin mage :D givad ganad deillä c:', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 19, 'Jano on ebin mage :D galja on hywää c:', NOW(), TRUE);
INSERT INTO comments (user_id, restaurant_id, comment, created_at, visible) VALUES (1, 20, 'Cafe Amore on ebin mage :D giwad gahwid deillä c:', NOW(), TRUE);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users,
    restaurant_id INTEGER REFERENCES restaurants,
    comment_id INTEGER REFERENCES comments,
    rating INTEGER,
    created_at TIMESTAMP,
    rating_visible BOOLEAN
);

INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 1, 1, 3, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 2, 2, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 3, 3, 3, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 4, 5, 5, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 5, 6, 3, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 6, 7, 5, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 7, 8, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 8, 9, 3, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 9, 10, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 10, 10, 3, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 11, 11, 5, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 12, 12, 5, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 13, 13, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 14, 14, 3, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 15, 15, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 16, 16, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 17, 17, 5, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 18, 18, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 19, 19, 4, NOW(), TRUE);
INSERT INTO ratings (user_id, restaurant_id, comment_id, rating, created_at, rating_visible) VALUES (1, 20, 20, 4, NOW(), TRUE);
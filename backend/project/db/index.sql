CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE USERS(
    user_id_pk BIGSERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(13),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200),
    admin BOOLEAN DEFAULT FALSE,
    image_addr VARCHAR(100),
    driver_rating NUMERIC(2, 1) DEFAULT 5.0,
    user_rating NUMERIC(2, 1) DEFAULT 5.0
);

CREATE TABLE ADDRESS(
    place_id_pk VARCHAR(100) NOT NULL PRIMARY KEY,
    user_id_fk BIGINT REFERENCES USERS(user_id_pk),
    apt_number VARCHAR(20),
    street_name VARCHAR(50),
    state VARCHAR(20),
    zip_code INT,
    country VARCHAR(50),
    coordinates GEOGRAPHY(POINT, 4326)
);

CREATE TABLE CAR_DETAILS(
    car_id_pk BIGSERIAL NOT NULL PRIMARY KEY,
    user_id_fk BIGINT REFERENCES USERS(user_id_pk),
    seats INT,
    number VARCHAR(10),
    make VARCHAR(20),
    model VARCHAR(20),
    color VARCHAR(10),
    image_addr VARCHAR(100)
);

CREATE TABLE RIDE(
    ride_id_pk BIGSERIAL NOT NULL PRIMARY KEY,
    driver_id_fk BIGINT REFERENCES USERS(user_id_pk),
    car_id_fk BIGINT REFERENCES CAR_DETAILS(car_id_pk),
    seats_available BIGINT,
    departure_time BIGINT,
    ride_completed BOOLEAN DEFAULT FALSE, 
    source_addr GEOGRAPHY(POINT, 4326),
    source_id VARCHAR(100),
    dest_addr GEOGRAPHY(POINT, 4326),
    dest_id VARCHAR(100)
);

CREATE TABLE RIDE_DETAILS(
    ride_id_fk BIGINT REFERENCES RIDE(ride_id_pk),
    user_id_fk BIGINT REFERENCES USERS(user_id_pk),
    username VARCHAR(50) REFERENCES USERS(username),
    ride_completed BOOLEAN DEFAULT FALSE,
    source_addr GEOGRAPHY(POINT, 4326),
    source_id VARCHAR(100),
    start_time BIGINT,
    dest_addr GEOGRAPHY(POINT, 4326),
    dest_id VARCHAR(100),
    end_time BIGINT DEFAULT NULL,
    customer_review VARCHAR(500),
    customer_rating NUMERIC(2, 1) DEFAULT 5.0,
    driver_review VARCHAR(500),
    driver_rating NUMERIC(2, 1) DEFAULT 5.0
);
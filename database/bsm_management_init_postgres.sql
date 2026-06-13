/* =========================
   TẠO DATABASE (Nếu tự chạy thủ công)
   CREATE DATABASE "BSM_Management";
========================= */

/* =========================
   USERS
========================= */
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('OWNER', 'TENANT')) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   HOUSES
========================= */
CREATE TABLE IF NOT EXISTS houses (
    id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    total_rooms INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================
   ROOMS
========================= */
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    house_id INT NOT NULL,
    owner_id INT NOT NULL,
    room_name VARCHAR(50) NOT NULL,

    room_price DECIMAL(12,2) DEFAULT 0,
    electric_price DECIMAL(12,2) DEFAULT 0,

    water_type VARCHAR(10)
        CHECK (water_type IN ('METER', 'PERSON'))
        DEFAULT 'METER',

    water_price DECIMAL(12,2) DEFAULT 0,
    water_price_per_person DECIMAL(12,2) DEFAULT 0,
    people_count INT DEFAULT 1,

    status VARCHAR(20)
        CHECK (status IN ('EMPTY', 'OCCUPIED'))
        DEFAULT 'EMPTY',

    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

/* =========================
   TENANT_ROOMS
========================= */
CREATE TABLE IF NOT EXISTS tenant_rooms (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================
   METER_READINGS
========================= */
CREATE TABLE IF NOT EXISTS meter_readings (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    month VARCHAR(7) NOT NULL, -- YYYY-MM

    electric_old INT NOT NULL,
    electric_new INT NOT NULL,
    water_old INT NOT NULL,
    water_new INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (electric_new >= electric_old),
    CHECK (water_new >= water_old),

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

/* =========================
   INVOICES
========================= */
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    tenant_id INT NOT NULL,

    month VARCHAR(7) NOT NULL,
    room_price DECIMAL(12,2) NOT NULL,

    electric_used INT NOT NULL,
    water_used INT NOT NULL,

    electric_cost DECIMAL(12,2) NOT NULL,
    water_cost DECIMAL(12,2) NOT NULL,

    total_amount DECIMAL(12,2) NOT NULL,

    status VARCHAR(20)
        CHECK (status IN ('UNPAID', 'PAID'))
        DEFAULT 'UNPAID',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,

    UNIQUE (room_id, month),

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================
   PAYMENTS
========================= */
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(50),

    vnp_TransactionNo VARCHAR(50),
    vnp_ResponseCode VARCHAR(10),
    vnp_OrderInfo VARCHAR(255),

    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

/* =========================
   NOTIFICATIONS
========================= */
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,

    title VARCHAR(100),
    content VARCHAR(255),

    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================
   MESSAGES (CHAT USER)
========================= */
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,

    content VARCHAR(1000) NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

/* =========================
   CHAT AI
========================= */
CREATE TABLE IF NOT EXISTS ChatMessages (
    id SERIAL PRIMARY KEY,
    user_id INT,
    role VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   OTP
========================= */
CREATE TABLE IF NOT EXISTS Otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   SETTINGS
========================= */
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    owner_id INT NULL,

    billing_day INT DEFAULT 5,
    default_electric_price INT DEFAULT 0,
    default_water_price INT DEFAULT 0,
    default_room_price DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================
   HOUSE RULES
========================= */
CREATE TABLE IF NOT EXISTS house_rules (
    id SERIAL PRIMARY KEY,

    house_id INT NOT NULL,

    title VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
);

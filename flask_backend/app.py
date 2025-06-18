from flask import Flask, jsonify, request
import sqlite3
from flask_cors import CORS
import os
import re  # For regex validation
import sys
sys.stdout.reconfigure(encoding='utf-8')


app = Flask(__name__)
CORS(app)  # Allow requests from Flutter or WebView

# SQLite database setup
DATABASE = 'bidyut.db'

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row  # Allows dictionary-style access
    return db

def init_db():
    if not os.path.exists(DATABASE):
        db = get_db()
        cursor = db.cursor()
        # Create users table with all required fields
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                password TEXT NOT NULL,
                school_name TEXT NOT NULL,
                terms_accepted BOOLEAN NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        db.commit()
        print("✅ Database initialized successfully!")
    else:
        print("✅ Database already exists!")

# Initialize the database when the app starts
init_db()

@app.route('/')
def home():
    return "✅ Flask backend with SQLite is running!"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Extract all form fields
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')
    school_name = data.get('schoolName') 
    terms = data.get('terms', False)  # Default to False if not provided

    # Validate required fields
    required_fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'schoolName']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "status": "error",
                "field": field,
                "message": "This field is required"
            }), 400

    # Email validation
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        return jsonify({
            "status": "error",
            "field": "email",
            "message": "Please enter a valid email address"
        }), 400

    # Phone validation
    phone_regex = r'^[+]?[\d\s\-\(\)]{10,}$'
    if not re.match(phone_regex, phone):
        return jsonify({
            "status": "error",
            "field": "phone",
            "message": "Please enter a valid phone number"
        }), 400

    # Password strength check (simplified version)
    if len(password) < 8:
        return jsonify({
            "status": "error",
            "field": "password",
            "message": "Password must be at least 8 characters"
        }), 400

    # Password confirmation
    if password != confirm_password:
        return jsonify({
            "status": "error",
            "field": "confirmPassword",
            "message": "Passwords do not match"
        }), 400

    # Terms acceptance
    if not terms:
        return jsonify({
            "status": "error",
            "field": "terms",
            "message": "You must accept the terms of service"
        }), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email=?", (email,))
        if cursor.fetchone():
            return jsonify({
                "status": "error",
                "field": "email",
                "message": "Email already registered"
            }), 400

        # Insert new user
        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, phone, password,school_name, terms_accepted) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (first_name, last_name, email, phone, password,school_name, terms)
        )
        db.commit()

        return jsonify({
            "status": "success",
            "message": "Account created successfully!",
            "user": {
                "firstName": first_name,
                "lastName": last_name,
                "email": email
            }
        })

    except sqlite3.Error as e:
        return jsonify({
            "status": "error",
            "message": "Registration failed. Please try again.",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
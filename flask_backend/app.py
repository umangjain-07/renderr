from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Flutter or WebView

# MySQL connection setup

try:
    db = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="772002",
        database="bidyut"
    )
    print("✅ Database connected!")
except mysql.connector.Error as e:
    print("❌ Database connection failed!")
    print("Error:", e)

# Get a cursor for DB operations
cursor = db.cursor()

@app.route('/')
def home():
    return "✅ Flask backend is running!"

@app.route('/api/message', methods=['GET'])
def get_message():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check login
    sql = "SELECT * FROM users WHERE username=%s AND password=%s"
    val = (username, password)
    cursor.execute(sql, val)
    user = cursor.fetchone()

    if user:
        return jsonify({"status": "success", "username": username})
    else:
        return jsonify({"status": "failed", "message": "Invalid credentials"}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    fullname = data.get('fullname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Insert user into database
    sql = "INSERT INTO users (fullname, username, email, password) VALUES (%s, %s, %s, %s)"
    val = (fullname, username, email, password)
    cursor.execute(sql, val)
    db.commit()  # Save changes
    
    print(f"[REGISTER] {fullname}, {username}, {email}")
    return jsonify({"status": "registered", "user": username})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

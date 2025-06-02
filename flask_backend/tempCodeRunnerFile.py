from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Flutter or WebView

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
    # Auth logic placeholder
    print(f"[LOGIN] Username: {username}, Password: {password}")
    return jsonify({"status": "success", "username": username})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    fullname = data.get('fullname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    print(f"[REGISTER] {fullname}, {username}, {email}")
    return jsonify({"status": "registered", "user": username})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

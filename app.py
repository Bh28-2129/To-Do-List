from flask import Flask, render_template, request
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["login_demo"]          
users = db["users"]                

@app.route("/")
def home():
    return render_template("login.html")

@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]

    # Store user data in MongoDB
    users.insert_one({"username": username, "password": password})
    return render_template("login.html", message=f"✅ User '{username}' registered successfully!")

if __name__ == "__main__":
    app.run(debug=True)

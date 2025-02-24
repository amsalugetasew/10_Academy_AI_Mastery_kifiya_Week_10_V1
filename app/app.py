from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from datetime import datetime
import pickle

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})  # React app port

# Load trained model
with open("app/model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

def process_date(date_str):
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    day = date_obj.day
    month = date_obj.month
    year = date_obj.year
    day_of_week = date_obj.weekday()
    
    return np.array([day, month, year, day_of_week])

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        date_str = request.json["date"]
        features = process_date(date_str).reshape(1, -1)
        
        # Get prediction
        prediction = model.predict(features)[0]
        
        return jsonify({"prediction": float(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)

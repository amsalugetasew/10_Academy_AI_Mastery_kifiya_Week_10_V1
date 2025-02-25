from flask import Flask
from flask import  request
from flask import  jsonify
from flask_cors import CORS
from model import predict_price

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_date = data.get("date")

    if not input_date:
        return jsonify({"error": "Date is required"}), 400

    try:
        price_prediction = predict_price(input_date)
        return jsonify({"prediction": price_prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

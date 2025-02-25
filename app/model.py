import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from datetime import datetime

# Load the trained Keras model
model = load_model("lstm_model.h5")

def preprocess_date(input_date):
    """Convert date string into numeric features."""
    date_obj = datetime.strptime(input_date, "%Y-%m-%d")
    features = np.array([[date_obj.year, date_obj.month, date_obj.day]])  # Adjust if needed
    return features

def predict_price(input_date):
    try:
        features = preprocess_date(input_date)
        prediction = model.predict(features)
        return float(prediction[0][0])  # Ensure a scalar output
    except Exception as e:
        return str(e)

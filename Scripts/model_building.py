import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.vector_ar.var_model import VAR
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense
import pickle

class BrentOilAnalysis:
    def __init__(self, data):
        self.data = data
        self.model = None
        self.scaler = MinMaxScaler()
        self.data.index = pd.to_datetime(self.data.index)

    def preprocess_data(self):
        """Handle missing values and scale the data."""
        self.data.fillna(method='ffill', inplace=True)
        self.data['Scaled_Price'] = self.scaler.fit_transform(self.data[['Price']])
        print("Data Preprocessed Successfully")

    def exploratory_data_analysis(self):
        """Perform EDA including visualization."""
        plt.figure(figsize=(10, 5))
        plt.plot(self.data.index, self.data['Price'], label='Brent Oil Price')
        plt.xlabel('Date')
        plt.ylabel('Price')
        plt.title('Brent Oil Price Trend')
        plt.legend()
        plt.show()
        
        sns.heatmap(self.data.corr(), annot=True, cmap='coolwarm')
        plt.show()
        print("EDA Completed Successfully")

    def build_arima_model(self, order=(5,1,0)):
        """Build and train an ARIMA model."""
        model = ARIMA(self.data['Price'], order=order)
        self.model = model.fit()
        print("ARIMA Model Built Successfully")
        print(self.model.summary())

    def build_var_model(self, lags=5):
        """Build and train a VAR model."""
        model = VAR(self.data.diff().dropna())
        self.model = model.fit(lags)
        print("VAR Model Built Successfully")
        print(self.model.summary())

    def build_lstm_model(self, time_steps=10):
        """Build and train an LSTM model."""
        X, y = [], []
        for i in range(time_steps, len(self.data['Scaled_Price'])):
            X.append(self.data['Scaled_Price'].values[i-time_steps:i])
            y.append(self.data['Scaled_Price'].values[i])
        X, y = np.array(X), np.array(y)
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))

        model = Sequential([
            LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)),
            LSTM(units=50),
            Dense(units=1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X, y, epochs=10, batch_size=16)
        self.model = model
        print("LSTM Model Built Successfully")

    def predict(self, steps=10):
        """Generate forecasts using the trained model."""
        if isinstance(self.model, ARIMA):
            forecast = self.model.forecast(steps=steps)
        elif isinstance(self.model, VAR):
            forecast = self.model.forecast(self.data.values[-steps:], steps=steps)
        elif isinstance(self.model, Sequential):  # For LSTM model prediction
            # Make predictions for the next 'steps' using LSTM
            # Prepare the input as the last available scaled data points
            input_data = self.data['Scaled_Price'].values[-10:].reshape(1, 10, 1)
            forecast = self.model.predict(input_data, steps=steps)
        else:
            print("Prediction not supported for this model.")
            return None
        print("Forecast Generated Successfully")
        return forecast

    def save_model(self, filename='model.pkl'):
        """Save the trained model to a file."""
        if isinstance(self.model, ARIMA):
            with open(filename, 'wb') as file:
                pickle.dump(self.model, file)
            print("ARIMA Model Saved Successfully")
        elif isinstance(self.model, VAR):
            with open(filename, 'wb') as file:
                pickle.dump(self.model, file)
            print("VAR Model Saved Successfully")
        elif isinstance(self.model, Sequential):  # For LSTM model
            self.model.save(filename)
            print("LSTM Model Saved Successfully")
        else:
            print("Model type not recognized for saving.")

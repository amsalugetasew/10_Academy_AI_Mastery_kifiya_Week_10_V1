from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller
import matplotlib.pyplot as plt
class Plot:
    def __init__(self, data):
        self.data = data
    # Plot the time series
    def time_series_analysis(self):
        plt.figure(figsize=(12, 6))
        plt.plot(self.data['Date'], self.data['Price'], label='Brent Oil Price')
        plt.xlabel('Date')
        plt.ylabel('Price (USD)')
        plt.title('Brent Oil Prices Over Time')
        plt.legend()
        plt.show()
    def plot_decomposition_results(self):
        # Set Date as Index
        self.data.set_index('Date', inplace=True)

        # Decompose the time series
        decomposition = seasonal_decompose(self.data['Price'], model='additive', period=365)

        # Plot decomposition results
        decomposition.plot()
        plt.show()
    def Augmented_Dickey_Fuller_test(self):
        # Perform Augmented Dickey-Fuller test
        result = adfuller(self.data['Price'])

        # Print results
        print(f'ADF Statistic: {result[0]}')
        print(f'p-value: {result[1]}')
        if result[1] < 0.05:
            print("The time series is stationary.")
        else:
            print("The time series is non-stationary. Differencing is required.")

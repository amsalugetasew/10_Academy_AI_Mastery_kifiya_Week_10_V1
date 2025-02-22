import pandas as pd
class Preprocessing:
    def __init__(self, df):
        self.data = df
    def preprocess_data(self):
        """Cleans and preprocesses the data."""
        if self.data is None:
            print("No data found. Please load data first.")
            return None

        # Convert 'Date' column to datetime format
        self.data[:,'Date'] = pd.to_datetime(self.data['Date'], errors='coerce')

        # Drop rows with invalid dates
        self.data.dropna(subset=['Date'], inplace=True)

        # Sort data by date
        self.data.sort_values(by='Date', inplace=True)

        # Reset index
        self.data.reset_index(drop=True, inplace=True)

        print("Data preprocessing completed.")
        return self.data
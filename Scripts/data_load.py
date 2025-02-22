import pandas as pd
import os

class DataLoader:
    def __init__(self, data_folder="../data"):
        """Initialize with the data folder path."""
        self.data_folder = data_folder

    def load_csv(self, filename):
        """
        Load CSV file from the data folder.
        
        Args:
            filename (str): Name of the CSV file.
        
        Returns:
            pd.DataFrame: Loaded dataframe.
        """
        file_path = os.path.join(self.data_folder, filename)
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File '{filename}' not found in '{self.data_folder}'")

        return pd.read_csv(file_path)


import React, { useState } from 'react';

function OilPricePredictor() {
  const [date, setDate] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the date is valid
    if (!date) {
      setError('Please select a date.');
      return;
    }

    try {
      // Send the date to the Flask backend for prediction
      const response = await fetch('http://127.0.0.1:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date }),  // Only sending the date
      });

      // If the response is OK, parse the result
      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);  // Set the prediction result
        setError(null);  // Clear any previous error
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to fetch prediction');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Select Date:
          <input
            type="date"
            value={date}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Predict</button>
      </form>

      {prediction && <div>Predicted Price: {prediction}</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
}

export default OilPricePredictor;

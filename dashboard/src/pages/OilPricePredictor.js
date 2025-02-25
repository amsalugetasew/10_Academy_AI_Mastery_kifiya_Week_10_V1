import React, { useState } from "react";

function OilPricePredictor() {
  const [date, setDate] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => setDate(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    if (!date) {
      setError("Please select a date.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });

      const data = await response.json();
      if (response.ok) setPrediction(data.prediction);
      else setError(data.error || "Prediction failed");
    } catch {
      setError("Could not fetch prediction. Is the backend running?");
    }
  };

  return (
    <div>
      <h2>Oil Price Predictor</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Date: <input type="date" value={date} onChange={handleChange} /></label>
        <button type="submit">Predict</button>
      </form>
      {prediction && <p>Predicted Price: ${prediction}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}

export default OilPricePredictor;

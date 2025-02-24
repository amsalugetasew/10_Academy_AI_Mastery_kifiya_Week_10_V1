import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [source, setSource] = useState("csv");
  const [apiUrl, setApiUrl] = useState("");
  const [analysisType, setAnalysisType] = useState("actual");
  const [processedData, setProcessedData] = useState({});

  const handleSourceChange = (event) => {
    setSource(event.target.value);
    setData([]);
    setMetrics({});
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const parsedData = result.data.slice(1).map(row => ({
          date: row[0],
          price: parseFloat(row[1]),
          event: row[2] || "",
        })).filter(d => d.date && !isNaN(d.price));

        updateData(parsedData);
      },
      header: false,
    });
  };

  const fetchApiData = async () => {
    if (!apiUrl) {
      alert("Please enter a valid API URL.");
      return;
    }

    try {
      const response = await axios.get(apiUrl);
      const apiData = response.data.map(item => ({
        date: item.date,
        price: parseFloat(item.price),
        event: item.event || "",
      }));

      updateData(apiData);
    } catch (error) {
      alert("Error fetching API data.");
      console.error(error);
    }
  };

  const computeMovingAverage = (data, windowSize) => {
    return data.map((d, i) => {
      if (i < windowSize - 1) return { ...d, [`ma${windowSize}`]: null };
      const sum = data.slice(i - windowSize + 1, i + 1).reduce((acc, val) => acc + val.price, 0);
      return { ...d, [`ma${windowSize}`]: sum / windowSize };
    });
  };

  const computeSeasonality = (data) => {
    const yearlyData = {};
    data.forEach(d => {
      const year = d.date.split("-")[0];
      if (!yearlyData[year]) yearlyData[year] = [];
      yearlyData[year].push(d);
    });

    const avgSeasonality = Object.keys(yearlyData).reduce((acc, year) => {
      yearlyData[year].forEach((d, index) => {
        if (!acc[index]) acc[index] = { date: d.date, price: 0, count: 0 };
        acc[index].price += d.price;
        acc[index].count += 1;
      });
      return acc;
    }, []);

    return avgSeasonality.map(d => ({
      date: d.date,
      price: d.count > 0 ? d.price / d.count : 0,
    }));
  };

  const computeTrend = (data) => computeMovingAverage(data, 7); // 7-day MA for trend
  const computeCyclic = (data) => computeMovingAverage(data, 90); // 90-day MA for cyclic

  const computeResidual = (data, trend, seasonality, cyclic) => {
    return data.map((d, i) => ({
      date: d.date,
      price: d.price - ((trend[i]?.price || 0) + (seasonality[i]?.price || 0) + (cyclic[i]?.price || 0))
    }));
  };

  const updateData = (parsedData) => {
    setData(parsedData);

    const trend = computeTrend(parsedData);
    const seasonality = computeSeasonality(parsedData);
    const cyclic = computeCyclic(parsedData);
    const residual = computeResidual(parsedData, trend, seasonality, cyclic);

    setProcessedData({
      actual: parsedData,
      trend,
      seasonality,
      cyclic,
      residual
    });

    const prices = parsedData.map(d => d.price);
    const avgPrice = prices.reduce((acc, val) => acc + val, 0) / prices.length;
    const volatility = Math.max(...prices) - Math.min(...prices);

    setMetrics({ averagePrice: avgPrice.toFixed(2), volatility: volatility.toFixed(2) });
  };

  return (
    <div className="dashboard-container">
      <h2>Brent Oil Price Dashboard</h2>

      <label>Select Data Source:</label>
      <select onChange={handleSourceChange} value={source}>
        <option value="csv">Upload CSV</option>
        <option value="api">Fetch from API</option>
      </select>

      {source === "csv" && <input type="file" accept=".csv" onChange={handleFileUpload} />}
      {source === "api" && (
        <>
          <input type="text" placeholder="Enter API URL" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
          <button onClick={fetchApiData}>Fetch Data</button>
        </>
      )}

      <label>Select Analysis Type:</label>
      <select onChange={(e) => setAnalysisType(e.target.value)} value={analysisType}>
        <option value="actual">Actual Price</option>
        <option value="trend">Trend</option>
        <option value="seasonality">Seasonality</option>
        <option value="cyclic">Cyclic</option>
        <option value="residual">Residual</option>
      </select>

      {processedData[analysisType]?.length > 0 && (
        <>
          <h3>Price Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData[analysisType]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke={analysisType === "trend" ? "#FF5733" :
                analysisType === "seasonality" ? "#33FF57" :
                analysisType === "cyclic" ? "#3375FF" :
                analysisType === "residual" ? "#F033FF" :
                "#8884d8"} />
            </LineChart>
          </ResponsiveContainer>

          <h3>Performance Metrics</h3>
          <p><strong>Average Price:</strong> ${metrics.averagePrice}</p>
          <p><strong>Volatility:</strong> ${metrics.volatility}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;

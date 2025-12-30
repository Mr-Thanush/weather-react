import React, { useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Key = import.meta.env.VITE_WEATHER_API_KEY;

  // Format UNIX timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchData = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Key}&units=metric`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setWeather(data);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weatherContainer">
      <h1>Weather App</h1>
      
      <div className="input">
        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchData()}
        />
        <button onClick={fetchData} disabled={loading}>
          Search
        </button>
      </div>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="NextData">
          <div className="flex">
          <div className="weatherDetails">
            <p className="degrees">{weather.main?.temp}℃</p>
            <p className="location">{weather.name}</p>
            <p className="condition">{weather.weather?.[0]?.main}</p>
          </div>
          <div className="date">
            <p className="datetime">{formatDate(weather.dt)}</p>
          </div>
          </div>

          <div className="weatherDetails2">
            <div className="col1">
              <p className="speed">{weather.wind?.speed ?? "-"} km/h</p>
              <p className="wind">Wind</p>
            </div>

            <div className="col2">
              <p className="power">{weather.main?.humidity ?? "-"}%</p>
              <p className="breeze">Humidity</p>
            </div>
          </div>

          
        </div>
      )}
    </div>
  );
};

export default Weather;
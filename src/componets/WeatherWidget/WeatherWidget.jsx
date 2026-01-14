// Import React hooks for state management
import { useState } from "react";
// Import component-specific CSS styles
import "./WeatherWidget.css";

/**
 * Maps weather condition codes from Open-Meteo API to emoji icons
 * @param {number} weatherCode - Weather condition code from API
 * @returns {string} Corresponding emoji icon
 */
const getWeatherIcon = (weatherCode) => {
  const icons = {
    0: "☀️", // Clear sky
    1: "🌤️", // Mainly clear
    2: "⛅", // Partly cloudy
    3: "☁️", // Overcast
    45: "🌫️", // Fog
    48: "🌫️", // Depositing rime fog
    51: "🌦️", // Light drizzle
    53: "🌦️", // Moderate drizzle
    55: "🌦️", // Dense drizzle
    61: "🌧️", // Slight rain
    63: "🌧️", // Moderate rain
    65: "🌧️", // Heavy rain
    71: "❄️", // Slight snow
    73: "❄️", // Moderate snow
    75: "❄️", // Heavy snow
    77: "🌨️", // Snow grains
    80: "🌦️", // Slight rain showers
    81: "🌦️", // Moderate rain showers
    82: "🌦️", // Violent rain showers
    85: "🌨️", // Slight snow showers
    86: "🌨️", // Heavy snow showers
    95: "⛈️", // Thunderstorm
    96: "⛈️", // Thunderstorm with slight hail
    99: "⛈️", // Thunderstorm with heavy hail
  };
  return icons[weatherCode] || "🌡️";
};

/**
 * WeatherWidget Component
 * A React component that allows users to search for weather information by city name.
 * Uses Open-Meteo API for geocoding and weather data.
 */
const WeatherWidget = () => {
  // State for user input (city name)
  const [city, setCity] = useState("");
  // State for weather data object
  const [weather, setWeather] = useState(null);
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState("");
  // State for multiple city options when search returns multiple results
  const [cityOptions, setCityOptions] = useState([]);

  /**
   * Fetches weather data for the entered city name
   * First gets coordinates using geocoding API, then fetches weather data
   */
  const fetchWeather = async () => {
    // Reset states before starting new search
    setLoading(true);
    setError("");
    setWeather(null);
    setCityOptions([]);

    try {
      // Step 1: Get coordinates for the city using geocoding API
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );
      const geoData = await geoRes.json();

      // Handle case where no cities are found
      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      // If multiple cities found, let user choose
      if (geoData.results.length > 1) {
        setCityOptions(geoData.results);
        setLoading(false);
        return;
      }

      // Only one city found, fetch weather directly
      const { latitude, longitude, country, name, admin1 } = geoData.results[0];
      await getWeather(latitude, longitude, country, name, admin1);
    } catch {
      setError("Failed to fetch weather");
      setLoading(false);
    }
  };

  /**
   * Fetches actual weather data using coordinates
   * @param {number} latitude - City latitude
   * @param {number} longitude - City longitude
   * @param {string} country - Country name
   * @param {string} name - City name
   * @param {string} admin1 - State/Province name
   */
  const getWeather = async (latitude, longitude, country, name, admin1) => {
    try {
      // Fetch weather data from Open-Meteo API with specific parameters
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      // Check if weather data is available
      if (!weatherData.current) {
        setError("Weather data not available for this location");
        setLoading(false);
        return;
      }

      // Set weather state with processed data
      setWeather({
        temperature: Math.round(weatherData.current.temperature_2m), // Round temperature
        humidity: weatherData.current.relative_humidity_2m,
        feelsLike: Math.round(weatherData.current.apparent_temperature), // Round feels-like temp
        windSpeed: Math.round(weatherData.current.wind_speed_10m), // Round wind speed
        windDirection: weatherData.current.wind_direction_10m,
        weatherCode: weatherData.current.weather_code, // For icon selection
        country,
        name,
        admin1,
      });
      setCityOptions([]); // Clear city options after successful selection
    } catch {
      setError("Failed to fetch weather data");
    }
    setLoading(false);
  };

  /**
   * Handles Enter key press in the input field to trigger search
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && city && !loading) {
      fetchWeather();
    }
  };

  /**
   * Clears all search data and resets the component to initial state
   */
  const clearSearch = () => {
    setCity("");
    setWeather(null);
    setError("");
    setCityOptions([]);
  };

  return (
    <div className="weather-widget-container">
      {/* Main widget title */}
      <h2>🌤️ Weather Widget</h2>

      {/* Search input and buttons section */}
      <div className="search-container">
        <input
          id="City"
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
          className="city-input"
        />
        <div className="button-group">
          {/* Search button with loading state */}
          <button
            onClick={fetchWeather}
            disabled={loading || !city} // Disabled when loading or no city entered
            className="search-btn"
          >
            {loading ? "🔍 Searching..." : "🔍 Get Weather"}
          </button>
          {/* Clear button - only shown when there's input or weather data */}
          {(city || weather) && (
            <button
              onClick={clearSearch}
              className="clear-btn"
              title="Clear search"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* Error message display */}
      {error && <p className="error">❌ {error}</p>}

      {/* City selection options when multiple cities are found */}
      {cityOptions.length > 0 && (
        <div className="city-options">
          <p>🏙️ Choose a city:</p>
          {/* Show up to 5 city options */}
          {cityOptions.slice(0, 5).map((option) => (
            <button
              key={option.id}
              className="city-option-btn"
              onClick={() =>
                getWeather(
                  option.latitude,
                  option.longitude,
                  option.country,
                  option.name,
                  option.admin1
                )
              }
            >
              📍 {option.name}
              {option.admin1 ? `, ${option.admin1}` : ""}
              {option.country ? `, ${option.country}` : ""}
            </button>
          ))}
        </div>
      )}

      {/* Weather information display */}
      {weather && (
        <div className="weather-info">
          {/* Location header with full address */}
          <div className="location-header">
            <h3>
              📍 {weather.name}
              {weather.admin1 ? `, ${weather.admin1}` : ""}
              {weather.country ? `, ${weather.country}` : ""}
            </h3>
          </div>

          {/* Main weather display with icon and temperature */}
          <div className="weather-main">
            <div className="weather-icon">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div className="temperature">{weather.temperature}°C</div>
          </div>

          {/* Additional weather details */}
          <div className="weather-details">
            <div className="weather-item">
              <span className="label">🌡️ Feels like:</span>
              <span className="value">{weather.feelsLike}°C</span>
            </div>
            <div className="weather-item">
              <span className="label">💧 Humidity:</span>
              <span className="value">{weather.humidity}%</span>
            </div>
            <div className="weather-item">
              <span className="label">💨 Wind:</span>
              <span className="value">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;

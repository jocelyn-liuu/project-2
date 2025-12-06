import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

// ------- NAVBAR ------- //
function NavBar({ setShowWeather, setShowCities, setSelectedCity }) {
  return (
    <nav className="nav-bar">
      <button
        className="nav-link"
        onClick={() => {
          setShowWeather(false);
          setShowCities(false);
        }}
      >
        Home
      </button>

      <button
        className="nav-link"
        onClick={() => {
          setSelectedCity('Berkeley');   // current city
          setShowCities(false);
          setShowWeather(true);
        }}
      >
        Berkeley
      </button>

      <button
        className="nav-link"
        onClick={() => {
          setShowWeather(false);
          setShowCities(true);
        }}
      >
        Other Cities
      </button>
    </nav>
  );
}

// ------- MAIN APP ------- //
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showWeather, setShowWeather] = useState(false);
  const [showCities, setShowCities] = useState(false);

  const [selectedCity, setSelectedCity] = useState('Berkeley'); // 🔹 which city

  function getBackgroundClass() {
    if (!data?.weather?.condition) return 'bg-default';

    const cond = data.weather.condition.toLowerCase();
    if (cond.includes('cloud')) return 'bg-cloudy';
    if (cond.includes('rain')) return 'bg-rainy';
    if (cond.includes('clear')) return 'bg-clear';
    return 'bg-default';
  }

  // 🔁 Fetch data whenever we are on the weather page AND city changes
  // 🔁 Fetch data whenever we are on the weather page AND city changes
useEffect(() => {
  if (!showWeather) return;

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://localhost:4000/api/weather-playlist?city=${encodeURIComponent(
          selectedCity
        )}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [showWeather, selectedCity]); // 👈 depends on both


  // ------- HOME PAGE ------- //
  if (!showWeather && !showCities) {
    return (
      <div className="home-page">
        <h1 className="home-title">Playlist by weather</h1>
        <button
          className="home-button"
          onClick={() => {
            setSelectedCity('Berkeley'); // default
            setShowWeather(true);
          }}
        >
          Generate Now
        </button>
      </div>
    );
  }

  // ------- OTHER CITIES PAGE ------- //
  if (showCities) {
    const handleCityClick = (city) => {
      setSelectedCity(city);  // set city
      setShowCities(false);
      setShowWeather(true);   // go to weather view
    };

    return (
      <div className="page bg-default">
        <NavBar
          setShowWeather={setShowWeather}
          setShowCities={setShowCities}
          setSelectedCity={setSelectedCity}
        />

        <div className="cities-container">
  <h1 className="cities-title">Other Cities</h1>

  <div className="cities-map-wrapper">
    <div className="cities-map">
      <button
        className="city-button city-ny"
        onClick={() => handleCityClick('New York')}
      >
        NY
      </button>
      <button
        className="city-button city-chicago"
        onClick={() => handleCityClick('Chicago')}
      >
        Chicago
      </button>
      <button
        className="city-button city-sf"
        onClick={() => handleCityClick('San Francisco')}
      >
        SF
      </button>
    </div>
  </div>
</div>


      </div>
    );
  }

  // ------- WEATHER PAGE STATES ------- //
  if (loading) {
    return (
      <div className="page bg-default">
        <NavBar
          setShowWeather={setShowWeather}
          setShowCities={setShowCities}
          setSelectedCity={setSelectedCity}
        />
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page bg-default">
        <NavBar
          setShowWeather={setShowWeather}
          setShowCities={setShowCities}
          setSelectedCity={setSelectedCity}
        />
        <div className="error-text">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page bg-default">
        <NavBar
          setShowWeather={setShowWeather}
          setShowCities={setShowCities}
          setSelectedCity={setSelectedCity}
        />
        <div className="error-text">No data available</div>
      </div>
    );
  }

  const { weather, playlist } = data;

  // ------- WEATHER PAGE ------- //
  return (
    <div className={`page ${getBackgroundClass()}`}>
      <NavBar
        setShowWeather={setShowWeather}
        setShowCities={setShowCities}
        setSelectedCity={setSelectedCity}
      />

      <div className="weather-container">
        <h1>
          Today&apos;s Weather: Temp: {weather.temp}°C
        </h1>
        <h2>{weather.condition}</h2>

        <div className="content-row">
          <div className="playlist-box">
            <iframe
              className="playlist-iframe"
              src={playlist.embedUrl}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

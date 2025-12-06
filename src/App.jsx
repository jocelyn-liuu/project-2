import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:4000/api/weather-playlist');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">{error}</div>;
  if (!data) return <div className="page">No data available</div>;


  const { weather, playlist } = data;

  return (
    <div className="page">
      <div className="card">
        <div className="card-inner">
          <h2 className="title">
            Today&apos;s Weather - Temp: {weather.temp}°C
          </h2>
          <p className="subtitle">
            {weather.condition.toUpperCase()}
          </p>

          <div className="content-row">
            <div className="weather-box">
              <p>Location: {weather.city}</p>
              <p>Description: {weather.description}</p>
            </div>

            <div className="playlist-box">
              <div className="playlist-header">spotify playlist</div>
              <iframe
                className="playlist-iframe"
                src={playlist.embedUrl}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={playlist.name}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

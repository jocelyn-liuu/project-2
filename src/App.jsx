import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    function getBackgroundClass() {
    if (!data?.weather?.condition) return 'bg-default';

    const cond = data.weather.condition.toLowerCase();

    if (cond.includes('cloud')) return 'bg-cloudy';
    if (cond.includes('rain')) return 'bg-rainy';
    if (cond.includes('clear')) return 'bg-clear';
    return 'bg-default';
  }

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
  <div className={`page ${getBackgroundClass()}`}>

    <div className="weather-container">
      <h1>Today's Weather - Temp: {data.weather.temp}°C</h1>
      <h2>{data.weather.condition}</h2>

      <div className="content-row">
       

        <div className="playlist-box">
          <iframe
  className="playlist-iframe"
  src={data.playlist.embedUrl}
  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
></iframe>


        </div>
      </div>
    </div>
  </div>
);

}

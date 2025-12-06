import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
app.use(cors());
app.get('/test', (req, res) => {
  res.json({ ok: true, message: 'Server is working' });
});

const PORT = process.env.PORT || 4000;


// ----- 1. Helper: get Spotify access token -----
async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const resp = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return resp.data.access_token;
}

// ----- 2. Map weather condition -> playlists (put your real IDs later) -----
const PLAYLISTS_BY_WEATHER = {
  Clear: [
    'SUNNY_PLAYLIST_ID_1',
    'SUNNY_PLAYLIST_ID_2',
  ],
  Clouds: [
    'CLOUDY_PLAYLIST_ID_1',
    'CLOUDY_PLAYLIST_ID_2',
  ],
  Rain: [
    'RAINY_PLAYLIST_ID_1',
    'RAINY_PLAYLIST_ID_2',
  ],
  Default: [
    'DEFAULT_PLAYLIST_ID_1',
  ],
};

// ----- 3. Route: get Berkeley weather + matching random playlist -----
app.get('/api/weather-playlist', async (req, res) => {
  try {
    const city = req.query.city || 'Berkeley';

    // 1. Call OpenWeather for Berkeley
    const weatherResp = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          units: 'metric',
          appid: process.env.WEATHER_API_KEY,
        },
      }
    );

    const weatherData = weatherResp.data;
    const condition = weatherData.weather[0].main; // "Clear", "Clouds", "Rain", etc.
    const temp = Math.round(weatherData.main.temp);

    // 2. Our own static mapping: condition -> playlist embed URLs
    const PLAYLISTS_BY_WEATHER = {
      Clear: [
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX1BzILRveYHb',
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX2sUQwD7tbmL',
      ],
      Clouds: [
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6',
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX3PIPIT6lEg5',
      ],
      Rain: [
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0',
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX8ymr6UES7vc',
      ],
      Default: [
        'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
      ],
    };

    const list = PLAYLISTS_BY_WEATHER[condition] || PLAYLISTS_BY_WEATHER.Default;
    const embedUrl = list[Math.floor(Math.random() * list.length)];

    // 3. Return clean JSON to frontend
    res.json({
      weather: {
        city,
        temp,
        condition,
        description: weatherData.weather[0].description,
      },
      playlist: {
        embedUrl,
      },
    });
  } catch (err) {
    console.error('ERROR in /api/weather-playlist:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to fetch weather',
      details: err.response?.data || err.message,
    });
  }
});

// ----- 4. Start the server -----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



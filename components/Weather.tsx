import React, { useState, KeyboardEvent } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFrown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../src/css/weather.css';

// Define TypeScript types for the weather data
interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface WeatherState {
  loading: boolean;
  data: Partial<WeatherData>; // Partial because data will be populated dynamically
  error: boolean;
}

const Weather: React.FC = () => {
  const [input, setInput] = useState<string>(''); // Typing input as string
  const [weather, setWeather] = useState<WeatherState>({
    loading: false,
    data: {},
    error: false,
  });

  // Function to format the current date
  const toDateFunction = (): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const WeekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  // Function to handle the search when pressing Enter
  const search = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });

      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

      try {
        const res = await axios.get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });
        setWeather({ data: res.data, loading: false, error: false });
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        setInput('');
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
      <Link to="/" className="flex items-center text-blue-500 hover:underline mb-4">
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        <span className="ml-2 text-green-600">Live Weather</span>
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-green-700">Live Weather</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter City Name..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>
      {weather.loading && (
        <div className="flex justify-center items-center h-32">
          <Oval color="black" height={100} width={100} />
        </div>
      )}
      {weather.error && (
        <div className="flex flex-col items-center text-red-600 mb-4">
          <FontAwesomeIcon icon={faFrown} size="lg" />
          <span className="mt-2 text-lg">City not found</span>
        </div>
      )}
      {weather.data && weather.data.main && (
        <div className="text-center">
          <div className="mb-2">
            <h2 className="text-xl font-semibold">
              {weather.data.name}, <span>{weather.data.sys?.country}</span>
            </h2>
          </div>
          <div className="mb-2">
            <span className="text-gray-500">{toDateFunction()}</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${weather.data.weather?.[0].icon}@2x.png`}
              alt={weather.data.weather?.[0].description}
              className="mb-2"
            />
            <span className="text-4xl font-bold">
              {Math.round(weather.data.main.temp)}<sup className="text-xl">°C</sup>
            </span>
          </div>
          <div className="text-gray-700 mt-2">
            <p>{weather.data.weather?.[0].description.toUpperCase()}</p>
            <p>Wind Speed: {weather.data.wind?.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;

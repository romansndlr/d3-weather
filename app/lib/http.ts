import axios from "axios";

export const http = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
});

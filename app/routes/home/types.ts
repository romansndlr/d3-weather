interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface WindData {
  speed: number;
  deg: number;
  gust: number;
}

export interface ForecastItem {
  dt: number;
  main: MainData;
  weather: WeatherData[];
  clouds: { all: number };
  wind: WindData;
  visibility: number;
  pop: number;
  rain?: { "3h": number };
  sys: { pod: string };
  dt_txt: string;
}

interface CityData {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: CityData;
}

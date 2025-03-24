import { addDays, format, startOfToday } from "date-fns";
import { chunk, range } from "lodash-es";
import { http } from "~/lib/http";
import { CloudyIcon, SunnyIcon } from "../../components/icons";
import { RainyIcon } from "../../components/icons";
import type { ForecastResponse } from "./types";

export async function getForecast() {
  const { data } = await http.get<ForecastResponse>("/forecast", {
    params: {
      lat: 32.0853,
      lon: 34.7818,
      units: "metric",
    },
  });

  return data;
}

export function getDays() {
  const today = startOfToday();

  return range(5).map((i) => {
    const day = addDays(today, i);

    return format(day, "EEE");
  });
}

export function groupWeatherByDay(forecast: ForecastResponse) {
  const days = getDays();

  const chunks = chunk(forecast.list, 8);

  return days.reduce(
    (acc, day, index) => {
      acc[day] = chunks[index];

      return acc;
    },
    {} as Record<string, typeof forecast.list>,
  );
}

export function getConditionIcon(weatherCondition: string) {
  const condition = weatherCondition.toLowerCase();

  if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("thunderstorm")
  ) {
    return <RainyIcon className="h-16 w-16" />;
  }

  if (
    condition.includes("cloud") ||
    condition.includes("fog") ||
    condition.includes("mist")
  ) {
    return <CloudyIcon className="h-16 w-16" />;
  }

  return <SunnyIcon className="h-16 w-16" />;
}

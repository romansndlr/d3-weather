import clsx from "clsx";
import { format, fromUnixTime } from "date-fns";
import { Link } from "react-router";
import useMeasure from "react-use-measure";
import type { Route } from "./+types/home";
import { Precipitation } from "./components/Precipitation";
import { Temperature } from "./components/Temerature";
import { Wind } from "./components/Wind";
import {
  loadSearchParams,
  serialize,
  useHomeSearchParams,
} from "./search-params";
import {
  getConditionIcon,
  getDays,
  getForecast,
  groupWeatherByDay,
} from "./utils";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const searchParams = loadSearchParams(request);

  const forecast = await getForecast();

  const weatherByDay = groupWeatherByDay(forecast);

  const days = getDays();

  const today = days[0];

  const weather = weatherByDay[searchParams.day];

  return {
    forecast,
    weatherByDay,
    days,
    today,
    weather,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { forecast, weatherByDay, days, weather } = loaderData;
  const [searchParams] = useHomeSearchParams();
  const [ref, bounds] = useMeasure();

  return (
    <div className="flex flex-col gap-8 pt-8">
      <header className="flex flex-col gap-1">
        <h3 className="text-xl">{forecast.city.name}</h3>
        <div className="flex items-start gap-3">
          <p className="flex items-start gap-0.5 font-semibold text-5xl">
            {weather[0].main.temp.toFixed(0)}
            <span className="text-sm">°C</span>
          </p>
          <dl className="font-light text-xs">
            <div className="flex items-center gap-0.5">
              <dt>Precipitation:</dt>
              <dd>{weather[0].pop}%</dd>
            </div>
            <div className="flex items-center gap-0.5">
              <dt>Humidity:</dt>
              <dd>{weather[0].main.humidity}%</dd>
            </div>
            <div className="flex items-center gap-0.5">
              <dt>Wind:</dt>
              <dd>{weather[0].wind.speed} km/h</dd>
            </div>
          </dl>
        </div>
      </header>

      <nav className="flex w-fit gap-1 rounded-full bg-white p-1 shadow shadow-blue-400 ring ring-slate-800">
        <Link
          className={clsx(
            "rounded-full px-2 py-1 font-normal transition-colors",
            searchParams.tab === "temperature" &&
              "bg-yellow-50 font-medium shadow-md ring ring-slate-900",
          )}
          to={serialize({
            tab: "temperature",
            day: searchParams.day,
          })}
        >
          Temperature
        </Link>
        <Link
          className={clsx(
            "rounded-full px-2 py-1 font-normal transition-colors",
            searchParams.tab === "precipitation" &&
              "bg-yellow-50 font-medium shadow-md ring ring-slate-900",
          )}
          to={serialize({
            tab: "precipitation",
            day: searchParams.day,
          })}
        >
          Precipitation
        </Link>
        <Link
          className={clsx(
            "rounded-full px-2 py-1 font-normal transition-colors",
            searchParams.tab === "wind" &&
              "bg-yellow-50 font-medium shadow-md ring ring-slate-900",
          )}
          to={serialize({
            tab: "wind",
            day: searchParams.day,
          })}
        >
          Wind
        </Link>
      </nav>

      <article
        ref={ref}
        className="flex h-[400px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-blue-400 shadow-lg ring ring-slate-800"
      >
        {searchParams.tab === "temperature" && (
          <Temperature
            weather={weather}
            width={bounds.width}
            height={bounds.height - 40}
          />
        )}
        {searchParams.tab === "precipitation" && (
          <Precipitation
            weather={weather}
            width={bounds.width}
            height={bounds.height - 40}
          />
        )}
        {searchParams.tab === "wind" && (
          <Wind
            weather={weather}
            width={bounds.width}
            height={bounds.height - 40}
          />
        )}
        <div className="flex w-full items-center whitespace-nowrap px-2 py-2">
          {weather.map((series) => (
            <div className="flex-1 text-center" key={series.dt}>
              <p>{format(fromUnixTime(series.dt), "HH:mm")}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="flex items-center justify-between gap-2 self-center rounded-2xl bg-white p-2 shadow-blue-400 shadow-lg ring ring-slate-800">
        {days.map((day) => {
          const weather = weatherByDay[day];

          const max = Math.max(...weather.map((w) => w.main.temp_max));
          const min = Math.min(...weather.map((w) => w.main.temp_min));

          return (
            <Link
              to={serialize({
                day,
                tab: searchParams.tab,
              })}
              className={clsx(
                "flex flex-col items-center px-6 py-2 transition-colors",
                day === searchParams.day &&
                  "rounded-lg bg-yellow-50 shadow-md ring ring-slate-900",
              )}
              key={day}
            >
              <h3
                className={clsx(
                  day === searchParams.day ? "font-medium" : "font-normal",
                )}
              >
                {day}
              </h3>
              {getConditionIcon(weather[0].weather[0].description)}
              <footer className="flex items-center gap-2">
                <p className="flex items-start">{max.toFixed(0)}°</p>
                <p className="flex items-start font-light text-slate-600">
                  {min.toFixed(0)}°
                </p>
              </footer>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

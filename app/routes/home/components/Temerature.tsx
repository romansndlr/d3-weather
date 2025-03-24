import * as d3 from "d3";
import { format, fromUnixTime } from "date-fns";
import { motion } from "motion/react";
import { useHomeSearchParams } from "../search-params";
import type { ForecastItem } from "../types";

const margin = { top: 20, bottom: 40, left: 20, right: 20 };

const Y_SCALE_BUFFER = 20;

const accessors = {
  x: (d: ForecastItem) => d.dt,
  y: (d: ForecastItem) => d.main.temp,
};

export function Temperature({
  weather,
  width,
  height,
}: { weather: ForecastItem[]; width: number; height: number }) {
  const [searchParams] = useHomeSearchParams();

  const timeDomain = [
    accessors.x(weather[0]),
    accessors.x(weather[weather.length - 1]),
  ];

  const graphXScale = d3.scaleLinear().domain(timeDomain).range([0, width]);

  const temperatureXScale = d3
    .scaleLinear()
    .domain(timeDomain)
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...weather.map(accessors.y)) + Y_SCALE_BUFFER])
    .range([height - margin.bottom, margin.top]);

  const lineGenerator = d3
    .line<ForecastItem>()
    .curve(d3.curveMonotoneX)
    .x((d) => graphXScale(accessors.x(d)))
    .y((d) => yScale(accessors.y(d)));

  const areaGenerator = d3
    .area<ForecastItem>()
    .curve(d3.curveMonotoneX)
    .x((d) => graphXScale(accessors.x(d)))
    .y0(() => height - margin.bottom)
    .y1((d) => yScale(accessors.y(d)));

  const linePath = lineGenerator(weather);
  const areaPath = areaGenerator(weather);

  return (
    width && (
      <div>
        <svg
          key={searchParams.day}
          width={width}
          height={height - margin.bottom}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-yellow-500)"
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopOpacity="0"
                stopColor="var(--color-yellow-300)"
              />
            </linearGradient>
          </defs>
          {weather.map((point) => (
            <motion.text
              key={point.dt}
              x={temperatureXScale(accessors.x(point))}
              y={yScale(accessors.y(point)) - 5}
              textAnchor="middle"
              dominantBaseline="text-after-edge"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {accessors.y(point).toFixed(0)}
            </motion.text>
          ))}
          {areaPath && (
            <motion.path
              animate={{ d: areaPath }}
              fill="url(#areaGradient)"
              initial={false}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}
          {linePath && (
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
              fill="none"
              stroke="var(--color-yellow-500)"
              strokeWidth={2}
              d={linePath}
            />
          )}
        </svg>
        <div className="flex w-full items-center whitespace-nowrap">
          {weather.map((series) => (
            <div className="flex-1 text-center" key={series.dt}>
              <p>{format(fromUnixTime(series.dt), "HH:mm")}</p>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

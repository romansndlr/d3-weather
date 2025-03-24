import * as d3 from "d3";
import { motion } from "motion/react";
import type { ForecastItem } from "../types";

const margin = { top: 20, right: 30, bottom: 20, left: 40 };

export function Precipitation({
  weather,
  width,
  height,
}: { weather: ForecastItem[]; width: number; height: number }) {
  const xScale = d3
    .scaleBand()
    .domain(weather.map((d) => d.dt.toFixed()))
    .range([0, width])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...weather.map((d) => d.pop)) + 0.2])
    .range([height, 0]);

  return (
    <svg width={width} height={height} aria-hidden="true">
      <defs>
        <linearGradient id="pop" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--color-blue-500)"
            stopOpacity="0.6"
          />
          <stop
            offset="100%"
            stopOpacity="0"
            stopColor="var(--color-blue-300)"
          />
        </linearGradient>
      </defs>
      {weather.map((point) => {
        const rawX = xScale(point.dt.toFixed());

        return (
          rawX && (
            <motion.text
              key={point.dt}
              x={rawX + xScale.bandwidth() / 2}
              y={yScale(point.pop) - 5}
              textAnchor="middle"
              dominantBaseline="text-after-edge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {point.pop * 100}%
            </motion.text>
          )
        );
      })}
      {weather.map((d) => (
        <motion.rect
          key={d.dt}
          x={xScale(d.dt.toFixed())}
          initial={{ y: height }}
          animate={{ y: yScale(d.pop) }}
          width={xScale.bandwidth()}
          height={height - yScale(d.pop)}
          transition={{ duration: 0.4, ease: "easeInOut", type: "tween" }}
          fill="url(#pop)"
          rx={4}
        />
      ))}
    </svg>
  );
}

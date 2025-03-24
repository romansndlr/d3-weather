import * as d3 from "d3";
import type { ForecastItem } from "../types";

export function Wind({
  weather,
  width,
  height,
}: { weather: ForecastItem[]; width: number; height: number }) {
  const lineXScale = d3
    .scaleTime()
    .domain([weather[0].dt, weather[weather.length - 1].dt])
    .range([0, width]);

  const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

  const lineGenerator = d3
    .line<ForecastItem>()
    .curve(d3.curveMonotoneX)
    .x((d) => lineXScale(d.dt))
    .y((d) => yScale(d.wind.speed));

  const line = lineGenerator(weather);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {line && (
        <path
          d={line}
          fill="none"
          stroke="var(--color-violet-400)"
          strokeWidth={2}
        />
      )}
      {weather.map((d) => (
        <g
          key={d.dt}
          transform={`translate(${lineXScale(d.dt)}, ${yScale(d.wind.speed) - 10})`}
        >
          <g
            fill="var(--color-violet-500)"
            transform={`rotate(${d.wind.deg - 180}, 15, 10)`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.95595 10.5206C1.96186 9.44368 2.83969 8.57544 3.91663 8.58136L22.1993 8.68179L18.6879 5.26301C17.9162 4.51173 17.8998 3.27717 18.651 2.50554C19.4023 1.73391 20.6369 1.71741 21.4085 2.46868L28.385 9.26117C28.7647 9.63085 28.9776 10.1391 28.9747 10.6691C28.9718 11.199 28.7533 11.7049 28.3696 12.0704L21.3188 18.7855C20.539 19.5282 19.3047 19.4982 18.5619 18.7183C17.8192 17.9384 17.8493 16.7041 18.6291 15.9614L22.1777 12.5817L3.89521 12.4813C2.81827 12.4754 1.95003 11.5976 1.95595 10.5206Z"
            />
            <path
              d="M3.91938 8.08136C2.5663 8.07393 1.46339 9.16479 1.45595 10.5179C1.44852 11.8709 2.53938 12.9739 3.89246 12.9813L20.9349 13.0749L18.2843 15.5993C17.3045 16.5325 17.2667 18.0833 18.1999 19.0631C19.133 20.0429 20.6838 20.0808 21.6637 19.1476L28.7144 12.4325C29.1965 11.9733 29.471 11.3376 29.4747 10.6718L28.9747 10.6691L29.4747 10.6718C29.4783 10.006 29.2109 9.36739 28.7338 8.90292L21.7573 2.11044C20.7878 1.16652 19.2367 1.18726 18.2928 2.15674C17.3489 3.12623 17.3696 4.67734 18.3391 5.62126L20.962 8.17499L3.91938 8.08136Z"
              stroke="var(--color-violet-900)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

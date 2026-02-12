/**
 * Radar chart showing the aesthetic DNA of the searched brand.
 * Uses recharts' RadarChart for the visualization.
 */

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { AestheticScores } from '../types/index';

interface StyleProfileProps {
  brandName: string;
  scores: AestheticScores;
}

/** Convert the scores object into the array format recharts expects */
function toChartData(scores: AestheticScores) {
  return [
    { axis: 'Minimalism', value: scores.minimalism },
    { axis: 'Streetwear', value: scores.streetwear },
    { axis: 'Avant-Garde', value: scores.avantGarde },
    { axis: 'Luxury', value: scores.luxury },
    { axis: 'Heritage', value: scores.heritage },
    { axis: 'Contemporary', value: scores.contemporary },
  ];
}

export function StyleProfile({ brandName, scores }: StyleProfileProps) {
  const data = toChartData(scores);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="heading text-lg text-stone-900 dark:text-stone-100 mb-1">
        Style DNA
      </h3>
      <p className="text-sm text-stone-400 dark:text-neutral-500 mb-4">
        Aesthetic profile for {brandName}
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid
              stroke="currentColor"
              className="text-stone-200 dark:text-neutral-700"
            />
            <PolarAngleAxis
              dataKey="axis"
              tick={{
                fontSize: 11,
                fill: 'currentColor',
              }}
              className="text-stone-500 dark:text-stone-400"
            />
            <Radar
              dataKey="value"
              stroke="oklch(0.72 0.11 55)"
              fill="oklch(0.72 0.11 55)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

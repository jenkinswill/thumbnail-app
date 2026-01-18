import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

type TrendDirection = 'up' | 'down';

interface YoutubeThumbnailImpactProps {
  cardImage?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  beforePrice?: string;
  changePercent?: string;
  timeframe?: string;
  trend?: TrendDirection;
}

const spikeUpData = [12, 20, 14, 35, 22, 60, 30, 78, 42, 92, 98].map((value, index) => ({
  time: index,
  value,
}));

const spikeDownData = [92, 78, 88, 60, 72, 38, 55, 32, 48, 16, 6].map((value, index) => ({
  time: index,
  value,
}));

type ImpactTheme = {
  accent: string;
  accentBright: string;
  accentSoft: string;
  accentGlow: string;
  background: string;
  percentGlow: string;
};

const impactTheme: Record<TrendDirection, ImpactTheme> = {
  up: {
    accent: '#39ff7a',
    accentBright: '#18d85c',
    accentSoft: 'rgba(12, 59, 31, 0.8)',
    accentGlow: 'rgba(57, 255, 122, 0.45)',
    background: 'linear-gradient(135deg, #050807 0%, #0b1411 45%, #050807 100%)',
    percentGlow: '0 0 30px rgba(57, 255, 122, 0.7)',
  },
  down: {
    accent: '#ff4b4b',
    accentBright: '#ff2d2d',
    accentSoft: 'rgba(82, 16, 16, 0.8)',
    accentGlow: 'rgba(255, 75, 75, 0.45)',
    background: 'linear-gradient(135deg, #080505 0%, #160a0a 45%, #080505 100%)',
    percentGlow: '0 0 30px rgba(255, 75, 75, 0.7)',
  },
};

export function YoutubeThumbnailImpact({
  cardImage = 'https://images.unsplash.com/photo-1606502281004-f86cf1282af5?w=400&h=600&fit=crop',
  title = 'UP 362%',
  subtitle = "DON'T MISS THIS",
  price = '$462',
  beforePrice = '$100',
  changePercent = '362',
  timeframe = 'IN 7 DAYS',
  trend = 'up',
}: YoutubeThumbnailImpactProps) {
  const theme = impactTheme[trend];
  const ArrowIcon = trend === 'down' ? ArrowDown : ArrowUp;
  const chartData = trend === 'down' ? spikeDownData : spikeUpData;
  const normalizedChange = changePercent.trim().replace(/^[+-]/, '').replace(/%/g, '') || '0';
  const changeText = `${trend === 'down' ? '-' : '+'}${normalizedChange}%`;

  return (
    <div
      className="relative w-[1280px] h-[720px] overflow-hidden"
      style={{ background: theme.background }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute -top-[20%] left-[-10%] w-[650px] h-[650px] rounded-full blur-[160px] opacity-70"
          style={{ background: theme.accentGlow }}
        ></div>
        <div
          className="absolute bottom-[-30%] right-[-10%] w-[520px] h-[520px] rounded-full blur-[140px] opacity-60"
          style={{ background: theme.accentGlow }}
        ></div>
      </div>

      <div className="absolute top-12 left-10 w-[640px] h-[300px] opacity-90">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`impactGradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.accent} stopOpacity={0.65} />
                <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide={true} />
            <YAxis hide={true} domain={[0, 100]} />
            <Area
              type="linear"
              dataKey="value"
              stroke={theme.accent}
              strokeWidth={7}
              fill={`url(#impactGradient-${trend})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative z-10 flex h-full">
        <div className="flex-1 flex flex-col justify-center pl-12 pr-6">
          <div
            className="flex flex-col gap-4"
            style={{ transform: 'scale(1.18)', transformOrigin: 'left center' }}
          >
            <div className="flex items-center gap-4">
              <ArrowIcon className="w-28 h-28" style={{ color: theme.accent, strokeWidth: 5 }} />
              <div
                style={{
                  fontSize: '110px',
                  color: theme.accent,
                  fontWeight: '900',
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1,
                  textShadow: `0 10px 24px rgba(0, 0, 0, 0.75), ${theme.percentGlow}`,
                }}
              >
                {changeText}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="px-5 py-3 rounded-xl"
                style={{
                  backgroundColor: '#f9f9f9',
                  color: '#111',
                  fontWeight: '900',
                  fontFamily: 'var(--font-display)',
                  fontSize: '30px',
                  boxShadow: `0 12px 22px rgba(0, 0, 0, 0.6), 0 0 18px ${theme.accentGlow}`,
                }}
              >
                {beforePrice}
              </div>
              <ArrowRight className="w-12 h-12" style={{ color: theme.accent, strokeWidth: 5 }} />
              <div
                className="px-5 py-3 rounded-xl"
                style={{
                  backgroundColor: theme.accent,
                  color: '#061008',
                  fontWeight: '900',
                  fontFamily: 'var(--font-display)',
                  fontSize: '34px',
                  boxShadow: `0 12px 22px rgba(0, 0, 0, 0.6), 0 0 28px ${theme.accentGlow}`,
                }}
              >
                {price}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[520px] flex items-center justify-center pr-10">
          <div
            className="relative"
            style={{
              transform: 'rotate(-6deg) scale(1.1)',
              transformOrigin: 'center',
            }}
          >
            <div
              className="absolute inset-0 rounded-[32px]"
              style={{
                border: '10px solid rgba(255, 255, 255, 0.95)',
                boxShadow: `0 0 40px ${theme.accentGlow}, 0 30px 80px rgba(0, 0, 0, 0.8)`,
                transform: 'scale(1.03)',
              }}
            ></div>
            <div
              className="relative rounded-[28px] overflow-hidden"
              style={{
                border: '8px solid rgba(255, 255, 255, 0.95)',
              }}
            >
              <img
                src={cardImage}
                alt="Pokemon Card"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                style={{
                  width: '460px',
                  height: '660px',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

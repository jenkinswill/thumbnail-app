import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

type TrendDirection = 'up' | 'down';

interface YoutubeThumbnailProps {
  cardImage?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  changePercent?: string;
  timeframe?: string;
  trend?: TrendDirection;
}

const upChartData = [20, 22, 19, 25, 23, 28, 32, 45, 55, 72, 95].map((value, index) => ({
  time: index,
  value,
}));

const downChartData = [95, 88, 82, 76, 69, 63, 58, 50, 42, 33, 22].map((value, index) => ({
  time: index,
  value,
}));

const trendTheme: Record<TrendDirection, {
  accent: string;
  accentLight: string;
  accentSoft: string;
  accentShadow: string;
  accentGlow: string;
  background: string;
  badgeText: string;
  trendLabel: string;
}> = {
  up: {
    accent: '#aa781d',
    accentLight: '#eed093',
    accentSoft: '#4c402b',
    accentShadow: 'rgba(170, 120, 29, 0.6)',
    accentGlow: 'rgba(238, 208, 147, 0.3)',
    background: 'linear-gradient(145deg, #070707 0%, #131312 50%, #0a0a0a 100%)',
    badgeText: 'PRICE ALERT',
    trendLabel: 'RISING FAST',
  },
  down: {
    accent: '#b42318',
    accentLight: '#ffb4a2',
    accentSoft: '#5f1b15',
    accentShadow: 'rgba(180, 35, 24, 0.6)',
    accentGlow: 'rgba(255, 180, 162, 0.35)',
    background: 'linear-gradient(145deg, #0b0505 0%, #170c0c 50%, #090505 100%)',
    badgeText: 'PRICE DROP',
    trendLabel: 'DROPPING FAST',
  },
};

export function YoutubeThumbnail({
  cardImage = 'https://images.unsplash.com/photo-1606502281004-f86cf1282af5?w=400&h=600&fit=crop',
  title = 'WEEKLY PRICE SHOCK',
  subtitle = 'POKEMON CARD WATCH',
  price = '$1,250',
  changePercent = '375',
  timeframe = 'IN 7 DAYS',
  trend = 'up',
}: YoutubeThumbnailProps) {
  const theme = trendTheme[trend];
  const ArrowIcon = trend === 'down' ? ArrowDown : ArrowUp;
  const chartData = trend === 'down' ? downChartData : upChartData;
  const referenceLineValue = trend === 'down' ? 80 : 20;
  const normalizedChange = changePercent.trim().replace(/^[+-]/, '').replace(/%/g, '') || '0';
  const changeText = `${trend === 'down' ? '-' : '+'}${normalizedChange}%`;

  return (
    <div
      className="relative w-[1280px] h-[720px] overflow-hidden"
      style={{ background: theme.background }}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }}
        ></div>
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
          style={{ background: `radial-gradient(circle, ${theme.accentLight} 0%, transparent 70%)` }}
        ></div>
        <div
          className="absolute top-[20%] right-[35%] w-[200px] h-[200px] rounded-full opacity-30 blur-[60px]"
          style={{
            background: `radial-gradient(circle, ${theme.accentLight} 0%, transparent 60%)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        ></div>
      </div>

      <div className="relative z-10 flex h-full gap-8 p-12">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center gap-2 px-6 py-4 rounded-full border-[3px] shadow-2xl animate-pulse"
              style={{
                backgroundColor: '#131312',
                borderColor: theme.accent,
                boxShadow: `0 0 40px ${theme.accentShadow}, 0 0 80px ${theme.accentGlow}`,
              }}
            >
              <AlertCircle className="w-8 h-8" style={{ color: theme.accentLight }} />
              <span
                className="tracking-wider"
                style={{
                  color: theme.accentLight,
                  fontSize: '24px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: '900',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {theme.badgeText}
              </span>
            </div>
          </div>

          <div className="relative mb-6">
            <div
              className="absolute top-0 left-0 z-10 px-8 py-5 rounded-xl"
              style={{
                backgroundColor: theme.accent,
                border: `3px solid ${theme.accentLight}`,
                boxShadow: `0 12px 40px ${theme.accentShadow}, 0 0 60px ${theme.accentGlow}`,
              }}
            >
              <div className="flex items-center gap-3">
                <ArrowIcon className="w-10 h-10" style={{ color: '#f9f9f9', strokeWidth: 4 }} />
                <div>
                  <div
                    style={{
                      fontSize: '40px',
                      color: '#f9f9f9',
                      fontWeight: '900',
                      fontFamily: 'var(--font-display)',
                      lineHeight: 1,
                    }}
                  >
                    {changeText}
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#f9f9f9',
                      fontWeight: '800',
                      marginTop: '2px',
                      fontFamily: 'var(--font-body)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {timeframe}
                  </div>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`chartGradient-${trend}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.accentLight} stopOpacity={0.6} />
                    <stop offset="50%" stopColor={theme.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
                  </linearGradient>
                  <filter id={`glow-${trend}`}>
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <XAxis dataKey="time" hide={true} />
                <YAxis hide={true} domain={[0, 100]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.accentLight}
                  strokeWidth={4}
                  fill={`url(#chartGradient-${trend})`}
                  filter={`url(#glow-${trend})`}
                />
                <ReferenceLine
                  y={referenceLineValue}
                  stroke={theme.accentSoft}
                  strokeDasharray="6 6"
                  strokeWidth={2}
                  opacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <div
                style={{
                  fontSize: '52px',
                  color: '#f9f9f9',
                  fontWeight: '900',
                  fontFamily: 'var(--font-display)',
                  lineHeight: '1.1',
                  textShadow: `0 4px 12px rgba(0, 0, 0, 0.9), 0 0 20px ${theme.accentGlow}`,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  style={{
                    fontSize: '28px',
                    color: theme.accentLight,
                    fontWeight: '900',
                    fontFamily: 'var(--font-display)',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {subtitle}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[420px] flex items-center justify-center">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl blur-3xl opacity-70 animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentLight} 100%)`,
                transform: 'scale(1.15)',
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-50"
              style={{
                background: `radial-gradient(circle, ${theme.accentLight} 0%, transparent 70%)`,
                transform: 'scale(1.2)',
              }}
            ></div>

            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{
                border: `5px solid ${theme.accent}`,
                boxShadow: `0 25px 80px rgba(0, 0, 0, 0.9), 0 0 60px ${theme.accentShadow}, inset 0 0 20px ${theme.accentGlow}`,
              }}
            >
              <img
                src={cardImage}
                alt="Pokemon Card"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-auto"
                style={{
                  width: '400px',
                  height: '560px',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div
              className="absolute -top-8 -left-8 px-10 py-6 rounded-2xl -rotate-6 shadow-2xl"
              style={{
                backgroundColor: theme.accent,
                border: `4px solid ${theme.accentLight}`,
                boxShadow: `0 12px 40px rgba(0, 0, 0, 0.95), 0 0 60px ${theme.accentGlow}`,
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  color: '#f9f9f9',
                  fontWeight: '900',
                  fontFamily: 'var(--font-display)',
                  lineHeight: '1',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                }}
              >
                {price}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowIcon className="w-5 h-5" style={{ color: '#f9f9f9', strokeWidth: 4 }} />
                <span
                  style={{
                    fontSize: '16px',
                    color: '#f9f9f9',
                    fontWeight: '800',
                    fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {theme.trendLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{
          background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accentLight} 30%, ${theme.accent} 50%, ${theme.accentLight} 70%, ${theme.accent} 100%)`,
          boxShadow: `0 0 20px ${theme.accentGlow}`,
        }}
      ></div>
    </div>
  );
}

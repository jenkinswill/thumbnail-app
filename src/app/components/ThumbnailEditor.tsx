import React, { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { YoutubeThumbnail } from './YoutubeThumbnail';
import { Upload, Download, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

type TrendDirection = 'up' | 'down';

type TrendPalette = {
  accent: string;
  accentSoft: string;
  accentLight: string;
};

const trendPalette: Record<TrendDirection, TrendPalette> = {
  up: {
    accent: '#aa781d',
    accentSoft: '#4c402b',
    accentLight: '#eed093',
  },
  down: {
    accent: '#b42318',
    accentSoft: '#5f1b15',
    accentLight: '#ffb4a2',
  },
};

const isDataUrl = (value: string) => value.startsWith('data:') || value.startsWith('blob:');
const isRemoteUrl = (value: string) => /^https?:\/\//i.test(value);
const isProxyUrl = (value: string) =>
  value.includes('images.weserv.nl/?url=') || value.includes('wsrv.nl/?url=');

const buildProxyUrl = (value: string) => {
  const stripped = value.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}`;
};

export function ThumbnailEditor() {
  const [trend, setTrend] = useState<TrendDirection>('up');
  const [cardImage, setCardImage] = useState(
    'https://images.unsplash.com/photo-1606502281004-f86cf1282af5?w=400&h=600&fit=crop'
  );
  const [title, setTitle] = useState('WEEKLY PRICE SHOCK');
  const [subtitle, setSubtitle] = useState('POKEMON CARD WATCH');
  const [price, setPrice] = useState('$1,250');
  const [changePercent, setChangePercent] = useState('375');
  const [timeframe, setTimeframe] = useState('IN 7 DAYS');
  const [useProxy, setUseProxy] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const currentPalette = trendPalette[trend];

  const displayCardImage = useMemo(() => {
    const trimmed = cardImage.trim();
    if (!trimmed) {
      return trimmed;
    }
    if (!useProxy || isDataUrl(trimmed) || isProxyUrl(trimmed)) {
      return trimmed;
    }
    if (isRemoteUrl(trimmed)) {
      return buildProxyUrl(trimmed);
    }
    return trimmed;
  }, [cardImage, useProxy]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCardImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadThumbnail = async () => {
    if (!previewRef.current || isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 1,
        width: 1280,
        height: 720,
      });

      const link = document.createElement('a');
      link.download = `pokemon-thumbnail-${trend}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Thumbnail export failed', error);
      alert('Download failed. Enable the image proxy or upload the image instead of using a URL.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setTrend('up');
    setCardImage('https://images.unsplash.com/photo-1606502281004-f86cf1282af5?w=400&h=600&fit=crop');
    setTitle('WEEKLY PRICE SHOCK');
    setSubtitle('POKEMON CARD WATCH');
    setPrice('$1,250');
    setChangePercent('375');
    setTimeframe('IN 7 DAYS');
    setUseProxy(true);
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1
            className="mb-2"
            style={{
              fontSize: '48px',
              color: '#eed093',
              fontWeight: '900',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
            }}
          >
            Weekly Pokemon Price Thumbnail Studio
          </h1>
          <p style={{ fontSize: '18px', color: '#f9f9f9', opacity: 0.7 }}>
            Craft click-through-ready thumbnails for price spikes and drops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Pokemon Card Image
            </label>
            <label
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all hover:opacity-80"
              style={{ backgroundColor: currentPalette.accent, color: '#f9f9f9' }}
            >
              <Upload className="w-5 h-5" />
              <span style={{ fontWeight: '600' }}>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <div className="mt-4">
              <input
                type="text"
                value={cardImage}
                onChange={(e) => setCardImage(e.target.value)}
                placeholder="Or paste image URL..."
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: '#262524',
                  border: '1px solid #4c402b',
                  color: '#f9f9f9',
                }}
              />
              <label
                className="mt-3 flex items-center gap-2 text-xs"
                style={{ color: '#f9f9f9', opacity: 0.75 }}
              >
                <input
                  type="checkbox"
                  checked={useProxy}
                  onChange={(e) => setUseProxy(e.target.checked)}
                />
                Use image proxy for URL images (recommended for downloads).
              </label>
              <p className="mt-2 text-xs" style={{ color: '#f9f9f9', opacity: 0.6 }}>
                Uploading a file avoids CORS issues during download.
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Main Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                backgroundColor: '#262524',
                border: '2px solid #4c402b',
                color: '#f9f9f9',
                fontSize: '16px',
                fontWeight: '600',
              }}
            />
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                backgroundColor: '#262524',
                border: '2px solid #4c402b',
                color: '#f9f9f9',
                fontSize: '16px',
                fontWeight: '600',
              }}
            />
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Trend Direction
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTrend('up')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: trend === 'up' ? trendPalette.up.accent : '#262524',
                  border: `2px solid ${trend === 'up' ? trendPalette.up.accentLight : trendPalette.up.accentSoft}`,
                  color: '#f9f9f9',
                  fontWeight: '600',
                }}
              >
                <ArrowUp className="w-4 h-4" />
                Price Up
              </button>
              <button
                type="button"
                onClick={() => setTrend('down')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: trend === 'down' ? trendPalette.down.accent : '#262524',
                  border: `2px solid ${trend === 'down' ? trendPalette.down.accentLight : trendPalette.down.accentSoft}`,
                  color: '#f9f9f9',
                  fontWeight: '600',
                }}
              >
                <ArrowDown className="w-4 h-4" />
                Price Down
              </button>
            </div>
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Price Tag
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                backgroundColor: '#262524',
                border: '2px solid #4c402b',
                color: '#f9f9f9',
                fontSize: '16px',
                fontWeight: '600',
              }}
            />
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Change Percent
            </label>
            <input
              type="text"
              value={changePercent}
              onChange={(e) => setChangePercent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                backgroundColor: '#262524',
                border: '2px solid #4c402b',
                color: '#f9f9f9',
                fontSize: '16px',
                fontWeight: '600',
              }}
            />
            <p className="mt-2 text-xs" style={{ color: '#f9f9f9', opacity: 0.6 }}>
              Enter the number without the plus or minus sign.
            </p>
          </div>

          <div
            className="p-6 rounded-xl"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-3" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Timeframe Text
            </label>
            <input
              type="text"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-4 py-3 rounded-lg"
              style={{
                backgroundColor: '#262524',
                border: '2px solid #4c402b',
                color: '#f9f9f9',
                fontSize: '16px',
                fontWeight: '600',
              }}
            />
          </div>

          <div
            className="p-6 rounded-xl flex flex-col gap-3"
            style={{
              backgroundColor: '#131312',
              border: '2px solid #4c402b',
            }}
          >
            <label className="block mb-1" style={{ color: '#eed093', fontSize: '16px', fontWeight: '700' }}>
              Actions
            </label>
            <button
              onClick={downloadThumbnail}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all hover:opacity-80"
              style={{ backgroundColor: currentPalette.accent, color: '#f9f9f9', fontWeight: '600' }}
              disabled={isDownloading}
            >
              <Download className="w-5 h-5" />
              {isDownloading ? 'Preparing...' : 'Download'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: '#262524',
                border: '2px solid #4c402b',
                color: '#f9f9f9',
                fontWeight: '600',
              }}
            >
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: '#131312',
            border: '3px solid #4c402b',
          }}
        >
          <div className="mb-6">
            <h2 style={{ fontSize: '24px', color: '#eed093', fontWeight: '800' }}>
              Preview (1280 x 720)
            </h2>
            <p style={{ fontSize: '14px', color: '#f9f9f9', opacity: 0.6, marginTop: '4px' }}>
              This is the exact export size for YouTube thumbnails.
            </p>
          </div>

          <div className="flex justify-center">
            <div
              className="inline-block rounded-xl overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 20px 60px ${currentPalette.accentSoft}` }}
            >
              <div ref={previewRef}>
                <YoutubeThumbnail
                  cardImage={displayCardImage}
                  title={title}
                  subtitle={subtitle}
                  price={price}
                  changePercent={changePercent}
                  timeframe={timeframe}
                  trend={trend}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-8 p-6 rounded-xl"
          style={{
            backgroundColor: '#131312',
            border: '2px solid #4c402b',
          }}
        >
          <h3 className="mb-4" style={{ fontSize: '20px', color: '#eed093', fontWeight: '700' }}>
            Tips for High-CTR Thumbnails
          </h3>
          <ul className="space-y-2" style={{ color: '#f9f9f9', opacity: 0.8 }}>
            <li>Use high-quality Pokemon card images (400 x 600 or larger).</li>
            <li>Keep titles short and bold (3-5 words reads best).</li>
            <li>Match the change percent to the biggest weekly move.</li>
            <li>Test readability at small size before publishing.</li>
            <li>Export as PNG for crisp text and gradients.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

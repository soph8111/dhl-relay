import { useEffect, useState } from 'react';
import { useEventStats } from '../hooks/useEventStats';
import { formatSeconds } from '@dhl-relay/shared';
import { StatCard } from './StatCard';
import type { SanityClient } from '@sanity/client';

interface StatsCarouselProps {
  client: SanityClient;
}

const AUTO_ADVANCE_MS = 5000;

interface Track {
  slides: { value: string; label: string; sublabel?: string; unit?: string }[];
  variant?: 'horizontal' | 'vertical';
}

function CarouselTrack({
  slides,
  variant,
  activeSlide,
}: {
  slides: Track['slides'];
  variant?: 'horizontal' | 'vertical';
  activeSlide: number;
}) {
  const count = slides.length;
  const [override, setOverride] = useState<number | null>(null);

  useEffect(() => {
    setOverride(null);
  }, [activeSlide]);

  const displayedSlide = override ?? activeSlide;

  return (
    <div className="bg-surface rounded-xl h-50 py-5 flex flex-col overflow-hidden md:h-35 md:w-63 md:py-3">
      <div className="overflow-hidden flex-1">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: `${count * 100}%`,
            transform: `translateX(-${(displayedSlide * 100) / count}%)`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex items-center justify-center"
              style={{ width: `${100 / count}%` }}
            >
              <StatCard
                variant={variant}
                value={slide.value}
                label={slide.label}
                sublabel={slide.sublabel}
                unit={slide.unit}
              />
            </div>
          ))}
        </div>
      </div>
      <Dots count={count} active={displayedSlide} onSelect={setOverride} />
    </div>
  );
}

function Dots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Vis side ${i + 1}`}
          className={`w-2 h-2 rounded-full transition-colors ${
            i === active ? 'bg-surface-content' : 'bg-surface-content-muted'
          }`}
        />
      ))}
    </div>
  );
}

export function StatsCarousel({ client }: StatsCarouselProps) {
  const { stats, loading } = useEventStats(client);
  const [activeSlide, setActiveSlide] = useState(0);

  const topSlides = !stats
    ? []
    : [
        {
          value: String(stats.beatsReferenceCount),
          label: 'Dwarf runners',
          sublabel: 'have earned a day off',
        },
        {
          value: String(stats.finishedCount),
          label: `Out of ${stats.totalCount}`,
          sublabel: 'have crossed the finish line',
        },
        {
          value: String(stats.beatsCutoffCount),
          label: 'Dwarf runners',
          sublabel: 'have beat their cut-off time',
        },
      ];

  const bottomSlides = !stats
    ? []
    : [
        {
          value:
            stats.closestMissSeconds != null
              ? `+${formatSeconds(stats.closestMissSeconds)}`
              : '—',
          label: 'Closest miss',
        },
        {
          value:
            stats.averagePaceSecondsPerKm != null
              ? formatSeconds(stats.averagePaceSecondsPerKm)
              : '—',
          label: 'Dwarf Avg Pace',
          unit: '/km',
        },
        {
          value:
            stats.averageTimeSeconds != null
              ? formatSeconds(stats.averageTimeSeconds)
              : '—',
          label: 'Dwarf Avg Time',
          unit: '/km',
        },
      ];

  const slideCount = topSlides.length;

  useEffect(() => {
    if (slideCount === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [activeSlide, slideCount]);

  if (loading || !stats) return null;

  return (
    <div className="flex flex-col gap-3">
      <CarouselTrack
        slides={topSlides}
        variant="horizontal"
        activeSlide={activeSlide}
      />
      <CarouselTrack slides={bottomSlides} activeSlide={activeSlide} />
    </div>
  );
}

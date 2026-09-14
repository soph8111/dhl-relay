import type { ReactNode } from 'react';

interface RunnerProfileCardProps {
  name: string;
  imageUrl?: string;
  age?: number;
  gender?: string;
  teamName?: string;
  children?: ReactNode; // ekstra indhold, fx tid-felter på Finished-siden
}

export function RunnerProfileCard({
  name,
  imageUrl,
  age,
  gender,
  teamName,
  children,
}: RunnerProfileCardProps) {
  return (
    <div className="flex flex-col gap-6 text-center bg-surface rounded-3xl w-full p-8">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="w-20 h-20 rounded-full object-cover mx-auto"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-surface-content-muted/30 mx-auto" />
      )}

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold text-surface-content">{name}</h1>

        {age != null && gender && (
          <p className="text-surface-content-muted text-sm">
            Age {age} • {gender}
          </p>
        )}
        {teamName && <p className="text-surface-content">{teamName}</p>}
      </div>

      {children}
    </div>
  );
}

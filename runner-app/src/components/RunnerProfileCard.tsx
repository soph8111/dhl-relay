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
    <div className="flex flex-col gap-4 text-center bg-surface rounded-3xl w-full p-4">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="w-22 h-22 rounded-full object-cover mx-auto"
        />
      ) : (
        <div className="w-22 h-22 rounded-full bg-surface-content-muted/30 mx-auto" />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-surface-content">{name}</h1>

        {age != null && gender && (
          <p className="text-surface-content-muted text-sm capitalize">
            Age {age} • {gender}
          </p>
        )}
        {teamName && (
          <p className="text-surface-content capitalize">{teamName}</p>
        )}
      </div>

      {children}
    </div>
  );
}

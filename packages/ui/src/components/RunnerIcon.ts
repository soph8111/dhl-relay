import L from 'leaflet';

export function RunnerIcon(
  imageUrl: string,
  hasGpsError: boolean = false,
  name: string = '',
) {
  const initial = name.trim().charAt(0).toUpperCase();

  return L.divIcon({
    className: 'transition-transform duration-[3000ms] ease-linear',
    html: `
      <div class="relative w-6 h-6 group">
        <span class="animate-ping absolute -z-10 inset-0 rounded-full bg-accent opacity-70"></span>
        <div class="w-6 h-6 rounded-full border border-white shadow-lg overflow-hidden ${!imageUrl ? 'bg-gray-300' : ''}">
          ${
            imageUrl
              ? `<img src="${imageUrl}" class="w-full! h-full object-cover" />`
              : initial
                ? `<span class="w-full h-full flex items-center justify-center text-white text-sm font-medium leading-none">${initial}</span>`
                : ''
          }
        </div>
        ${
          name
            ? `<div class="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap bg-accent/60 text-accent-content text-xs px-2 py-1 rounded-md shadow-lg">${name}</div>`
            : ''
        }
        ${hasGpsError ? `<div class="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red border border-white flex items-center justify-center text-white text-2xs font-bold leading-none">!</div>` : ''}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

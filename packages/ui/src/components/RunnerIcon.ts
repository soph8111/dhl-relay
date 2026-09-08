import L from 'leaflet';

export function RunnerIcon(imageUrl: string, hasGpsError: boolean = false) {
  return L.divIcon({
    className: 'transition-transform duration-[8000ms] ease-linear',
    html: `
      <div class="relative w-6 h-6">
      ${!hasGpsError ? '<span class="animate-ping absolute -z-10 inset-0 rounded-full bg-accent opacity-80"></span>' : ''}
      <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg overflow-hidden ${!imageUrl ? 'bg-gray-300' : ''}">
      ${imageUrl ? `<img src="${imageUrl}" class="w-full! h-full object-cover" />` : ''}
      </div>
        ${hasGpsError ? `<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white flex items-center justify-center text-white text-2xs font-bold leading-none">!</div>` : ''}
      </div>
      
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

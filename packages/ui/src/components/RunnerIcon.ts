import L from 'leaflet';

export function RunnerIcon(imageUrl: string, hasGpsError: boolean = false) {
  return L.divIcon({
    className: '',
    html: `
      <div class="relative w-8 h-8">
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden ${!imageUrl ? 'bg-gray-300' : ''}">
          ${imageUrl ? `<img src="${imageUrl}" class="w-full h-full object-cover" />` : ''}
        </div>
        ${hasGpsError ? `<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white flex items-center justify-center text-white text-[10px] font-bold leading-none">!</div>` : ''}
      </div>
    `,
  });
}

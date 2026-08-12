import L from 'leaflet';

export function RunnerIcon(imageUrl: string) {
  return L.divIcon({
    className: '',
    html: `
      <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden ${!imageUrl ? 'bg-gray-300' : ''}">
        ${imageUrl ? `<img src="${imageUrl}" class="w-full h-full object-cover" />` : ''}
      </div>
    `,
  });
}

mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubnlzeiIsImEiOiJjbWg5czU5dzMwOW5iMmtwcDdzeWFwem1hIn0.V7sdPtla47boikpVDDyscA';

// helper: safe HTML escape, currency and date formatting
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatCurrency(value) {
    if (value === null || value === undefined || value === '') return 'n/a';
    const num = Number(String(value).replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(num)) return escapeHTML(String(value));
    return num.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatDate(value) {
    if (!value) return 'n/a';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return escapeHTML(String(value));
    return d.toLocaleDateString();
}

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/bennysz/cmhst1kvt00av01ss4dib7kje',
    center: [-122.27, 37.8], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

map.on('load', function() {
    map.addSource('points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/benjaminszeghy/bennyc183-webmap/main/data/amlis.geojson'
    });
    
    map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': '#4264FB',
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });
    
    map.on('click', 'points-layer', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const p = e.features[0].properties || {};

        // small accessor that tries common (full/truncated) keys
        const g = (keys) => {
            for (const k of (Array.isArray(keys) ? keys : [keys])) {
                if (p[k] !== undefined && p[k] !== null && String(p[k]).trim() !== '') return p[k];
            }
            return null;
        };

        const popupContent = `
            <div id="popup-content">
              <h3>${escapeHTML(g(['Problem_Area','roblem_Are']) || 'AML Site')}</h3>
              <p><strong>Location:</strong> ${escapeHTML(g(['County']) || 'n/a')}, ${escapeHTML(g(['State_Tribe_C_50','tate_Tribe_C_50']) || 'n/a')}</p>
              <p><strong>Problem:</strong> ${escapeHTML(g(['Problem_Typ','roblem_Typ']) || 'n/a')}</p>
              <p><strong>Priority:</strong> ${escapeHTML(g(['Problem_Pri','roblem_Pri']) || 'n/a')}</p>
              <p><strong>Mining Type:</strong> ${escapeHTML(g(['Mining_Type','ining_Type']) || 'n/a')}</p>
              <p><strong>Funding Source:</strong> ${escapeHTML(g(['Funding_Sou','unding_Sou']) || 'n/a')}</p>
              <p><strong>Unfunded Cost:</strong> ${formatCurrency(g(['Unfunded_Co','nfunded_Co']))}</p>
              <p><strong>Completed Cost:</strong> ${formatCurrency(g(['Completed_C','ompleted_C']))}</p>
              <p><strong>Date Prepared:</strong> ${formatDate(g(['Date_Prepared','ate_Prepar']))}</p>
              <p><strong>Date Revised:</strong> ${formatDate(g(['Date_Revised','ate_Revise']))}</p>
            </div>
        `;
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });
    
});
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
        data: 'https://raw.githubusercontent.com/benjaminszeghy/bennyc183-webmap/main/data/uranium_mines.geojson'
    });
    
    map.addLayer({
        id: 'points-layer',
        type: 'circle',
        source: 'points-data',
        paint: {
            'circle-color': '#CC2F00',
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
                <h3>${escapeHTML(g(['MINENAME','DB_ALIAS'])) || 'Uranium Site'}</h3>

                <p><strong>Location:</strong>
                ${escapeHTML(g(['COUNTY_NAM'])) || 'n/a'},
                ${escapeHTML(g(['STATE_NAME'])) || 'n/a'}
                ${g(['ZIPCODE']) ? `(${escapeHTML(g(['ZIPCODE']))})` : ''}</p>

                <p><strong>State/County FIPS:</strong>
                ${escapeHTML(g(['STATE_CODE'])) || '—'} /
                ${escapeHTML(g(['CNTY_FIPS'])) || '—'}</p>

                <p><strong>MILS ID:</strong> ${escapeHTML(g(['IDMILS'])) || '—'}</p>

                <p><strong>QA/QC:</strong>
                ${escapeHTML(g(['QAQC'])) || '—'}
                ${g(['QC_FLAG']) ? `• QC Flag: ${escapeHTML(g(['QC_FLAG']))}` : ''}</p>

                <p><strong>Status:</strong>
                ${(g(['RECLAIMED']) == 1 || g(['RECLAIMED']) === '1') ? 'Reclaimed' : 'Unreclaimed'}</p>

                <p><strong>Match:</strong>
                ${escapeHTML(g(['MATCHID'])) || '—'}
                ${g(['MATCHNAME']) ? `• ${escapeHTML(g(['MATCHNAME']))}` : ''}</p>

            </div>
        `;
        
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });
    
});
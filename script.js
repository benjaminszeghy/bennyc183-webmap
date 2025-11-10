mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubnlzeiIsImEiOiJjbWg5czU5dzMwOW5iMmtwcDdzeWFwem1hIn0.V7sdPtla47boikpVDDyscA';

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bennysz/cmhst1kvt00av01ss4dib7kje',
    center: [-98.5795, 39.8283],
    zoom: 3.5
});

map.on('load', function () {
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

    // --- Popups ---
    map.on('click', 'points-layer', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const p = e.features[0].properties || {};

        // accessor that tries common (full/truncated) keys
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

        new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo(map);
    });

    // --- Quick-zoom buttons for classic US uranium regions ---
    const AOIS = [
      { id: 'uravan',  label: 'Uravan (CO/UT)',       center: [-108.9, 38.7],  zoom: 8.2 },
      { id: 'grants',  label: 'Grants Belt (NM)',     center: [-107.85, 35.2], zoom: 8.0 },
      { id: 'powder',  label: 'Powder River (WY)',    center: [-106.7, 43.9],  zoom: 6.8 },
      { id: 'stx',     label: 'South Texas',          center: [-98.0, 28.5],   zoom: 7.2 },
      { id: 'azstrip', label: 'Arizona Strip',        center: [-112.5, 36.5],  zoom: 7.0 },
    ];

    // create a small button dock in the top-left of the map
    const dock = document.createElement('div');
    dock.className = 'map-dock';

    AOIS.forEach(aoi => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'map-dock-btn';
        btn.textContent = aoi.label;
        btn.onclick = () => map.flyTo({ center: aoi.center, zoom: aoi.zoom, essential: true });
        dock.appendChild(btn);
    });

    // attach dock to the map container
    map.getContainer().appendChild(dock);
});

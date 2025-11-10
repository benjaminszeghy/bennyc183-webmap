mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubnlzeiIsImEiOiJjbWg5czU5dzMwOW5iMmtwcDdzeWFwem1hIn0.V7sdPtla47boikpVDDyscA';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/bennysz/cmh9scj9v00bo01sqcmagbn0c',
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
  		const p = e.features[0].properties;

		const popupContent = `

			<div>
			  <h3>${p['roblem_Are'] || 'AML Site'}</h3>
			  <p><strong>Location:</strong> ${p['County'] || 'n/a'}, ${p['tate_Tribe_C_50'] || 'n/a'}</p>
			  <p><strong>Problem:</strong> ${p['roblem_Typ'] || 'n/a'}</p>
			  <p><strong>Priority:</strong> ${p['roblem_Pri'] || 'n/a'}</p>
			  <p><strong>Mining Type:</strong> ${p['ining_Type'] || 'n/a'}</p>
			  <p><strong>Funding Source:</strong> ${p['unding_Sou'] || 'n/a'}</p>
			  <p><strong>Unfunded Cost:</strong> ${p['nfunded_Co'] ?? 'n/a'}</p>
			  <p><strong>Completed Cost:</strong> ${p['ompleted_C'] ?? 'n/a'}</p>
			  <p><strong>Date Prepared:</strong> ${p['ate_Prepar'] ?? 'n/a'}</p>
			  <p><strong>Date Revised:</strong> ${p['ate_Revise'] ?? 'n/a'}</p>
			</div>

		`;
		
		new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);


    });
	
});
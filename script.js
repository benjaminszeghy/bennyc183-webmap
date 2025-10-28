mapboxgl.accessToken = 'pk.eyJ1IjoiYmVubnlzeiIsImEiOiJjbWg5czU5dzMwOW5iMmtwcDdzeWFwem1hIn0.V7sdPtla47boikpVDDyscA';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/bennysz/cmh9scj9v00bo01sqcmagbn0c',
    center: [-122.27, 37.8], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
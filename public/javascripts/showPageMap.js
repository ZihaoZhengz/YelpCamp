mapboxgl.accessToken = mapToken
const parsedCampground = JSON.parse(campground);
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: parsedCampground.geometry.coordinates, // starting position [lng, lat]
zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(parsedCampground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${parsedCampground.title}</h3><p>${parsedCampground.location}</p>`
            )
    )
    .addTo(map)
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());
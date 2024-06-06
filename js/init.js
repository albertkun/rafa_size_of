const MAPTILER_KEY = 'z37jJYOIqWw3eBn8jUWN';
class ButtonControl {
    constructor({text, title, eventHandler}) {
        this._text = text;
        this._title = title;
        this._eventHandler = eventHandler;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('button');
        this._container.className = 'maplibregl-ctrl';
        this._container.textContent = this._text;
        this._container.title = this._title;
        this._container.addEventListener('click', this._eventHandler);
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

// Load the rafah GeoJSON data
fetch('./rafah_on_ucla.geojson')
    .then(response => response.json())
    .then(rafahData => {
        let map = new maplibregl.Map({
            container: 'map', // container id
            style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
            center: [-118.445181, 34.068921], // UCLA coordinates [lng, lat]
            zoom: 10 // adjust zoom level as needed
        });

        // Add the controls after the map has loaded
        map.on('load', function () {
            // Add the "Zoom to UCLA" button
            map.addControl(new ButtonControl({
                text: 'Zoom to UCLA',
                title: 'Zoom to UCLA',
                eventHandler: () => map.jumpTo({center: [-118.445181, 34.068921], zoom: 10}) // UCLA coordinates
            }), 'top-right');

            // Add the "Zoom to Rafah" button
            map.addControl(new ButtonControl({
                text: 'Zoom to Rafah',
                title: 'Zoom to Rafah',
                eventHandler: () => map.jumpTo({center: [34.257889265753306, 31.248957571474392], zoom: 10}) // Rafah coordinates
            }), 'top-right');
        });

        map.on('load', function () {
            map.addSource('rafah', {
                'type': 'geojson',
                'data': rafahData
            });

            map.addLayer({
                'id': 'rafah-layer',
                'type': 'fill',
                'source': 'rafah',
                'layout': {},
                'paint': {
                    'fill-color': '#888888', // change this to the color you want
                    'fill-opacity': 0.4
                }
            });
			map.addLayer({
				'id': 'rafah-border',
				'type': 'line',
				'source': 'rafah',
				'layout': {},
				'paint': {
					'line-color': '#ff0000', // red color
					'line-width': 2
				}
			});
            fetch('./rafah_bigger.geojson')
                .then(response => response.json())
                .then(rafahBiggerData => {
                    map.addSource('rafahBigger', {
                        'type': 'geojson',
                        'data': rafahBiggerData
                    });

                    map.addLayer({
                        'id': 'rafahBigger-layer',
                        'type': 'fill',
                        'source': 'rafahBigger',
                        'layout': {},
                        'paint': {
                            'fill-color': '#888888', // change this to the color you want
                            'fill-opacity': 0.4
                        }
                    });
					map.addLayer({
						'id': 'rafahBigger-border',
						'type': 'line',
						'source': 'rafahBigger',
						'layout': {},
						'paint': {
							'line-color': '#ff0000', // red color
							'line-width': 2
						}});
						    // Add a legend
    class LegendControl {
        onAdd(map) {
            this._map = map;
            this._container = document.createElement('div');
            this._container.className = 'maplibregl-ctrl';
			this._container.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // semi-transparent white background
			this._container.style.padding = '10px';
			this._container.style.borderRadius = '5px';
			this._container.innerHTML = `
				<strong>Size of Rafah:</strong>
				<div style="display: flex; align-items: center; margin-top: 5px;">
					<div style="background: #888888; width: 20px; height: 20px; margin-right: 5px; opacity: 0.4;"></div>
					<span>Rafah</span>
				</div>
				<div style="display: flex; align-items: center; margin-top: 5px;">
					<div style="background: #ff0000; width: 20px; height: 2px; margin-right: 5px;"></div>
					<span>Border</span>
				</div>
			`;
            return this._container;
        }

        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
    }

    map.addControl(new LegendControl(), 'bottom-right');
                });
        });
    });


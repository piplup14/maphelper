'use strict'
function    create(target) {
    target.map_bounds = leaflet_bounds;
    target.map_redraw = leaflet_redraw;
    target.map_destroy = leaflet_destroy;
    target.map_count_pos = leaflet_count_pos;
        target.myMap = L.map(target.div, {
            center: [52.9650, 36.07849],
            zoom: 12
        });
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXNlcm5hbWUxMDI5IiwiYSI6ImNrenh0cmN4MTA0dnoycHBjbWZlZDN2aGYifQ.Z3tA9UJnm7gg6xMSN8pEJw', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(target.myMap);
        let placesPane = target.myMap.getPane('overlayPane');
        placesPane.appendChild(target.canvas);
        target.myMap.on('movestart',() => {target.redraw();});
    }

function    leaflet_redraw() {
        const test = document.querySelector('.leaflet-map-pane');
        let tr = getComputedStyle(test).getPropertyValue('transform');
        let values;
        values = tr.split('(')[1],
        values = values.split(')')[0],
        values = values.split(',');
        let matr = [values[4], values[5]];
        matr[0] = -(parseFloat(matr[0]));
        matr[1] = -(parseFloat(matr[1]));
        this.canvas.style.transform = "translate("+matr[0]+"px,"+matr[1]+"px)";
        
    }

    function    leaflet_count_pos(pos) {
        pos[0]=parseFloat(pos[0]);
        pos[1]=parseFloat(pos[1]);
        let state = this.myMap.latLngToContainerPoint([pos[0],pos[1]]);
        return ([state.x,state.y]);
    }

    function    leaflet_bounds() {
        let bounds = this.myMap.getBounds();
        return ([[bounds.getSouth(),bounds.getWest()],[bounds.getNorth(),bounds.getEast()]]);
    }
    function leaflet_destroy() {
        this.canvas.style.transform = "translate(0px,0px)";
        this.myMap.remove()
    }

export {create}
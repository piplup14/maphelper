'use strict'

function create (target) {
    target.map_bounds = yandex_bounds;
    target.map_redraw = yandex_redraw;
    target.map_destroy = yandex_destroy;
    target.map_count_pos = yandex_count_pos;
    target.wid = document.getElementById(target.div).offsetWidth;
    target.myMap = new ymaps.Map(target.div, {
        center: [52.9650800, 36.0784900],
        zoom: 12
    });
    let placesPane = target.myMap.panes.get('places').getElement();
    placesPane.appendChild(target.canvas);
    target.myMap.events.add('boundschange',() => {target.redraw();});
}

function yandex_redraw_prepare(target) {
    //target.leftCorn = target.leftCorn;
    console.log(target);
    let myMap = target.myMap;
    target.zoom = myMap.getZoom();
    target.projection = myMap.options.get('projection');
}

function yandex_redraw() {
    yandex_redraw_prepare(this);
    let myMap = this.myMap
    let newB = myMap.getBounds();
    let zoom = myMap.getZoom();
    this.leftCorn = myMap.converter.globalToPage(
        this.projection.toGlobalPixels(
            newB[1],
            zoom
        ));
}

function yandex_count_pos(pos) {
    let state = this.myMap.converter.globalToPage(
        this.projection.toGlobalPixels(
            pos,
            this.zoom
        ));
    state[0] = state[0]-(this.leftCorn[0]-this.wid);
    state[1] = state[1]-this.leftCorn[1];
    return (state);
}

function yandex_bounds() {
    return this.myMap.getBounds();
}

function yandex_destroy() {
    this.myMap.destroy();
}


export {create}
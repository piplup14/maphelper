'use strict'

function create_yandex (target, div) {
        target.wid = document.getElementById(div).offsetWidth;
        target.myMap = new ymaps.Map(div, {
            center: [52.9650800, 36.0784900],
            zoom: 12
        });
        let placesPane = target.myMap.panes.get('places').getElement();
        placesPane.appendChild(target.canvas);
        target.myMap.events.add('boundschange',() => {target.redraw();});
};

const yandex_redraw = () => {
    this.yandex_redraw_prepare();
    let myMap = this.myMap
    let newB = myMap.getBounds();
    let zoom = myMap.getZoom();
    this.leftCorn = myMap.converter.globalToPage(
        this.projection.toGlobalPixels(
            newB[1],
            zoom
        ));
};

const yandex_redraw_prepare =() =>{
    //this.leftCorn = this.leftCorn;
    let myMap = this.myMap;
    this.zoom = myMap.getZoom();
    this.projection = myMap.options.get('projection');
};

const yandex_count_pos=(pos) =>{
    let state = this.myMap.converter.globalToPage(
        this.projection.toGlobalPixels(
            pos,
            this.zoom
        ));
    state[0] = state[0]-(this.leftCorn[0]-this.wid);
    state[1] = state[1]-this.leftCorn[1];
    return (state);
};

const yandex_bounds=()  =>{
    return this.myMap.getBounds();
};

const hello = () =>{
    alert ('hello');
}
export {create_yandex,hello,yandex_redraw,yandex_redraw_prepare,yandex_count_pos}
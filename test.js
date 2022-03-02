 class UniversalMap {
    constructor(div,choise) {
        this.elementscount = 0;
        this.elements = new Map();
        this.elements.clear();
       
        const mapdiv = document.getElementById(div);
        

        this.canvas = document.createElement('canvas');
        
        this.app = new PIXI.Application({ width: mapdiv.offsetWidth, height: mapdiv.offsetHeight, backgroundAlpha: 0, view:this.canvas});
        this.canvas.id = 'canvas';
        this.container = new PIXI.Container();
        this['create_' + choise](div);
        this.choise = choise;
    }
//////////////////yandex

    create_yandex(div){
            this.wid = document.getElementById(div).offsetWidth;
            this.myMap = new ymaps.Map(div, {
                center: [52.9650800, 36.0784900],
                zoom: 12
            });
            let placesPane = this.myMap.panes.get('places').getElement();
            placesPane.appendChild(this.canvas);
            this.myMap.events.add('boundschange',() => {this.redraw();});
    }

    yandex_redraw = () => {
        this.yandex_redraw_prepare();
        let myMap = this.myMap
        let newB = myMap.getBounds();
        let zoom = myMap.getZoom();
        this.leftCorn = myMap.converter.globalToPage(
            this.projection.toGlobalPixels(
                newB[1],
                zoom
            ));
    }

    yandex_redraw_prepare(){
        //this.leftCorn = this.leftCorn;
        let myMap = this.myMap;
        this.zoom = myMap.getZoom();
        this.projection = myMap.options.get('projection');
    }

    yandex_count_pos(pos){
        let state = this.myMap.converter.globalToPage(
            this.projection.toGlobalPixels(
                pos,
                this.zoom
            ));
        state[0] = state[0]-(this.leftCorn[0]-this.wid);
        state[1] = state[1]-this.leftCorn[1];
        return (state);
    }
    
    yandex_bounds(){
        return this.myMap.getBounds();
    }
///////////////////////////
    

//////////////////leaflet

    create_leaflet(){
        this.myMap = L.map('map', {
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
        }).addTo(this.myMap);
        let placesPane = this.myMap.getPane('overlayPane');
        placesPane.appendChild(this.canvas);
        this.myMap.on('movestart',() => {this.redraw();});
    }

    leaflet_redraw(){
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

    leaflet_count_pos(pos){
        pos[0]=parseFloat(pos[0]);
        pos[1]=parseFloat(pos[1]);
        let state = this.myMap.latLngToContainerPoint([pos[0],pos[1]]);
        return ([state.x,state.y]);
    }

    leaflet_bounds(){
        let bounds = this.myMap.getBounds();
        return ([[bounds.getSouth(),bounds.getWest()],[bounds.getNorth(),bounds.getEast()]]);
    }
/////////////////////////

    destroy() {
        // remove from div and free all
        this.myMap.destroy(); 
    }

    update(id, settings){
        let elements = this.elements;
        let oldElement = elements.get(id);
        let cloneObject = Object.assign(oldElement,settings);
        this.elements.set(id,cloneObject);
        this.redraw();
    }
    redraw() {
        // full redraw all elements
        this[this.choise+'_redraw']();
        const app = this.app;
        app.stage.addChild(this.container);
        let elements = this.elements;
        console.log('redraw');
        const container = this.container;
        let i = 0;
        for (let [curKey, elFromEl] of elements) {
            let elFromCon = container.getChildAt(i);
            elFromCon.clear();
            i++;
            this['draw_' + elFromEl.shape](curKey, elFromEl, elFromCon);
            continue;
        }
    }
    
    draw_polygon(key, elFromEl, elFromCon){
        let startPoint = this[this.choise+'_count_pos'](elFromEl.place[0])
        elFromCon.lineStyle(5, elFromEl.pen);
        elFromCon.moveTo(startPoint[0], startPoint[1]);
        for (let z = 1;z<elFromEl.place.length;z++){
            let state = this[this.choise+'_count_pos'](elFromEl.place[z])
            elFromCon.lineTo(state[0], state[1]);
        }
        elFromCon.lineTo(startPoint[0], startPoint[1]);
        elFromCon.endFill();
    }

    draw_circle(key, elFromEl, elFromCon) {
        elFromCon.lineStyle(/*border width*/3,/*border color*/ elFromEl.pen, 1);
        let state = this[this.choise+'_count_pos'](elFromEl.place)
        elFromCon.drawCircle(state[0], state[1],elFromEl.radius)
        elFromCon.endFill();
    }


    draw_polyline(key, elFromEl, elFromCon) {
        elFromCon.lineStyle(5, elFromEl.pen);
        let state = this[this.choise+'_count_pos'](elFromEl.place[0])
        elFromCon.moveTo(state[0], state[1]);
        for (let z = 1;z<elFromEl.place.length;z++){
            state = this[this.choise+'_count_pos'](elFromEl.place[z])
            elFromCon.lineTo(state[0], state[1]);
        }
        elFromCon.endFill();
    }

    add(data) {
        this.elementscount++;
        console.log(data);
        this.elements.set(data.id, data);
        let graphcs = new PIXI.Graphics();
        this.container.addChild(graphcs);
    }
    clear() {
        this.elementscount = 0;
        this.elements.clear;
        for (var i = this.app.stage.children.length - 1; i >= 0; i--) {	this.app.stage.removeChild(this.app.stage.children[i]);}
    }
    get bounds() {
        let rez = this[this.choise+'_bounds']();
        return rez;
    }

}

/*
                    
*/


let map;
function test() {
    
    map.clear();
    /////////////adds
{

    //circle
    map.add({
        id: 1001,
        shape: 'circle',
        radius: 10,
        brush: '#666',
        pen: 'black',
        place: [52.9675, 36.0750]
    });
    map.add({
        id: 1004,
        shape: 'circle',
        radius: 10,
        brush: '#666',
        pen: 'black',
        place: [52.9885, 36.0000]
    });

    //polyline
    map.add({
        id: 1002,
        shape: 'polyline',
        pen: 'black',
        shadow: 'white',
        place: [[52.9597, 36.0825],[52.9602, 36.0849],[52.9623, 36.0838],[52.9621, 36.0828],[52.9637, 36.0801]]
    });
    
    //random circle

    //polygon
    map.add({
        id: 1003,
        shape: 'polygon',
        brush: '#666',
        pen: 'black',
        place: [[52.9772, 36.0609],[52.9651, 36.0667],[52.9614, 36.0556],[52.9665, 36.0481],[52.9759, 36.0424]]
    });
}
    /////////////
    //map.redraw();
    map.update(1001, {
        place: [52.9595, 36.0592]
    });
}
function ran(){
    let curbounds = map.bounds;
     map.add({
        id: 1005,
        shape: 'circle',
        radius: 10,
        brush: '#666',
        pen: 'black',
        place: [(Math.random() * (curbounds[1][0] - curbounds[0][0]) + curbounds[0][0]).toFixed(15),(Math.random() * (curbounds[1][1] - curbounds[0][1]) + curbounds[0][1]).toFixed(15)]
    });
}

function init() {
    map = new UniversalMap('map','leaflet');
    document.getElementById("destro").addEventListener('click',() => {map.destroy()});
    test();
    //map.redraw();
    setInterval(() => {  map.redraw();ran(); }, 1000);
}

ymaps.ready(init);

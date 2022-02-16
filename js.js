 class YandexMap {
    constructor(div) {
        // init on div
        this.myMap = new ymaps.Map(div, {
            center: [52.9650800, 36.0784900],
            zoom: 12
        });
        this.elementscount = 0;
        this.elements = new Map();
        var placesPane = this.myMap.panes.get('places').getElement();
        const mapdiv = document.getElementById(div);
        this.wid = mapdiv.offsetWidth;
        this.canvas = document.createElement('canvas');
        
        this.app = new PIXI.Application({ width: mapdiv.offsetWidth, height: mapdiv.offsetHeight, backgroundAlpha: 0, view:this.canvas});
        
            this.canvas.id = 'canvas';
            placesPane.appendChild(this.canvas);
            this.container = new PIXI.Container();
        
        this.myMap.events.add('boundschange',(e) => {this.redraw();});
        /*this.myMap.events.add('click',(e) => {
            const app = this.app;
            const container = this.container;
            console.log(container.getChildAt(0));
            console.log(container.getChildAt(1));
        });*/
    }
    destroy() {
        // remove from div and free all
        this.myMap.destroy(); 
    }
    redraw() {
        // full redraw all elements
        let myMap = this.myMap
        const projection = myMap.options.get('projection');
        let newB = myMap.getBounds();
        let zoom = myMap.getZoom();
        let leftCorn = myMap.converter.globalToPage(
        projection.toGlobalPixels(
            newB[1],
            zoom
        ));
        const app = this.app;
        
        
        //let elemLength = this.elements.size;
        
        app.stage.addChild(this.container);
        let elements = this.elements;
        const container = this.container;
        let i = 0;
        for (let curKey of elements.keys()) {
        //console.log( container.getChildAt(i),' ',i);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//TODO
                let elFromEl = elements.get(curKey);
                let elFromCon = container.getChildAt(i);
                elFromCon.clear();

                /*let place = myMap.converter.globalToPage(
                    projection.toGlobalPixels(
                        elFromEl.pos,
                        zoom
                    ));
                    let sprite = elFromEl.sprite;
                    sprite.x = place[0]-(leftCorn[0]-this.wid);
                    sprite.y = place[1] - leftCorn[1];
                    elFromCon = sprite;*/
                    //container.addChild(sprite);
                    i++;
                switch (elFromEl.shape){
                    case "polyline":
                        elFromCon.lineStyle(5, 'black');
                        let state = myMap.converter.globalToPage(
                            projection.toGlobalPixels(
                                elFromEl.place[0],
                                zoom
                            ));
                        elFromCon.moveTo(state[0], state[1]);
                        for (let z = 1;z<elFromEl.place.length;z++){
                            console.log(elFromEl.place[z]);
                            state = myMap.converter.globalToPage(
                            projection.toGlobalPixels(
                                elFromEl.place[z],
                                zoom
                            ));
                            console.log(state);
                            elFromCon.lineTo(state[0], state[1]);
                        }
                        elFromCon.endFill();
                    break;
                }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            };
            
    }
    add(data) {
        this.elementscount++;
        console.log(data);
        this.elements.set(data.id, data);
        console.log(this.elements);
        let graphcs = new PIXI.Graphics();
        this.container.addChild(graphcs);
        //this.redraw();
    }
    clear() {
        this.elementscount = 0;
        this.elements.clear;
        for (var i = this.app.stage.children.length - 1; i >= 0; i--) {	this.app.stage.removeChild(this.app.stage.children[i]);};
        //this.redraw();
        console.log('clear');
    }
    get bounds() {
        return this.myMap.getBounds();
    }
}


let map;
function test() {
map.clear();
let curbounds = map.bounds;
const texture = PIXI.Texture.from('./bunny.png');
/*for (let i = 0; i < 10; i++) {
    const bunny =  new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    map.add({ sprite: bunny,  pos: [(Math.random() * (curbounds[1][0] - curbounds[0][0]) + curbounds[0][0]).toFixed(15), (Math.random() * (curbounds[1][1] - curbounds[0][1]) + curbounds[0][1]).toFixed(15)]});
}*/
map.add({
    id: 1002,
    shape: 'polyline',
    pen: 'black',
    shadow: 'white',
    place: [[52.9597, 36.0825],[52.9602, 36.0849],[52.9623, 36.0838],[52.9621, 36.0828],[52.9637, 36.0801]]
});
map.redraw();
}

function init() {
map = new YandexMap('map');
document.getElementById("destro").addEventListener('click',() => {map.destroy()})
test()
//setInterval(test, 1000);
}

ymaps.ready(init);
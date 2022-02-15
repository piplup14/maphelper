 class Map {
    constructor(div) {
        // init on div
        this.myMap = new ymaps.Map(div, {
            center: [52.9650800, 36.0784900],
            zoom: 12
        });
        this.elements = [];
        this.elements.push([52.9650800, 36.0784900]);
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
        
        
        let elemLength = this.elements.length;
        
        app.stage.addChild(this.container);
        let elements = this.elements;
        const container = this.container;
            for(let i = 0;i<elemLength;i++) {
                console.log( container.getChildAt(i),' ',i);
                let elFromEl = elements[i];
                let elFromCon = container.getChildAt(i);

                let place = myMap.converter.globalToPage(
                    projection.toGlobalPixels(
                        elFromEl.pos,
                        zoom
                    ));
                    let sprite = elFromEl.sprite;
                    sprite.x = place[0]-(leftCorn[0]-this.wid);
                    sprite.y = place[1] - leftCorn[1];
                    elFromCon = sprite;
                    //container.addChild(sprite);
            };
            
    }
    add(data) {
        this.elements.push(data);
        this.container.addChild(data.sprite)
        this.redraw();
        
    }
    clear() {
        this.elements = [];
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
for (let i = 0; i < 10; i++) {
    const bunny =  new PIXI.Sprite(texture);
    bunny.anchor.set(0.5);
    map.add({ sprite: bunny,  pos: [(Math.random() * (curbounds[1][0] - curbounds[0][0]) + curbounds[0][0]).toFixed(15), (Math.random() * (curbounds[1][1] - curbounds[0][1]) + curbounds[0][1]).toFixed(15)]});
}
map.redraw();
}

function init() {
map = new Map('map');
document.getElementById("destro").addEventListener('click',() => {map.destroy()})
test()
//setInterval(test, 1000);
}

ymaps.ready(init);
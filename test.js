class UniversalMap {
    constructor(div) {
        this.elementscount = 0;
        this.elements = new Map();
        this.elements.clear();

        this.div = div;
        const mapdiv = document.getElementById(div);
        
        this.canvas = document.createElement('canvas');
        
        this.app = new PIXI.Application({ width: mapdiv.offsetWidth, height: mapdiv.offsetHeight, backgroundAlpha: 0, view:this.canvas});
        this.canvas.id = 'canvas';
        this.container = new PIXI.Container();
    }

    async init(choise) {
        let {create} = await import('./'+ choise + '_module.js');
        create(this);
    }

    destroy() {
        // remove from div and free all
        //this.myMap.destroy(); 
        this.map_destroy();
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
        // console.log(this);

        this.map_redraw();
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
        let startPoint = this.map_count_pos(elFromEl.place[0])
        elFromCon.lineStyle(5, elFromEl.pen);
        elFromCon.moveTo(startPoint[0], startPoint[1]);
        for (let z = 1;z<elFromEl.place.length;z++){
            let state = this.map_count_pos(elFromEl.place[z])
            elFromCon.lineTo(state[0], state[1]);
        }
        elFromCon.lineTo(startPoint[0], startPoint[1]);
        elFromCon.endFill();
    }

    draw_circle(key, elFromEl, elFromCon) {
        elFromCon.lineStyle(/*border width*/3,/*border color*/ elFromEl.pen, 1);
        let state = this.map_count_pos(elFromEl.place)
        elFromCon.drawCircle(state[0], state[1],elFromEl.radius)
        elFromCon.endFill();
    }


    draw_polyline(key, elFromEl, elFromCon) {
        elFromCon.lineStyle(5, elFromEl.pen);
        let state = this.map_count_pos(elFromEl.place[0])
        elFromCon.moveTo(state[0], state[1]);
        for (let z = 1;z<elFromEl.place.length;z++){
            state = this.map_count_pos(elFromEl.place[z])
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
        let rez = this.map_bounds();
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

    // if (map) map.destroy();
    //         map = new UniversalMap('map','leaflet');
    //         map.init().then(() => {
    //             test();
    //         });
            

    let i = 1;
    document.getElementById("changeMapY").onclick = () =>{
        if (i==0) {
            if (map) map.destroy();
            map.init('yandex').then(() => {
                test();
            });
            i=1;
        } 
    };
    document.getElementById("changeMapL").onclick = () =>{
        if (i==1) {
            if (map) map.destroy();
            map.init('leaflet').then(() => {
                test();
            });
            i=0;
        } 
    };

    /////
    map = new UniversalMap('map');
    map.init('yandex').then(() => {
        test();
        setInterval(() => {  map.redraw();ran(); }, 1000);
    });

    //document.getElementById("destro").addEventListener('click',() => {map.destroy()});
    //map.redraw();
}

ymaps.ready(init);

// const help = () =>{
//     let a = 5;
//     return a;
// }

// console.log(help());
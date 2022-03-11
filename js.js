 class YandexMap {
    constructor(div) {
        // init on div
        target.myMap = new ymaps.Map(div, {
            center: [52.9650800, 36.0784900],
            zoom: 12
        });
        target.elementscount = 0;
        target.elements = new Map();
        target.elements.clear();
        var placesPane = target.myMap.panes.get('places').getElement();
        const mapdiv = document.getElementById(div);
        target.wid = mapdiv.offsetWidth;
        target.canvas = document.createElement('canvas');
        
        target.app = new PIXI.Application({ width: mapdiv.offsetWidth, height: mapdiv.offsetHeight, backgroundAlpha: 0, view:target.canvas});
        
            target.canvas.id = 'canvas';
            placesPane.appendChild(target.canvas);
            target.container = new PIXI.Container();
        
        target.myMap.events.add('boundschange',() => {target.redraw();});
        /*target.myMap.events.add('click',(e) => {
            const app = target.app;
            const container = target.container;
            console.log(container.getChildAt(0));
            console.log(container.getChildAt(1));
        });*/
    }
    destroy() {
        // remove from div and free all
        target.myMap.destroy(); 
    }
    update(id, settings){
        let elements = target.elements;
        let oldElement = elements.get(id);
        let cloneObject = Object.assign(oldElement,settings);
        console.log(cloneObject);
        target.elements.set(id,cloneObject);
        target.redraw();
    }
    redraw() {
        // full redraw all elements
        let myMap = target.myMap
        const projection = myMap.options.get('projection');
        let newB = myMap.getBounds();
        let zoom = myMap.getZoom();
        target.leftCorn = myMap.converter.globalToPage(
        projection.toGlobalPixels(
            newB[1],
            zoom
        ));
        const app = target.app;
        app.stage.addChild(target.container);
        let elements = target.elements;
        const container = target.container;
        let i = 0;
        for (let [curKey, elFromEl] of elements) {
            // let elFromEl = elements.get(curKey);
            let elFromCon = container.getChildAt(i);
            elFromCon.clear();
            i++;
            target['draw_' + elFromEl.shape](curKey, elFromEl, elFromCon);
            continue;

            /*switch (elFromEl.shape){
                case "polyline":
                    elFromCon.lineStyle(5, elFromEl.pen);
                    state = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            elFromEl.place[0],
                            zoom
                        ));
                    state[0] = state[0]-(leftCorn[0]-target.wid);
                    state[1] = state[1]-leftCorn[1]
                    elFromCon.moveTo(state[0], state[1]);
                    for (let z = 1;z<elFromEl.place.length;z++){
                        state = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            elFromEl.place[z],
                            zoom
                        ));
                        state[0] = state[0]-(leftCorn[0]-target.wid);
                        state[1] = state[1]-leftCorn[1]
                        elFromCon.lineTo(state[0], state[1]);
                    }
                    elFromCon.endFill();
                break;//
                case "circle":
                    elFromCon.beginFill();
                    elFromCon.lineStyle(3, elFromEl.pen, 1);
                    state = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            elFromEl.place,
                            zoom
                        ));
                    state[0] = state[0]-(leftCorn[0]-target.wid);
                    state[1] = state[1]-leftCorn[1]
                    elFromCon.drawCircle(state[0], state[1],elFromEl.radius)
                    elFromCon.endFill();

                break;
                case "polygon" :
                    elFromCon.lineStyle(5, elFromEl.pen);
                    let startPoint = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            elFromEl.place[0],
                            zoom
                        ));
                    elFromCon.moveTo(startPoint[0]-(leftCorn[0]-target.wid), startPoint[1]-leftCorn[1]);
                    for (let z = 1;z<elFromEl.place.length;z++){
                        state = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            elFromEl.place[z],
                            zoom
                        ));
                        state[0] = state[0]-(leftCorn[0]-target.wid);
                        state[1] = state[1]-leftCorn[1]
                        elFromCon.lineTo(state[0], state[1]);
                    }
                    elFromCon.lineTo(startPoint[0]-(leftCorn[0]-target.wid), startPoint[1]-leftCorn[1]);
                    elFromCon.endFill();
                break;
            }*/
        }
            
    }

    draw_polygon(key, elFromEl, elFromCon){
        let leftCorn = target.leftCorn;
        let myMap = target.myMap;
        let zoom = myMap.getZoom();
        const projection = myMap.options.get('projection');
        elFromCon.lineStyle(5, elFromEl.pen);
        let startPoint = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                elFromEl.place[0],
                zoom
            ));
        elFromCon.moveTo(startPoint[0]-(leftCorn[0]-target.wid), startPoint[1]-leftCorn[1]);
        for (let z = 1;z<elFromEl.place.length;z++){
            let state = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                elFromEl.place[z],
                zoom
            ));
            state[0] = state[0]-(leftCorn[0]-target.wid);
            state[1] = state[1]-leftCorn[1]
            elFromCon.lineTo(state[0], state[1]);
        }
        elFromCon.lineTo(startPoint[0]-(leftCorn[0]-target.wid), startPoint[1]-leftCorn[1]);
        elFromCon.endFill();
    }

    draw_circle(key, elFromEl, elFromCon) {
        let leftCorn = target.leftCorn;
        let myMap = target.myMap;
        let zoom = myMap.getZoom();
        const projection = myMap.options.get('projection');
        //elFromCon.beginFill();
        elFromCon.lineStyle(/*border width*/3,/*border color*/ elFromEl.pen, 1);
        let state = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                elFromEl.place,
                zoom
            ));
        state[0] = state[0]-(leftCorn[0]-target.wid);
        state[1] = state[1]-leftCorn[1]
        elFromCon.drawCircle(state[0], state[1],elFromEl.radius)
        elFromCon.endFill();
    }


    draw_polyline(key, elFromEl, elFromCon) {
        let leftCorn = target.leftCorn;
        let myMap = target.myMap;
        let zoom = myMap.getZoom();
        const projection = myMap.options.get('projection');
        elFromCon.lineStyle(5, elFromEl.pen);
        let state = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                elFromEl.place[0],
                zoom
            ));
        state[0] = state[0]-(leftCorn[0]-target.wid);
        state[1] = state[1]-leftCorn[1]
        elFromCon.moveTo(state[0], state[1]);
        for (let z = 1;z<elFromEl.place.length;z++){
            state = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                elFromEl.place[z],
                zoom
            ));
            state[0] = state[0]-(leftCorn[0]-target.wid);
            state[1] = state[1]-leftCorn[1]
            elFromCon.lineTo(state[0], state[1]);
        }
        elFromCon.endFill();
    }

    add(data) {
        target.elementscount++;
        target.elements.set(data.id, data);
        //console.log(target.elements);
        let graphcs = new PIXI.Graphics();
        target.container.addChild(graphcs);
        //target.redraw();
    }
    clear() {
        target.elementscount = 0;
        target.elements.clear;
        for (var i = target.app.stage.children.length - 1; i >= 0; i--) {	target.app.stage.removeChild(target.app.stage.children[i]);}
        //target.redraw();
        //console.log('clear');
    }
    get bounds() {
        return target.myMap.getBounds();
    }
}


let map;
function test() {
    
    map.clear();
    /////////////adds
{
    //polyline
    map.add({
        id: 1002,
        shape: 'polyline',
        pen: 'black',
        shadow: 'white',
        place: [[52.9597, 36.0825],[52.9602, 36.0849],[52.9623, 36.0838],[52.9621, 36.0828],[52.9637, 36.0801]]
    });
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
    map.redraw();
    map.update(1001, {
        place: [52.9595, 36.0592]
    });
}
function ran(){
    console.log('renren');
    let curbounds = map.bounds;
     map.add({
        id: 1005,
        shape: 'circle',
        radius: 10,
        brush: '#666',
        pen: 'black',
        place: [(Math.random() * (curbounds[1][0] - curbounds[0][0]) + curbounds[0][0]).toFixed(15), (Math.random() * (curbounds[1][1] - curbounds[0][1]) + curbounds[0][1]).toFixed(15)]
    });
}

function init() {
    map = new YandexMap('map');
    document.getElementById("destro").addEventListener('click',() => {map.destroy()})
    test()
    setInterval(() => { map.redraw(); ran() }, 1000);
}

ymaps.ready(init);
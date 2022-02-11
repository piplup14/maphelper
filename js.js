    /*function init(){
        // Создание карты.
        var myMap;
        myMap = new ymaps.Map("map", {
            center: [52.9650800, 36.0784900],
            zoom: 12
        });
       //////////////////////////
        var placesPane = myMap.panes.get('places').getElement();
        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        placesPane.appendChild(canvas);
/////////////////////////////////
        myMap.events.add('boundschange', function (e) {
            console.log('121');
            const projection = myMap.options.get('projection');
            let newB = e.get("newBounds")
            let leftCorn = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                newB[1],
                myMap.getZoom()
            )) 
            if (canvas.getContext){
                let orel = myMap.converter.globalToPage(
                    projection.toGlobalPixels(
                        [52.9650800, 36.0784900],
                        myMap.getZoom()
                    ));
                
                var ctx = canvas.getContext('2d');
                ctx.canvas.width = 800;
                ctx.canvas.height = 450;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                console.log(orel,leftCorn);
                orel[0] = orel[0]-(leftCorn[0]-800);
                orel[1] = orel[1] - leftCorn[1];

                console.log(orel);
                ctx.arc(orel[0],orel[1],5,0,Math.PI*2,true);
                
                ctx.stroke();
              }

        });
        
    }*/
    class Map {
        constructor(div) {
            // init on div
            this.myMap = new ymaps.Map(div, {
                center: [52.9650800, 36.0784900],
                zoom: 12
            });
            this.elements = [];
            var placesPane = this.myMap.panes.get('places').getElement();
            const canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            placesPane.appendChild(canvas);
            this.ctx = canvas.getContext('2d');
            const mapdiv = document.getElementById(div)
            this.ctx.canvas.width = mapdiv.offsetWidth;
            this.ctx.canvas.height = mapdiv.offsetHeight;
            this.myMap.events.add('boundschange',(e) => {this.redraw();});
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
            )) 
            let elemLength = this.elements.length;
            let elements = this.elements;
            if (canvas.getContext){
                let ctx = this.ctx;
                let wid = canvas.width;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for(let i = 0;i<elemLength;i++) {
                    let place = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            elements[i],
                            zoom
                        ));
                    ctx.beginPath();
                place[0] = place[0]-(leftCorn[0]-wid);
                place[1] = place[1] - leftCorn[1];
                ctx.arc(place[0],place[1],5,0,Math.PI*2,true);
                ctx.stroke();
                };
                
              }
        }
        add(data) {
            this.elements.push(data);
        }
        clear() {
            this.elements = [];
            this.redraw();
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
    for (let i = 0; i < 100000; i++) {
        map.add([(Math.random() * (curbounds[1][0] - curbounds[0][0]) + curbounds[0][0]).toFixed(15), (Math.random() * (curbounds[1][1] - curbounds[0][1]) + curbounds[0][1]).toFixed(15)]);
    }
    map.redraw();
}
    
function init() {
    map = new Map('map');
    document.getElementById("destro").addEventListener('click',() => {map.destroy()})
    setInterval(test, 1000);
}
    
ymaps.ready(init);
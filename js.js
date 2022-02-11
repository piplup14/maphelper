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
            //var myMap;
            this.myMap = new ymaps.Map(div, {
                center: [52.9650800, 36.0784900],
                zoom: 12
            });
            this.elements = [];
        var placesPane = this.myMap.panes.get('places').getElement();
        const canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        placesPane.appendChild(canvas);
        this.bindEvent();
        }
        destroy() {
        // remove from div and free all
        }
        bindEvent(){
            const redr = this.redraw();
            this.myMap.events.add('boundschange',redr /*(e) => {
                let myMap = this.myMap;
                let elements = this.elements;    
                const projection = myMap.options.get('projection');
            let newB = myMap.getBounds();
            let zoom = myMap.getZoom();
            let leftCorn = myMap.converter.globalToPage(
            projection.toGlobalPixels(
                newB[1],
                zoom
            )) 
            if (canvas.getContext){
                var ctx = canvas.getContext('2d');
                ctx.canvas.width = 800;
                ctx.canvas.height = 450;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                elements.forEach(element => {
                    let place = myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            element,
                            zoom
                        ));
                    ctx.beginPath();
                place[0] = place[0]-(leftCorn[0]-800);
                place[1] = place[1] - leftCorn[1];
                ctx.arc(place[0],place[1],5,0,Math.PI*2,true);
                ctx.stroke();
                });
                
              }

            }*/
            
            
            );
        }
        redraw() {
            // full redraw all elements
            console.log(this.myMap);
            const projection = this.myMap.options.get('projection');
            let newB = this.myMap.getBounds();
            let zoom = this.myMap.getZoom();
            let leftCorn = this.myMap.converter.globalToPage(
            projection.toGlobalPixels(
                newB[1],
                zoom
            )) 
            if (canvas.getContext){
                var ctx = canvas.getContext('2d');
                ctx.canvas.width = 800;
                ctx.canvas.height = 450;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                console.log(this.elements);
                this.elements.forEach(element => {
                    let place = this.myMap.converter.globalToPage(
                        projection.toGlobalPixels(
                            element,
                            zoom
                        ));
                    ctx.beginPath();
                place[0] = place[0]-(leftCorn[0]-800);
                place[1] = place[1] - leftCorn[1];
                ctx.arc(place[0],place[1],5,0,Math.PI*2,true);
                ctx.stroke();
                });
                
              }
              console.log(this.elements);
        }
        add(data) {
            this.elements.push(data);
        }
        clear() {
            this.elements = [];
            //this.redraw();
            console.log('clear');
        }
    };


function test() {
    const map = new Map('map');
    map.clear();
    
    //for (let i = 0; i < 1000; i++) {
    map.add([52.9650800, 36.0784900]);
    //}
    console.log('121',map.elements);
    map.redraw();
    console.log('121',map.elements);
}
    ymaps.ready(test);


    /*
    class Map {
        constructor() {
            this.myMap = new ymaps.Map("map", {
                center: [52.9650800, 36.0784900],
                zoom: 12
            });
            this.ctx = canvas.getContext('2d');
            this.masOfCirc = [];
            let placesPane = myMap.panes.get('places').getElement();
            const canvas = document.createElement('canvas');
            canvas.id = 'canvas';
            placesPane.appendChild(canvas);
            this.draw();
            const projection = myMap.options.get('projection');
            this.zoom = this.myMap.getZoom();
            myMap.events.add('boundschange', function (e) {
                this.zoom = this.myMap.getZoom();
                this.draw();
            })
        }
        add(){
            this.masOfCirc = [];
            for (let i=0;i < 20; i++){

            }
        }
        draw(){
            let newB = this.myMap.getBounds()
            let rCon = myMap.converter.globalToPage(
                projection.toGlobalPixels(
                    newB[1],
                    myMap.getZoom()
                ))
            if (this.canvas.getContext){
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.masOfCirc.forEach(el => {
                let pos = myMap.converter.globalToPage(
                    projection.toGlobalPixels(
                        el,
                        this.zoom
                    ));
                
                    this.ctx.beginPath();
                pos[0] = pos[0]-(rCon[0]-800);
                pos[1] = pos[1] - rCon[1];

                this.ctx.arc(pos[0],pos[1],5,0,Math.PI*2,true);
                
                this.ctx.stroke();

            });

        }}
    }
*/
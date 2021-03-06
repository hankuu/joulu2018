// calendar window sizes
let cwH = 200;
let cwW = 200;
let titlePadding = 30;


//create window containers
let calendar = d3.select("#calendar");

let calWindows = [];
for (let i = 0; i < 24; i++) {
  //create windows
  let item = calendar.append("div")
    .attr("class", "calWindowClosed")

  //title
  item.append("div")
    .attr("class", "calTitle")
    .text(""+(i+1));

  //container for content
  item.append("svg")
    .attr("id","win"+(i+1).toString())
    .attr("height", cwH-titlePadding)
    .attr("width", cwW);

  calWindows.push(item)

}

//////////////////////////
// Utils
//////////////////////////
function randomBetween(low, high){
  return Math.floor(Math.random()*(high-low+1)+low);
}

function pathForPolygon(cx,cy,height,numOfPoints,isCurvedIn){
  //path to return
  let path = "";
  //angle to turn on circumscribed circle
  let a = 2*Math.PI/numOfPoints;

  let points = []
  for (let i = 0; i <= numOfPoints; i++) {
    points[i] = [cx + height*Math.cos(i*a), cy + height*Math.sin(i*a)]
  }

  if(isCurvedIn===true){
    path = "M" + points.join("Q"+cx+","+cy+" ")+ "z";
  }else{
    path = "M" + points.join("L")+ "z";
  }
  return path;
}



//////////////////////////
// 1st: simple circle
//////////////////////////
function addContent1(){
  let num = 0;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

    //change title
    d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("1: circle / ympyrä")

  d3.select(calWindows[num]._groups[0][0].childNodes[1])
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 100)
  .attr("r", 50)
  .attr("fill", "blue")
}//1st

//////////////////////////
// 2nd: pie
//////////////////////////
function addContent2(){
  let num = 1;

  //for the pie
  const data = [{value: randomBetween(10,100)}, {value: randomBetween(10,100)}];
  const r = cwW/3;

  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen");

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("2: pie")


  //SVG container for the elements
  const svg = d3.select(calWindows[num]._groups[0][0].childNodes[1]);

  //Group for the pie
  const pieGroup = svg.append("g")
    .attr("transform", `translate(${cwW / 2},${cwH / 2.5})`);
// .attr("transform", "translate("+(cwW/2)+","+(cwH/2.5)+")");

  //create colorScale
  let colorScale = d3.scaleOrdinal()
                    .range(["orange","forestGreen"])

  //arcs
  const pie = d3.pie()
      .sort(null)
      .value(d => d.value)

  const arcs = pie(data);

  arc = d3.arc()
    .innerRadius(0)
    .outerRadius(r)


  //paths
  const path = pieGroup.selectAll("path")
                      .data(arcs)
                      .enter()
                      .append("path")
                      .attr("fill",(d,i) => {return colorScale(i)})
                      .attr("stroke","white")
                      .attr("stroke-width",5)
                      .attr("d", arc)
} //2nd


//////////////////////////
// 3rd: simple bars
//////////////////////////
function addContent3(){
  let num = 2;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("3: bars / palkit: hover")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])


  //data for bars
  const data = [
    {name: "A", value: 12},
    {name: "B", value: 22},
    {name: "C", value: 2},
  ]

  //bars
  let margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 20
  }
  let height = cwH - titlePadding - margin.top - margin.bottom;
  let width = cwW - margin.left - margin.right;

  function toCircle(){
    let me = d3.select(this);

    let y = +(me.attr("y")) + (+(me.attr("height"))/2);
    let area = +(me.attr("height")) * +(me.attr("width"));

    calWin.append("circle")
      .attr("cx",width - width/4)
      .attr("cy",y)
      .attr("r", Math.sqrt(area / Math.PI))
      .attr("fill", me.attr("fill"))

      me.attr("fill","transparent")

  }

  function toRect(){
    let me = d3.select(this);
    me.attr("fill",d => colorScale(d.value))

    calWin.selectAll("circle").remove();

  }

  //scales
  let yScale = d3.scaleBand()
        .range([height, 0])
        .domain(data.map(d => d.name))
        .padding(0.2);

  let xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, function(d){ return d.value; })]);

  let colorScale = d3.scaleSequential(d3.interpolateOranges)
          // .domain([d3.max(data, function(d){ return d.value; }),0]);
          .domain([-10, d3.max(data, function(d){ return d.value; })]);

  let barGroup = calWin
    .append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", margin.left)
    .attr("y", d => yScale(d.name))
    .attr("height", yScale.bandwidth())
    .attr("width", d => (xScale(d.value)))
    .attr("fill", d => colorScale(d.value))
    .on("mouseover",toCircle)
    .on("mouseout",toRect);

    //Add axes on top
    calWin.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    calWin.append("g")
      .attr("transform", `translate(${margin.left},${height})`)
      .call(d3.axisBottom(xScale))

} //3rd

//////////////////////////
// 4th: random squares
//////////////////////////
function addContent4(){
  let num = 3;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

    //change title
    d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("4: squares / neliöt")

  //pick random point within padded area
  let padding = 10;

let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

let width = +calWin.attr("width")
let height = +calWin.attr("height")

let random = {
  x: randomBetween(padding, width - padding),
  y: randomBetween(padding, height - padding)
}

//colorScale
let colorScale = d3.scaleSequential(d3.interpolateWarm)
        .domain([0,width*height]);



  calWin.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width", random.x)
  .attr("height", random.y)
  .attr("fill", colorScale(random.x*random.y))

  calWin.append("rect")
  .attr("x",random.x)
  .attr("y", random.y)
  .attr("width", width - random.x)
  .attr("height", height - random.y)
  .attr("fill", colorScale((width-random.x)*(height -random.y)))

  calWin.append("rect")
  .attr("x",random.x)
  .attr("y", 0)
  .attr("width", width - random.x)
  .attr("height", random.y)
  .attr("fill", colorScale((width - random.x)*random.y))

  calWin.append("rect")
  .attr("x",0)
  .attr("y", random.y)
  .attr("width", random.x)
  .attr("height", height - random.y)
  .attr("fill", colorScale(random.x*(height - random.y)))

  calWin.append("line")
  .attr("x1", random.x)
  .attr("y1", 0)
  .attr("x2", random.x)
  .attr("y2", height)
  .attr("stroke", "white")
  .attr("stroke-width",5)

  calWin.append("line")
  .attr("x1", 0)
  .attr("y1", random.y)
  .attr("x2", width)
  .attr("y2", random.y)
  .attr("stroke", "white")
  .attr("stroke-width",5)


}//4th

//////////////////////////
// 5th: node-link
// Help:
// node-links https://bl.ocks.org/mbostock/533daf20348023dfdd76
// linear grads http://bl.ocks.org/pnavarrc/20950640812489f13246
//////////////////////////
function addContent5(){
  let num = 4;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("5: node-link")

  //Container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //Bit of background
  calWin.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width", width)
  .attr("height", height)
  .attr("fill","black")


  // Create the svg:defs element and the main gradient definition.
 var svgDefs = calWin.append('defs');

 var mainGradient = svgDefs.append('linearGradient')
     .attr('id', 'mainGradient');

 // Create the stops of the main gradient
 mainGradient.append('stop')
     .attr('class', 'stop-end')
     .attr('offset', '0.2');

 mainGradient.append('stop')
     .attr('class', 'stop-middle')
     .attr('offset', '0.5');

 mainGradient.append('stop')
     .attr('class', 'stop-end')
     .attr('offset', '0.8');

     //D3 force
  let simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-200))
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .on("tick", ticked);

  let link = calWin.selectAll(".link")

  //data
  let data = {
  "nodes": [
    {"id": "red"},
    {"id": "orange"},
    {"id": "yellow"},
    {"id": "blue"},
    {"id": "violet"}
  ],
  "links": [
    {"source": "red", "target": "orange", "place": "in"},
    {"source": "orange", "target": "yellow", "place": "in"},
    {"source": "yellow", "target": "blue", "place": "in"},
    {"source": "blue", "target": "violet", "place": "in"},
    {"source": "violet", "target": "red", "place": "in"},

    {"source": "red", "target": "yellow", "place": "out"},
    {"source": "red", "target": "blue", "place": "out"},
    {"source": "yellow", "target": "violet", "place": "out"},
    {"source": "orange", "target": "blue", "place": "out"},
    {"source": "orange", "target": "violet", "place": "out"}
  ]
}

simulation.nodes(data.nodes)
simulation.force("link")
  .links(data.links)

//drawing only links
link = link
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", function(d) {return d.place==="out" ? "out" : "link"});


  function ticked() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

}//5th


//////////////////////////
// 6th: contour
//////////////////////////
function addContent6(){
  let num = 5;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("6: Itsenäisyyspäivä")

  //get container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let padding = 10;
  let width = +calWin.attr("width")-padding;
  let height = +calWin.attr("height")-padding;

  //scales
  let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 20]);


  let xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, 30]);

  let colorScale = d3.scaleSequential(d3.interpolateBlues)
          .domain([0,0.16]);

  //data
  let data = [];
  //vertical
  for (let i = 0; i < 500; i++) {
    data.push({
      x: randomBetween(10,15),
      y: randomBetween(0, 20)
    })
  }
  //splitting horizontal into 2 parts to avoid center blob
  //horizontal1
  for (let i = 0; i < 300; i++) {
    let tmp = {
      x: randomBetween(0,10),
      y: randomBetween(8, 13)
    }
    data.push(tmp)
  }
  //horizontal2
  for (let i = 0; i < 500; i++) {
    let tmp = {
      x: randomBetween(15,30),
      y: randomBetween(8, 13)
    }
    data.push(tmp)
  }

    calWin.selectAll("path")
      .data(d3.contourDensity()
              .x(function(d){ return xScale(d.x); })
              .y(function(d) { return yScale(d.y); })
              .size([width, height])
              .bandwidth(10)
              (data))
      .enter()
      .append("path")
      .attr("fill", function(d){return colorScale(d.value);})
      .attr("stroke", "white")
      .attr("stroke-width", 0.3)
      .attr("d", d3.geoPath());
}//6th

//////////////////////////
// 7th: voronoi
// help: https://bl.ocks.org/aaizemberg/8063f8c2d1adb7c7ee68
//////////////////////////
function addContent7(){
  let num = 6;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("7: Voronoi")

  //Container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  let data = [];
  let padding = 10;
  for (let i = 0; i < 7; i++) {
    //not using scales but mapping to the area
    data.push([randomBetween(padding, width-padding),randomBetween(padding, height-padding)])
  }

  //colorScale
  let colorScale = d3.scaleSequential()
          .domain([0,height])
          .interpolator(d3.interpolatePlasma)

  //Could not have thought of this myself.
  //TODO learn svg better
  function polygon(d) {
    return "M" + d.join("L") + "Z";
  }

  //voronoi
  let diagram = d3.voronoi().extent([[0,0], [width, height]])

  calWin.append("g").selectAll("path")
    .data(diagram.polygons(data))
    .enter()
    .append("path")
    .attr("stroke","white")
    .attr("stroke-width",3)
    //coloring according to the x-value
    .attr("fill",function(d){return colorScale(d.data[0]);})
    .attr("d", polygon)

  calWin.append("g").selectAll("line")
    .data(diagram.links(data))
    .enter()
    .append("line")
    .attr("x1", function(d) { return d.source[0]; })
    .attr("y1", function(d) { return d.source[1]; })
    .attr("x2", function(d) { return d.target[0]; })
    .attr("y2", function(d) { return d.target[1]; })
    .attr("stroke","white")
    .attr("stroke-width",0.5)

  calWin.append("g").selectAll("circle")
    .data(data)
    .enter()
      .append("circle")
      .attr("cx", function(d) {return d[0]})
      .attr("cy", function(d) {return d[1]})
      .attr("r", 1)
      .attr("fill", "white")
}//7th

//////////////////////////
// 8th: Contours again
//////////////////////////
function addContent8(){
  let num = 7;

  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("8: circles / ympyrät")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  let data = [];
  let maxPoints = 500;
  let outR = height/4-1;

  //scales
  let colorScale = d3.interpolateRgb("yellow", "orange");

  //add background
  calWin.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "darkBlue")

  //upper circle
  for (var i = 0; i < maxPoints; i++) {
    let t = 2*Math.PI*Math.random();
    let r = 0;
    while(r < outR/2){
      r = outR * Math.sqrt(Math.random())
    }
    data.push([r*Math.cos(t)+width/2,r*Math.sin(t)+height/4,colorScale((outR-r)/(outR/2)),(outR-r)/(outR/2)])
  }
  //lower circle
  for (var i = 0; i < maxPoints; i++) {
    let t = 2*Math.PI*Math.random();
    let r = 0;
    while(r < outR/2){
      r = outR * Math.sqrt(Math.random())
    }
    data.push([r*Math.cos(t)+width/2,r*Math.sin(t)+3*height/4, colorScale((outR-r)/(outR/2)), 1-(outR-r)/(outR/2)])
  }

  //draw
  calWin.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => d[0])
    .attr("cy", d => d[1])
    .attr("r", d => d[3]*3)
    .attr("fill", d => d[2])
}//8th

//////////////////////////
// 9: nine pulsing circles
//////////////////////////
function addContent9(){
  let num = 8;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("9: pulse / pulssi")

  //container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let padding = 5;
  let width = +calWin.attr("width")-padding
  let height = +calWin.attr("height")-padding

  let side = width < height ? width : height;

  let xVar = width/3;
  let yVar = side/3;

  let targetR = side/3;

  let data = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      data.push([xVar*(i+0.5),yVar*(j+0.5)])
    }
  }

  //color
  let colorScale = d3.quantize(d3.interpolateHcl("yellow", "#4d4193"), 9);

  //calculate duration
  function getDuration(d,i){
    return (i%2)*500 + 2000;
  }


  //handle pulse
  function pulse() {
  			var circle = calWin.selectAll("circle");
  			(function repeat() {
  				circle = circle.transition()
          .duration(getDuration)
  					.attr("r", 10)
  					.transition()
            .duration(getDuration)
  					.attr("r", targetR*Math.random())
  					.on("end", repeat);
  			})();
  }

  //draw circles
      calWin.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => d[0])
      .attr("cy", d => d[1])
      .attr("r",10)
      .attr("fill", function(d,i){
        return colorScale[i];
       })
      .attr("stroke", function(d,i){
        return colorScale[8-i];
       })
      .transition()
      .duration(getDuration)
        .attr('stroke-width', 2)
        .attr("r", targetR*Math.random())
        .on("end", pulse);


}//9th


//////////////////////////
// 10th collatz conjecture
//////////////////////////
function addContent10(){
  let num = 9;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("10: Collatz conjecture")

  //container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  let padding = 10;
  let width = +calWin.attr("width")-2*padding;
  let height = +calWin.attr("height")-2*padding;

  let universalY = 2*height/3;

  let data = {
    nodes: [
      {id: 1, used: 1},
       {id: 2, used: 1},
       {id: 3, used: 0},
       {id: 4, used: 1},
       {id: 5, used: 1},
       {id: 6, used: 0},
       {id: 7, used: 0},
       {id: 8, used: 1},
       {id: 9, used: 0},
       {id: 10, used: 1},
       {id: 11, used: 0},
       {id: 12, used: 0},
       {id: 13, used: 0},
       {id: 14, used: 0},
       {id: 15, used: 0},
       {id: 16, used: 1}
     ],
     links: [
        {"source": 5,
         "target": 10},
        {"source": 5,
         "target": 16},
        {"source": 8,
         "target": 16},
        {"source": 4,
         "target": 8},
        {"source": 2,
         "target": 4},
        {"source": 1,
         "target": 2}
     ]
  };

  //scales
  let xScale = d3.scaleLinear()
          .range([padding, width])
          .domain([0,17])


  //if scaled?
  let rScale = d3.scaleSqrt()
          .range([3, 7])


  //Draw nodes
  calWin.selectAll("circle")
  .data(data.nodes)
  .enter()
  .append("circle")
  // .attr("cx", function(d){return xScale(d.id)})
  .attr("cx", (d) => xScale(d.id))
  .attr("cy", universalY)
  .attr("r", function(d){
    return d.used === 1 ? 5 : 2;
  })
  .attr("fill", function(d){
    return d.used === 1 ? "tomato" : "gray";
  })
  .attr("stroke", function(d){
    return d.id === 10 ? "lime" : "transparent";
  })
  .attr("stroke-width", 2)


  //draw links
  calWin.selectAll("path")
  .data(data.links)
  .enter()
  .append("path")
  .attr("d", function(d){
    //Building an arc
    return "M " + xScale(d.source) + "," + universalY + " A " + ((xScale(d.source)-xScale(d.target))/2) + "," + ((xScale(d.source)-xScale(d.target))/2) + " 0 0, 1 " +xScale(d.target) + " " + universalY;
  })
  .attr("fill", "transparent")
  .attr("stroke", "black")

}//10th

//////////////////////////
// 11th: Bubbles!
// A recipe for Baked Berry Oatmeal http://www.foodhero.org/recipes/baked-berry-oatmeal
//////////////////////////
function addContent11(){
  let num = 10;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("11: bubbles!")

  //container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //data
  let data = {
    "children" : [{"name": "rolled oats", "measure":"cup", "amount":2 },
    {"name": "baking powder", "measure":"teaspoon", "amount":1 },
    {"name": "cinnamon", "measure":"teaspoon", "amount":1 },
    {"name": "salt", "measure":"teaspoon", "amount":0.25 },
    {"name": "egg", "measure":"item", "amount":2 },
    {"name": "brown sugar", "measure":"cup", "amount":0.5 },
    {"name": "vanilla", "measure":"teaspoon", "amount":1.5 },
    {"name": "milk", "measure":"cup", "amount":2 },
    {"name": "melted butter", "measure":"teaspoon", "amount":4 },
    {"name": "cane berries", "measure":"cup", "amount":2 },
    {"name": "walnuts (chopped)", "measure":"cup", "amount":0.25 }]
  }

  let bubbles = d3.pack(data)
                  .size([width, height])
                  .padding(2);

  let nodes = d3.hierarchy(data)
              .sum(function(d){ return d.amount;})

  //find out number of different measure types
  let types = d3.set();
  for (let i = 0; i < data.children.length; i++) {
    types.add(data.children[i].measure)
  }

  //colors according to number of measure types
  // let colorScale = d3.scaleOrdinal(d3.schemeSpectral[types.values().length])
  let colorScale = d3.scaleOrdinal(d3.schemeSpectral[types.values().length*3])

  let node = calWin.selectAll("circle")
      .data(bubbles(nodes).descendants())
      .enter()
      .filter(function(d){ return !d.children;})
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })

    node.append("circle")
      .attr("r", (d) => d.r )
      .attr("fill", function(d){
        return colorScale(types.values().indexOf(d.data.measure)+3)})

}//11th

//////////////////////////
// 12th: clock
//////////////////////////
function addContent12(){
  let num = 11;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("12: dance / tanssi")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  let width = +calWin.attr("width");
  let height = +calWin.attr("height");
  let side = height < width ? height : width;
  let padding = 20;
  side -= 2*padding;

  let outerR = side/2-20;
  let data = d3.range(12);
  let t = Math.PI/6;

  calWin
  .attr("width", side)
  .attr("height", side)
  .attr("transform",`translate(${ width/2 - side/2 },${ padding }), rotate(-90)`)
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d,i){return outerR*Math.cos(i*t)+side/2-5})
  .attr("cy", function(d,i){ return outerR*Math.sin(i*t)+side/2})
  .attr("r", function(d,i){return 7+(11-i)})
  .attr("fill", "black")
  .attr("stroke","tomato")
  .transition()
  .duration(2000)
    .attr("cx", function(d,i){return outerR*Math.cos(getAngle(i))+side/2-3})
    .attr("cy", function(d,i){ return outerR*Math.sin(getAngle(i))+side/2})
    .attr("fill", "tomato")
    .attr("stroke", "black")
    .on("end", function(d){
    			var circle = calWin.selectAll("circle");
    			(function repeat() {
    				circle = circle.transition()
            .duration(2000)
              .attr("cx", function(d,i){
                let angle = getAngle(i);
                return outerR*Math.cos(angle)+side/2-3;
              })
              .attr("cy", function(d,i){
                let angle = getAngle(i);
                return outerR*Math.sin(angle)+side/2;
              })
              .attr("fill", "black")
              .attr("stroke","tomato")
    					.transition()
              .duration(2000)
              .attr("cx", function(d,i){return outerR*Math.cos(i*t)+side/2-3})
              .attr("cy", function(d,i){ return outerR*Math.sin(i*t)+side/2})
              .attr("fill", "tomato")
              .attr("stroke", "black")
    					.on("end", repeat);
    			})();
  })

    function getAngle(i){
      return i*Math.PI/randomBetween(2,10);
    }

}//12th


//////////////////////////
// 13th: Lucia
//////////////////////////
function addContent13(){
  let num = 12;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("13: Lucia")

  //container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //add background
  calWin.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "darkBlue")


  //create helper data container
  let data = d3.range(13);

  //Following is based on precalculated placements
  //TODO: extract path drawing into a function
  calWin.selectAll(".candle")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d){ return 36+d*10; })
  .attr("y", height/2)
  .attr("width", 8)
  .attr("class", "candle")
  .attr("height", height/2)
  .attr("fill", "Ivory")

  calWin.selectAll(".bigFlame")
  .data(data)
  .enter()
  .append("path")
  .attr("d", function(d){ return "M " + (40+d*10) + ", " + (height/2) + " q -5, -10 0, -20 q 5, 10 0, 20" })
  .attr("class", ".bigFlame")
  .attr("stroke", "orange")
  .attr("fill", "yellow")

  calWin.append("g")
  .attr("id","smallFlames")
  .selectAll(".smallFlame")
  .data(data)
  .enter()
  .append("path")
  .attr("d", function(d){ return "M " + (40+d*10) + ", " + (height/2) + " q -2.5, -5 0, -10 q 2.5, 5 0, 10" })
  .attr("class", ".smallFlame")
  .attr("fill", "orange")
  .attr("stroke", "red")
  .transition()
    .duration(2000)
    .attr("fill", "yellow")
    .attr("stroke", "orange")
    .on("end", flicker)


      function flicker() {
    			var flamegroup = calWin.select("#smallFlames");
          var sFlames = flamegroup.selectAll("path");

    			(function repeat() {
            sFlames = sFlames.transition()
            .duration(randomBetween(500,2000))
            .attr("fill", "orange")
            .attr("stroke", "red")
            .transition()
              .duration(randomBetween(500,2000))
              .attr("fill", "yellow")
              .attr("stroke", "orange")
              .on("end", repeat);
          })();
      }

}//13th


//////////////////////////
// 14th: triangles
//////////////////////////
function addContent14(){
  let num = 13;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("14: triangles / kolmiot")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  //container
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //triangle measures
  let tSide = width/7;
  let tHeight = Math.sqrt(3)*0.5*tSide;

  //coloring
  let colorScale = d3.scaleSequential()
          .domain([0,height])
          .interpolator(d3.interpolatePlasma)

  calWin.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width", width)
  .attr("height",height/2)
  // .attr("fill", colorScale(height/3))
  .attr("fill", colorScale(randomBetween(0,height/2)))

  calWin.append("rect")
  .attr("x",0)
  .attr("y",height/2)
  .attr("width", width)
  .attr("height",height/2)
  // .attr("fill", colorScale(2*height/3))
  .attr("fill", colorScale(randomBetween(height/2,height)))


  //draw triangle from center point
  function drawTriangle(x, y, pointUp){
    let path = "";
    if(pointUp===true){
      path = "M "+(x)+", "+(y-tHeight/2)+" l "+(tSide/2)+", "+(tHeight)+" l "+(-tSide)+", 0 z"
    }else{
      path = "M "+(x)+", "+(y+tHeight/2)+" l "+(-tSide/2)+", "+(-tHeight)+" l "+(tSide)+", 0 z"
    }
      return path;
  }

  //Draw triangles
  calWin.selectAll("path")
  .data(d3.range(14))
  .enter()
  .append("path")
  .attr("d", function(d){
    //x: move triqngle center point from left to right. restart for the 2nd row
    //y: 2nd row starts after 7 triangles
    //pointup: draw every other triangle point up
    return drawTriangle(tSide/2+(d>6?d-7:d)*(tSide),(d>6?height/2+tHeight/2:height/2-tHeight/2),(d%2===0?false:true))})
  .attr("fill", function(d){ return colorScale((13-d)*height/14) })
  .transition()
    .duration(2000)
    .attr("fill", function(d){return colorScale((d)*height/14) })
    .transition()
      .duration(2000)
      .attr("fill", function(d){ return colorScale((13-d)*height/14) })
}//14th


//////////////////////////
// 15th: 3 pentagons
//////////////////////////
function addContent15(){
  let num = 14;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("15: pentagons")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  //container
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //bakground
  calWin.append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width",width)
  .attr("height", height)
  .attr("fill", "#6f00a8")


  //pentagon measures
  let pSide = 40;
  let pHeight = pSide*Math.sqrt(5+2*Math.sqrt(5))/2;

  //draw pentagon from center point
  function drawPentagon(x,y,turn,scale){
    //angle to turn on circumscribed circle
    let a = 72 * Math.PI/180;

    let points = []
    for (let i = 0; i < 5; i++) {
        points[i] = [x + scale*pHeight/2*Math.cos(i*a+turn), y + scale*pHeight/2*Math.sin(i*a+turn)]
    }

    return "M" + points.join("L") + "z";
  }

//rotate shape
function rotateShape(id,x,y,angle){

  let shape = calWin.select(id);

  (function repeat() {
    shape.transition()
    .duration(2000)
    .attrTween('transform',function(d){
      return d3.interpolateString("rotate(0,"+x+","+y+")","rotate("+angle+","+x+","+y+")");
    })
    .transition()
      .duration(2000)
      .attrTween('transform',function(d){
        return d3.interpolateString("rotate("+(angle)+","+x+","+y+")","rotate(0,"+x+","+y+")");
      })
    .on("end",repeat);
  })();
}

  //draw pentagons
  calWin.append("path")
  .attr("d", drawPentagon(width/2, height/3, Math.PI/5, 1.3))
  .attr("id","shape1")
  .attr("fill", "transparent")
  .attr("stroke", "#cc4778")
  .attr("stroke-width",20)

  calWin.append("path")
  .attr("d", drawPentagon(width/4, 2*height/3, 0, 1))
  .attr("id","shape2")
  .attr("fill", "#fba238")
  .attr("opacity", 0.8)
  .attr("stroke", "transparent");

  calWin.append("path")
  .attr("d", drawPentagon(2*width/3, 3*height/4, 0, 0.8))
  .attr("id","shape3")
  .attr("fill", "#fada24")
  .attr("opacity", 0.7)
  .attr("stroke", "transparent")

  //rotate
  rotateShape("#shape1",width/2,height/3,230)
  rotateShape("#shape2",width/2,height/3,-72)
  rotateShape("#shape3",width/2,height/2,-300)

}//15th

//////////////////////////
// 16th: 4x4
//////////////////////////
function addContent16(){
  let num = 15;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("16: 4x4")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  let padding = 10;
  let width = +calWin.attr("width")-2*padding
  let height = +calWin.attr("height")-2*padding
  let sHeight = height/4;

  //draw star from center point
  function drawStar(x,y){
    //angle to turn on circumscribed circle
    let a = Math.PI/2;

    let points = []
    for (let i = 0; i < 5; i++) {
      points[i] = [x + sHeight*Math.cos(i*a), y + sHeight*Math.sin(i*a)]
    }
    return "M" + points.join("Q"+x+","+y+" ")+ "z";
  }

  //rotate all stars
  function rotateStars(id){
    let star = calWin.select(id);
    let angle = randomBetween(60,2*360);
    let x = +id.split("#star")[1]%2===0?width/2-height/4:width/2+height/4;
    let y = +id.split("#star")[1]<2?height/4:3*height/4;

    (function repeat() {
      star.transition()
      .duration(randomBetween(2000,3000))
      .attrTween('transform',function(d){
        return d3.interpolateString("rotate(0,"+x+","+y+")","rotate("+angle+","+x+","+y+")");
      })
      .transition()
      .duration(randomBetween(1000,3000))
        .attrTween('transform',function(d){
          return d3.interpolateString("rotate("+(angle)+","+x+","+y+")","rotate(0,"+x+","+y+")");
        })
      .on("end",repeat);
    })();
  }

  calWin.attr("width",width)
  .attr("height",height)
  .attr("transform",`translate(${padding},${padding})`)


  calWin.append("circle")
  .attr("cx", width/2-height/4)
  .attr("cy", height/4)
  .attr("r", sHeight)
  .attr("fill", "red")

  calWin.append("circle")
  .attr("cx", width/2-height/4)
  .attr("cy", height/4)
  .attr("r", sHeight-3)
  .attr("fill", "white")


  calWin.append("circle")
  .attr("cx", width/2+height/4)
  .attr("cy", height/4)
  .attr("r", sHeight)
  .attr("fill", "black")

  calWin.append("circle")
  .attr("cx", width/2+height/4)
  .attr("cy", height/4)
  .attr("r", sHeight-3)
  .attr("fill", "white")

  calWin.append("circle")
  .attr("cx", width/2-height/4)
  .attr("cy", 3*height/4)
  .attr("r", sHeight)
  .attr("fill", "black")

  calWin.append("circle")
  .attr("cx", width/2-height/4)
  .attr("cy", 3*height/4)
  .attr("r", sHeight-3)
  .attr("fill", "white")

  calWin.append("circle")
  .attr("cx", width/2+height/4)
  .attr("cy", 3*height/4)
  .attr("r", sHeight)
  .attr("fill", "red")

  calWin.append("circle")
  .attr("cx", width/2+height/4)
  .attr("cy", 3*height/4)
  .attr("r", sHeight-3)
  .attr("fill", "white")

  //draw stars
  calWin.selectAll("path")
  .data(d3.range(4))
  .enter()
  .append("path")
  .attr("d",(d)=>drawStar(d%2===0?width/2-height/4:width/2+height/4, d<2?height/4:3*height/4))
  .attr("id",function(d){return "star"+d})
  .attr("fill",function(d){return d%3===0?"red":"black"})

  rotateStars("#star0");
  rotateStars("#star1");
  rotateStars("#star2");
  rotateStars("#star3");

}//16th


//////////////////////////
// 17th: a pointy thing
//////////////////////////
function addContent17(){
  let num = 16;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("17: pointy / piikikäs")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  //container
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  let cx = width/2
  let cy = height/2

  let colorScale = d3.scaleSequential()
                    .domain([width/2,0])
                    .interpolator(d3.interpolateViridis)

  let opacityScale = d3.scaleLinear()
                      .domain([0,width/2])
                      .range([1,0.3])

calWin.append("path")
.attr("d", pathForPolygon(cx,cy,width,17,false))
.attr("fill", colorScale(width/17))
.attr("opacity",opacityScale(width/3))


  for(let i = 17; i > 0; i-- ){
    calWin.append("path")
    .attr("d", pathForPolygon(cx,cy,width/17*i,17,true))
    .attr("fill", colorScale(width/17*i))
    .attr("opacity",opacityScale(width/17*i))
  }

}//17th


//////////////////////////
// 18th:
//////////////////////////
function addContent18(){
  let num = 17;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("18: 2nd pulse")

  //container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let padding = 5;
  let width = +calWin.attr("width")-padding
  let height = +calWin.attr("height")-padding

  let side = width < height ? width : height;

  let xVar = width/3;
  let yVar = side/3;

  let targetR = side/3;

  let data = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      data.push([xVar*(i+0.5),yVar*(j+0.5),randomBetween(3,9)])
    }
  }

  //colorscale
  let colorScale = d3.quantize(d3.interpolateViridis, 9);

  //calculate duration
  function getDuration(d,i){
    return (i%2)*500 + 2000;
  }


  //handle pulse
  function pulse() {
  			var item = calWin.selectAll("path");
  			(function repeat() {
  				item = item.transition()
          .duration(getDuration)
            .attr("d", (d,i) => pathForPolygon(d[0],d[1],20,d[2],i%3===0?true:false))
  					.transition()
            .duration(getDuration)
            .attr("d", (d,i) => pathForPolygon(d[0],d[1],randomBetween(10,30),d[2],i%3===0?true:false))
  					.on("end", repeat);
  			})();
  }

  //draw polygons
      calWin.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d,i) => pathForPolygon(d[0],d[1],20,d[2],i%3===0?true:false))
      .attr("fill", function(d,i){
        return colorScale[i];
       })
      .attr("stroke", function(d,i){
        return colorScale[8-i];
       })
      .transition()
      .duration(getDuration)
        .attr('stroke-width', 0)
        .attr("d", (d,i) => pathForPolygon(d[0],d[1],randomBetween(10,30),d[2],i%3===0?true:false))
         .on("end", pulse);

}//18th

//////////////////////////
// 19th: bubbles in boxes
//////////////////////////
function addContent19(){
  let num = 18;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("19: bubblox/palloota")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  //container
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //controlling
  let numOfBoxes = 3
  let colors = ["red","yellow","orange"]


  let data = {children: []}
  //generate data
  for(let i=0; i<19; i++){
    // data.push({
      data.children.push({
        ordernum: i,
        id: "box"+randomBetween(0,numOfBoxes-1),
        value: randomBetween(10,100)
      });
  }


  //draw boxes for bubbles
  calWin.selectAll("rect")
  .data(d3.range(numOfBoxes))
  .enter()
  .append("rect")
  .attr("x",function(d){return 0+d*width/3;})
  .attr("y",0)
  .attr("width",width/3)
  .attr("height",height)
  .attr("id",d=>"box"+d)
  .attr("fill",function(d) {return colors[d]})


  let bubbles = d3.pack(data)
                .size([width/3,height])
                .padding(2)

  let nodes = d3.hierarchy(data)
                .sum(function(d){return d.value; })

//box0
  let node = calWin.selectAll(".box0")
      .data(bubbles(nodes).descendants())
      .enter()
      .filter(function(d){
        return !d.children;})
      .append("g")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .append("circle")
      .attr("r", (d) => d.r )
      .attr("fill",function(d){
        let c = "white";
        if(d.data.id==="box1"){
          c=colors[1]
        }else if (d.data.id==="box2") {
          c=colors[2]
        }
        return c;
      })
      .attr("class","box0")


  //box1
  node = calWin.selectAll(".box1")
        .data(bubbles(nodes).descendants())
        .enter()
        .filter(function(d){
          return !d.children;})
        .append("g")
        .attr("transform", function(d) {
          return "translate(" + (d.x+width/3) + "," + d.y + ")";
        })
        .append("circle")
        .attr("r", (d) => d.r )
        .attr("fill",function(d){
          let c = "white";
          if(d.data.id==="box0"){
            c=colors[0]
          }else if (d.data.id==="box2") {
            c=colors[2]
          }
          return c;
        })
        .attr("class","box1")

    //box2
    node = calWin.selectAll(".box2")
          .data(bubbles(nodes).descendants())
          .enter()
          .filter(function(d){
            return !d.children;})
          .append("g")
          .attr("transform", function(d) {
            return "translate(" + (d.x+2*width/3) + "," + d.y + ")";
          })
          .append("circle")
          .attr("r", (d) => d.r )
          .attr("fill",function(d){
            let c = "white";
            if(d.data.id==="box0"){
              c=colors[0]
            }else if (d.data.id==="box1") {
              c=colors[1]
            }
            return c;
          })
          .attr("class","box2")


}//19th


//////////////////////////
// 20th: Pascal trianle up to the row where 20 is the first time
//////////////////////////
function addContent20(){
  let num = 19;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("20: Pascal")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  //container
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")

  //box size
  let bWidth = width/7;
  let bHeight = height/7;

  //colors
  let colors = d3.quantize(d3.interpolatePlasma,21)

  //data
  let data = [];
  for (let i = 0; i < 7; i++) {
    data[i] = [];
    for(let j=0; j<(i+1); j++){
      data[i].push({
        x: bWidth*(3-i/2)+j*bWidth,
        y: i*bHeight,
        value: j===0?1:j===i?1:(data[i-1][j]).value+(data[i-1][j-1]).value
      });
    }
  }


  //rows
  let rows = calWin.selectAll(".row")
  .data(data)
  .enter()
  .append("g")
  .attr("class","row")

  //boxes
  let box = rows.selectAll(".box")
  .data(function(d){ return d;}) //get data out of rows
  .enter()
  .append("rect")
  .attr("class","box")
  .attr("x", d => d.x)
  .attr("y", d => d.y)
  .attr("width",bWidth)
  .attr("height", bHeight)
  .attr("fill", d => colors[d.value])
  .attr("stroke", d => colors[21-d.value])
  
}//20th



//////////////////////////
//
//////////////////////////
function addContent(){
  let num = 0;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  //change title
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("1: circle / ympyrä")

  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])

  let width = +calWin.attr("width")
  let height = +calWin.attr("height")


  calWin.append("circle")
  .attr("cx", 100)
  .attr("cy", 100)
  .attr("r", 50)
  .attr("fill", "blue")
}//


//Calling content creators
addContent1();
addContent2();
addContent3();
addContent4();
addContent5();
addContent6();
addContent7();
addContent8();
addContent9();
addContent10();
addContent11();
addContent12();
addContent13();
addContent14();
addContent15();
addContent16();
addContent17();
addContent18();
addContent19();
addContent20();

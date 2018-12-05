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
    {"source": "red", "target": "orange", "id": "black"},
    {"source": "orange", "target": "yellow", "id": "black"},
    {"source": "yellow", "target": "blue", "id": "black"},
    {"source": "blue", "target": "violet", "id": "black"},
    {"source": "violet", "target": "red", "id": "black"},

    {"source": "red", "target": "yellow", "id": "white"},
    {"source": "red", "target": "blue", "id": "white"},
    {"source": "yellow", "target": "violet", "id": "white"},
    {"source": "orange", "target": "blue", "id": "white"},
    {"source": "orange", "target": "violet", "id": "white"}
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
    .attr("class", function(d) {return d.id==="white" ? "out" : "link"})
    .attr("stroke", function(d) { return d.id;} );


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
  d3.select(calWindows[num]._groups[0][0].childNodes[0]).text("1: circle / ympyrä")

  //get container
  let calWin = d3.select(calWindows[num]._groups[0][0].childNodes[1])
  let width = +calWin.attr("width")
  let height = +calWin.attr("height")
  // let padding = 10;

  //data
  let data = {"values": [103,104,104,105,105,106,106,106,107,107,106,106,105,105,104]}

  calWin.selectAll("path")
    .data(d3.contours()
        .size([width, height])
        // .size([volcano.width, volcano.height])
        .thresholds(d3.range(90, 195, 5))
      (data.values))
    .enter().append("path")
      // .attr("d", d3.geoPath(d3.geoIdentity().scale(width / volcano.width)))
      .attr("d", d3.geoPath(d3.geoIdentity().scale(1)))
      .attr("fill", "lightBlue")
      .attr("stroke","black");
      // .attr("fill", function(d) { return color(d.value); });

}//6th

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

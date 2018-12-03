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
// 1st: simple circle
//////////////////////////
function addContent1(){
  let num = 0;
  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen")

  d3.select(calWindows[num]._groups[0][0].childNodes[1])
  .append("circle")
  .attr("cx",100)
  .attr("cy", 100)
  .attr("r", 50)
  .attr("fill", "blue")
}

//////////////////////////
// 2nd: pie
//////////////////////////
function addContent2(){
  let num = 1;

  //for the pie
  const data = [{value: 23}, {value: 56}];
  const r = cwW/3;

  //change class to calWindowOpen
  d3.select(calWindows[num].node())
    .attr("class", "calWindowOpen");

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


  //scales
  let yScale = d3.scaleBand()
        .range([height, 0])
        .domain(data.map(d => d.name))
        .padding(0.2);

  calWin.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

  let xScale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, function(d){ return d.value; }))

  calWin.append("g")
    .attr("transform", `translate(${margin.left},${height})`)
    .call(d3.axisBottom(xScale))


  let barGroup = calWin
    .append("g")


  .append("circle")
  .attr("cx",150)
  .attr("cy", 150)
  .attr("r", 50)
  .attr("fill", "orange")
} //3rd


//Calling content creators
addContent1();
addContent2();
addContent3();

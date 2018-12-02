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


//1st
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

//2nd
//pie
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
    // .attr("transform", `translate(${width / 2},${height / 2})`);
           .attr("transform", "translate("+(cwW/2)+","+(cwH/2.5)+")");

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

}


//Calling content creators
addContent1();
addContent2();

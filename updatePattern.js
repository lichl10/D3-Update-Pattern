// create svg with margin convention
const margin = ({ top: 20, right: 20, bottom: 20, left: 40 });
const width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
// create scales without domains
const xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);
const yScale = d3.scaleLinear()
    .range([height, 0]);
// create axes and axis title containers
const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
g.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`);
g.append("g")
    .attr("class", 'axis y-axis');
svg.append('text')
    .attr("class", "y-axis-title")
    .attr('x', 7)
    .attr('y', 11)
    .text("stores");
// Define update parameters: measure type, sorting direction
let type = document.querySelector("#group-by").value;
function update(data, type, reverse){
    //sort the bars
    data = (reverse == 0)?data.sort((a,b)=>b[type]-a[type]):data.sort((a,b)=>a[type]-b[type]);
    // update domains
    xScale.domain(data.map(d => d.company));
    yScale.domain([0, d3.max(data, d => d[type])]);
	// update bars
    const bars = g.selectAll('.bar').data(data,d=>d.company);
    bars.enter()
        .append('rect')
        .attr("class","bar")
        .merge(bars)
        .transition()
        .delay((d,i)=> i * 10)
        .duration(1000)
        .attr('x', d=>xScale(d.company))
        .attr('y', d =>yScale(d[type]))
        .attr('height',  d=>height-yScale(d[type]))
        .attr('width', xScale.bandwidth())
        .style('fill', '#6699CC');
    bars.exit()
        .transition()
        .duration(1000)
        .attr('x', width)
        .remove();
	// update axes and axis title
    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);
    g.select('.x-axis')
        .transition()
        .call(xAxis);
    g.select('.y-axis')
        .transition()
        .call(yAxis);
    let label;
    (type=="revenue")?label="Billion USD":label="Store";
    svg.select('.y-axis-title')
        .text(label);
}
// Loading data
d3.csv("./coffee-house-chains.csv", d3.autoType).then(data => {
    let reverse=0;
    update(data,type,reverse);
    // Handling the type change
    let element = document.querySelector('#group-by');
    element.addEventListener('change', (event)=>{
        type = document.querySelector("#group-by").value;
        reverse=0
        update(data,type,reverse);
    });
    // Handling the sorting direction change
    d3.select('.sort').on('click', ()=>{
        //(sorted==0)?sorted==1:sorted==0;
        reverse=1;
        update(data,type,reverse);
    })
});

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthdata) { // 

    healthdata.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthdata, d => d.healthcare)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthdata, d => d.poverty)])
        .range([height, 0]);

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Hair length: ${d.healthcare}<br>Hits: ${d.poverty}`);
        });
});
chart.call(toolTip);

chart
    .selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
        return xLinearScale(data.healthcare);
    })
    .attr("cy", function(data, index) {
        return yLinearScale(data.poverty);
    })
    .attr("r", "20")
    .attr("stroke", "black")
    .attr("opacity", 0.70)
    .attr("fill", "light red")
    .on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
    });

chart
    .append("g")
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

chart.append("g").call(leftAxis);

svg.selectAll(".dot")
    .data(healthData)
    .enter()
    .append("text")
    .text(function(data) { return data.abbr; })
    .attr("x", function(data) {
        return xLinearScale(data.healthcare);
    })
    .attr("y", function(data) {
        return yLinearScale(data.poverty);
    })
    .attr("font-size", "10px")
    .attr("fill", "blue")
    .style("text-anchor", "middle");

chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack Healthcare");

chart
    .append("text")
    .attr("transform", "translate(" + width / 2 + " , " + (height + margin.top + 30) + ")", )
    .attr("class", "axisText")
    .text("In Poverty (%)");
}).catch(function(error) {
    console.log(error);
});
looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  id: "scatter_v2",
  label: "scatter_v2",

  // here is where you add options - need to change
  options: { 
    font_size: {
      type: "string",
      label: "Font Size",
      values: [
        {"Large": "large"},
        {"Small": "small"}
      ],
      display: "radio",
      default: "large"
    }
  },

// initial function build HTML template
// don't have imports here
create: function(element, config) {
  element.innerHTML = `
  <!DOCTYPE html>
<meta charset="utf-8">
<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>`
},

updateAsync: function(data, element, config, queryResponse, details, done){
    // Clear any errors from previous updates
    this.clearErrors();

    console.log(typeof(data))
    console.log(data)
    console.log(data[0])
    console.log(JSON.stringify(data))

    console.log("is this here?")

    for (const d of data){
    console.log(d)
    };

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleLinear()
    .domain([0, 4000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 500000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d['funded']['value']); } )
      .attr("cy", function (d) { return y(d['number_proposed']['value']); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")


    done()
}
});

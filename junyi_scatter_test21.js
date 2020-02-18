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

//     console.log(typeof(data))
//     console.log(data)
//     console.log(data[0])
//     console.log(JSON.stringify(data))

//     console.log("is this here?")

//     for (const d of data){
//     console.log(d)
//     };
  
//   get basic values:
  const length_of_data = Object.values(data).length
  const length_of_values = Object.values(data[0]).length
  
  
  const col_naming = Object.keys(data[0])[0]
  // first row name
  
  const y_col = Object.keys(data[0])[length_of_values-1]
  // const y_col = 'number_proposed'
  
  const x_col = Object.keys(data[0])[length_of_values-2]
  // const x_col = 'funded'
  
  var x_arr = new Array()
  var y_arr = new Array()
  
  
  // get max and min values for sizing of graphs
  for (let n = 0 ; n <= length_of_data - 1; n ++ ) {
    console.log(n)

    // console.log(typeof data[n][y_col]['value'])
    // console.log(data[n][y_col]['value'])
    // console.log(data[n][y_col]['value'] || 0)

    if (typeof(data[n][x_col]['value'] ) == 'number'){
      const x_push = data[n][x_col]['value'];
      console.log(typeof(x_push))
      x_arr.push(x_push)
    } else {
      x_arr.push(0)
    }

    const x_push = data[n][x_col]['value'] || 0;
    // console.log(typeof(x_push))


     if (typeof(data[n][y_col]['value'] ) == 'number'){
      const y_push = data[n][y_col]['value'];
      console.log(typeof(y_push))
      y_arr.push(y_push)
    } else {
      y_arr.push(0)
    };
    

    // const y_push = data[n][y_col]['value'] || 0;
    // console.log(y_push)

    // y_arr.push(y_push)
  };
  
  
    const max_x = Math.max.apply(Math, x_arr) * 1.1
    const min_x = Math.min.apply(Math, x_arr) * 0.9
    const max_y = Math.max.apply(Math, y_arr) * 1.1
    const min_y = Math.min.apply(Math, y_arr) * 0.9
  

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


  // Add X axis
  var x = d3.scaleLinear()
    .domain([min_x, max_x])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([min_y, max_y])
    .range([ height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));


  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d[x_col]['value']); } )
      .attr("cy", function (d) { return y(d[y_col]['value']); } )
      .attr("r", 2.5)
      .style("fill", "#69b3a2")


  // Add names
  svg.append('g')
     .selectAll("text")
     .data(data)
     .enter()
     .append('text')
     .text(function(d) {return d[col_naming]['value'];})
    .attr("x", function (d) { return x(d[x_col]['value']); } )
    .attr("y", function (d) { return y(d[y_col]['value']); } )
    .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "black");

 
    done()
}
});

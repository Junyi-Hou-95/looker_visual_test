<!DOCTYPE html>
<meta charset="utf-8">

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>

<script type="text/javascript">
// set the dimensions and margins of the graph
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

//     const data = `
// [
//   {
//     "arranger.dealer": {
//       "value": "Evolution Funding 2018 Ltd",
//       "links": [
//         {
//           "label": "View in Salesforce",
//           "url": "https://oodle.lightning.force.com/0015800000hf1slAAA",
//           "type": "url",
//           "icon_url": "https://drdds.com/wp-content/uploads/2019/02/salesforce-favicon.png"
//         }
//       ],
//       "html": "Evolution Funding 2018 Ltd "
//     },
//     "applications.volume_funded": {
//       "value": 155298307.17,
//       "rendered": "£155,298,307",
//       "links": [
//         {
//           "label": "Show All £155,298,307",
//           "url": "/explore/oodlefinance/applications?fields=applications.application_name,applications.applicant_1,applications.created_date,applications.closed_date,applications.volume_funded&f[arranger.dealer]=Evolution+Funding+2018+Ltd&f[arranger.dealer_id]=0015800000hf1slAAA&f[applications.funded]=yes&query_timezone=UTC&limit=500",
//           "type": "measure_default"
//         }
//       ]
//     },
//     "applications.number_of_applications": {
//       "value": 181196,
//       "rendered": "181,196",
//       "links": [
//         {
//           "label": "Show All 181,196",
//           "url": "/explore/oodlefinance/applications?fields=applications.application_name,applications.created_date,applications.purchase_price,applications.total_finance_amount,applications.apr,applications.accepted,applications.funded,applications.current_stage&f[arranger.dealer]=Evolution+Funding+2018+Ltd&f[arranger.dealer_id]=0015800000hf1slAAA&query_timezone=UTC&limit=500",
//           "type": "measure_default"
//         }
//       ]
//     },
//     "number_proposed": {
//       "value": 5.258148606160319,
//       "rendered": "5.258148606160319"
//     },
//     "funded": {
//       "value": 8.191166721725114,
//       "rendered": "8.191166721725114"
//     }
//   },
//   {
//     "arranger.dealer": {
//       "value": "Carfinance247",
//       "links": [
//         {
//           "label": "View in Salesforce",
//           "url": "https://oodle.lightning.force.com/0015800001bE4NKAA0",
//           "type": "url",
//           "icon_url": "a"
//         }
//       ],
//       "html": "Carfinance247 "
//     },
//     "applications.volume_funded": {
//       "value": 50127044.93,
//       "rendered": "£50,127,045",
//       "links": [
//         {
//           "label": "Show All £50,127,045",
//           "url": "/explore/oodlefinance/applications?fields=applications.application_name,applications.applicant_1,applications.created_date,applications.closed_date,applications.volume_funded&f[arranger.dealer]=Carfinance247&f[arranger.dealer_id]=0015800001bE4NKAA0&f[applications.funded]=yes&query_timezone=UTC&limit=500",
//           "type": "measure_default"
//         }
//       ]
//     },
//     "applications.number_of_applications": {
//       "value": 197867,
//       "rendered": "197,867",
//       "links": [
//         {
//           "label": "Show All 197,867",
//           "url": "/explore/oodlefinance/applications?fields=applications.application_name,applications.created_date,applications.purchase_price,applications.total_finance_amount,applications.apr,applications.accepted,applications.funded,applications.current_stage&f[arranger.dealer]=Carfinance247&f[arranger.dealer_id]=0015800001bE4NKAA0&query_timezone=UTC&limit=500",
//           "type": "measure_default"
//         }
//       ]
//     },
//     "number_proposed": {
//       "value": 5.296373369178862,
//       "rendered": "5.296373369178862"
//     },
//     "funded": {
//       "value": 7.700072103008778,
//       "rendered": "7.700072103008778"
//     }
//   },
//   {
//     "arranger.dealer": {
//       "value": "AXY (2005) Ltd",
//       "links": [
//         {
//           "label": "View in Salesforce",
//           "url": "https://oodle.lightning.force.com/0015800001IKEQTAA5",
//           "type": "url",
//           "icon_url": "a"
//         }
//       ],
//       "html": "AXY (2005) Ltd "
//     },
//     "applications.volume_funded": {
//       "value": 0,
//       "rendered": "£0",
//       "filterable_value": "0.0",
//       "links": [
//         {
//           "label": "Show All £0",
//           "url": "/explore/oodlefinance/applications?fields=applications.application_name,applications.applicant_1,applications.created_date,applications.closed_date,applications.volume_funded&f[arranger.dealer]=AXY+%282005%29+Ltd&f[arranger.dealer_id]=0015800001IKEQTAA5&f[applications.funded]=yes&query_timezone=UTC&limit=500",
//           "type": "measure_default"
//         }
//       ]
//     },
//     "applications.number_of_applications": {
//       "value": 3,
//       "links": [
//         {
//           "label": "Show All 3",
//           "url": "/explore/oodlefinance/applications?fields=applications.application_name,applications.created_date,applications.purchase_price,applications.total_finance_amount,applications.apr,applications.accepted,applications.funded,applications.current_stage&f[arranger.dealer]=AXY+%282005%29+Ltd&f[arranger.dealer_id]=0015800001IKEQTAA5&query_timezone=UTC&limit=500",
//           "type": "measure_default"
//         }
//       ]
//     },
//     "number_proposed": {
//       "value": 0.4771212547196623,
//       "rendered": "0.4771212547196623"
//     },
//     "funded": {
//       "value": null,
//       "rendered": "null"
//     }
//   }
// ]
// `
  // const parsedData = JSON.parse(data);

  // console.log(parsedData);




  var x_looker = function(data) {

  

  console.log(typeof(data))
  console.log(data)


  const min_y_10_percent = 0
  const max_y_10_percent = 10

  const min_x_10_percent = 0
  const max_x_10_percent = 10



  const keys = Object.values(data)
  
  length_of_data = Object.values(data).length
  length_of_values = Object.values(data[0]).length


  console.log(length_of_values)

  // value of the funded (length_of_values-1) of the first row (data[0])
  console.log(Object.values(data[0])[length_of_values-1]['value'])

  // value of the funded (length_of_values-1) of the first row (data[0])
  console.log(Object.values(data[0])[length_of_values-2]['value'])

  // value of the first element of the row (second [0]) of the first row (data[0])
  console.log(Object.values(data[0])[0]['value'])

  console.log(keys)

  console.log(data[2])





  

  const y_col = Object.keys(data[0])[length_of_values-1]
  // const y_col = 'number_proposed'
  const x_col = Object.keys(data[0])[length_of_values-2]
  // const x_col = 'funded'
  



  // for (const d of data){
  //   console.log('second thing')
  // console.log(typeof(d))
  // console.log(d)
  // };

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, max_x_10_percent])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, max_y_10_percent])
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
      .attr("cy", function (d) {  console.log('input-------------'); console.log(d);console.log(d[x_col]['value']) ;return y(d[y_col]['value']); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

};


// x(csv_data)
x_looker(parsedData)

</script>

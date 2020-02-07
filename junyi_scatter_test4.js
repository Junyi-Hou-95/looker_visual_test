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


    console.log("is this here?")
     
    for (const d of data){
    console.log(d)
    }


    done()
}
});

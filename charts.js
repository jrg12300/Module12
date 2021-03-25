function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();
console.log('heyy')

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}




// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var first_sample=resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids=first_sample.otu_ids;
    var otu_labels=first_sample.otu_labels;
    var sample_values=first_sample.sample_values;;
    var otu_ids_formated=[];
    var otu_array=[];

    // 8. Create the trace for the bar chart. 
    // 9. Create the layout for the bar chart. 
    // Slice the first 10 objects for plotting// Reverse the array due to Plotly's defaults

    for (i = 0; i < otu_ids.length; i++) {otu_ids_formated.push('OTU '.concat(otu_ids[i]));}

    for (i = 0; i < otu_ids.length; i++) {otu_array[i]=[otu_ids_formated[i],otu_labels[i],sample_values[i]];}

    //https://riptutorial.com/javascript/example/3443/sorting-multidimensional-array
    otu_array.sort(function(a, b) {return a[2] - b[2];})
    otu_array10 = (otu_array.slice(-10))

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var xdata = [];
    var ydata =[];
    var lables = [];
    
    for (i = 0; i < otu_array10.length; i++) 
    {
      xdata[i]= otu_array10[i][2]
      ydata[i]=otu_array10[i][0]
      lables[i] = otu_array10[i][1]
    }

    // Trace1 for the Bar Graph Data
    var trace1 = { x: xdata, y: ydata,text: lables, name: "Greek", type: "bar", orientation: "h"};
    // data
    var data = [trace1];
    // Apply the group bar mode to the layout
    var layout = {title: "Sample Bacteria", margin: {l: 100,r: 100,t: 100,b: 100} };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);



    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x:otu_ids_formated , y:sample_values , mode: 'markers',  marker:{size: sample_values}
      }; 
    var bubbleData = [trace2];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Marker Size',
      showlegend: false,
      height: 500,
      width: 600      
    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    

  });
}




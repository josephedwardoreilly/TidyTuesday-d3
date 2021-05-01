
    // print data in the console
    // d3.csv("cleaned.csv", function(data) {
    //     for (var i = 0; i < data.length; i++) {
    //         console.log(data[i].year);
    //         console.log(data[i].N);
    //     }
    // });

    
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
              "translate(" + margin.left + "," + margin.top + ")")
        .style('opacity', 1);

      // Set up a div to be used to display values on rollover
      var Tooltip = d3.select("#my_dataviz")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("position", "absolute")
                  .style("opacity", 0)
                  .style("background-color", "lightgrey")
                  .style("border", "solid")
                  .style("border-width", ".5px")
                  .style("border-radius", "5px")
                  .style("padding", "5px");

     
    
    //Read the data
    d3.csv("cleaned.csv",
    
      // Second argument is a function that uses the loaded data
      function(data) {


        // Nest data by symbol.
        var state = d3.nest()
                        .key(function(d) { return d.state; })
                        .entries(data);

        // Compute the maximum net change per state, needed for the y-domain.
        state.forEach(function(s) {
        s.maxPrice = d3.max(s.values, function(d) { return d.net; });
                        });                
    

        // Compute the minimum and maximum date across symbols.
        // We assume values are sorted by date.
           x.domain([
            d3.min(symbols, function(s) { return s.values[0].Y; }),
            d3.max(symbols, function(s) { return s.values[s.values.length - 1].Y; })
           ]);

        // Add an SVG element for each symbol, with the desired dimensions and margin.
        var svg = d3.select("body").selectAll("svg")
        .data(state)
        .enter().append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        
            
          })

    // print data in the console
    // d3.csv("cleaned.csv", function(data) {
    //     for (var i = 0; i < data.length; i++) {
    //         console.log(data[i].year);
    //         console.log(data[i].N);
    //     }
    // });


    // set the dimensions and margins of the graph
    var margin = {top: 8, right: 10, bottom: 2, left: 10},
    width = 960 - margin.left - margin.right,
    height = 69 - margin.top - margin.bottom;

    // NOT SURE WHY THIS IS OUTSIDE THE FUNCTION? 
    var x = d3.scale.linear()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);
    
    // set up a method to draw the line plot
    var line = d3.svg.line()
    .x(function(d) { return x(d.Y); })
    .y(function(d) { return y(d.net); });

    
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

        // Add the line path elements. Note: the y-domain is set per element.
        svg.append("path")
        .attr("class", "line")
        .attr("d", function(d) { y.domain([0, d.maxPrice]); return line(d.values); });
            
          })
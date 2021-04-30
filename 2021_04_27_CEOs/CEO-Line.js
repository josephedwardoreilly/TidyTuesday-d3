
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
    
        // Add X axis 
        var x = d3.scaleLinear()
          .domain(d3.extent(data, d => d.year))
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
                  .tickFormat(d3.format("")) // this formats the tick label to remove the comma in thousands
                  );

        // text label for the x axis
        svg.append("text")             
           .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "left")
            .text("Year"); // the actual label text
    
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([d3.min(data, d => d.N - 10), d3.max(data, function(d) { return +d.N + 10; })])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // text label for the y axis
        svg.append("text")             
           .attr("transform", "rotate(-90)")
           .attr("y", 0 - margin.left)
           .attr("x", 0 - (height / 2))
           .attr("dy", "2em")
           .style("text-anchor", "middle")
           .text("Number of departing CEOs");
    
        // Add the line
        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          .style('opacity', 0)
          .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(d.N) })
            )
          .transition()
          .delay(100)
          .duration(1000)
          .style("opacity", 1.0);

 
          // Three function that change the tooltip when user hover / move / leave a cell
          var mouseover = function(d) {
            Tooltip.html("Number of CEO departures = " + d.N)
                   .style("left", (d3.mouse(this)[0]+70) + "px")
                   .style("top", (d3.mouse(this)[1]) + "px")
                   .transition() // opacity transition in on rollover
                   .duration(500)
                   .style("opacity", .9)
                   
            d3.select(this) // highlight the dot itself as a transition on rollover
              .transition()
              .duration(100)
              .style('fill', 'red')
              .attr('r', 6)
          }

          var mouseleave = function(d) {
            Tooltip.transition() // opacity transition out on rollover
                   .duration(500)
                   .style("opacity", 0)

            d3.select(this)
              .transition()
              .duration(100)
              .style('fill', 'black')
              .attr('r', 4)
          }


        // Add dots
        svg.append('g')
          .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.year); } )
              .attr("cy", function (d) { return y(d.N); } )
              .attr("r", 4)
              .style("fill", "black")
              .on('mouseover', mouseover) // These define behaviour on mouse events, functions for second parameter defined above
              .on('mouseout', mouseleave)            
            
          })
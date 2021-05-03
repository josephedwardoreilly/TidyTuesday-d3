
    // points, with jitter
    // x axis is date-time
    // y is constant as 1, with jitter [is a y axis needed?]
    // colour is linked to agency_type
    // add an arc transofrmation for x points
    
    
    // print data in the console
    // d3.csv("cleaned.csv", function(data) {
    //     for (var i = 0; i < data.length; i++) {
    //         console.log(d3.extent(d => d.dodge));
    //     }
    // });

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 1400 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
        .style('opacity', 1)
       ;

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
    
    // When reading the csv, I must format variables as the second argument:
    function(d){
      return { launch_date: d3.timeParse("%Y-%m-%d")(d.launch_date), agency_type : d.agency_type, mission : d.mission , dodge : d.dodge}
    },
    
      // Second argument is a function that uses the loaded data
      function(data) {
    

        // Add X axis 
        var x = d3.scaleTime()
                  .domain(d3.extent(data, function(d) { return d.launch_date; }))
                  .range([ 0, width ]);
           svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x))
              .selectAll('text')
              .style('fill', 'white')
              .attr('font', 'Bebas')
              ;

        // text label for the x axis
        svg.append("text")             
           .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "left")
            .style('fill', 'white')
            .text("Launch Date"); // the actual label text
    
        // Add Y axis
        var y = d3.scaleLinear()
          .domain(d3.extent(data, function(d) { return +d.dodge; }))
          .range([ height, 0 ]);
        svg.append("g")

        // color the dots by launch type
        // define the ordinal colour scale
        var color = d3.scaleOrdinal()
        .domain(["state", "private", "startup" ])
        .range([ "#7EBDC2", "#BB4430", "#FFD23F"])

 
          // Three function that change the tooltip when user hover / move / leave a cell
          var mouseover = function(d) {
            Tooltip.html("Mission: " + d.mission + "<br>Agency: " + d.agency_type)
                   .style("left", (d3.mouse(this)[0]) + 10 + "px")
                   .style("top", (d3.mouse(this)[1]) + height/3 + "px")
                   .style("opacity", .9)
                   
            d3.select(this) // highlight the dot itself as a transition on rollover
              .style('opacity', 1)
              .attr('r', 10)
          }

          var mouseleave = function(d) {
            Tooltip.style("opacity", 0)
                   
            d3.select(this)
              .style('opacity', .75)
              .attr('r', 4)
          }

     

        // Add dots
        svg.append('g')
          .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.launch_date); } )
              .attr("cy", function (d) { return y(d.dodge); }  )
              .attr("r", 4)
              .style("opacity", 0.1)
              .style("fill", function (d) { return color(d.agency_type) } )
              .transition()
              .duration(1000)
              .style("opacity", 0.75)

              svg.selectAll('circle')
              .on('mouseover', mouseover) // These define behaviour on mouse events, functions for second parameter defined above
              .on('mouseout', mouseleave)     
              
              




})
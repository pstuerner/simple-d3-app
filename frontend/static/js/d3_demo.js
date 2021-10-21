
function chart1 (dataRaw) {
    function updateAxis () {
        // Function to adjust the axis according to new data
        xScale.domain(d3.extent(data, d => d.X));
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        yScale.domain(d3.extent(data, d => d.y));
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
      }

      function updateScatter () {
        // Function to adjust the scatter according to new data
        scatter
        .selectAll('.scatter')
        .data(data)
        .join(
            enter => {
                enter
                .append('circle')
                .attr('class', 'scatter')
                .attr('id', d => `scatter-${d.i}`)
                .attr('cx', d => xScale(d.X))
                .attr('cy', d => yScale(d.y))
                .attr('r', 5)
                .style('fill', 'dodgerblue')
                .transition()
                .duration(500)
            },
            update => {
                update
                .transition()
                .duration(500)
                .delay((d,i)=>i*10)
                .attr('cx', d => xScale(d.X))
                .attr('cy', d => yScale(d.y))
                .attr('r', 5)
            },
            exit => {
                exit.remove()
            }
        )
    }

    // Prepare data
    let data = dataRaw.data;

    // Define margin and size
    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = d3.select('#chart').node().getBoundingClientRect().width - margin.left - margin.right,
        height = d3.select('#chart').node().getBoundingClientRect().height - margin.top - margin.bottom;
 
    // Define the scales
    let xScale = d3.scaleLinear().range([0, width]),
        yScale = d3.scaleLinear().range([height, 0]);

    // Create chart
    let svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Create axes
    let xAxis = svg.append("g").attr("transform", `translate(0,${height})`),
        yAxis = svg.append("g");
    
    // Create scatter group
    let scatter = svg.append('g').attr('class', 'scatter-group');

    // Update
    updateAxis()
    updateScatter()

    // Button
    d3.select('#new-data-button').on('click', function () {
        d3.json('http://localhost:8081/data?return_theta=true').then(function(dataRaw) {
            data = dataRaw.data
            updateAxis()
            updateScatter()
        });
    })
}


d3.json('http://localhost:8081/data?return_theta=true').then(function(dataRaw) {
    chart1(dataRaw); 
  });
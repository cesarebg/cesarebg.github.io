var margin = {
  top: 50,
  left: 60,
  right: 30,
  bottom: 50,
};

var width = 500;
var height = 400;

var svg = d3.select('#vis_pound')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", "0%")
    .attr("x2", 0).attr("y2", "100%")
    .selectAll("stop")
    .data([{
        offset: "0%",
        color: "lime"
      },
      {
        offset: "40%",
        color: "grey"
      },
      {
        offset: "100%",
        color: "red"
      }
    ])
    .enter().append("stop")
    .attr("offset", function(d) {
      return d.offset;
    })
    .attr("stop-color", function(d) {
      return d.color;
    });

    var tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip');

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var dateParse = d3.timeParse('%Y');
    var tooltipFormat = d3.timeFormat('%Y');


    var x = d3.scaleTime()
      .range([0, width]);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var x_axis = d3.axisBottom(x)
    var y_axis = d3.axisLeft(y)

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'x axis');

      // x labels
    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append('g')
      .attr('class', 'y axis');

      // y label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Million £");

      // Title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("UK expenditure by function 2001-2016 in £");

    function make_x_gridlines() {
      return d3.axisBottom(x)
        .ticks(5);
    }

    function make_y_gridlines() {
      return d3.axisLeft(y)
        .ticks(5);
    }

    // add the X gridlines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
      );
    // add the Y gridlines
    svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      );

var button = document.getElementById("gov_function");
button.addEventListener('change', function() {
  var gov_function = button.value;
  var growth_rate_name = [];
  var gov_function_title = [];
  var correlation = [];
  if (gov_function == "1. General public services") {
    growth_rate_name.push('GPS Growth Rate');
    gov_function_title.push('General Public Services');
    correlation.push('0.79');
  } else if (gov_function == "2. Defence") {
    growth_rate_name.push('DEF Growth Rate');
    gov_function_title.push('Defence');
    correlation.push('0.5');
  } else if (gov_function == "3. Public order and safety") {
    growth_rate_name.push('POS Growth Rate');
    gov_function_title.push('Public Order and Safety');
    correlation.push('0.78');
  } else if (gov_function == "4. Economic affairs") {
    growth_rate_name.push('EA Growth Rate');
    gov_function_title.push('Economic Affairs');
    correlation.push('0.87');
  } else if (gov_function == "5. Environment protection") {
    growth_rate_name.push('EP Growth Rate');
    gov_function_title.push('Environment Protection');
    correlation.push('0.87');
  } else if (gov_function == "6. Housing and community amenities") {
    growth_rate_name.push('HCA Growth Rate');
    gov_function_title.push('Housing and Community Amenities');
    correlation.push('0.97');
  } else if (gov_function == "7. Health") {
    growth_rate_name.push('HEA Growth Rate');
    gov_function_title.push('Health');
    correlation.push('0.98');
  } else if (gov_function == "8. Recreation, culture and religion") {
    growth_rate_name.push('RCR Growth Rate');
    gov_function_title.push('Recreation, Culture and Religion');
    correlation.push('0.71');
  } else if (gov_function == "9. Education") {
    growth_rate_name.push('EDU Growth Rate');
    gov_function_title.push('Education');
    correlation.push('0.87');
  } else if (gov_function == "10. Social protection") {
    growth_rate_name.push("SP Growth Rate");
    gov_function_title.push('Social Protection');
    correlation.push('0.93');
  } else if (gov_function == "EU transactions") {
    growth_rate_name.push('EUT Growth Rate');
    gov_function_title.push('EU Transactions');
    correlation.push('0.99');
  } else if (gov_function == "Public sector expenditure on services") {
    growth_rate_name.push('PSES Growth Rate');
    gov_function_title.push('Public Sector Expenditure on Services');
    correlation.push('0.91');
  } else if (gov_function == "Total Managed Expenditure") {
    growth_rate_name.push('TME Growth Rate');
    gov_function_title.push('Total Managed Expenditure');
    correlation.push('0.93');
  }

  console.log(growth_rate_name)


  // function expenditure_pounds() {

  d3.json("/datasets/data_spending_pounds.json", function(data) {
    console.log(data);

    x.domain(d3.extent(data, function(d) {
      return dateParse(d.Date);
    }));

    y.domain(d3.extent(data, function(d) {
      return d[gov_function];
    }));

    var line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(function(d) {
        return x(dateParse(d.Date));
      })
      .y(function(d) {
        return y(d[gov_function]);
      });

    var lines = svg.selectAll('.line')
      .remove()
      .exit()
      .data([data]);

    lines
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      // .attr('stroke', 'steelblue')
      .attr('d', line);

    var points = svg.selectAll('.point')
      .remove()
      .exit()
      .data(data);

    points
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('r', 3)
      .attr('cx', function(d) {
        return x(dateParse(d.Date));
      })
      .attr('cy', function(d) {
        return y(d[gov_function]);
      })
      .attr('fill', 'black')
      .attr('opacity', 1)
      .on('mouseover', mouseOver)
      .on('mousemove', mouseMove)
      .on('mouseout', mouseOut);

    svg.select('.x.axis')
      .call(x_axis)

    svg.select('.y.axis')
      .call(y_axis)

    function mouseOver(d) {
      console.log(d);
      var date = dateParse(d.Date);
      var displayDate = tooltipFormat(date)
      var value_function = d[gov_function];

      d3.select(this)
        .transition()
        .style('opacity', 1);

      tooltip
        .style('display', null)
        .html('<p>UK spending in ' + gov_function_title[0] + ' was £' + value_function + ' million in ' + displayDate + '<br> Year to Year Change: ' + d[growth_rate_name[0]] + '%<br>Correlation coefficient value with %GDP: ' + correlation + '</p>');
    }

    function mouseMove(d) {
      tooltip
        .style('top', (d3.event.pageY - 20) + "px")
        .style('left', (d3.event.pageX + 20) + "px");
    }

    function mouseOut(d) {
      d3.select(this)
        .transition()
        .style('opacity', 1);

      tooltip
        .style('display', 'none');

    }

  });

});

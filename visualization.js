let drawspace = d3.select("#drawspace");

d3.csv(
  "research-and-development-manpower-full-time-equivalence-by-sector.csv"
).then(showData);

var data;
const height = 500;
const width = 700;

function showData(data) {
  this.data = data;
  loadYears();
  loadSectors();
  change();
}

function change() {
  let chartType = document.getElementById("chart_type").value;
  let selectedYear = document.getElementById("year").value;
  let selectedSector = document.getElementById("sector").value;

  if (chartType === "vis1") {
    hideElement("box_sector");
    showElement("box_year");
    drawBarChart(getDataByYear(selectedYear), selectedYear);
  } else if (chartType === "vis2") {
    hideElement("box_year");
    showElement("box_sector");
    drawLineChart(getDataBySector(selectedSector), selectedSector);
  } else if (chartType === "vis3") {
    hideElement("box_sector");
    showElement("box_year");
    drawPieChart1(getDataByManpowerType(selectedYear), selectedYear);
  }
}

function drawBarChart(appData, year) {
  d3.selectAll("svg > *").remove();

  drawspace
    .append("text")
    .attr("transform", "translate(0,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text(
      "Full time equivalence across sectors and type of R&D in year " + year
    );

  var xScale = d3
    .scaleBand()
    .range([0, width])
    .padding(0.4)
    .domain(
      appData.map((d) => {
        return d.sector + " - " + d.type_of_rnd_manpower;
      })
    );

  var yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(appData, (d) => +d.fte)])
    .nice();

  var g = drawspace
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  drawspace
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 800)
    .attr("y", 800)
    .text("Type of R&D personnel in each sector");

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  g.append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -150)
    .attr("dy", "-5.1em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Full-Time Equivalence");

  var mouseover = function (d) {
    d3.select(this).style("stroke", "black").style("fill", "brown");
  };

  var mouseleave = function (d) {
    d3.select(this).style("stroke", "none").style("fill", "steelblue");
  };

  g.selectAll(".bar")
    .data(appData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.sector + " - " + d.type_of_rnd_manpower))
    .attr("y", (d) => yScale(d.fte))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.fte))
    .on("mouseover", mouseover)
    .on("mouseout", mouseleave);
}

function drawLineChart(appData, sector) {
  d3.selectAll("svg > *").remove();

  drawspace
    .append("text")
    .attr("transform", "translate(0,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text(sector + " FTE trend from 2010 to 2018");

  let parseDate = d3.timeParse("%Y");

  var xScale = d3
    .scaleTime()
    .range([0, width])
    .domain(d3.extent(appData, (d) => parseDate(d.year)));

  var yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(appData, (d) => +d.fte)])
    .nice();

  var g = drawspace
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  g.append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -150)
    .attr("dy", "-5.1em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .text("Full-Time Equivalence");

  g.append("path")
    .datum(appData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(parseDate(d.year)))
        .y((d) => yScale(d.fte))
    );
}

function drawPieChart(appData, year) {
  //TODO: Draw Pie Chart Based on Type on Manpower
  d3.selectAll("svg > *").remove();

  drawspace
    .append("text")
    .attr("transform", "translate(0,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text("FTE contribution by type of R&D Manpower in " + year);

  let g = drawspace
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + 400 + ")");

  let types = appData.map((d) => d.type_of_rnd_manpower);

  let color = d3.scaleOrdinal(d3.schemeCategory10).domain(types);

  const pie = d3.pie();

  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2);

  var arcs = g
    .selectAll("arc")
    .data(pie(appData.map((d) => d.fte)))
    .enter()
    .append("g")
    .attr("class", "arc");
  console.log(color("PhD"));
  arcs
    .append("path")
    .attr("fill", (d, i) => color(types[i]))
    .attr("d", arc);
}

function drawPieChart1(d, year) {
  //TODO: Draw Pie Chart Based on Type on Manpower
  d3.selectAll("svg > *").remove();
  // a circle chart needs a radius
  var radius = Math.min(width, height) / 2;

  // legend dimensions
  var legendRectSize = 14.5; // defines the size of the colored squares in legend
  var legendSpacing = 3; // defines spacing between squares

  // define color scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

  drawspace
    .append("text")
    .attr("transform", "translate(0,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text("FTE contribution by type of R&D Manpower in " + year);

  var svg = drawspace
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + 400 + ")");
  var arc = d3
    .arc()
    .innerRadius(0) // none for pie chart
    .outerRadius(radius); // size of overall chart

  var pie = d3
    .pie() // start and end angles of the segments
    .value(function (d) {
      return d.fte;
    }) // how to extract the numerical data from each entry in our dataset
    .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

  // define tooltip
  var tooltip = d3
    .select("#chart") // select element in the DOM with id 'chart'
    .append("div") // append a div element to the element we've selected
    .attr("class", "tooltip"); // add class 'tooltip' on the divs we just selected

  tooltip
    .append("div") // add divs to the tooltip defined above
    .attr("class", "label"); // add class 'label' on the selection

  tooltip
    .append("div") // add divs to the tooltip defined above
    .attr("class", "count"); // add class 'count' on the selection

  tooltip
    .append("div") // add divs to the tooltip defined above
    .attr("class", "percent"); // add class 'percent' on the selection

  d.forEach(function (d) {
    d.fte = +d.fte; // calculate count as we iterate through the data
    d.enabled = true; // add enabled property to track which entries are checked
  });

  // creating the chart
  var path = svg
    .selectAll("path") // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
    .data(pie(d)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
    .enter() //creates placeholder nodes for each of the values
    .append("path") // replace placeholders with path elements
    .attr("d", arc) // define d attribute with arc function above
    .attr("fill", function (d) {
      return color(d.data.type_of_rnd_manpower);
    }) // use color scale to define fill of each label in dataset
    .each(function (d) {
      this._current - d;
    }); // creates a smooth animation for each track

  // mouse event handlers are attached to path so they need to come after its definition
  path.on("mouseover", function (d) {
    // when mouse enters div
    var total = d3.sum(
      d.map(function (d) {
        // calculate the total number of tickets in the dataset
        return d.enabled ? d.fte : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase
      })
    );
    var percent = Math.round((1000 * d.data.fte) / total) / 10; // calculate percent
    tooltip.select(".label").html(d.data.type_of_rnd_manpower); // set current label
    tooltip.select(".count").html("$" + d.data.fte); // set current count
    tooltip.select(".percent").html(percent + "%"); // set percent calculated above
    tooltip.style("display", "block"); // set display
  });

  path.on("mouseout", function () {
    // when mouse leaves div
    tooltip.style("display", "none"); // hide tooltip for that element
  });

  path.on("mousemove", function (d) {
    // when mouse moves
    tooltip
      .style("top", d3.event.layerY + 10 + "px") // always 10px below the cursor
      .style("left", d3.event.layerX + 10 + "px"); // always 10px to the right of the mouse
  });

  // define legend
  var legend = svg
    .selectAll(".legend") // selecting elements with class 'legend'
    .data(color.domain()) // refers to an array of labels from our dataset
    .enter() // creates placeholder
    .append("g") // replace placeholders with g elements
    .attr("class", "legend") // each g is given a legend class
    .attr("transform", function (d, i) {
      var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing
      var offset = (height * color.domain().length) / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements
      var horz = 18 * legendRectSize; // the legend is shifted to the left to make room for the text
      var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'
      return "translate(" + horz + "," + vert + ")"; //return translation
    });

  // adding colored squares to legend
  legend
    .append("rect") // append rectangle squares to legend
    .attr("width", legendRectSize) // width of rect size is defined above
    .attr("height", legendRectSize) // height of rect size is defined above
    .style("fill", color) // each fill is passed a color
    .style("stroke", color) // each stroke is passed a color
    .on("click", function (label) {
      var rect = d3.select(this); // this refers to the colored squared just clicked
      var enabled = true; // set enabled true to default
      var totalEnabled = d3.sum(
        d.map(function (d) {
          // can't disable all options
          return d.enabled ? 1 : 0; // return 1 for each enabled entry. and summing it up
        })
      );

      if (rect.attr("class") === "disabled") {
        // if class is disabled
        rect.attr("class", ""); // remove class disabled
      } else {
        // else
        if (totalEnabled < 2) return; // if less than two labels are flagged, exit
        rect.attr("class", "disabled"); // otherwise flag the square disabled
        enabled = false; // set enabled to false
      }

      pie.value(function (d) {
        if (d.type_of_rnd_manpower === label) d.enabled = enabled; // if entry label matches legend label
        return d.enabled ? d.fte : 0; // update enabled property and return count or 0 based on the entry's status
      });

      path = path.data(pie(d)); // update pie with new data

      path
        .transition() // transition of redrawn pie
        .duration(750) //
        .attrTween("d", function (d) {
          // 'd' specifies the d attribute that we'll be animating
          var interpolate = d3.interpolate(this._current, d); // this = current path element
          this._current = interpolate(0); // interpolate between current value and the new value of 'd'
          return function (t) {
            return arc(interpolate(t));
          };
        });
    });

  // adding text to legend
  legend
    .append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text(function (d) {
      return d;
    }); // return label
}

function loadYears() {
  const years = [...new Set(data.map((d) => d.year))].sort();
  let sel = "";
  years.forEach((y) => (sel += `<option value="${y}">${y}</option>`));
  document.getElementById("year").innerHTML = sel;
}

function loadSectors() {
  const sectors = [...new Set(data.map((d) => d.sector))];
  let sel = "";
  sectors.forEach((y) => (sel += `<option value="${y}">${y}</option>`));
  document.getElementById("sector").innerHTML = sel;
}

function getDataByYear(year) {
  return data.filter((d) => {
    return d.year === year;
  });
}

function getDataBySector(sector) {
  let sectorData = {};
  for (let d of data) {
    let year = d.year;
    if (d.sector === sector) {
      if (year in sectorData) sectorData[year] += parseFloat(d.fte);
      else sectorData[year] = parseFloat(d.fte);
    }
  }
  return Object.keys(sectorData).map((key) => ({
    year: key,
    fte: sectorData[key],
  }));
}

function getDataByManpowerType(year) {
  const yearData = data.filter((d) => d.year === year);
  let typeData = {};

  for (let d of yearData) {
    let trm = d.type_of_rnd_manpower;
    if (trm in typeData) typeData[trm] += parseFloat(d.fte);
    else typeData[trm] = parseFloat(d.fte);
  }

  const test = Object.keys(typeData).map((key) => ({
    type_of_rnd_manpower: key,
    fte: typeData[key],
  }));

  console.log(test);
  return test;
}

function hideElement(element) {
  document.getElementById(element).style.display = "none";
}

function showElement(element) {
  document.getElementById(element).style.display = "block";
}

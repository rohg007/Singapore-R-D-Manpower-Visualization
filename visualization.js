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
  console.log(appData);
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

  g
    .append("path")
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
  console.log(sectorData);
  const arr = Object.keys(sectorData).map((key) => ({
    year: key,
    fte: sectorData[key],
  }));
  console.log(arr);
  return arr;
}

function hideElement(element) {
  document.getElementById(element).style.display = "none";
}

function showElement(element) {
  document.getElementById(element).style.display = "block";
}

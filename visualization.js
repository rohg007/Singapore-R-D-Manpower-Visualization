let drawspace = d3.select("#drawspace");

d3.csv(
  "research-and-development-manpower-full-time-equivalence-by-sector.csv"
).then(showData);

var data;
const height = 500;
const width = 700;

function showData(data) {
  this.data = data;
  loadYears(data);
  change();
}

function change() {
  let selectedYear = document.getElementById("year").value;
  drawBarChart(getDataByYear(selectedYear), selectedYear);
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

function loadYears(data) {
  const years = [...new Set(data.map((d) => d.year))].sort();
  let sel = "";
  years.forEach((y) => (sel += `<option value="${y}">${y}</option>`));
  document.getElementById("year").innerHTML = sel;
}

function getDataByYear(year) {
  return data.filter((d) => {
    return d.year === year;
  });
}

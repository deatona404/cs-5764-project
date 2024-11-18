import React from 'react';
import './ChoroplethWindow.css'
import * as d3 from "d3";
import * as topojson from "topojson"
import { useRef, useState, useEffect } from 'react';

import us from '../../data/counties-albers-10m.json'

let data = {}

function ChoroplethWindow(props) {
  const [isInitialized, setIsInitialized] = useState(false);
  // set up refs
  let svgRef = useRef(null)


  // Obtain chart data
  console.log(us)
  let counties = topojson.feature(us, us.objects.counties)
  let states = topojson.feature(us, us.objects.states)
  let statemap = new Map(states.features.map(d => [d.id, d]))
  let statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)

  let choro_properties = {
    id: d => d.id,
    value: d => d.rate,
    scale: d3.scaleQuantize,
    domain: [1, 10],
    range: d3.schemeBlues[9],
    title: (f, d) => `${f.properties.name}, ${statemap.get(f.id.slice(0, 2)).properties.name}\n${d?.rate}%`,
    features: counties,
    borders: statemesh,
    width: 975,
    height: 610
  }

  useEffect(() => { // used to ensure d3 stuff edits the existing element once it spawns
    if (!isInitialized) {
        setIsInitialized(true);
        let chart = Choropleth(props.data, choro_properties, svgRef)
        // drawChart(svgRef)
        
    }
    else{
      // drawChart(svgRef)
        let chart = Choropleth(props.data, choro_properties, svgRef
      )
    }
  }, [isInitialized, props.data.fileContent, svgRef, props.selected]); // init is purposefully left out

  

  console.log("hiiii we are in here")
  console.log(props.data)

  // HTML content
    return <div className='ChoroplethWindow'>
      <svg id="Chart" ref={svgRef}>
        <p>test</p>
      </svg>
      

      </div>;
  }


function drawChart(reference){
  let svg = d3.select(reference.current)
  svg.selectAll("*").remove();
  svg.append("g")
  .attr("id", "title")
  .append("text")
  .attr("x", 5 + 5 / 2)
  .attr("y", 5 + 5 - 5)
  .text("test text in svg");
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/choropleth
function Choropleth(data, {
  id = d => d.id, // given d in data, returns the feature id
  value = () => undefined, // given d in data, returns the quantitative value
  title, // given a feature f and possibly a datum d, returns the hover text
  format, // optional format specifier for the title
  scale = d3.scaleSequential, // type of color scale
  domain, // [min, max] values; input of color scale
  range = d3.interpolateBlues, // output of color scale
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  projection, // a D3 projection; null for pre-projected geometry
  features, // a GeoJSON feature collection
  featureId = d => d.id, // given a feature, returns its id
  borders, // a GeoJSON object for stroking borders
  outline = projection && projection.rotate ? {type: "Sphere"} : null, // a GeoJSON object for the background
  unknown = "#ccc", // fill color for missing data
  fill = "white", // fill color for outline
  stroke = "white", // stroke color for borders
  strokeLinecap = "round", // stroke line cap for borders
  strokeLinejoin = "round", // stroke line join for borders
  strokeWidth, // stroke width for borders
  strokeOpacity, // stroke opacity for borders
}, reference = {}) {
  // Compute values.
  console.log(features.features)
  console.log(data.features)
  // const N = d3.map(data.features, id);
  // const V = d3.map(data.features, value).map(d => d == null ? NaN : +d);
  // const Im = new d3.InternMap(N.map((id, i) => [id, i]));
  // const If = d3.map(features.features, featureId);
  const N = d3.map(data, id);
  const V = d3.map(data, value).map(d => d == null ? NaN : +d);
  const Im = new d3.InternMap(N.map((id, i) => [id, i]));
  const If = d3.map(features.features, featureId);

  // Compute default domains.
  if (domain === undefined) domain = d3.extent(V);

  // Construct scales.
  const color = scale(domain, range);
  if (color.unknown && unknown !== undefined) color.unknown(unknown);

  // Compute titles.
  if (title === undefined) {
    format = color.tickFormat(100, format);
    title = (f, i) => `${f.properties.name}\n${format(V[i])}`;
  } else if (title !== null) {
    const T = title;
    const O = d3.map(data, d => d);
    title = (f, i) => T(f, O[i]);
  }

  // Compute the default height. If an outline object is specified, scale the projection to fit
  // the width, and then compute the corresponding height.
  if (height === undefined) {
    if (outline === undefined) {
      height = 400;
    } else {
      const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
      const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
      projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
      height = dy;
    }
  }

  // Construct a path generator.
  const path = d3.geoPath(projection);

  // grab the svg ref
  let svg = d3.select(reference.current)
  svg.selectAll("*").remove(); // clear any remaining content on it
  svg.attr("style", "width: 100%; height: 100%;");

  // svg = d3.create("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("viewBox", [0, 0, width, height])
  //     .attr("style", "width: 100%; height: auto; height: intrinsic;");

  if (outline != null) svg.append("path")
      .attr("fill", fill)
      .attr("stroke", "currentColor")
      .attr("d", path(outline));

  svg.append("g")
    .selectAll("path")
    .data(features.features)
    .join("path")
      .attr("fill", (d, i) => color(V[Im.get(If[i])]))
      .attr("d", path)
    .append("title")
      .text((d, i) => title(d, Im.get(If[i])));

  if (borders != null) svg.append("path")
      .attr("pointer-events", "none")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      .attr("d", path(borders));

  console.log("attempting to log svg")
  console.log(svg)

  return Object.assign(svg.node(), {scales: {color}});
}


  
export default ChoroplethWindow;
  
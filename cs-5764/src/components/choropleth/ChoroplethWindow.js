import React from 'react';
import './ChoroplethWindow.css'
import * as d3 from "d3";
import * as topojson from "topojson"
import { useRef, useState, useEffect } from 'react';

import us from '../../data/counties-albers-10m.json'
import Legend from './Legend';

let data = {}
let border_color = "#838383"

function ChoroplethWindow(props) {
  const [isInitialized, setIsInitialized] = useState(false);
  // set up refs
  let svgRef = useRef(null)
  const [selectedSvgElement, setSelectedSvgElement] = useState([])
  // let selectedSvgElement = []


  const [colorThresholds, setColorThresholds] = useState([])
  const [colorRange, setColorRange] = useState([])
  
  

  // Obtain chart data
  console.log(us)
  // console.log(props.data)
  // let counties = topojson.feature(us, us.objects.counties)
  let states = topojson.feature(us, us.objects.states)
  let statemap = new Map(states.features.map(d => [d.id, d]))
  let statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b)

  let choro_properties = {
    id: d => d.id,
    value: d => d[props.job][props.metric],
    scale: d3.scaleQuantize,
    domain: [51000, 150000],
    // domain: [60000, 150000],
    range: d3.schemeGreens[9],
    title: (f, d) => `${f.properties.name}\n\$${d[props.job][props.metric]}`,
    features: states,
    borders: statemesh,
    width: 975,
    height: 610
  }

  console.log("scheme greens !!!", choro_properties.range)
  console.log("scale quantize !!!", choro_properties.scale)

  useEffect(() => { // used to ensure d3 stuff edits the existing element once it spawns
    if (!isInitialized) {
        setIsInitialized(true);
        let chart = Choropleth(props.data, choro_properties, svgRef)
        // drawChart(svgRef)
        
    }
    else{
      // drawChart(svgRef)
        let chart = Choropleth(props.data, choro_properties, svgRef)
        console.log(props.year)
    }
  }, [isInitialized, props.data.fileContent, svgRef, props.selected, props.job]); // init is purposefully left out

  // HTML content
    return (
      <div className='ChoroplethWindow'>
        <svg id="Chart" ref={svgRef}>
          <p>test</p>
        </svg>
        <Legend thresholds={colorThresholds} range={colorRange}/>

      </div>
    );

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
      range = d3.interpolateGreens, // output of color scale
      width = 640, // outer width, in pixels
      height, // outer height, in pixels
      projection, // a D3 projection; null for pre-projected geometry
      features, // a GeoJSON feature collection
      featureId = d => d.id, // given a feature, returns its id
      borders, // a GeoJSON object for stroking borders
      outline = projection && projection.rotate ? {type: "Sphere"} : null, // a GeoJSON object for the background
      unknown = "#ccc", // fill color for missing data
      fill = "white", // fill color for outline
      stroke = border_color, // stroke color for borders
      strokeLinecap = "round", // stroke line cap for borders
      strokeLinejoin = "round", // stroke line join for borders
      strokeWidth = 1, // stroke width for borders
      strokeOpacity, // stroke opacity for borders
    }, reference = {}) {
      // Compute values.

      const year = "2000"
      // const N = d3.map(data.features, id);
      // const V = d3.map(data.features, value).map(d => d == null ? NaN : +d);
      // const Im = new d3.InternMap(N.map((id, i) => [id, i]));
      // const If = d3.map(features.features, featureId);
      // const N = d3.map(data, id);
      const statesVector = d3.map(data, d => d.State)
      const fipsVector = d3.map(data, d => d.fips)
      // console.log(statesVector)
      // const V = d3.map(data, value).map(d => d == null ? NaN : +d);
      const valuesVector = d3.map(data, value).map(d => d == null ? NaN : +d);
      // console.log(valuesVector)
      const indexToFipsMap = new d3.InternMap(statesVector.map((id, i) => [fipsVector[i], i]));
      // console.log(indexToFipsMap)
      const geographyFeaturesVector = d3.map(features.features, featureId);
      // console.log(features.features)
      // console.log(geographyFeaturesVector)

      // Compute default domains.
      if (domain === undefined) domain = d3.extent(valuesVector);

      // Construct scales.
      const color = scale(domain, range);
      if (color.unknown && unknown !== undefined) color.unknown(unknown);
      
      let thresholds = color.thresholds()
      // console.log("color !!!!!!!!!!", color)
      // console.log("color thresholds !!!!!!!!!!", thresholds)
      // console.log("range !!!!!!!!!!", range)

      setColorThresholds(thresholds)
      setColorRange(range)

      // Compute titles.
      if (title === undefined) {
        format = color.tickFormat(100, format);
        title = (f, i) => `${f.properties.name}\n${format(valuesVector[i])}`;
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

      // this structure holds the states
      let states = svg
                    .append("g")
                    .attr("id", "statesfill");


      console.log("right before state svg appending")
      console.log(selectedSvgElement)

      const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'lightgray')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none') // Prevent interference
      .style('visibility', 'hidden');

      states
        .selectAll("path")
        .data(features.features)
        .join("path")
          .attr("fill", (d, i) => color(valuesVector[indexToFipsMap.get(geographyFeaturesVector[i])]))
          .attr("key", (d, i) => i)
          .attr("d", path)
          .attr("stroke", (d) => (isSelected(d.properties.name) ? "#fff17e " : border_color))
          .attr("stroke-width", (d) => (isSelected(d.properties.name) ? "3" : 0))
          .on("click", (e) => {
            let state = d3.select(e.target)
            let stateName = getStateNameFromFill(state);
            console.log(state)
            console.log(stateName)
            if(isSelected(stateName)){
                state.style("fill", "dodgerblue")
                setSelectedSvgElement([])
                // selected.splice(props.selected.indexOf(bar._groups[0][0].id), 1);
                props.setSelected("United States") // FIXME: do not hardcode this
            }
            else {
                setSelectedSvgElement([state])
                props.setSelected(stateName)
                state.style("fill", "red")
            }

            tooltip.style('visibility', 'hidden');
          })
          .on("mouseover", (e) => {
            // d3.select(e.target).style("filter", "brightness(150%)")
            tooltip.style('visibility', 'visible');
          })
          .on('mousemove', (e) => {
            tooltip
              .style('top', e.pageY - 10 + 'px')
              .style('left', e.pageX + 10 + 'px')
              .html("<b>" + getStateNameFromFill(d3.select(e.target)) + "</b><br>Mean Salary: $" + valuesVector[indexToFipsMap.get(geographyFeaturesVector[e.target.attributes.key.value])]);

            console.log(e)
          })
          .on("mouseout", (e) => {
            d3.select(e.target).style("filter", "brightness(100%)")
            tooltip.style('visibility', 'hidden');
          })
        // .append("title")
        //   .text((d, i) => title(d, indexToFipsMap.get(geographyFeaturesVector[i])));
          
      // TODO: the append title is the hover text with the value. uncomment to re-add
      

      // console.log(geographyFeaturesVector[0])
      // console.log(indexToFipsMap.get(geographyFeaturesVector[0]))
      // console.log(valuesVector[indexToFipsMap.get(geographyFeaturesVector[1])])

      if (borders != null) svg.append("path")
          .attr("pointer-events", "none")
          .attr("fill", "none")
          .attr("stroke", stroke)
          .attr("stroke-linecap", strokeLinecap)
          .attr("stroke-linejoin", strokeLinejoin)
          .attr("stroke-width", strokeWidth)
          .attr("stroke-opacity", strokeOpacity)
          .attr("d", path(borders));

      return Object.assign(svg.node(), {scales: {color}});


      function getStateNameFromFill(target){
        return target._groups[0][0].__data__.properties.name.toString()
      }

      // function getStateNameFromPath(target){
      //   return target._groups[0][0].__data__.properties.name.toString()
      // }

      function isSelected (state) {
        if(typeof state === 'string' || state instanceof String){
          return props.selected === state
        }
        // else, its a statefill path
        let stateName = getStateNameFromFill(state);
        return props.selected === stateName
      }
    }
  }
  
export default ChoroplethWindow;
  
import React from 'react';
import './BarSet.css'
import * as d3 from "d3";
import { useRef, useState, useEffect } from 'react';

let svg = null;

function BarSet(props) {
    const [isInitialized, setIsInitialized] = useState(false);
    let svgRef = useRef(null)

    const viewBox = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };

    let title = {
        text: "",
        x: 1.5,
        y: 0,
        width: 100,
        height: 12,
        baseline: 6,
        yAxis: "",
        xAxis: ""
    };

    let layout = {}; // populated by the populate_layout function

    useEffect(() => { // load on first run
        if (!isInitialized) {
            setIsInitialized(true);
            init(props.labels, props.data, svgRef);
        }
        else{
            init(props.labels, props.data, svgRef);
            console.log(props)
        //   setSelected("North Carolina") // for testing
              // console.log(data); // ensure this updates
        }
    
      }, [isInitialized, props.data]);

    return <div className='BarSet'>
        {/* sahgsdjkhfgsjkdh */}
        <div className='BarSetDiv'>
            <h2>{props.title}</h2>
        <svg id="ChartBar" ref={svgRef}></svg>
        </div>
        
        
        </div>;


    function populate_layout(data) {
        layout.topBorder = 0
        layout.bottomBorder = .91 * viewBox.height;
        
        layout.leftBorder = 9;
        layout.rightBorder = 95;
        layout.graphWidth = layout.rightBorder - layout.leftBorder;

        layout.maxData = props.max

        layout.maxScale = Math.max(layout.maxData, Math.floor(layout.maxData + 0.5));
        layout.maxScale = layout.maxData
        layout.minScale = 0;
        
        // This section of the layout contains some general heuristic code for generating a "decent" scaled graph.
        // It attempts to round the scale values and spacing to nice, even numbers, and tries to fit most cases, including
        // numbers smaller than 0 and numbers larger than 100 or so.
        // Generally, it seeks to round scale number increments to 0.1, 0.2, 0.5, 1.0, 2.0, 5.0.. etc.

        // It is not perfect, since designing a perfect algorithm for on-demand graph scales is impossible, but it does a 
        // pretty decent job and works for values that the default d3.nice() function does not work for.

        // if(layout.maxScale < 1){
        //     layout.numLines = 10;
        //     layout.decimalFix = 2;
        //     layout.increment = d3.tickStep(0, layout.maxScale, layout.numLines).toFixed(layout.decimalFix);
        // }
        // else if (layout.maxScale < 5) {
        //     layout.numLines = 5;
        //     layout.decimalFix = 1;
        //     layout.increment = d3.tickStep(0, layout.maxScale, layout.numLines).toFixed(layout.decimalFix);
        // }
        // else if (layout.maxScale < 10){
        //     layout.numLines = 14;
        //     layout.decimalFix = 1;
        //     layout.increment = d3.tickStep(0, layout.maxScale, layout.numLines).toFixed(layout.decimalFix);
        // }
        // else {
        //     layout.numLines = 14;
        //     layout.decimalFix = 0;
        //     layout.increment = d3.tickStep(0, layout.maxScale, layout.numLines).toFixed(layout.decimalFix);
        // }
        layout.scaleSpacing = (layout.bottomBorder - layout.topBorder) / (layout.numLines - 1) / 1.1;


        // if we will exceed bounds using d3.nice(), default to ugly values
        // if (layout.maxScale * layout.scaleSpacing / layout.increment > layout.bottomBorder - layout.topBorder) { 
        //     layout.increment = (layout.maxScale / (layout.numLines - 1)).toFixed(1)
        // }

        // if(layout.increment === 0){
        //     layout.decimalFix = 3;
        //     layout.increment = (layout.maxScale / (layout.numLines - 1)) // no rounding!
        // }   
    

        // end heuristics ------------------------------------------------------------------------------------------
        
        // some final layout arrangements for the axis placements of bars, values, etc.

        layout.value = {x: layout.leftBorder - 2, y: 0, baseline: 5};

        layout.barHeight = layout.graphHeight / 5 / 1.64; // FIXME: change 5 to length of array
        layout.barSpacing = 0.64 * layout.barHeight;

        layout.startY = layout.topBorder - layout.barSpacing + (layout.graphHeight - ((5) * layout.barHeight + (4) * layout.barSpacing)) / 2 -0.5;

        layout.label = {x: 0, y: layout.bottomBorder + 2.5, baseline: 5};
    }

    function init(labels, data, boxRef) {
        // first, clear the previous svg
        let svg = d3.select(boxRef.current)
        svg.selectAll("*").remove();
        layout = {};
        title.text = "";
        title.xAxis = "";
        title.yAxis = "";

        svg.attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 960 500")

        let barSpacing = 70
        let barX = 380
        let barHeight = 35
        let graphTop = 27
        let barWidth = 578

        svg.append("g")
            .attr("id", "labels")

        for (let i = 0; i < labels.length; i++){
            let label = labels[i]
            if(labels[i] == "Network and Computer Systems Administrators"){
                label = "Network & Systems Admins"
            }
            
            svg.append("text")
            .attr("x", 0)
            .attr("y", graphTop + i * barSpacing)
            .style("font-size", "26px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(label);
        }


        svg.append("g")
            .attr("id", "bars")
        for (let i = 0; i < data.length; i++){
            let datai = data[i]
            let datai_text = "$ " + datai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let width = datai / props.max

            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX)
                .attr("y", graphTop - 27 + i * barSpacing)
                .attr("width", barWidth)
                .attr("height", barHeight)
                .style("fill", "#282e32")

            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX)
                .attr("y", graphTop - 27 + i * barSpacing)
                .attr("width", width * barWidth)
                .attr("height", barHeight)
                .style("fill", "#238b45")

            svg.append("text")
            .attr("x", barX + 8)
            .attr("y", graphTop + i * barSpacing)
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", "#a1d99b")
            .text(datai_text);
        }
        

        
        // then, we grab the container and start populating the layout and svg
        populate_layout(data);
        let dataClone = JSON.parse(JSON.stringify(data))
        console.log(dataClone)
    
        // basic layout of svg
        // svg = container
        //     .append("svg")
        //     .attr("viewBox", viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height)
        //     .attr("preserveAspectRatio", "none")
        //     .style("width", "100%")
        //     .style("height", "100%")
        //     .style("border", "none");
    
        // add title to svg
        // svg
        //     .append("g")
        //     .attr("id", "title")
        //     .append("text")
        //     .attr("x", title.x + title.width / 2)
        //     .attr("y", title.y + title.height - title.baseline)
        //     .text(title.text);
        // svg
        //     .append("g")
        //     .attr("id", "xAxis")
        //     .append("text")
        //     .attr("x", title.x + title.width / 2)
        //     .attr("y", 0.3 + title.y + title.height - title.baseline + layout.bottomBorder)
        //     .text(title.xAxis);
        //     svg
        //     .append("g")
        //     .attr("id", "yAxis")
        //     .append("text")
        //     .attr("x", layout.leftBorder - 6)
        //     .attr("y", (layout.bottomBorder - layout.topBorder) / 2 + title.y + title.height - 2)
        //     .text(title.yAxis);
    
        

        // this structure will hold the values and labels for the chart
        let bars = svg
            .append("g")
            .attr("id", "bars");
    
    
        // now, we add the lines (the scale) based on our max data point.
        // for(let i = layout.minScale; i < layout.numLines; i++){
        //     let lineY = layout.bottomBorder - layout.scaleSpacing * i
        //     let val = (layout.increment * i).toFixed(layout.decimalFix);
    
        //     // now we append the line
        //     bars
        //     .append("line")
        //     .attr("x1", layout.leftBorder)
        //     .attr("y1", lineY)
        //     .attr("x2", layout.rightBorder)
        //     .attr("y2", lineY);
    
        //     // to the left of this line, we want to append a value.
        //     bars
        //     .attr("class", "value")
        //     .append("text")
        //     .attr("x", layout.value.x)
        //     .attr("y", lineY + 0.27) 
        //     .text(val);
        // }

        bars
                .append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 100)
                .attr("height", layout.barHeight)
                .style("fill", "dodgerblue")
    
    
        // and this loop populates the chart with the actual bars
        for (let i = 0; i < dataClone.length; i++){
            let barX = layout.startX + i * layout.barSpacing + i *layout.barWidth + layout.barSpacing
    
            let barHeight = parseFloat(dataClone[i][title.yAxis]) * layout.scaleSpacing / layout.increment;
            // let barHeight = layout.scale(dataClone[i][title.yAxis]);
            let barY = layout.bottomBorder - barHeight;
    
            // add the bar to the chart
            bars
                .append("rect")
                .attr("id", "bar-" + i)
                .attr("x", barX)
                .attr("y", barY)
                .attr("width", layout.barWidth)
                .attr("height", barHeight)
                .style("fill", "dodgerblue")
                // .on("mouseover", (e) => onHover(e))
                // .on("mouseout", (e) => offHover(e))
                // .on("click", (e) => onClick(e))
                .style("fill", "red");

            // if(isSelected("bar-" + i)){
            //     bars
            //     .append("rect")
            //     .attr("id", "bar-" + i)
            //     .attr("x", barX)
            //     .attr("y", barY)
            //     .attr("width", layout.barWidth)
            //     .attr("height", barHeight)
            //     .style("fill", "dodgerblue")
            //     .on("mouseover", (e) => onHover(e))
            //     .on("mouseout", (e) => offHover(e))
            //     .on("click", (e) => onClick(e))
            //     .style("fill", "red");
            // }
            // else {
            //     bars
            //     .append("rect")
            //     .attr("id", "bar-" + i)
            //     .attr("x", barX)
            //     .attr("y", barY)
            //     .attr("width", layout.barWidth)
            //     .attr("height", barHeight)
            //     .style("fill", "dodgerblue")
            //     .on("mouseover", (e) => onHover(e))
            //     .on("mouseout", (e) => offHover(e))
            //     .on("click", (e) => onClick(e));
            // }
    
            // add the label to the chart
            // bars
            // .attr("class", "label")
            // .append("text")
            // .attr("x", barX + layout.barWidth/2)
            // .attr("y", layout.label.y) 
            // .text(data.data[i][title.xAxis]);

            console.log(svg)
    
        }
    
    }
  }



  

  


export default BarSet;
  
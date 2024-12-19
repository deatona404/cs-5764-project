import React from 'react';
import './BarSet.css'
import * as d3 from "d3";
import { useRef, useState, useEffect } from 'react';

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
            init(props.data, svgRef);
        }
        else {
            init(props.data, svgRef);
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

        layout.scaleSpacing = (layout.bottomBorder - layout.topBorder) / (layout.numLines - 1) / 1.1;

        layout.value = {x: layout.leftBorder - 2, y: 0, baseline: 5};

        layout.barHeight = layout.graphHeight / 5 / 1.64; // FIXME: change 5 to length of array
        layout.barSpacing = 0.64 * layout.barHeight;

        layout.startY = layout.topBorder - layout.barSpacing + (layout.graphHeight - ((5) * layout.barHeight + (4) * layout.barSpacing)) / 2 -0.5;

        layout.label = {x: 0, y: layout.bottomBorder + 2.5, baseline: 5};
    }

    function init(data, boxRef) {
        // first, clear the previous svg
        let svg = d3.select(boxRef.current)
        svg.selectAll("*").remove();
        layout = {};
        title.text = "";
        title.xAxis = "";
        title.yAxis = "";

        svg.attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 960 500")

        let barSpacing = 62 // 70
        let barX = 380
        let barHeight = 35
        let graphTop = 40
        let barWidth = 578

        svg.append("g").attr("id", "labels")
        for (let i = 0; i < data.length; i++) {
            let title = data[i].title
            if(title == "Network and Computer Systems Administrators"){
                title = "Network & Systems Admins"
            }
            
            svg.append("text")
            .attr("x", 0)
            .attr("y", graphTop + i * barSpacing)
            .style("font-size", "26px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .text(title);
        }

        svg.append("g").attr("id", "bars")
        for (let i = 0; i < data.length; i++) {
            // let wage = data[i].annual_mean_wage
            let median = data[i].annual_median_wage
            let percentile10 = data[i].annual_10th_percentile_wage
            let percentile25 = data[i].annual_25th_percentile_wage
            let percentile75 = data[i].annual_75th_percentile_wage
            let percentile90 = data[i].annual_90th_percentile_wage

            
            if (!median) {
                svg.append("text")
                .attr("x", barX)
                .attr("y", graphTop + i * barSpacing)
                .style("font-size", "24px")
                .style("font-weight", "bold")
                .style("fill", "#838383")
                .text("No data");
                continue;
            }
            let text = "$ " + median.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let medianWidth = median / props.max

            let percentile10Width = percentile10 / props.max
            let percentile25Width = percentile25 / props.max
            let percentile75Width = percentile75 / props.max
            let percentile90Width = percentile90 / props.max
            const tickHeight = 14
            
            // bar background
            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX)
                .attr("y", graphTop - 27 + i * barSpacing)
                .attr("width", barWidth)
                .attr("height", barHeight)
                .style("fill", "#282e32")

            // bar fill
            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX)
                .attr("y", graphTop - 27 + i * barSpacing)
                .attr("width", medianWidth * barWidth)
                .attr("height", barHeight)
                .style("fill", "#238b45")

            // 25th percentile tick
            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX + percentile25Width * barWidth)
                .attr("y", graphTop - 27 + i * barSpacing)
                .attr("width", 2)
                .attr("height", barHeight)
                .style("fill", "#a1d99b90")

            // median tick
            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX + medianWidth * barWidth)
                .attr("y", graphTop - 27 + i * barSpacing - (tickHeight/2))
                .attr("width", 3)
                .attr("height", barHeight + tickHeight)
                .style("fill", "#a1d99b")

            // 75th percentile tick
            svg.append("rect")
                .attr("id", "bar-" + "0")
                .attr("x", barX + percentile75Width * barWidth)
                .attr("y", graphTop - 27 + i * barSpacing)
                .attr("width", 2)
                .attr("height", barHeight)
                .style("fill", "#a1d99b90")

            svg.append("text")
            .attr("x", barX + 8)
            .attr("y", graphTop + i * barSpacing)
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", "#a1d99b")
            .text(text);
        }

        // then, we grab the container and start populating the layout and svg
        populate_layout(data);
    }
}

export default BarSet;

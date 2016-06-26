/**
 * Created by billynewman on 6/12/16.
 */
function pga(){
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(4, "yrds");

    var canvas  = d3.select(".graphContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/PGADriving.json", function(error, data) {
        if (error) throw error;

        var dataKeys = d3.keys(data);
        x.domain(dataKeys);

        var yData = getYMax(data);
        y.domain([
                d3.min(getYMax(data), function(d){
                    return d.AVG;
                }) - 5,
                d3.max(getYMax(data), function(d){
                    return d.AVG;
                })]
        );

        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Driving Avg");

		var title = canvas.append("text")
			.attr("class", "title")
			.attr("dy", ".71em")
			.attr("dx", "1.70em")
			.text('1997 - 2016');

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = canvas.selectAll(".bar")
            .data(dataKeys)
            .enter().append("g")
            .attr("class", "bar");

        bars.append("rect")
            .attr("x", function(d,i) {
                return x(dataKeys[i]);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d, i) {
                return y(yData[i].AVG);
            })
            .attr("height", function(d, i) {
                return height - y(yData[i].AVG);
            });

            //Create the frequency labels above the rectangles.
            bars.append("text")
                .text(function(d, i){
                    return yData[i].PLAYER_NAME;
                })
                .attr("y", function(d,i) {
                    return (-x(dataKeys[i])) - x.rangeBand() / 2;
                })
                .attr("x", function(d, i) {
                    return y(yData[i].AVG) + ((height - y(yData[i].AVG))/2);
                })
                .attr("transform", "rotate(90)")
                .attr("text-anchor", "middle")
                .attr("fill", "white");

            //Create the frequency labels above the rectangles.
            bars.append("text")
                .text(function(d, i){
                    return yData[i].AVG;
                })
                .attr("x", function(d,i) {
                    return x(dataKeys[i]) + x.rangeBand() / 2;
                })
                .attr("y", function(d, i) {
                    return y(yData[i].AVG) - 10;
                })
                .attr("text-anchor", "middle");
        });


}

function getYMax(data){
    var max = [];

    for(key in data){
        max.push(d3.max(data[key], function(d){
            return d;
        }));
    }

    return max;
}
pga();


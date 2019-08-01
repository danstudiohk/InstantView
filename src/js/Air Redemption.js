

/*
*********************************
****    	 initialize      **** 
*********************************
*/


var DataPath = "data/csv/Air Redemption.csv";//Data Source location
var KeyMkt = "All Markets";


function Execute(){

	
	getData();
	CreateChart();
	
	};

d3.csv(DataPath, function(data){
	window.entireData = data;
	
		entireData.forEach(function(d) {
			d.Date = parseDate(d.Date);
			
		});

	Execute();
});


/*
*********************************
****    	getData();      **** 
*********************************
*/



function getData(){
	

	
//filtered by Market
	filteredData_byMkt = entireData.filter(function (df) {
		return df.Market == KeyMkt &&
			df.Year == numyear //year parameter
		;
	});

	filteredData_byMkt.forEach(function(d) {
		d.Date = d.Date;
		d.Year = d.Year;
		d.Month = d.Month;
		d.Market = d.Market;
		d.ACT_Miles = +d.ACT_Miles;
		d.BGT_Miles = +d.BGT_Miles;	
		d.LY_Miles = +d.LY_Miles;
	});
	
	
//filtered by Market and Month (for Actual)
	filteredData_byMktMonth = entireData.filter(function (df) {
		return df.Market == KeyMkt &&
			df.Year == numyear &&//year parameter
			df.Month <= nummonth //month parameter
		;
	});
	
	filteredData_byMktMonth.forEach(function(d) {
		d.Date = d.Date;
		d.Year = d.Year;
		d.Month = d.Month;
		d.Market = d.Market;
		d.ACT_Miles = +d.ACT_Miles;
		d.BGT_Miles = +d.BGT_Miles;	
		d.LY_Miles = +d.LY_Miles;
	});	
	
	
//filtered by Market and Month (for Area Chart)
	filteredData_byMktMonthTotal = entireData.filter(function (df) {
		return df.Market == "All Markets"  &&
			 df.Year == numyear &&//year parameter
			 df.Month <= nummonth //month parameter
		;
	});
	
	filteredData_byMktMonthTotal.forEach(function(d) {
		d.Date = d.Date;
		d.Year = d.Year;
		d.Month = d.Month;
		d.Market = d.Market;
		d.ACT_Miles = +d.ACT_Miles;
		d.BGT_Miles = +d.BGT_Miles;	
		d.LY_Miles = +d.LY_Miles;
	});	
		
	
	

//Group by Carrier YTD  for Pie Chart
//filtered by Market and without Total Carrier
	filteredData_byMktYTD = entireData.filter(function (df) {
		return df.Market != "All Markets" &&
			df.Year == numyear &&//year parameter
			df.Month <= nummonth //month parameter
		;
	});
	
	filteredData_byMktYTD.forEach(function(d) {
		d.Date = d.Date;
		d.Year = d.Year;
		d.Month = d.Month;
		d.Market = d.Market;
		d.ACT_Miles = +d.ACT_Miles;
		d.BGT_Miles = +d.BGT_Miles;	
		d.LY_Miles = +d.LY_Miles;
	});
	
	Market_sort = ['Hong Kong', 'Macau', 'Taiwan','PRD','PRC','North America','Southeast Asia','Others'];
		
	Data_ACT_Miles_byMarketYTD = d3.nest()
		.key(function(d){return d.Market;}).sortKeys(function(a,b) {return Market_sort.indexOf(a) - Market_sort.indexOf(b);})
		.rollup(function(d){return d3.sum(d, function(d) { return d.ACT_Miles} );})
		.entries(filteredData_byMktYTD);
		

//Data for Table use with calculation	
	
	Table_filteredData_byMkt = filteredData_byMktMonth;
	
	Table_filteredData_byMkt.forEach(function(d) {
		d.Year = d.Year;
		d.Month = d.Month;
		d['Miles'] = formatNum1dp2(+d.ACT_Miles);
		d['Miles vs BGT'] = formatPercent((+d.ACT_Miles - +d.BGT_Miles) / +d.BGT_Miles);	
		d['Miles vs LY']= formatPercent((+d.ACT_Miles - +d.LY_Miles) / +d.LY_Miles);

	});
};


/*
*********************************
****     CreateChart();      **** 
*********************************
*/

function CreateChart() {

//Clear All SVG
	d3.selectAll("svg > *").remove();
	d3.selectAll(".table").remove();
	
/*
*********************************
****        Line Chart       **** 
*********************************
*/	
	
//Line chart Setting
	var svgLine = d3.select("#ChartLine"), 
				margin = {top:50 , right: 60, bottom: 50, left: 100},
				width = 800 - margin.left - margin.right,
				height = 400 - margin.top - margin.bottom;
				
	svgLine.append("g").attr("transform", "translate("+ margin.left +",0)");
	
//Get position of the line chart
	lineOffsetLeft = $("#ChartLine").offset().left;
	lineOffsetTop = $("#ChartLine").offset().top;

//GET MAX value to set Axis Y 
	svgLine_ACTmax = d3.max(filteredData_byMkt,function(d) { 
			return d.ACT_Miles; 
	});
	
	svgLine_BGTmax = d3.max(filteredData_byMkt,function(d) { 
			return d.BGT_Miles; 
	});
	
	svgLine_LYmax = d3.max(filteredData_byMkt,function(d) { 
			return d.LY_Miles; 

	});
	//To determine the max Y value	
	svgLine_Valuemax = Math.max(svgLine_ACTmax,svgLine_BGTmax,svgLine_LYmax)*1.1;

	//Scale Setting
	var svgLine_ScaleX = d3.time.scale().rangeRound([0,width]);
	var svgLine_ScaleY = d3.scale.linear().rangeRound([height,0]);	

	svgLine_ScaleX.domain(d3.extent(filteredData_byMkt, function(d) { return d.Date; }));
	svgLine_ScaleY.domain([0, svgLine_Valuemax + margin.top + margin.bottom ]);	

	//Actual Data Point
	var svgLine_valueline_ACT = d3.svg.line()
		.x(function(d) { return svgLine_ScaleX(d.Date);})
		.y(function(d) { return svgLine_ScaleY(d.ACT_Miles);})
		.interpolate('cardinal')
	;
	
	//BGT Data Point
	var svgLine_valueline_BGT = d3.svg.line()
		.x(function(d) { return svgLine_ScaleX(d.Date); })
		.y(function(d) { return svgLine_ScaleY(d.BGT_Miles); })
		.interpolate('cardinal')
	;
	
	//LY Data Point
	var svgLine_valueline_LY = d3.svg.line()
		.x(function(d) { return svgLine_ScaleX(d.Date); })
		.y(function(d) { return svgLine_ScaleY(d.LY_Miles); })
		.interpolate('cardinal')
	;
	//Actual Data Path
	var svgLine_DataPath_ACT = svgLine.append("path")
		.attr("id","svgLine_DataPath_ACT")
		.attr("class","svgLine_DataPath")
		.attr("d", svgLine_valueline_ACT(filteredData_byMktMonth))
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("fill","none")
		.attr("stroke-width",5)
		.attr("stroke","#FAD00A")
	;
	
	//Animation of Actual Data Path
	var svgLine_DataPath_ACT_totalLength = svgLine_DataPath_ACT.node().getTotalLength();
	
	svgLine_DataPath_ACT
		.attr("stroke-dasharray", svgLine_DataPath_ACT_totalLength + " " + svgLine_DataPath_ACT_totalLength)
		.attr("stroke-dashoffset", svgLine_DataPath_ACT_totalLength)
		.transition().duration(1000).ease("linear").attr("stroke-dashoffset", 0);	
	
	//BGT Data Path
	var svgLine_DataPath_BGT = svgLine.append("path")
		.attr("id","svgLine_DataPath_BGT") //BGT
		.attr("class", "svgLine_DataPath")
		.attr("d", svgLine_valueline_BGT(filteredData_byMkt))
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("fill","none")
		.attr("stroke-width",3)
		.attr("stroke","#4BACC6")
	;
	//LY Data Path
	var svgLine_DataPath_LY = svgLine.append("path")
		.attr("id","svgLine_DataPath_LY") //LY
		.attr("class", "svgLine_DataPath")
		.attr("d", svgLine_valueline_LY(filteredData_byMkt))
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("fill","none")
		.attr("stroke-width",3)
		.attr("stroke","grey")
		.attr("stroke-dasharray","10")
		.attr("opacity",0.5)
	;

	// Add the X Axis to SVG
	var svgLine_xAxis = d3.svg.axis().scale(svgLine_ScaleX)
		.orient("bottom")
		.ticks(12) //Month
		.innerTickSize(-height)
		.tickFormat(d3.time.format("%b"))
		.tickPadding(20)
	;

    svgLine.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate("+margin.left+ "," + (height + margin.top) + ")")
		.call(svgLine_xAxis)
	;
		
	// Add the Y Axis to SVG	
	var svgLine_yAxis = d3.svg.axis().scale(svgLine_ScaleY)
		.orient("left")
		.ticks(6)
		.innerTickSize(-width)
		.tickFormat(formatNum2)
		.tickPadding(10)
	;
    svgLine.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate("+ margin.left+ "," + margin.top + ")")
		.call(svgLine_yAxis)
	;

	
	//ACT Data Dot
	svgLine.selectAll("dot")
		.data(filteredData_byMktMonth)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("r", 10)
		.style("fill", "white")
		.style("stroke", "#FACF00")
		.style("stroke-width", 3)
		.attr("cx", function(d) { return svgLine_ScaleX(d.Date); })
		.attr("cy", function(d) { return svgLine_ScaleY(d.ACT_Miles); })
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.on("mouseover", function(d) {	
        		d3.select(this).transition().duration(100)
				.attr("r", 15)
				.style("fill","#FACF00");
			d3.select("#svgLine_tooltip").transition()
				.duration(100)
				.style("opacity",1);

				
			d3.select("#svgLine_tooltip").html(
				formatTime(d.Date) + " <br> " +
				" Miles: " + formatNum1dp2(d.ACT_Miles) + " <br> " +	
				" vs BGT: " + formatPercent((d.ACT_Miles-d.BGT_Miles)/d.BGT_Miles) + " <br> " +
				" vs LY: " + formatPercent((d.ACT_Miles-d.LY_Miles)/d.LY_Miles)
			)
				.style("left", (d3.event.pageX) - lineOffsetLeft - 50 + "px")		
				.style("top", (d3.event.pageY) - lineOffsetTop + 60 + "px");
         })
		.on("mouseout", function(d) {	
        		d3.select(this).transition()
				.duration(100)
				.attr("r", 10)
				.style("fill","#FFFFFF");
			d3.select("#svgLine_tooltip").transition()
				.duration(500)
				.style("opacity",0);	
		})
		;
	
/*
*********************************
****        Area Chart       **** 
*********************************
*/	
	
	var svgArea = d3.select("#ChartArea"),  
		margin = {top:50 , right: 60, bottom: 50, left: 100},
		width = 800 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;
		
	AreaOffsetLeft = $("#ChartArea").offset().left;
	AreaOffsetTop = $("#ChartArea").offset().top;	

	svgArea.append("g").attr("transform", "translate("+ margin.left +",0)");
	
	svgArea_ACTmax = d3.max(filteredData_byMktMonthTotal,function(d) { return d.ACT_Miles; })*1.1;
	
	var svgArea_ScaleX = d3.time.scale()
		.rangeRound([0,width]);
	var svgArea_ScaleY = d3.scale.linear()
		.rangeRound([height,0]);	

	svgArea_ScaleX.domain(d3.extent(filteredData_byMkt, function(d) { return d.Date; }));
	svgArea_ScaleY.domain([0, svgArea_ACTmax + margin.top + margin.bottom ]);	
	
	var stack = d3.layout.stack()
		.offset("zero")
		.order("reverse ")
		.values(function(d) { return d.values; })
		.x(function(d) { return d.Date; })
		.y(function(d) { return d.ACT_Miles; })
		;
	
	var nest_Market = d3.nest()
		.key(function(d) { return d.Market; }).sortKeys(function(a,b) {return Market_sort.indexOf(a) - Market_sort.indexOf(b);});
		
		
	var svgArea_area = d3.svg.area()
		.interpolate("cardinal")
		.x(function(d) { return svgArea_ScaleX(d.Date); })
		.y0(function(d) { return svgArea_ScaleY(d.y0); })
		.y1(function(d) { return svgArea_ScaleY(d.y0 + d.y); });
		
	
	var layers = stack(nest_Market.entries(filteredData_byMktYTD));
	
	svgArea.selectAll(".layer")
		.data(layers)
		.enter().append("path")

		.attr("class","layer")
		.attr("d", function(d) { return svgArea_area(d.values); })
		.attr("transform", "translate("+ margin.left+ "," + margin.top + ")")
		.style("fill", "#FFFFFF")
		.style("stroke","#000000")
		.attr("stroke-width", "0px")
		.transition().duration(500).ease("poly","2")
		.style("fill", function(d, i) { return AMLMarketcolor(i); })
		;
		
	svgArea.selectAll(".layer").attr("opacity", 1)
		.on("mouseover", function(d, i) {
			svgArea.selectAll(".layer").transition()
			.duration(250)
			.attr("opacity", function(d, j) {
				return j != i ? 0 : 1;
			})
			;
			d3.select("#svgArea_tooltip").transition()
				.duration(100)
				.style("opacity",0.9)
				;
			d3.select("#svgArea_tooltip")
				.text(d.key)
				;
			d3.select("#svgArea_tooltip")
				.style("left", AreaOffsetLeft + 15 + nummonth * 30  + "px")
				.style("top", (d3.event.pageY - AreaOffsetTop - lineOffsetTop / 4.5 + 30) + "px");
			
		})
		;	
	
		svgArea.selectAll(".layer")
		.on("mouseout", function(d, i) {
			svgArea.selectAll(".layer")
			.transition()
			.duration(250)
			.attr("opacity","1")
			;
			d3.select("#svgArea_tooltip")
			.style("opacity",0)
			;
		})
	;
	

	// Add the X Axis to SVG
	var svgArea_xAxis = d3.svg.axis().scale(svgArea_ScaleX)
		.orient("bottom")
		.ticks(12) //Month
		.innerTickSize(-height)
		.tickFormat(d3.time.format("%b"))
		.tickPadding(20)
	;

    svgArea.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + margin.left+ "," + (height + margin.top) + ")")
		.call(svgArea_xAxis);
		
	// Add the Y Axis to SVG	
	var svgArea_yAxis = d3.svg.axis().scale(svgArea_ScaleY)
		.orient("left")
		.ticks(6)
		.innerTickSize(-width)
		.tickFormat(formatNum2)
		.tickPadding(10)
	;
    svgArea.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate("+ margin.left+ "," + margin.top + ")")
		.call(svgArea_yAxis);	

	
/*
*********************************
****        Pie Chart       **** 
*********************************
*/

//Pie chart Setting
	var svgPie = d3.select("#ChartPie"), 
				margin = {top:20 , right: 50, bottom: 20, left: 50},
				width = 800,
				height = 500;
				
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {return d.values;});
		
	pieData = pie(Data_ACT_Miles_byMarketYTD);

	var svgPie_arcPath = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(width/4.5);
			
			
	var svgPie_arcPath_large = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(width/3.75);

	//var d3color10 = d3.scale.category10();
	
	var svgPie_arcs = svgPie.selectAll(".arc")
		.data(pieData)
		.enter()
		.append("g")	
		.attr("transform","translate(" + width /2 + "," + height /2 + ")")
		.attr("class", "arc")
		;
		
	var svgPie_sectior = svgPie_arcs.append("path")
		.attr("stroke","white")
		.attr("stroke-width",3)
		.style("fill",function(d,i){return AMLMarketcolor(i); })
		.on("mouseover", function(d) {	
        		d3.select(this).transition().duration(100)
				.attr("d", svgPie_arcPath_large)
			}
		)
		.on("mouseout", function(d) {	
        		d3.select(this).transition().duration(100)
				.attr("d", svgPie_arcPath)
			}
		)
		;
		

	svgPie_sectior.transition().delay(function(d, i) { return i * 250; }).duration(500)
		.attrTween('d', function(d) {
			var i = d3.interpolate(d.startAngle, d.endAngle);
				return function(t) {
					d.endAngle = i(t);
			return svgPie_arcPath(d);
			};
		})
		;
//Pie Proportion figures
	svgPie_arcs.append("text")
		.attr("transform",function(d){
			var x = svgPie_arcPath.centroid(d)[0] * 1.35;
			var y = svgPie_arcPath.centroid(d)[1] * 1.35;
			return "translate(" + x + "," + y + ")";})
		.attr("text-anchor","middle")
		.attr("font-size",24)
		.attr("fill","white")
		.transition()
		.delay(1500)
		.text(function(d){
			var percent = Number(d.value) / d3.sum(Data_ACT_Miles_byMarketYTD, function(d){return d.values;})*100;
			return percent.toFixed(1) +"%";})
		;
		
		
	svgPie_arcs.append("line")
		.attr("class","pieLine")
		.attr("stroke","#555555")
		.attr("stroke-width",2)
		.transition().delay(function(d, i) { return i * 500; }).duration(500)
		.attr("x1",function(d) { return svgPie_arcPath.centroid(d)[0]*1.8; })
		.attr("y1",function(d) { return svgPie_arcPath.centroid(d)[1]*1.8; })
		.attr("x2",function(d) { return svgPie_arcPath.centroid(d)[0]*2.35; })
		.attr("y2",function(d) { return svgPie_arcPath.centroid(d)[1]*2.35; })
		;
		
	svgPie_arcs.append("text")
		.attr("class","pieLabel")
		.transition().delay(function(d, i) { return i * 500; }).duration(500)
		.attr("font-size",24)
		.attr("transform",function(d){
			var x = svgPie_arcPath.centroid(d)[0] * 3.2;
			var y = svgPie_arcPath.centroid(d)[1] * 2.6;
			return "translate(" + x + "," + y + ")";
		})
		.attr("text-anchor","middle")
		.text(function(d) {
			return d.data.key;
		});		
		

/*
*********************************
****        Table       **** 
*********************************
*/

//Sort the filtered data
	datasorted = filteredData_byMkt.sort(function (a, b) {
	 return a.Date > b.Date ? 1 : -1;
	});
	
//Get YTD Figures 
	sumYTD = 0;
	function ACTYTDfigure() {
		for (i = 0; i < nummonth; i++) { 
				sumYTD += datasorted[i].ACT_Miles;
		};
	};
	ACTYTDfigure();
	
	sumBGT = 0;
	function BGTYTDfigure() {
	for (i = 0; i < nummonth; i++) { 
			 sumBGT += datasorted[i].BGT_Miles;
		};
	};
	BGTYTDfigure();
	
	sumBGTFY = 0;
	function BGTFYfigure() {
	for (i = 0; i < 12; i++) { 
			 sumBGTFY += datasorted[i].BGT_Miles;

		};
	};
	BGTFYfigure();
	
	sumLY = 0;
	function LYYTDfigure() {
	for (i = 0; i < nummonth; i++) { 
				 sumLY += datasorted[i].LY_Miles;
		};
	};
	LYYTDfigure();

//calculation
	FigureVsBGT = (sumYTD - sumBGT)/sumBGT;
	FigureVsBGTFY = sumYTD / sumBGTFY;
	FigureVsLY = (sumYTD - sumLY)/sumLY;

//tween figure	
	d3.select('#FigureYTD').transition().duration(800)
	.tween("number", function() {
	  var i = d3.interpolate(0, sumYTD);
	  return function(t) {
		this.textContent = formatNum1dp2(i(t));
	  };
	});
	
	d3.select('#FigureVsBGT').transition().duration(800)
			.tween("number", function() {
			  var i = d3.interpolate(0, FigureVsBGT);
			  return function(t) {
				this.textContent = formatPercent(i(t));
			  };
			});

	d3.select('#FigureVsLY').transition().duration(800)
			.tween("number", function() {
			  var i = d3.interpolate(0, FigureVsLY);
			  return function(t) {
				this.textContent =  formatPercent(i(t)) ;
			  };
			});
		
	
//change +/- color 		
	if(FigureVsBGT>=0){
		document.getElementById("FigureVsBGT").style.color = "#00B050";
	}else{
		document.getElementById("FigureVsBGT").style.color = "#E20000";
	};

	if(FigureVsLY>=0){
		document.getElementById("FigureVsLY").style.color = "#00B050";
	}else{
		document.getElementById("FigureVsLY").style.color = "#E20000";
	};
	
//progress arc
	var tau = 2 * Math.PI;

	var backarc = d3.svg.arc()
		.innerRadius(12)
		.outerRadius(18)
		.startAngle(0)
	;
	var forearc = d3.svg.arc()
		.innerRadius(12)
		.outerRadius(18)
		.startAngle(0)
		.cornerRadius(60)
	;
	var background = d3.select("#progresschart").append("path")
		.attr("transform", "translate(" + 25 + "," + 22 + ")")
		.datum({endAngle: tau})
		.style("fill", AMLlightgrey)
		.attr("d", backarc)
	;

	var foreground = d3.select("#progresschart").append("path")
		.attr("transform", "translate(" + 25 + "," + 22 + ")")
		.datum({endAngle: FigureVsBGTFY * tau})
		.style("fill", "#FACF00")
		.attr("opacity",0.8)
		.attr("class","progressarc")
		.attr("d", forearc)

	;
	
	d3.select("#progresschart").append("text")
		.attr("font-size",8)
		.attr("transform", "translate(19,24)")
		.style("fill","#000")
		.transition().duration(800)
			.tween("number", function() {
			  var i = d3.interpolate(0, FigureVsBGTFY);
			  return function(t) {
				this.textContent =  formatPercentn(i(t)) ;
			  };
			});
			
			
			
//Table	
	function Createtabulate(data, columns) {
		var table = d3.select('#table-responsive').append('table').attr("class","table table-hover")
		var thead = table.append('thead').attr("class","thead-light")
		var tbody = table.append('tbody');
		// append the header row
			thead.append('tr')
				.selectAll('th')
				.data(columns).enter()
				.append('th')
				.text(function (column) { return column; });
		// create a row for each object in the data
			var rows = tbody.selectAll('tr')
				.data(data)
				.enter()
				.append('tr');
		// create a cell in each row for each column
			var cells = rows.selectAll('td')

				.data(function (row) {
					return columns.map(function (column) {
					return {column: column, value: row[column]};
				});
			})
				.enter()
				.append('td')
				.attr("class", function(d) { return d.column})
				.text(function (d) { return d.value; })
				;
	  return table;
	}

	// render the table(s)

	Createtabulate(Table_filteredData_byMkt, ['Month', 'Miles' , 'Miles vs BGT', 'Miles vs LY']); 

	;


	//Table tab conditional formatting
		$('#table-responsive .vs.BGT').each(function() {
			if (parseInt($(this).text()) < 0) {
				$(this).addClass('figred');
			} else {
				$(this).addClass('figgreen');
			}
		});

		$('#table-responsive .vs.LY').each(function() {
			if (parseInt($(this).text()) < 0) {
				$(this).addClass('figred');
			} else {
				$(this).addClass('figgreen');
			}
		});




/*
*********************************
****        Chart Title      **** 
*********************************
*/
	function ChartTitleParsing() {
		if (KeyMkt=="All Markets") {
			KeyMktName = "";
		} else {
			KeyMktName = " in" + KeyMkt;
		};
	};
	ChartTitleParsing();

	ChartLineHeader = "Air Redemption Growth"  + KeyMktName ;
	document.getElementById("ChartLineHeader").innerHTML  = ChartLineHeader;
	
	ChartAreaHeader = "Air Redemption Growth by Market" ;
	document.getElementById("ChartAreaHeader").innerHTML  = ChartAreaHeader;
	
	ChartPieHeader = "Air Redemption Market Distribution";
	document.getElementById("ChartPieHeader").innerHTML  = ChartPieHeader;
		
/* 	ChartCommentHeader = "Coming Soon" ;
	document.getElementById("ChartCommentHeader").innerHTML  = ChartCommentHeader;
 */
 
 
 
/*
*********************************
****          Legend        ****
*********************************
*/
	

Legend_Market_sort = ['HK', 'MO', 'TW','PRD','PRC','NA','SEA','OTH'];	
var svgLegned = d3.select("#legend").attr("class","col-12");

        var offset = 60;
        
        var legend = svgLegned.selectAll('.legend')
            .data(Legend_Market_sort)
            .enter().append('g')
            .attr("class", "legend")
            .attr("transform", function (d, i) {
             if (i === 0 ) {
				dataL = d.length + offset 
				return "translate(0,0)"
			} else if(i <= 3 ) { 
				var newdataL = dataL
				dataL +=  d.length + offset
				return "translate(" + (newdataL) + ",0)"
			} else if (i === 4){
				dataL = d.length + offset 
				return "translate(0,25)"
			} else {
				var newdataL = dataL
				dataL +=  d.length + offset
				return "translate(" + (newdataL) + ",25)"
			}
        })

		legend.append('circle')
		.attr("cx", 8)
		.attr("cy", 8)
		.attr("r", 8)
		.style("fill", function (d, i) {
		return AMLMarketcolor(i)
        })
        
        legend.append('text')
            .attr("x", 20)
            .attr("y", 12.5)
        .text(function (d, i) {
            return d
        })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            .style("font-size", 10)	
			;
	
 
};






var DataPath = "data/csv/index.csv";//Data Source location

d3.csv(DataPath, function(data){
	window.entireData = data; //Entire Data (#7 records)
	getData();
});

function getData() {
	filteredData = entireData.filter(function(d){
		return d.Year == numyear &&
		d.Month == nummonth
		;})
	
	filteredData.forEach(function(d) {
		d.Type = d.Type;
		d.Date = parseDate(d.Date);
		d.Year = d.Year;
		d.Month = d.Month;
		d.YTD = +d.YTD;
		d.vsBGT = +d.vsBGT;
		d.vsLY = +d.vsLY;
		d.Comment = d.Comment;
	});
	
	//YTD figures	
     d3.select("#CardTotalMemberYTD")
		.data(filteredData.filter(function(d){return d.Type == "Total Member";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardActiveMemberYTD")
		.data(filteredData.filter(function(d){return d.Type == "Active Member";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardNewMemberYTD")
		.data(filteredData.filter(function(d){return d.Type == "New Member";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardAirAccrualYTD")
		.data(filteredData.filter(function(d){return d.Type == "Air Accrual";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardNonAirAccrualYTD")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Accrual";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardOtherAccrualYTD")
		.data(filteredData.filter(function(d){return d.Type == "Other Accrual";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardAirRedemptionYTD")
		.data(filteredData.filter(function(d){return d.Type == "Air Redemption";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
	d3.select("#CardNonAirRedemptionYTD")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Redemption";}))
		.transition().duration(2000).tween("number", function(d) {
			var i = d3.interpolateRound(0, d.YTD);
			return function(t) {
				this.textContent = formatNum1dp2(i(t));
			};
		});
		
	//vs BGT Figures

	d3.select("#CardTotalMembervsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Total Member";}))
		.text(function(d){return formatPercentn(d.vsBGT);})	
	d3.select("#CardActiveMembervsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Active Member";}))
		.text(function(d){return formatPercentn(d.vsBGT);})
	d3.select("#CardNewMembervsBGT")
		.data(filteredData.filter(function(d){return d.Type == "New Member";}))
		.text(function(d){return formatPercentn(d.vsBGT);})
		
		
		
	d3.select("#CardAirAccrualvsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Air Accrual";}))
		.text(function(d){return formatPercent(d.vsBGT);})
		.style("color",function(d){if(d.vsBGT > 0) {return  figurePosGreen; } else {return  figureNegRed; };});		
	d3.select("#CardNonAirAccrualvsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Accrual";}))
		.text(function(d){return formatPercent(d.vsBGT);})
		.style("color",function(d){if(d.vsBGT > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardOtherAccrualvsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Other Accrual";}))
		.text(function(d){return formatPercent(d.vsBGT);})
		.style("color",function(d){if(d.vsBGT > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardAirRedemptionvsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Air Redemption";}))
		.text(function(d){return formatPercent(d.vsBGT);})
		.style("color",function(d){if(d.vsBGT > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardNonAirRedemptionvsBGT")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Redemption";}))
		.text(function(d){return formatPercent(d.vsBGT);})
		.style("color",function(d){if(d.vsBGT > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
		
	//vs LY Figures
	d3.select("#CardTotalMembervsLY")
		.data(filteredData.filter(function(d){return d.Type == "Total Member";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardActiveMembervsLY")
		.data(filteredData.filter(function(d){return d.Type == "Active Member";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardNewMembervsLY")
		.data(filteredData.filter(function(d){return d.Type == "New Member";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardAirAccrualvsLY")
		.data(filteredData.filter(function(d){return d.Type == "Air Accrual";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardNonAirAccrualvsLY")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Accrual";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardOtherAccrualvsLY")
		.data(filteredData.filter(function(d){return d.Type == "Other Accrual";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardAirRedemptionvsLY")
		.data(filteredData.filter(function(d){return d.Type == "Air Redemption";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	d3.select("#CardNonAirRedemptionvsLY")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Redemption";}))
		.text(function(d){return formatPercent(d.vsLY);})
		.style("color",function(d){if(d.vsLY > 0) {return  figurePosGreen; } else {return  figureNegRed; };});
	
	//vs Comment
/* 	d3.select("#CardTotalMemberComment")
		.data(filteredData.filter(function(d){return d.Type == "Total Member";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardActiveMemberComment")
		.data(filteredData.filter(function(d){return d.Type == "Active Member";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardNewMemberComment")
		.data(filteredData.filter(function(d){return d.Type == "New Member";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardAirAccrualComment")
		.data(filteredData.filter(function(d){return d.Type == "Air Accrual";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardNonAirAccrualComment")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Accrual";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardOtherAccrualComment")
		.data(filteredData.filter(function(d){return d.Type == "Other Accrual";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardAirRedemptionComment")
		.data(filteredData.filter(function(d){return d.Type == "Air Redemption";}))
		.text(function(d){return d.Comment;});
	d3.select("#CardNonAirRedemptionComment")
		.data(filteredData.filter(function(d){return d.Type == "Non Air Redemption";}))
		.text(function(d){return d.Comment;}); */
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};
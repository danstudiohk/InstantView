
//Declare Parameter
var CarVal; //return Filter Select (AA)
var CatVal; //return Metreics Select (NAR)
var MetVal; //return Metics Select 
var DimVal = 0;//return Dimension count
var PillarVal; //return Pillar Select (NAA)
var MembVal;
var MembSplitVal = 0;
var PillarFinornonFinVal;
var Datapath;
var dat; //Raw data 
var datafilter; //filtered data
var yAxisformattyp; //for NAR yAxis change
var radioSel = 'Market';
var tabSel = 'Table';
var selFinance = 1;
var selnonFinance = 1;
var FinORnonFin = "";
var windowwidth = $(document).width(); 

//Calender setting
var numyear = 2018; 
var nummonth = 6; //(1-12)

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

lastupdate = "Reporting Month: " + monthNames[nummonth-1] + " " + numyear;
d3.select("#lastupdate").text(lastupdate);

//Format
var parseDate = d3.time.format("%Y%m%d").parse; //Date format in raw data csv
var formatTime = d3.time.format("%b"); //MMM
var formatNum = d3.format("10.2s"); //10,000,000 -> 10M
//convert G to B
	function formatNum2(x) {
	  var s = formatNum(x);
	  switch (s[s.length - 1]) {
		case "G": return s.slice(0, -1) + "B";
	  }
	  return s;
	};
var formatNum1dp = d3.format("10.3s"); //10,000,000 -> 10.0M	
//convert G to B
function formatNum1dp2(x) {
  var s = formatNum1dp(x);
  switch (s[s.length - 1]) {
	case "G": return s.slice(0, -1) + "B";
  }
  return s;
};	

var formatPercent = d3.format("+0.1%");
var formatPercentn = d3.format("0%");

var format4dp =d3.format(".4f");
function format4dp2(x) {
	var s= format4dp(x);
	return s;	
};

timegone = "(Time gone by: " + formatPercentn(nummonth/12) + ")";
d3.select("#timegone").text(timegone);

//d3.color
var d3color10 = d3.scale.category10();

var AMLlightgrey = "#E9ECEF";
var AMLdarkgrey = "grey";

var figurePosGreen = "#00B050";
var figureNegRed = "#E20000";

function googlecolor(n) {
	var c = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
	return c[n % c.length];
}

//Standard AML Color
function AMLCarriercolor(n) {
	var c = ["#006564","#E4122B","#757575"];
	return c[n % c.length];
}

function AMLMarketcolor(n) {
	var c = ["#034B65", "#383838", "#457E7F", "#C02841", "#FFA539", "#6C5B7B", "#774F38", "#E18E78"];
	//	var c = ["#cC0000", "#948A54", "#92D050", "#FF6501", "#FFD70D", "#1F497D", "#7030A0", "#5B6E83"];
	return c[n % c.length];
}

function AMLCategorycolor(n) {
	var c = ["#034B65", "#FFA539", "#457E7F", "#C02841", "#383838", "#6C5B7B", "#774F38", "#E18E78", "#542337", 
			"#05779F", "#FFD097", "#90C1C2", "#E3798B", "#848484", "#B5A9BF", "#C0937A", "#F0C9BE", "#9D4166"];
	return c[n % c.length];
}

function AMLMembercolor(n) {
	var c = ["#EF002A", "#086FA1", "#FFA539"];
	return c[n % c.length];
}


function AMLFinorNonFincolor(n) {
	var c = ["#EF002A", "#086FA1"];
	return c[n % c.length];
}

function AMLPillarcolor(n) {
	var c = ["#034B65", "#FFA539", "#457E7F", "#C02841", "#383838", "#6C5B7B", "#774F38", "#E18E78", "#542337", 
		"#05779F", "#FFD097", "#90C1C2", "#E3798B", "#848484", "#B5A9BF", "#C0937A", "#F0C9BE", "#9D4166"];
	return c[n % c.length];
}



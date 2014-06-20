//Campus Shuttle Tracking 

//NOTE: OFFICAL ROAD-LIKE COMMENT BLOCK
//===================================================================
//-------------------------------------------------------------------
//===================================================================

Titanium.UI.setBackgroundColor('#fff');
Ti.UI.Android.hideSoftKeyboard();
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

//Create set of tabs
var tabGroup = Titanium.UI.createTabGroup();

var url = "http://www.osushuttles.com/Services/JSONPRelay.svc/GetMapStopEstimates";
var url2 = "http://www.osushuttles.com/Services/JSONPRelay.svc/GetRoutesForMapWithSchedule";
var url3 = "http://www.osushuttles.com/Services/JSONPRelay.svc/GetMapVehiclePoints";

var userGPS = [44.565, -123.277];
var deviceGPSOn = false;
var gpsOffPhrase = "GPS: Off";
var gpsOnPhrase = "GPS: On";

//Array of nearest stops
var nearestArray = [];

var stopsArray = [], diffArray = [];

//Route visibility toggle checkboxes
var routeCheckboxA, routeCheckBoxB, routeCheckboxC;

//Create main window
var win = Ti.UI.createWindow({
    backgroundColor:'#c34500',
    navBarHidden:true,
    softKeyboardOnFocus: Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS,
    layout: 'vertical',
});

var topMenu = Ti.UI.createView({
	width: 'auto',
	height: Ti.UI.SIZE,
	top: 0,
});

createRouteCheckBox();


//Create webview of map.html
var localWebview = Titanium.UI.createWebView({
	url:'map.html',
    //bottom: bottomMenu.toImage().height,
    left:0,
    right:0,
    top: 0,
    //html:textContent,
    height:'55%',
    //width:'auto',
    backgroundColor:'#373737',
    touchEnabled:true,
    borderColor: '#c34500',
    borderWidth: 3,
    borderRadius: 0,
    layout: 'vertical',
    //borderColor: '#080808',
    //borderWidth: '8px'
});

var bottomMenu = Ti.UI.createView({
    width:'auto',
    height: 'auto',
    bottom:3,
    left: 3,
    right: 3,
    backgroundColor:'#373737',
    borderColor: '#111111',
    borderWidth: 5,
    borderRadius: 0,
});

var userGPSStatusLabel = Titanium.UI.createLabel({
	color:'#334C61',
	text: '',
	font:{fontSize:15,fontFamily:'Helvetica Neue', fontWeight: 'bold'},
	textAlign:'left',
	top: '90px',
	left: 10,
	backgroundColor: 'transparent',
});

/*var slideLabel = Titanium.UI.createLabel({
	color:'#334C61',
	text: '',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	bottom: 0,
	width: 'auto',
	height:'auto',
	backgroundImage: 'GeneralUI/slideBar.png'
});*/

var routeEstTable = Ti.UI.createTableView({
  	left: 7,
  	right:25,
  	height:Titanium.UI.SIZE,
  	maxRowHeight: 50,
  	data: nearestArray,
	scrollable: true,
	color: '#ffffff',
	//separatorColor: 'transparent',
	separatorColor: 'white',
	showVerticalScrollIndicator: false,
});

var scrollArrows = Ti.UI.createImageView({
	image:'GeneralUI/scrollarrow.png',
	right:10
});


//Add objects to window
win.add(topMenu);
win.add(localWebview);
win.add(bottomMenu);

//win.add(slideLabel);
win.add(userGPSStatusLabel);
bottomMenu.add(routeEstTable);
bottomMenu.add(scrollArrows);


SetStops();

setAdjustTableListener();
setWebViewListener();
setLongPressListener();

win.open();

//===================================================================
//-------------------------------------------------------------------
//===================================================================

function createRouteCheckBox(){
	routeCheckboxB = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  value:true,
	  left: 0,
	  width: '33.3%',
	  height: 'auto',
	  top: 0,
	  backgroundImage: 'Checkbox/green_on2u.png',
	  titleOff: '',
	  titleOn: ''
	});
	
	routeCheckboxA = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  value:true,
	  left: '33.3%',
	  width: '33.3%',
	  height: 'auto',
	  top: 0,
	  backgroundImage: 'Checkbox/orange_on2u.png',
	  titleOff: '',
	  titleOn: ''
	});
	
	routeCheckboxC = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  value:true,
	  left: '66.6%',
	  width: '33.3%',
	  height: 'auto',
	  top: 0,
	  backgroundImage: 'Checkbox/blue_on2u.png',
	  titleOff: '',
	  titleOn: ''
	});
	

	topMenu.add(routeCheckboxA);
	topMenu.add(routeCheckboxB);
	topMenu.add(routeCheckboxC);
	
	setCheckBoxEventListeners();
}

//===================================================================
//-------------------------------------------------------------------
//===================================================================

//set stopsArray
function SetStops(){
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			var routesArray = [];
			var id = 0;
			
			//Retrieve initial route info
			routes = JSON.parse(this.responseText);
			for(var i = 0; i < routes.length; i++){
				var routeArray = [];
				var route = routes[i];
		
				for (var j = 0; j < route.Landmarks.length; j++){
					var landmarkArray = [];
					var data = route.Landmarks[j];
					landmarkArray.push(data.Label, data.Latitude, data.Longitude);
					routeArray.push(landmarkArray);
					
				}
				routesArray.push(routeArray);
			}
			Ti.API.info("ROUTES ARRAY: " + routesArray.toString());
	
			//Sort and remove duplicates. Add flags for which shuttles stop at each stop.
			for(var k = 0; k < routesArray.length; k++){
				for(var l = 0; l < routesArray[k].length; l++){
					var cur = routesArray[k][l];
					var skip = 0;
					
					
					for(var i = 0; i < stopsArray.length; i++){
						if(stopsArray[i][0] == cur[0]){
							skip = 1;
							break;
						}	
					}
			
					if(!skip){
						var tmpArray = [];
						tmpArray.push(cur[0], cur[1], cur[2], -1, -1, -1, id++);
						stopsArray.push(tmpArray);
					}
				}
				
			}
			/* ----------------ARRAY INFO-----------------------
			 * stopsArray STRUCTURE
			 * 		[Stop Name, Latitude, Longitude, SouthCentralBusFlag, NorthCentralBusFlag, ExpressBusFlag]
			 * 	
			 * 		Example
			 * 			[LaSells Stewart Center,44.55901,-123.27962,1,0,1]		*/
		}
	});
	xhr.open("GET", url2);
	xhr.send();
}

//===================================================================
//-------------------------------------------------------------------
//===================================================================

function setAdjustTableListener(){
	//Event listener triggered on map click on stop. Starts function that scrolls the table.
	Ti.App.addEventListener('adjustTable', function(event){
		adjustTable(event);		
		});
}


function setCheckBoxEventListeners(){
	routeCheckboxA.addEventListener('change',function(){
		Ti.App.fireEvent("abox", {data: [routeCheckboxA.value]});
		if(routeCheckboxA.value == true){
			routeCheckboxA.setBackgroundImage('Checkbox/orange_on2u.png');
		}
		else{
			routeCheckboxA.setBackgroundImage('Checkbox/orange_off2u.png');
		}
	});
	
	routeCheckboxB.addEventListener('change',function(){
		Ti.App.fireEvent("bbox", {data: [routeCheckboxB.value]});
		if(routeCheckboxB.value == true){
			routeCheckboxB.setBackgroundImage('Checkbox/green_on2u.png');
		}
		else{
			routeCheckboxB.setBackgroundImage('Checkbox/green_off2u.png');
		}
	});
	
	routeCheckboxC.addEventListener('change',function(){
		Ti.App.fireEvent("cbox", {data: [routeCheckboxC.value]});
		if(routeCheckboxC.value == true){
			routeCheckboxC.setBackgroundImage('Checkbox/blue_on2u.png');
		}
		else{
			routeCheckboxC.setBackgroundImage('Checkbox/blue_off2u.png');
		}
	});
}



function setWebViewListener(){
	//Event listener to start when webview loads
	localWebview.addEventListener('load',function(){
		var gpsCounter = 0;
		var stops = [];
		//Start the create map event
	
		getUserGPS();
		Ti.App.fireEvent("startmap", {data: [stops, userGPS]});
		setTimeout(function() {
			ShuttleLocRequest();
			setBackupShuttleData();
			Ti.App.fireEvent("updatemap", {data: [shuttlecoords, heading]});
		}, 1500);
		
	
		//Request the shuttle data, and start the update event, repeats every 5 seconds
		setInterval(function() {
			if(deviceGPSOn){
				gpsCounter++;
				if(gpsCounter === 10){
					userGPS.length = 0;
					getUserGPS();
					gpsCounter = 0;
				}
			}
			ShuttleLocRequest();
			findNearest(userGPS);
			Ti.App.fireEvent("updatemap", {data: [shuttlecoords, heading]});
		}, 4000);
		
	});	
}


function setLongPressListener(){
	routeEstTable.addEventListener('longpress', function(e){
		Ti.API.info("Clicked! e.row: " + e.row + " diffArray[e.row]: " + diffArray[e.row]);
		var index = diffArray[e.index][1];
		var val1 = stopsArray[index][1];
		var val2 = stopsArray[index][2];
		Ti.App.fireEvent("centerMap", {latitude: val1, longitude: val2});
	});
}

//===================================================================
//-------------------------------------------------------------------
//===================================================================

function getUserGPS(){
	Titanium.Geolocation.getCurrentPosition(function(e)
		{
			if (!e.success || e.error)
			{
				Ti.API.info("Failed to get UserGPS, error: " + e);
				deviceGPSOn = false;
				userGPSStatusLabel.text = gpsOffPhrase;
				return;
			}
			else{
				userGPS[0] = e.coords.latitude;
				userGPS[1] = e.coords.longitude;
				userGPS[2] = e.coords.timestamp;
				deviceGPSOn = true;
				userGPSStatusLabel.text = gpsOnPhrase;
			}
		});
}

//===================================================================
//-------------------------------------------------------------------
//===================================================================

//Organize table based on proximity to user
function findNearest(userLocation){
	diffArray = [];
	nearestArray = [];
	
	updateRouteEstimates();
	
	//Calculate differences between stops and UserGPS
	for(var i = 0; i < stopsArray.length; i++){
		var tmpStop = stopsArray[i];
		var latitude = tmpStop[1];
		var longitude = tmpStop[2];
		var diff = getDistanceFromLatLon(userLocation[0],userLocation[1],latitude,longitude);
		diffArray.push([diff, i]);
	}
	
	//Sort the new array by distance, with [0] being the smallest
	diffArray.sort(function(a,b){
		return a[0] - b[0];
	});
	
	var routeColor, labelArray = [], leftIncrement = 70;
	for(var j = 0; j < diffArray.length; j++){
		var index = diffArray[j][1], distance = diffArray[j][0];
		var baseRow = Ti.UI.createTableViewRow({
	    	height:'auto',
	    });
	    
	    labelArray = [];
		for(var i = 0; i < 3; i++){
			if(i==0){
				var distanceLabel = Ti.UI.createLabel({
					font: { fontSize:14 },
					text: distance.toFixed(2.2) + " mi",
					color: '#C0C0C0',
					left: 10,
					top: 28,
				});
				labelArray.push(distanceLabel);
			}
			
			//Disabled empty check for testing -- Change this back!!
			//if(stopsArray[index][i+3] != -1){
				switch(i+3){
					case 3:
						//routeColor = '#576fff';
						routeColor = '#7084ff';
						break;
					case 4:
						routeColor = '#36c636';
						break;
					case 5:
						routeColor = '#ff6600';
						break;
					default:
						Ti.API.info("ALERT, wrong index Stops Array");
				}
				var eta = stopsArray[index][i+3].toString();
				if(eta > 59){
					var minutes = Math.round(eta % 60);
					var hours = Math.round(eta / 60);
					if(minutes < 10)
						eta = hours + ":0" + minutes;
					else
						eta = hours + ":" + minutes;
				}
				else{
					if(eta < 10)
						eta = "0:0"+eta;
					else
						eta = "0:"+eta;
				}
				if(eta == '0:00'){
					eta = 'Arrived';
				}
				
				//TEST VALUE
				eta = "10:40";
				
				var stopTiming = Ti.UI.createLabel({
					font: { fontSize:34 },
					text: eta,
					color: routeColor,
					//top: 5,
					left: 195 + (100*i)
				});
				labelArray.push(stopTiming);
			//}
		}
		
		var secondaryRow = Ti.UI.createTableViewRow({
	    	height:'auto',
	    	textAlign: 'left',
	    });
	   	
	   	var stopNameLabel = Ti.UI.createLabel({
			font: { fontSize:16 },
			text: stopsArray[index][0],
			color: '#FFFFFF',
			left: 0,
			top: 6
		});
		secondaryRow.add(stopNameLabel);
	    
	    for(var i = 0; i < labelArray.length; i++){
			secondaryRow.add(labelArray[i]);
		}
		nearestArray.push(secondaryRow);
	}
	routeEstTable.setData(nearestArray);
}




function updateRouteEstimates(){
	var shuttles = [];
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
			shuttles = JSON.parse(this.responseText);
			for(var i = 0; i < shuttles.length; i++){
				var shuttle = shuttles[i];
				for(var j = 0; j < stopsArray.length; j++){
					for(var k = 0; k < shuttle.RouteStops.length; k++){
						if(shuttle.RouteStops[k].Description == stopsArray[j][0]){
							stopsArray[j][i+3] = shuttle.RouteStops[k].Estimates[0].SecondsToStop;
						}
					}
				}
			}
		},
		onerror: function(e){
			Ti.API.info("UPDATE ROUTE EST ERROR: "+e);
		},
		timeout : 5000
	});
	xhr.open("GET", url);
	xhr.send();
}

//===================================================================
//-------------------------------------------------------------------
//===================================================================

//Variables and function for shuttle coordinates data
var shuttleloc, shuttlelocs;
var shuttlecoords = new Array(3); //Hold all shuttle data
for (var i=0;i<3;i++){
	shuttlecoords[i]=new Array(2); //Hold latitude, longitude
}
var heading = new Array(3);

function ShuttleLocRequest(){
	var xhr = Ti.Network.createHTTPClient({
		onload: function() {
		
			//Get all info
			shuttlelocs = JSON.parse(this.responseText);
			
			if(shuttlelocs.length == 0){
				Ti.API.info("No shuttles active...");
			}
			
			for (var x=0;x<shuttlelocs.length;x++){
				shuttleloc = shuttlelocs[x];
				shuttlecoords[x][0] = shuttleloc.Latitude;
				shuttlecoords[x][1] = shuttleloc.Longitude;
				heading[x] = shuttleloc.Heading;
			}
		},
		onerror : function(e) {
         	try{
         		Ti.API.info("Get Object from backup");
         		shuttlecoords = Ti.App.Properties.getObject('backupShuttleCoords');
         		heading = Ti.App.Properties.getObject('backupHeading');
         		
         	}catch(err){
         		Ti.API.info("Failed to retrieve backup shuttle data: " + err);
         	}
     	}
	});
	xhr.open("GET", url3);
	xhr.send();
}

//===================================================================
//-------------------------------------------------------------------
//===================================================================

function setBackupShuttleData(){
	Ti.App.Properties.setObject('backupShuttleCoords', shuttlecoords);
	Ti.App.Properties.setObject('backupHeading', heading);
	
}


//FUNCTION : Adjusts tableView upon map click. Scrolls to chosen stop.
function adjustTable(e){
	var stopId = e.data[0];
	
	var dataToChange = routeEstTable.getData();
	dataToChange = dataToChange[0].getRows();
	
	//Find name of chosenStop using stopId passed in
	var chosenStop, i;
	for(i = 0; i < stopsArray.length; i++){
		if(stopsArray[i][6] == stopId){
			chosenStop = stopsArray[i][0];
			break;
		}
	}
	
	//Find row with the same name, scroll to it.
	var stopName, j;
	for(i = 0; i < dataToChange.length; i++){
		stopName = dataToChange[i].children[0].text;
		if(stopName == chosenStop){
			var row = dataToChange[i];
			row.backgroundColor = '#000000';
			routeEstTable.scrollToTop(i);
			break;
		}	
	}
	
}


function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  var miConversion = 0.621371;
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c * miConversion; // Distance in km
  return d;
}


function deg2rad(deg) {
  return deg * (Math.PI/180);
}


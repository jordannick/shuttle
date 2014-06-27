//===========================================================================================
//===========================================================================================
//Settings view
//===========================================================================================
//===========================================================================================

Ti.API.info("In Settings!");
var oldProps;

var mainSettingsWin;



var view0, settingsLabel, closeSettingsButton, view1, routeToggleLabel, view2, gpsToggleLabel, gpsToggleButton, view3, feedbackLabel;
var feedbackEmail, feedbackSendButton, view4, unitLabel, unitToggle;
var routeToggleA, routeToggleB, routeToggleC, routeToggleD;


//===========================================================================================

exports.createSettingsWin = function(props){

	
	//mainSettingsWin.open();
	
	
	Ti.API.info("In settings.js.");
	oldProps = props;
	Ti.API.info("IN SETTINGS: props[] = " + props.toString());
	//setDefaults(props);
	//return mainSettingsWin;
	
	//Ti.API.info("In settings.js.");
	oldProps = props;
	//Ti.API.info("IN SETTINGS: props[] = " + props.toString());
	//setDefaults(props);
	var ret = createWindow();
	return ret;
};

function createWindow(){
	mainSettingsWin = Ti.UI.createWindow({
		layout: 'vertical',
		width: '100%',
		height: '100%',
		navBarHidden:true,
		//backgroundColor: '#FFFFFF',
		backgroundGradient: {
			type:'linear',
			//colors:[{color:'#656968', position:0.0},{color:'#3a3c3b', position: 1.0}]
			colors:[{color:'#3b3b3b', position:0.0},{color:'#1e1e1e', position: 1.0}]
		},
	});
	
	view0 = Ti.UI.createView({
		height: 56,
		backgroundGradient: {
			type:'linear',
			colors:[{color:'#2370a1', position:0.0},{color:'#09557c', position: 1.0}]
		},
		bottom: 10,
	});
	
	settingsLabel = Ti.UI.createLabel({
		font:{fontSize:22},
		color: '#FFFFFF',
		text: 'Settings',
		left: 10,
	});
	
	closeSettingsButton = Ti.UI.createButton({
		backgroundImage: 'GeneralUI/settingsGoBack.png',
		backgroundSelectedImage: 'GeneralUI/settingsGoBackPressed.png',
		width: 42,
		height: 42,
		right: 10,
		title: '',
	});
	
	closeSettingsButton.addEventListener('click', function(e){
		destroyWindow();
	});
	
	view0.add(settingsLabel);
	view0.add(closeSettingsButton);
	
	//===========================================================================================
	
	view1 = Ti.UI.createView({
		height: Ti.UI.SIZE,
		layout: 'horizontal',
	});
	
	routeToggleLabel = Ti.UI.createLabel({
		font: {fontSize: 20},
		color: '#FFFFFF',
		text: "Shuttle/Route Display",
		width: '100%',
	});
	
	routeToggleA = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  font:{fontSize:16,fontFamily:'Helvetica Neue'},
	  value:true,
	  width: '50%',
	  //height: '100%',
	  titleOff: 'Express',
	  titleOn: 'Express',
	  borderRadius: 5,
	  verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	
	routeToggleB = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  font:{fontSize:16,fontFamily:'Helvetica Neue'},
	  value:true,
	  width: '50%',
	  //height: '100%',
	  titleOff: 'South Central',
	  titleOn: 'South Central',
	  borderRadius: 5,
	  verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	
	routeToggleC = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  font:{fontSize:16,fontFamily:'Helvetica Neue'},
	  value:true,
	  width: '50%',
	  //height: '100%',
	  titleOff: 'North Central',
	  titleOn: 'North Central',
	  borderRadius: 5,
	  verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	
	routeToggleD = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  font:{fontSize:16,fontFamily:'Helvetica Neue'},
	  value:true,
	  width: '50%',
	  //height: '100%',
	  titleOff: 'Central Campus',
	  titleOn: 'Central Campus',
	  borderRadius: 5,
	  verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	
	view1.add(routeToggleLabel);
	view1.add(routeToggleA);
	view1.add(routeToggleB);
	view1.add(routeToggleC);
	view1.add(routeToggleD);
	
	//===========================================================================================
	
	view2 = Ti.UI.createView({
		layout: 'horizontal',
		height: Ti.UI.SIZE,
		top: 10,
		bottom: 10,
	});
	
	gpsToggleLabel = Ti.UI.createLabel({
		font: {fontSize: 20},
		color: '#FFFFFF',
		text: "User GPS",
	});
	
	gpsToggleButton = Ti.UI.createSwitch({
		style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
		font: {fontsize: 16},
		value: true,
		titleOff: "GPS Off",
		titleOn: "GPS On",
	});
	
	view2.add(gpsToggleLabel);
	view2.add(gpsToggleButton);
	
	//===========================================================================================
	
	view3 = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		layout: 'horizontal',
		top: 10,
		bottom: 10,
	});
	
	feedbackLabel = Ti.UI.createLabel({
		font: {fontSize: 20},
		color: '#FFFFFF',
		width: '100%',
		text: 'Help Improve the App!'
	});
	
	feedbackEmail = Ti.UI.createEmailDialog();
	feedbackEmail.subject = "BeaverBus App Feedback";
	feedbackEmail.toRecipients = ['sellers.kevin@gmail.com'];
	
	feedbackSendButton = Ti.UI.createButton({
		//width: 100,
		title: "Send Feedback",
	});
	feedbackSendButton.addEventListener('click', function(e){
		Ti.App.Properties.setString('sentEmail', 'yes');
		feedbackEmail.open();
	});
	
	view3.add(feedbackLabel);
	view3.add(feedbackSendButton);
	
	//===========================================================================================
	
	view4 = Ti.UI.createView({
		width: '100%',
		height: Ti.UI.SIZE,
		layout: 'horizontal',
		top: 10,
		bottom: 10,
	});
	
	unitLabel = Ti.UI.createLabel({
		font: {fontSize: 20},
		color: '#FFFFFF',
		text: "Distance Unit"
	});
	
	unitToggle = Ti.UI.createSwitch({
	  style: Ti.UI.Android.SWITCH_STYLE_TOGGLEBUTTON,
	  font:{fontSize:16,fontFamily:'Helvetica Neue'},
	  value:true,
	  titleOff: 'Km',
	  titleOn: 'Mi',
	  //verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
	});
	view4.add(unitLabel);
	view4.add(unitToggle);

	mainSettingsWin.add(view0);
	mainSettingsWin.add(view1);
	mainSettingsWin.add(view2);
	mainSettingsWin.add(view4);
	mainSettingsWin.add(view3);
	
	return mainSettingsWin;
}

function destroyWindow(){
	setProperties();
	
	view0 = null; settingsLabel = null; closeSettingsButton = null; view1 = null; routeToggleLabel = null; view2 = null; gpsToggleLabel = null; gpsToggleButton = null; view3 = null; feedbackLabel = null;
	feedbackEmail = null; feedbackSendButton = null; view4 = null; unitLabel = null; unitToggle;
	routeToggleA = null; routeToggleB = null; routeToggleC = null; routeToggleD = null;
	
	mainSettingsWin.close();
	mainSettingsWin = null;
}

function setDefaults(props){
	routeToggleA.setValue(props[0]);
	routeToggleB.setValue(props[1]);
	routeToggleC.setValue(props[2]);
	routeToggleD.setValue(props[3]);
	gpsToggleButton.setValue(props[4]);
	unitToggle.setValue(props[5]);
}

function setProperties(){
	Ti.App.Properties.setString('showExpress', routeToggleA.getValue());
	Ti.App.Properties.setString('showSouthCentral', routeToggleB.getValue());
	Ti.App.Properties.setString('showNorthCentral', routeToggleC.getValue());
	Ti.App.Properties.setString('showCentralCampus', routeToggleD.getValue());
	
	Ti.App.Properties.setString('gpsEnabled', gpsToggleButton.getValue());
	
	Ti.App.Properties.setString('unitMi', unitToggle.getValue());
	
	var props = [routeToggleA.getValue(), routeToggleB.getValue(), routeToggleC.getValue(), routeToggleD.getValue(), gpsToggleButton.getValue(), unitToggle.getValue()];
	
	Ti.API.info("OldProps : " + oldProps.toString() + " |||| NewProps : " + props.toString());
	for(var i = 0, len = oldProps.length; i < len; i++){
		if(oldProps[i] == props[i])
		{
			props[i] = -1;
		}
	}
	Ti.App.fireEvent('settingsChanged', {data: props});
	Ti.API.info("Newly changed props[] : " + props.toString());	
	
}
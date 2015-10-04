var map = L.map('map').setView([37.8, -96],4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiYWxleHBldHJhbGlhIiwiYSI6IjkzNGM2N2ExZmE2ZDEwMzFiMzQyMDYxOWZmM2Q3OWIzIn0.lnNa29TGpWFu5V-pqDIsuA'
}).addTo(map);

//get color depending on difference in likelihood
function getColor(odds){
	console.log(odds)
	if (odds > 2.5) {color = '#b30000'
	} else if (odds > 2) {color = '#e34a33'
	} else if (odds > 1.5) {color = '#fc8d59'
	} else if (odds > 1) {color = '#fdcc8a'
	} else color = '#fef0d9'
	console.log(color);
	return color;
}
	
function style(feature) {
    return {
        fillColor: getColor(feature.properties.black_coeff),
        weight: 3,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

//L.geoJson(statesData, {style:style}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;
	console.log(e)
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
	info.update();
}

var geojson;

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function(map){
	this._div = L.DomUtil.create('div', 'info'); //create div with class info
	this.update();
	return this._div;
};

var addCommas = function(str) {
  return (str + "").replace(/(\d)(?=(\d{3})+(\.\d+|)\b)/g, "$1,");
}

var percentBuilder = function(str) {
  return (str * 1).toFixed(3) + "%";
};


//update the control based on feature properties
info.update = function (props) {
    this._div.innerHTML = '<h4>How much harder is it for black people to get loans?</h4>' +
          (props ?
        '<b>' + props.name + '</b><br />' + props.black_coeff.toFixed(2) + ' = black loan difficulty index' +
        '<br>' + addCommas(props.tot_apps.toString()) + ' mortgage loan applications in the state in 2014.' + 
        '<br>' + percentBuilder(props.black_share.toString()) + ' share of applicants were black.'
        : 'Move your pointer over a state');
};

info.addTo(map);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map){
	
	var div = L.DomUtil.create('div', 'info legend'),
	grades = [0, 1, 1.5, 2, 2.5]
	labels = []
	
	//look at ratios and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
	
	return div;
};

legend.addTo(map);



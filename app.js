
 //initialize map when page ready
 //-----------
var map, layer;
var nlon = 139.809006;
var nlat = 35.682999;
var iZone = 2;
//var options = {theme: null};

// Projections
// -----------
var sphericalMercatorProj = new OpenLayers.Projection('EPSG:900913');
var geographicProj = new OpenLayers.Projection('EPSG:4326');

// Define three colors that will be used to style the cluster features
// depending on the number of features they contain.
// -----------
var colors = {
	low: "rgb(181, 226, 140)", 
	middle: "rgb(241, 211, 87)", 
	high: "rgb(253, 156, 115)"
};

// Define three rules to style the cluster features.
// -----------
var lowRule = new OpenLayers.Rule({
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.LESS_THAN,
		property: "count",
		value: 15
	}),
	symbolizer: {
		fillColor: colors.low,
		fillOpacity: 0.9, 
		strokeColor: colors.low,
		strokeOpacity: 0.5,
		strokeWidth: 12,
		pointRadius: 10,
		label: "${count}",
		labelOutlineWidth: 1,
		fontColor: "#ffffff",
		fontOpacity: 0.8,
		fontSize: "12px"
	}
});
var middleRule = new OpenLayers.Rule({
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.BETWEEN,
		property: "count",
		lowerBoundary: 15,
		upperBoundary: 50
	}),
	symbolizer: {
		fillColor: colors.middle,
		fillOpacity: 0.9, 
		strokeColor: colors.middle,
		strokeOpacity: 0.5,
		strokeWidth: 12,
		pointRadius: 15,
		label: "${count}",
		labelOutlineWidth: 1,
		fontColor: "#ffffff",
		fontOpacity: 0.8,
		fontSize: "12px"
	}
});
var highRule = new OpenLayers.Rule({
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.GREATER_THAN,
		property: "count",
		value: 50
	}),
	symbolizer: {
		fillColor: colors.high,
		fillOpacity: 0.9, 
		strokeColor: colors.high,
		strokeOpacity: 0.5,
		strokeWidth: 12,
		pointRadius: 20,
		label: "${count}",
		labelOutlineWidth: 1,
		fontColor: "#ffffff",
		fontOpacity: 0.8,
		fontSize: "12px"
	}
});

            
// Create a Style that uses the three previous rules
// -----------
var style = new OpenLayers.Style(null, {
	rules: [lowRule, middleRule, highRule]
});   

// Create a vector layers
// -----------
var citiesLayer = new OpenLayers.Layer.Vector("Cities", {
	protocol: new OpenLayers.Protocol.HTTP({
		url: "./data/world_cities.json",
		//url: "https://raw.githubusercontent.com/kenkaohy/json/9aa47d333c1433e7323861e3c890598da9b4da0d/world_cities.json",
		format: new OpenLayers.Format.GeoJSON()
	}),
	renderers: ['Canvas','SVG'],
	strategies: [
		new OpenLayers.Strategy.Fixed(),
		//Using AnimatedCluster.js
		new OpenLayers.Strategy.AnimatedCluster({
			distance: 45,
			animationMethod: OpenLayers.Easing.Expo.easeOut,
			animationDuration: 12
		})
	],
	styleMap:  new OpenLayers.StyleMap(style)
});	

// Sundials: layer uses Cluster strategy.
var sundialsLayer = new OpenLayers.Layer.Vector('Sundials (clustered)', {
    projection: geographicProj,
    strategies: [
        new OpenLayers.Strategy.Fixed(),
        new OpenLayers.Strategy.Cluster()
    ],
    styleMap: new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
                pointRadius: '${radius}',
                fillOpacity: 0.6,
                fillColor: '#ffcc66',
                strokeColor: '#cc6633'
            }, {
                context: {
                    radius: function(feature) {
                        return Math.min(feature.attributes.count, 10) * 1.5 + 2;
                    }
                }
        }),
        'select': {fillColor: '#8aeeef'}
    }),
    protocol: new OpenLayers.Protocol.HTTP({
        url: 'data/sundials.kml',
		//url: "https://raw.githubusercontent.com/kenkaohy/json/master/sundials.kml",
        format: new OpenLayers.Format.KML({
            extractStyles: true,
            extractAttributes: true
        })
    })
});


// -----------
// Create Main map
// ----------
var map = new OpenLayers.Map({
    div: 'sample_map',
    layers: [
        new OpenLayers.Layer.OSM('OpenStreetMap'),
		citiesLayer,
        sundialsLayer
    ],

});

//Deafult hide the layer when load map.
sundialsLayer.setVisibility(false);

//Add layer scwitcher control.
map.addControl(new OpenLayers.Control.LayerSwitcher());

//Set Map center by coordinate.
map.setCenter(
	new OpenLayers.LonLat(nlon,nlat ).transform(
		new OpenLayers.Projection("EPSG:4326"),
		map.getProjectionObject()
	), iZone
);   


// Create control and add some layers
// ----------------------------------
var fpControl = new OpenLayers.Control.FeaturePopups({
    boxSelectionOptions: {},
    layers: [
        [
        // Uses: Templates for hover & select and safe selection
        sundialsLayer, {templates: {
            // hover: single & list
            hover: '${.name}',
            hoverList: '<b>${count}</b><br>${html}',
            hoverItem: '${.name}<br>',
            // select: single & list
            single: '<div><h2>${.name}</h2>${.description}</div>',
            item: '<li><a href=\"#\" ${showPopup()}>${.name}</a></li>'
        }}]
    ]
});
map.addControl(fpControl);


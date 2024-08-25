#target photoshop

function exportLayersIndividually() {
    var doc = app.activeDocument;
    var outputFolder = Folder.selectDialog("Select the output folder");

    if (!outputFolder) {
        return; // Exit if no folder is selected
    }

    var exportCount = 0;
    var totalLayers = doc.layers.length;

    // Loop through each layer except the last one (the base mask layer)
    for (var i = 0; i < totalLayers - 1; i++) {
        var layer = doc.layers[i];

        // Skip if the layer is not visible
        if (!layer.visible) {
            continue;
        }

        // Show only the current layer
        for (var j = 0; j < totalLayers; j++) {
            if (j !== i && j !== totalLayers - 1) { // Hide all layers except the current layer and the base mask layer
                doc.layers[j].visible = false;
            }
        }

        // Export the current layer
        var fileName = layer.name + ".png";
        var file = new File(outputFolder + "/" + fileName);
        var options = new PNGSaveOptions();
        options.compression = 9;
        doc.saveAs(file, options, true, Extension.LOWERCASE);

        // Hide the current layer
        layer.visible = false;

        exportCount++;

        // Make all layers visible again for the next iteration
        for (var k = 0; k < totalLayers; k++) {
            doc.layers[k].visible = true;
        }
    }

    alert("Layers exported successfully!");
}

exportLayersIndividually();

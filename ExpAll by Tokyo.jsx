#target photoshop

function exportLayersIndividually() {
    var doc = app.activeDocument;
    var outputFolder = Folder.selectDialog("Select the output folder");

    if (!outputFolder) {
        return; // Exit if no folder is selected
    }

    var totalLayers = doc.layers.length;
    var cancel = false;

    // Create a progress dialog
    var progressWindow = new Window("palette", "Export Progress");
    progressWindow.progressBar = progressWindow.add("progressbar", [0, 0, 300, 20], 0, totalLayers - 1);
    progressWindow.progressBar.label = progressWindow.add("statictext", [0, 20, 300, 40], "Exporting...");
    progressWindow.cancelButton = progressWindow.add("button", [0, 40, 100, 60], "Cancel");

    // Show the progress window
    progressWindow.show();

    // Function to check for cancellation
    function checkForCancel() {
        if (cancel) {
            progressWindow.close();
            alert("Export cancelled.");
            return true;
        }
        return false;
    }

    // Attach the cancel button's click event handler
    progressWindow.cancelButton.onClick = function() {
        cancel = true;
    };

    // Loop through each layer except the last one (the base mask layer)
    for (var i = 0; i < totalLayers - 1; i++) {
        if (checkForCancel()) {
            return; // Exit if canceled
        }

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

        // Update progress bar
        progressWindow.progressBar.value = i;
        progressWindow.progressBar.label.text = "Exporting layer " + (i + 1) + " of " + (totalLayers - 1);

        // Make all layers visible again for the next iteration
        for (var k = 0; k < totalLayers; k++) {
            doc.layers[k].visible = true;
        }
    }

    if (!checkForCancel()) {
        progressWindow.close();
        alert("Layers exported successfully!");
    }
}

exportLayersIndividually();

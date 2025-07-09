function HouseholdTimeSeries() {
    //name for the visulisation to appear in the menu bar.
    this.name = 'SG-Household: 2020';
    
    // each visualisation must have a unique ID with no special characters.
    this.id = 'household-timeseries';
    
    //title to display above the plot.
    this.title = 'SG-Household: 2020';
    
    //name for eaceh axis
    this.xAxisLabel = 'Type of Housing';
    this.yAxisLabel = 'HouseHold income';
    
    var marginSize = 35;
    
    //used for hovering text
    var hoveredEllipseIndex = -1;
    
    // Maximum width for x-axis labels
    this.maxLabelWidth = 150;
    
    // Padding for wrapped lines
    var labelPadding = 10;
    
     // Initialize the array to hold checkboxes
    this.houseTypeCheckboxes = [];
      
    //layout object to store all common plot layout parameters and methods.
    this.layout= {
        marginSize: marginSize,
        //locations of margin positons. lef and bottom have double margin size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,
        plotWidth:function(){
            return this.rightMargin - this.leftMargin;
            console.log("plot width ="+ this.plotWidth )
        },
        
        plotHeight:function(){
            return this.bottomMargin - this.topMargin;
        },
        
        //boolean to enable/disable background grid.
        grid:false,
        
        //number of axis tick labels to draw so that they are not drawn on top of one another
        numXTickLabels:10,
        numYTickLabels:8,
    };
    
    this.drawTitle = function() {
        fill(0);
        noStroke();
        textAlign('center','center');
        text(this.title,
            (this.layout.plotWidth()/2) + this.layout.leftMargin,this.layout.topMargin - (this.layout.marginSize/2));
    };
    
    //map the min and max income to the bottom and top of the y axis line
    this.mapIncomeToHeight = function(value){
        return map(value,
                  this.minincome,
                  this.maxincome,
                  this.layout.bottomMargin,
                  this.layout.topMargin);
    };
    
    //property to represent whether data has been loaded
    this.loaded = false;
    
    // preload the data. this function is called automatically by the gallery when a visulisation is added.
    this.preload = function(){
        var self = this;
        this.data = loadTable(
                    './data/house-hold-income/householdincome.csv','csv','header',
                    // callback function to set the value 
                    // this.load to true.
                    function(table){
                        self.loaded=true;
                        console.log("data loaded")
                    });
    }

    // Function to wrap text based on a maximum width
    function wrapText(text, maxWidth) {
        var words = text.split(' ');
        var lines = [];
        var currentLine = '';

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            var testLine = currentLine + (currentLine === '' ? '' : ' ') + word;
            var testWidth = textWidth(testLine);
            if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines.join('\n');
    }
    
    //this function updates the graph when the check box is selected or unselected 
    this.updateDisplay = function () {
        // Redraw the plot without clearing the canvas
        this.drawTitle();
        drawYAxisTickLabels(this.minincome, this.maxincome, this.layout, this.mapIncomeToHeight.bind(this), 0);
        drawAxis(this.layout);
        drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);
        // Iterate through checkboxes and update housing type visibility
        for (var i = 0; i < this.houseTypeCheckboxes.length; i++) {
            var checkbox = this.houseTypeCheckboxes[i];
            var housingType = this.housingTypes[i];
            if (checkbox.checked()) {
                // Draw the housing type if the checkbox is checked
                this.drawHousingType(housingType);
            }
        }
    }
    
    this.drawHousingType = function (housingType) {
        // Calculate the spacing between ellipses based on the total selected checkboxes
        var xSpacing = (this.layout.rightMargin - this.layout.leftMargin)/6;
        var y = xSpacing;
        // Iterate through checkboxes and draw ellipses and labels for selected housing types
        for (var checkboxIndex = 0; checkboxIndex < this.houseTypeCheckboxes.length; checkboxIndex++) {
            var checkbox = this.houseTypeCheckboxes[checkboxIndex];
            if (checkbox.checked() && this.housingTypes[checkboxIndex] === housingType) {
                for (var housingIndex = 0; housingIndex < this.housingTypes.length; housingIndex++) {
                    if (this.housingTypes[housingIndex] === housingType) {
                        fill(0);
                        noStroke();
                        textAlign('center', 'center');
                        textSize(16);

                        // Wrap the label text if it's too long
                        var wrappedText = wrapText(this.housingTypes[housingIndex], this.maxLabelWidth);

                        // Split the wrapped text into lines
                        var lines = wrappedText.split('\n');

                        // Draw each line with increased padding for wrapped lines
                        for (var j = 0; j < lines.length; j++) {
                            var line = lines[j];
                            var labelY = this.layout.bottomMargin + this.layout.marginSize / 2 + j * textSize() + j * labelPadding;
                            text(line, 0 + y, labelY);
                        }
                        //plotting of ellipses 
                        stroke(65, 105, 225);
                        noFill();
                        var ellipseX = 0 + y;
                        var ellipseY = this.mapIncomeToHeight(this.ballheight[housingIndex]);
                        var ellipseRadius = this.ballsize[housingIndex] * 5;
                        ellipse(ellipseX, ellipseY, ellipseRadius);

                        // Check if the mouse is over the current ellipse
                        var distanceToEllipse = dist(mouseX, mouseY, ellipseX, ellipseY);
                        if (distanceToEllipse < ellipseRadius / 2) {
                            hoveredEllipseIndex = housingIndex;
                        } else if (hoveredEllipseIndex === housingIndex) {
                            hoveredEllipseIndex = -1;
                        }
                    }
                    // Increment the distance between labels
                    y = y + xSpacing;
                }
                // Display income when hovering over an ellipse
                if (hoveredEllipseIndex !== -1) {
                    var income = this.ballheight[hoveredEllipseIndex];
                    var hoverText = 'Income:' + income + '\n' + '% of this housing type:' + this.ballsize[hoveredEllipseIndex] + '%';
                    fill(0);
                    textAlign(CENTER);
                    textSize(16);
                    stroke(255);
                    text(hoverText, mouseX, mouseY - 20);
                }
            }
        }
    }

    this.destroy = function () {
        // Remove checkboxes
        for (var i = 0; i < this.houseTypeCheckboxes.length; i++) {
            this.houseTypeCheckboxes[i].remove();
        }
    }
       
    this.setup = function () {
        // font defaults
        textSize(16);
        this.minincome = 0;
        this.maxincome = 28000;

        // Ensure that data is loaded before accessing it
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Clear the existing checkboxes if any
        for (var i = 0; i < this.houseTypeCheckboxes.length; i++) {
            this.houseTypeCheckboxes[i].remove();
        }
        this.houseTypeCheckboxes = []; // Clear the array

        // Get the values from the data sheet
        this.housingTypes = this.data.getColumn(0);
        this.ballheight = this.data.getColumn(1);
        this.ballsize = this.data.getColumn(2);

        // Create checkboxes for each housing type
        for (var i = 0; i < this.housingTypes.length; i++) {
            var checkbox = createCheckbox(this.housingTypes[i], true); // 'true' sets the checkbox to checked by default
            checkbox.position(150, this.layout.bottomMargin + 20 + i * 25); // Adjust the position as needed
            checkbox.style('color', 'black'); // Adjust checkbox label color
            checkbox.changed(this.updateDisplay.bind(this)); // Call the updateDisplay function when checkbox state changes
            this.houseTypeCheckboxes.push(checkbox);
        }
    }
   
    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minincome, this.maxincome, this.layout, this.mapIncomeToHeight.bind(this), 0);
        //draw x and y axis
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);
        
        // Call the updateDisplay function to whihc draws the checkboxes and housing types
        this.updateDisplay();
    }
}


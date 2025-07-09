function NutrientsTimeSeries() {
    //name for the visulisation to appear in the menu bar.
    this.name = 'Nutrients: 1974-2016';
    
    // each visualisation must have a unique ID with no special characters.
    this.id = 'nutrients-timeseries';
    
    //title to display above the plot.
    this.title = 'nutrients: 1974-2016';
    
    //name for eaceh axis
    this.xAxisLabel = 'year';
    this.yAxisLabel = '%';
    
    this.colors = [];
    
    var marginSize = 35;
    
    //layout object to store all common plot layout parameters and methods.
    this.layout= {
        marginSize: marginSize,
        
        //locations of margin positons. left and bottom have double margin size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,
        
        plotWidth:function(){
            return this.rightMargin - this.leftMargin;
        },
        
        plotHeight:function(){
            return this.bottomMargin - this.topMargin;
        },
        
        //boolean to enable/disable background grid.
        grid:true,
        
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
    
    this.mapYearToWidth = function(value){
        return map(value,
                  this.startYear,
                  this.endYear,
                  this.layout.leftMargin,
                  this.layout.rightMargin);
    };
    
    this.mapNutrientsToHeight = function(value){
        return map(value,
                  this.minPercentage,
                  this.maxPercentage,
                  this.layout.bottomMargin,
                  this.layout.topMargin);
    };
    
    // property to represent whether data has been loaded.
    this.loaded = false;
    
    // preload the data. this function is called automatically by the gallery when a visulisation is added.
    this.preload = function(){
        var self = this;
        this.data = loadTable(
            './data/food/nutrients74-16.csv','csv','header',
        // callback function to set the value 
        // this.load to true.
        function(table){
            self.loaded=true;
                  });
    };
    
    //this function is to create the legend
    this.makeLegendItem = function(label, i , colour){
        var boxWidth = 50;
        var boxHeight = 10;
        var x = 792;
        var y = 40+ (boxHeight+2)*i;
        
        noStroke();
        fill(colour);
        rect(x , y , boxWidth,boxHeight);
        
        fill('black');
        textAlign('left', 'center');
        textSize(12);
        text(label, x + boxWidth +10 , y+boxHeight/2);
    }
    
    this.setup = function () {
        var container = document.createElement('div');
        container.classList.add('checkboxContainer');
        document.body.appendChild(container);
        
        this.selectedNutrients = [];
        this.colors = [];
        //font defaults.
        textSize(16);
        
        //set min and max years: assumes data is sorted by date.
        this.startYear = Number(this.data.columns[1]);
        this.endYear = Number(this.data.columns[this.data.columns.length -1]);
        
    // Create checkboxes for nutrient selection
    for (var i = 0; i < this.data.getRowCount(); i++) {
      var nutrient = this.data.getString(i, 0);

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = nutrient;
      checkbox.classList.add('nutrientCheckbox');
      checkbox.addEventListener('change', this.handleNutrientSelection.bind(this));

      var label = document.createElement('label');
      label.textContent = nutrient;
      label.appendChild(checkbox);

      // Append the checkbox and label to the document body
      container.appendChild(label);
    }
        
        for(var i=0; i< this.data.getRowCount(); i++)
            {
                this.colors.push(color(random(0,255),random(0,255),random(0,255)));
            }
        
        //set the min and max percentage
        // do a dynamic find min and max in the data source
        this.minPercentage = 80;
        this.maxPercentage = 400;
        
        
    };
    
    this.destroy = function () {
        // Remove the container div and its contents from the document
        var container = document.querySelector('.checkboxContainer');
        if (container) {
            container.remove();
        }
    };
    
    this.handleNutrientSelection = function () {
        // Clear the previously selected nutrients
        this.selectedNutrients = [];
        // Get the selected nutrients from the checkboxes
        var checkboxes = document.querySelectorAll('.nutrientCheckbox');

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                this.selectedNutrients.push(checkbox.value);
            }
        });

        // Redraw the graph with the selected nutrients
        redraw();
    };
    

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels
        drawYAxisTickLabels(this.minPercentage, this.maxPercentage, this.layout, this.mapNutrientsToHeight.bind(this), 0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels
        drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

        // Plot all pay gaps between startyear and end year using the width of the canvas minus margins
        var numYears = this.endYear - this.startYear;

        // Plot only the selected nutrients
        for (var i = 0; i < this.data.getRowCount(); i++) {
            var row = this.data.getRow(i);
            var title = row.getString(0);

            // Check if the current nutrient is selected
            if (this.selectedNutrients.includes(title)) {
                var previous = null;

                for (var j = 1; j < this.data.getColumnCount(); j++) {
                    var current = {
                                    year: this.startYear + j - 1,
                                    percentage: row.getNum(j),
                                    };

                    if (previous !== null) {
                        stroke(this.colors[i]);
                        line(
                            this.mapYearToWidth(previous.year),
                            this.mapNutrientsToHeight(previous.percentage),
                            this.mapYearToWidth(current.year),
                            this.mapNutrientsToHeight(current.percentage)
                            );

                    var xLabelSkip = 3;
                    if ((previous.year - this.startYear) % xLabelSkip === 0) {
                        drawXAxisTickLabel(previous.year, this.layout, this.mapYearToWidth.bind(this));
                        }
                    } else {
                        noStroke();
                        this.makeLegendItem(title, i, this.colors[i]);
                    }

                previous = current;
                }
            }
        };
    }
}




function Food(){
    // name for the visualisation to appear in the menu bar.
    this.name = 'Food';
    
    //Each visualisation must have a unique ID with no special characters.
    this.id = 'food';
    
    //Property to represent whether data has been loaded.
    this.loaded = false;
    
    var bubbles = [];
    var maxAmt;
    var years = [];
    var yearSelect;
    
    //Preload the data. This function is called automatically by the gallery when a visualisation is added.
    this.preload = Function()
    {
        var self = this;
        this.data = loadTable(
            './data/food/foodData.csv','csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function(table) {
                self.loaded = true;
            }
        );
    }
    
    //This is called automatically when the user click on the menu button 
    this.setup = function() {
        console.log("in set up");
        this.data_setup();
    }
    
    // this is caled automatically when the user click on the other menu button
    this.destroy = function() {
        console.log("in destory");
        //clear away the years button
        select("#years").html("");
    }
    
    this.draw = function() 
    {
        if(!this.loaded)
            {
                console.log('Data not yet loaded');
                return;
            }
        translate(width/2,height/2);
        for(var i=0;i<bubbles.length;i++)
            {
                bubbles[i].update(bubbles);
                bubbles[i].draw();
            }
    }
    
      this.data_setup = function() {
        
        bubbles =[];
        maxAmt;
        years = [];
        yearSelect;
        
        var rows = this.data.getRows();
        var numColumns = this.data.getColumnCount();
        
        // Create the dropdown select for years
        yearSelect = createSelect();
        yearSelect.parent('years');
        yearSelect.changed(function() {
            
            changeYear(yearSelect.value(), years, bubbles);
        });

        // Populate the dropdown select with options
        for (var i = 5; i < numColumns; i++) {
            var y = this.data.columns[i];
            years.push(y);
            yearSelect.option(y);
        }   
          
          
        //creat bubble for each food type
        //each bubble consists of data value from 1974 to 2016/17
        maxAmt = 0;
        for(var i=0;i<rows.length;i++)
            {
                if(rows[i].get(0) != "")
                    {
                        //set the food name
                        var b = new Bubble(rows[i].get(0));
                        
                        //start from column index 5, which is all the years
                        for(var j = 5;j<numColumns; j ++)
                            {
                                //get the value for each year
                                if(rows[i].get(j) !="")
                                    {
                                        var n = rows[i].getNum(j);
                                        if(n > maxAmt)
                                            {
                                                maxAmt = n; // keep a tally of the highest value
                                            }
                                        b.data.push(n);// push data in 
                                    }
                                else
                                    {
                                        //for empty value
                                        b.data.push(0);
                                    }
                            }
                        bubbles.push(b);
                    }
            }
        
        for(var i=0;i<bubbles.length;i++)
            {
                bubbles[i].setMaxAmt(maxAmt);
                bubbles[i].setData(0);// set to the first data
            }
    }
    
    function changeYear(year,_years,_bubbles){
        var y = _years.indexOf(year);
        //set the selected year for all the bubbles
        for(var i=0;i<bubbles.length;i++)
            {
                _bubbles[i].setData(y);
            }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    //Will use the base example for some starter data
    const bloodPressure = [ 
                        {SysBP: 120, DiaBP: 90, atDate: '2018/10/31'}, 
                        { SysBP: 115, DiaBP: 100, atDate: '2018/10/20'} 
                    ];
    
    const egfrData = [ 
                        {eGFR: 65, atDate: '2018/10/31'}, 
                        {eGFR: 70, atDate: '2018/10/20'}
                     ];
    
    initializeTables();
    
    //Fills out the tables from stored input data
    function initializeTables() {
        fillTable(bloodPressure, 'bpTable');
        fillTable(egfrData, 'kdTable');
        printResults(calculateBP(bloodPressure), "bpResults");
        printResults(calculateKD(egfrData), "kdResults");
    }
    
    //Returns a sorted array of readings. Must have an 'atDate' property to sort by.
    function sortByDate (readings) {
        //Replacing forward slashes with hyphons, forward slash format is undefined for some browsers
        for ( let reading of readings ) {
            reading.atDate = reading.atDate.replace(/\//g, "-");
        }
        
        //Sorting array based on date, will sort to most recent
        return readings.sort ( (a, b) => (a.atDate < b.atDate) ? 1 : -1 );
    }
    
    //Calls sort function, grabs most recent reading and assesses stage. 
    //returns an object of the most recent reading with a classification
    function calculateBP (bloodPressureArray) {
        let sortedBP = sortByDate(bloodPressureArray);
        let results = Object.assign({}, sortedBP[0]); //Creating a copy of the reading we want
        let hyperT = false;
        
        console.log(results);
        
        //Stage 3 check
        if (results.SysBP >= 180 && results.DiaBP >= 120) {
                hyperT = true;
                results.Classification = "Stage 3"; 
            
        }
        //Stage 2 check
        if(results.SysBP >= 160 && results.SysBP < 180) {
            hyperT = true;
            results.Classification = "Stage 2";
            
            
        } else if(results.DiaBP >= 100 && results.DiaBP < 110) {
            hyperT = true;
            results.Classification = "Stage 2";    
        }
        
        //Stage 1 check
        if(results.SysBP >= 140 && results.SysBP < 160) {
            hyperT = true;
            results.Classification = "Stage 1";
        
        } else if (results.DiaBP >= 90 && results.DiaBP < 100){
            hyperT = true;
            results.Classification = "Stage 1";
            
        }
        
        //Choosing to use a flag instead of a long if/else tree.
        if(!hyperT)
            results.Classification = "No Hypertension";
        
        return results;
    }
    
    //Calls sort function, grabs most recent reading and assesses kidney disease. 
    //returns an object of the most recent reading with a classification
    function calculateKD(egfrArray) {
        let sortedKidneyArray = sortByDate(egfrArray);
        let results = Object.assign({}, sortedKidneyArray[0]);
        
        if(results.eGFR >= 90) {
            
            results.Classification = "Normal";
            
        } else if (results.eGFR >= 60 && results.eGFR <= 90) {
            
            results.Classification = "Mildly Decreased";
            
        } else if (results.eGFR >= 45 && results.eGFR <= 59) {
            
           results.Classification = "Mild to Moderate";
            
        } else if (results.eGFR >= 30 && results.eGFR <= 44) {
            
            results.Classification = "Moderate to Severe";
            
        } else if (results.eGFR >= 15 && results.eGFR <= 29) {
            
            results.Classification = "Severely Decreased";
        
        } else {
            
            results.Classification = "Kidney Failure";
        }
        
        return results;
    }
    
    //This will iterate through an array and assess any 20% fluctuations in readings chronologically
    //Returns an empty array if no problems found, or the two readings which show problems
    function kidneyDropCheck(egfrArray) {
        let sortedReadings = sortByDate(egfrArray);
        let percentageToCheck = 0.2; //Percentage we are checking
        let problemReadings = []; //Storing problem readings in pairs so it's easier to output this.
        let problemPair = []; //This will be for our pair readings
        
        
        for ( let i = 1; i < (sortedReadings.length - 1); i++) {
            
            let difference = sortedReadings[i].eGFR - sortedReadings[(i - 1)].eGFR;
          
            if ( difference >= (sortedReadings[i].eGFR * 0.20)) {
                problemPair = [];
                problemPair.push(sortedReadings[i]);
                problemPair.push(sortedReadings[i - 1]);
                problemReadings.push(problemPair);
            }
        }
        
        return problemReadings;
    }
    
    //Fills out a table based on the array and the table ID, table ID must match the html ID of the parent element to the table
    function fillTable(array, tableID) {
        const table = document.querySelector(`#${tableID}>tbody`);
        let tableRow;
        let tableCell;
        
        for(let obj of array) {
            tableRow = document.createElement('tr');
            
            for (const prop in obj) {
                tableCell = document.createElement('td');
                tableCell.textContent = obj[prop];
                tableRow.appendChild(tableCell);
            }
            
            table.appendChild(tableRow);
        }
        
        
    }
    
    //Formats YYY-MM-DD into YYYY/MM/DD
    function dateArrayFormat(rawDate) {
        return rawDate.replace(/-/g, '/');
    }
    
    //Returns an h2 element with the string provided.
    function createErrorHeader(errorString) {
        let errorElement = document.createElement('p');
        
        errorElement.textContent = errorString;
        
        errorElement.setAttribute('class', 'errorHeader');
        
        return errorElement;
    }
    
    //Takes in an object and a table ID, will insert object data into table with proper html ID
    function addRowFromInput(dataToAdd, tableID) {
        const table = document.querySelector(`#${tableID}`);
        const tableRow = document.createElement('tr');
        let tableCell;
        
        for(const prop in dataToAdd) {
            tableCell = document.createElement('td');
            tableCell.textContent = dataToAdd[prop];
            tableRow.appendChild(tableCell);
        }
        
        table.appendChild(tableRow);
    }
    
    //Creates a table with results array given
    //The table param must provide the parent element of the table
    function printResults(results, table) {
        const resultTable = document.querySelector(`#${table}>table`);
        const headerRow = document.createElement('tr');
        const dataRow = document.createElement('tr');
        
        for(const prop in results) {
            let tableHeader = document.createElement('th');
            let tableCell = document.createElement('td');
            
            tableHeader.textContent = prop;
            tableCell.textContent = results[prop];
            
            headerRow.appendChild(tableHeader);
            dataRow.appendChild(tableCell);
        }
        
        resultTable.appendChild(headerRow);
        resultTable.appendChild(dataRow);
    }
    
    //Builds the drop table for the kidney disease fluctuations, takes in an array of readings
    function buildDropTable(readings) {
        const dropDiv = document.querySelector('#kdDrop');
        dropDiv.innerHTML = '<table id="kdDropTable"></table>';
        const header = document.querySelector('#dropHeader');
        header.textContent = 'KD Readings with more than 20% drops';
        
        const dropTable = document.querySelector('#kdDropTable');
        
        const headerRow = document.createElement('tr');
        
        let dateHeader = document.createElement('td');
        let readingHeader = document.createElement('td');
        let percentHeader = document.createElement('td');
        
        dateHeader.textContent = "Date";
        readingHeader.textContent = "Reading";
        percentHeader.textContent = "Percent";
        
        headerRow.appendChild(dateHeader);
        headerRow.appendChild(readingHeader);
        headerRow.appendChild(percentHeader);
        
        dropTable.appendChild(headerRow);
        
        for(let readingPair of readings) {
            let firstdataRow = document.createElement('tr');
            let seconddataRow = document.createElement('tr');
            
            for (const prop in readingPair[0]) {
                let dataCell = document.createElement('td');
                dataCell.textContent = readingPair[0][prop];
                firstdataRow.appendChild(dataCell);
            }
            
            for (const prop in readingPair[1]) {
                let dataCell = document.createElement('td');
                dataCell.textContent = readingPair[1][prop];
                seconddataRow.appendChild(dataCell);
            }
            
            let percentElement = document.createElement('td');
            percentElement.textContent = "Readings saw a " + calculateDiff(readingPair[0].eGFR, readingPair[1].eGFR) + "% drop."
            percentElement.setAttribute('rowspan', '2');
            
            firstdataRow.appendChild(percentElement);
            
            dropTable.appendChild(firstdataRow);
            dropTable.appendChild(seconddataRow);
        
    
        }
    }
    
    //Takes in two numbers, will calculate the difference in percentage between first number and second.
    //Returns a fixed two point float of percentage.
    function calculateDiff(firstReading, secondReading) {
        let percentage = parseInt(firstReading - secondReading);
        percentage = (percentage / firstReading) * 100;
        percentage = parseFloat(percentage);
        percentage = percentage.toFixed(2);
        return percentage;
    }
    
    
    //Allows user to input readings that get added to the current stored data
    document.querySelector("#bpInput").addEventListener('click', function () {
        //Grabbing inputs from user
        let inputDate = document.querySelector('#bpDateInput').value;
        let sysBP = document.querySelector('#sysBPInput').value;
        let diaBP = document.querySelector('#diaBPInput').value;
        const resultsElement = document.querySelector('#bpResults');
        
        //Removing any error messages before we check their answers
        if(document.querySelector(".errorHeader"))
                document.querySelector(".errorHeader").remove();
        
        
        //Error checking to make sure no floats and no empty fields
        if (sysBP.indexOf('.') != -1 || diaBP.indexOf('.') != -1) {
                
            document.querySelector("#bpForm").appendChild(createErrorHeader("Please use integers only, no decimals."));
            
        } else if (isNaN(parseInt(sysBP)) || isNaN(parseInt(diaBP)) || inputDate == '') {
            
            document.querySelector("#bpForm").appendChild(createErrorHeader("Input field was missing."));
            
        } else {
            
            //Resetting results table in case new result
            resultsElement.innerHTML = "<table></table>";
            
            sysBP = parseInt(sysBP);
            diaBP = parseInt(diaBP);
            
            let reading = { 
                            SysBP: sysBP,
                            DiaBP: diaBP,
                            atDate: dateArrayFormat(inputDate)
                          };
            
            bloodPressure.push(reading);
            
            //Adding answer to current table
            addRowFromInput(reading, 'bpTable');
            
            //Getting most recent reading and printing it out
            let resultObj = calculateBP(bloodPressure);
            printResults(resultObj, "bpResults");
            
        }
        
        //Resetting form fields
        document.querySelector('#bpDateInput').value = '';
        document.querySelector('#sysBPInput').value = '';
        document.querySelector('#diaBPInput').value = '';
            
    });
    
    document.querySelector("#kdInput").addEventListener('click', function () {
        //Grabbing inputs from user
        let inputDate = document.querySelector('#kdDateInput').value;
        let egfr = document.querySelector('#eGFRInput').value;
        const resultsElement = document.querySelector('#kdResults');
        
        //Removing any error messages before we check their answers
        if(document.querySelector(".errorHeader"))
                document.querySelector(".errorHeader").remove();
        
        //Error checking to make sure no floats and no empty fields
        if (egfr.indexOf('.') != -1) {
            
            document.querySelector("#kdForm").appendChild(createErrorHeader("Please use integers only, no decimals."));
            
        } else if (isNaN(parseInt(egfr)) || inputDate == '') {
            
            document.querySelector("#kdForm").appendChild(createErrorHeader("Input field was missing."));
            
        } else {
            
            resultsElement.innerHTML = "<table></table>";
            
            
            egfr = parseInt(egfr);
            
            let reading = { 
                            eGFR: egfr,
                            atDate: dateArrayFormat(inputDate)
                          };
            
            egfrData.push(reading);
            
            //Adding answer to current table
            addRowFromInput(reading, 'kdTable');
            
            //Getting most recent reading and printing it out
            let resultObj = calculateKD(egfrData);
            printResults(resultObj, "kdResults");
            
            //Checking for any 20% or more drops in the current data set
            let dropCheckArray = kidneyDropCheck(egfrData);
            
            //If we find any, print them out in a separate table.
            if(dropCheckArray.length > 0) {
                buildDropTable(dropCheckArray); 
            }
        }
        
        document.querySelector('#kdDateInput').value = '';
        document.querySelector('#eGFRInput').value = '';
    });

});




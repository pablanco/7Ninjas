var PlanetPage = function(url){
    
    //Define elemets to interact with pages
    var searchButton   = element.all(by.tagName('button')).first();
    var planetNameField = element(by.name('planetName'));
    var validatorResponse = element.all(by.css('.mat-dialog-container'));
    var table_results = element.all(by.css('.results'));
    var table_rows = element.all(by.css('.result'));
    
    var pageurl = url;

    this.submitForm = function(){
        searchButton.click();
    }

    this.completeForm = function(planetName){
        if(planetName!==null){
            planetNameField.sendKeys(planetName);
        }
    }

    this.startBrowser = function(){
        browser.get(pageurl);
    }

    this.getValidatorResponse = function(){
        return validatorResponse;
    }

    this.getListAllElements = function(){
        return table_results;
    }

    this.getListAllRows = function(){
        return table_rows;
    }

    
}

module.exports = PlanetPage;
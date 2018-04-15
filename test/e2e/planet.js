var planet_data = require('../data/planet.data.json');
var page_data  = require('../data/page.data.json');
var PlanetPage      = require('../page_objects/planet.page.js');

describe('Test Planet Search Feature', function(){

    //Crea el page-object para las pruebas
    var planet_page = new PlanetPage(page_data.planet.url);

    beforeEach(function(){
        browser.ignoreSynchronization = false;
        planet_page.startBrowser();
    });

    it('Check page title', function() {
        browser.ignoreSynchronization = false;
        expect(browser.getTitle()).toEqual(page_data.common.page_title);
    });

    it('Check no input on submit', function() {        
        planet_page.completeForm(null);
        planet_page.submitForm();
        expect(planet_page.getValidatorResponse().first().getText()).toContain(page_data.planet.validation.error);
    });
    
    it('Check wrong planet data', function() {
        planet_page.completeForm(planet_data.wrong.planetName);
        planet_page.submitForm();
        expect(planet_page.getValidatorResponse().last().getText()).toContain(page_data.planet.validation.error);
    });
    
    it('Check right planet data', function() {
        planet_page.completeForm(planet_data.valid.planetName);
        planet_page.submitForm();
        browser.ignoreSynchronization = false;
        //browser.sleep(500);
        expect(planet_page.getListAllElements().count()).toBe(1);
        expect(planet_page.getListAllRows().count()).toBe(1);
    });
});
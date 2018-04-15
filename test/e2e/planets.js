var planet_data = require('../data/planet.data.json');
var page_data  = require('../data/page.data.json');
var PlanetsPage      = require('../page_objects/planets.page.js');
var TemplatePage   = require('../page_objects/generic.page.js');

describe('Test Planets List Feature', function(){

    //Crea el page-object para las pruebas
    var planet_page = new PlanetsPage(page_data.planets.url);
    var template_page = new TemplatePage();

    beforeEach(function(){
        browser.ignoreSynchronization = false;
        planet_page.startBrowser();
    });

    it('Check page title', function() {
        browser.ignoreSynchronization = false;
        expect(browser.getTitle()).toEqual(page_data.common.page_title);
    });
    
    it('Check list to be filled', function() {
        browser.ignoreSynchronization = true;
        expect(planet_page.getListAllElements().count()).toBe(1);
        expect(planet_page.getListAllRows().count()).toBeGreaterThan(0);
    });

    it('Check navigation to comments and back', function() {
        planet_page.seeComments();
        expect(browser.getCurrentUrl()).toEqual(page_data.comment.url + planet_data.valid.planetName);

        template_page.CallToAction();
        expect(browser.getCurrentUrl()).toEqual(page_data.planets.url_redirect);
    });

    it('Check planet delete', function() {
        planet_page.deletePlanet();
        browser.ignoreSynchronization = false;
        expect(planet_page.getListAllElements().count()).toBe(1);
        expect(planet_page.getListAllRows().count()).toBe(0);
    });

    it('Check logout action', function() {
        template_page.LogoutAction();        
        expect(browser.getCurrentUrl()).toEqual(page_data.logout.url_redirect);        
    });
});
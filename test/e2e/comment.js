var comment_data   = require('../data/comment.data.json');
var planet_data   = require('../data/planet.data.json');
var page_data     = require('../data/page.data.json');
var CommentPage   = require('../page_objects/comment.page.js');

describe('Test Comment Feature', function(){

    //Crea el page-object para las pruebas
    var comment_page = new CommentPage(page_data.comment.url + planet_data.valid.planetName);

    beforeEach(function(){
        browser.ignoreSynchronization = false;
        comment_page.startBrowser();
    });
    
    it('Check page title', function() {
        browser.ignoreSynchronization = false;
        expect(browser.getTitle()).toEqual(page_data.common.page_title);
    });
    
    it('Check no input on submit', function() {        
        comment_page.completeForm(null);
        comment_page.submitForm();
        expect(comment_page.getValidatorResponse().first().getText()).toContain(page_data.comment.validation.error);
    });
    
    it('Check right comment data', function() {
        comment_page.completeForm(comment_data.valid.text);
        comment_page.submitForm();
        browser.ignoreSynchronization = true;
        expect(comment_page.getListAllElements().count()).toBe(1);
        expect(comment_page.getListAllRows().count()).toBeGreaterThan(0);
    });
    
});
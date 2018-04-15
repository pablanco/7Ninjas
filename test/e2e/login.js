var login_data = require('../data/login.data.json');
var page_data  = require('../data/page.data.json');
var LoginPage      = require('../page_objects/login.page.js');
var TemplatePage   = require('../page_objects/generic.page.js');

describe('Test Login Feature', function(){

    //Creates page-object to test
    var login_page = new LoginPage(page_data.login.url);
    var template_page = new TemplatePage();

    beforeEach(function(){
        browser.ignoreSynchronization = false;
        login_page.startBrowser();
    });

    it('Check page title', function() {
        browser.ignoreSynchronization = false;
        expect(browser.getTitle()).toEqual(page_data.common.page_title);
    });

    it('Check no input on submit', function() {        
        login_page.completeForm(null, null);
        login_page.submitForm();
        browser.sleep(500);
        expect(login_page.getValidatorResponse().last().getText()).toContain(page_data.login.validation.error);
    });
    
    it('Check no password on submit', function() {
        login_page.completeForm(login_data.wrong.username, null);
        login_page.submitForm();
        browser.sleep(500);
        expect(login_page.getValidatorResponse().last().getText()).toContain(page_data.login.validation.error);
    });

    it('Check wrong login data', function() {
        login_page.completeForm(login_data.wrong.username, login_data.wrong.password);
        login_page.submitForm();
        browser.ignoreSynchronization = false;
        expect(login_page.getValidatorResponse().last().getText()).toContain(page_data.login.validation.validation_error);
    });

    it('Check right login data', function() {
        login_page.completeForm(login_data.valid.username, login_data.valid.password);
        login_page.submitForm();
        expect(browser.getCurrentUrl()).not.toEqual(page_data.login.url);
        browser.ignoreSynchronization = true;
        expect(browser.getCurrentUrl()).toEqual(page_data.login.url_redirect);
        expect(template_page.getAdminHeaderMenuButton().getText()).toEqual(page_data.login.welcome);
    });

});
var LoginPage = function(url){
    
    //Define elemets to interact with pages
    var loginButton   = element.all(by.tagName('button')).first();
    var username = element(by.name('username'));
    var password = element(by.name('password'));
    var validatorResponse = element.all(by.css('.mat-dialog-container'));
    
    var userMenuButton = element(by.id('loggerUser'));
    var pageurl = url;

    this.submitForm = function(){
        loginButton.click();
    }

    this.completeForm = function(user, pass){
        if(user!==null){
            username.sendKeys(user);
        }
        if(pass!==null){
            password.sendKeys(pass);
        }
    }

    this.startBrowser = function(){
        browser.get(pageurl);
    }

    this.getValidatorResponse = function(){
        return validatorResponse;
    }
}

module.exports = LoginPage;
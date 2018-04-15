var TemplatePage = function(){
    
    //Define elemets to interact with pages
    var adminHeaderMenuButton   = element.all(by.css('.mat-toolbar span.welcome')).first();
    var settingsHeaderMenuButton  = element.all(by.css('.mat-toolbar .mat-icon')).first();
    var logoutHeaderMenuButton  = element.all(by.css('.mat-toolbar .mat-icon')).last();

    this.LogoutAction = function(){
        logoutHeaderMenuButton.click();
    }

    this.CallToAction = function(){
        settingsHeaderMenuButton.click();
    }

    this.getAdminHeaderMenuButton = function(){
        return adminHeaderMenuButton;
    }
    this.getLogoutHeaderMenuButton = function(){
        return logoutHeaderMenuButton;
    }

    this.getSettingsHeaderMenuButton = function(){
        return settingsHeaderMenuButton;
    }

    this.getTitleContainer = function(){
        return titleContainer;
    }

    this.getListAllElements = function(){
        return listAllElements;
    }

}

module.exports = TemplatePage;
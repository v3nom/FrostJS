var indexRoute = new Frost.Routing.Route('', () => {
    return new Frost.View('src/index/indexPage.html', App.Page.IndexPage);
});

Frost.Routing.addRoute(indexRoute);
Frost.Routing.addRoute(new Frost.Routing.Route('settings', () => {
    return new Frost.View('src/settings/settings.html', App.Page.SettingPage);
}));

document.addEventListener('DOMContentLoaded', () => {
    Frost.init();
});

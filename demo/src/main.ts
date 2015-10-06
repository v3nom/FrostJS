var indexRoute = new Frost.Routing.Route('', () => {
  return new Frost.View('src/index/page.html', App.Page.Index.Page, {
    header: new Frost.View('src/index/header.html', App.Page.Index.Header),
    content: new Frost.View('src/index/content.html', App.Page.Index.Content),
    _: [new Frost.View('src/sidepanel/panel.html', App.Page.Panel)]
  });
});

Frost.Routing.addRoute(indexRoute);
Frost.Routing.addRoute(new Frost.Routing.Route('settings', () => {
  return new Frost.View('src/settings/settings.html', App.Page.SettingPage);
}));

document.addEventListener('DOMContentLoaded', () => {
  Frost.init();
});

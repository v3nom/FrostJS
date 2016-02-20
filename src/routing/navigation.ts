module Frost.Routing {
  var activeView: Frost.View;

  function handleNavigation(data: Routing.HistoryState) {
    var nextRoute: Routing.Route = Frost.Routing.matchRoute(data.hash);
    if (nextRoute) {
      var nextView = nextRoute.action();
      nextView.prepareForRender(`Page${Date.now() }`).then(() => {
        if (activeView) {
          activeView.removeFromDOM();
        } else {
          // Clean body first
          while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
          }
        }
        activeView = nextView;
        activeView.renderToDOM(document.body);
        activeView.applyBindings();
      }).catch((err) => {
        console.error(err);
      })
    } else {
      console.error('No route matched');
    }
  }
  Frost.Events.sub(Routing.HISTORY_CHANGE_EVENT, handleNavigation);
}

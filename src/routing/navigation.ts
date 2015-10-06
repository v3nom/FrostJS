module Frost.Routing {
    var activeView: Frost.View;

    function handleNavigation(data: Routing.HistoryState) {
        var nextRoute: Routing.Route = Frost.Routing.matchRoute(data.hash);
        if (nextRoute) {
            var nextView = nextRoute.action();
            if (activeView && nextView.isSame(activeView)) {
                return;
            }
            nextView.prepareForRender().then(() => {
                if (activeView) {
                    activeView.removeFromDOM();
                }else{
                  // Clean body first
                  while (document.body.firstChild) {
                    document.body.removeChild(document.body.firstChild);
                  }
                }
                activeView = nextView;
                activeView.renderToDOM(document.body);
            });
        } else {
            console.error('No route matched');
        }
    }
    Frost.Events.sub(Routing.HISTORY_CHANGE_EVENT, handleNavigation);
}

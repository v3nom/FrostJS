var Frost;
(function (Frost) {
    function init() {
        Frost.Routing.startTracking();
    }
    Frost.init = init;
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var Routing;
    (function (Routing) {
        function handleNavigation() {
            var hash = location.hash.replace('#/', '');
            var state = history.state;
            var route = Frost.Routing.matchRoute(hash);
            console.log(hash, state, route);
        }
        function startTracking() {
            window.addEventListener('popstate', function (event) {
                handleNavigation();
            });
            handleNavigation();
        }
        Routing.startTracking = startTracking;
    })(Routing = Frost.Routing || (Frost.Routing = {}));
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var Routing;
    (function (Routing) {
        var routingTable = {};
        function addRoute(route) {
            routingTable[route.url] = route;
        }
        Routing.addRoute = addRoute;
        function matchRoute(url) {
            return routingTable[url];
        }
        Routing.matchRoute = matchRoute;
    })(Routing = Frost.Routing || (Frost.Routing = {}));
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var Routing;
    (function (Routing) {
        var Route = (function () {
            function Route(url, action) {
                this.url = url;
                this.action = action;
            }
            return Route;
        })();
        Routing.Route = Route;
    })(Routing = Frost.Routing || (Frost.Routing = {}));
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var View = (function () {
        function View(viewPath, viewModelConstructor) {
            this.viewPath = viewPath;
            this.viewModelConstructor = viewModelConstructor;
        }
        View.prototype.prepareForRender = function () {
            var p = new Promise(function (resolve, reject) {
            });
        };
        return View;
    })();
    Frost.View = View;
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var Section = (function () {
        function Section() {
        }
        Section.prototype.sectionShow = function () {
        };
        Section.prototype.sectionHide = function () {
        };
        Section.prototype.sectionCreate = function () {
        };
        Section.prototype.sectionRemove = function () {
        };
        return Section;
    })();
    Frost.Section = Section;
})(Frost || (Frost = {}));

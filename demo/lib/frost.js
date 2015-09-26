var Frost;
(function (Frost) {
    var AssetManager;
    (function (AssetManager) {
        var assetCache = {};
        function getAsset(url) {
            var p = new Promise(function (resolve, reject) {
                var req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            resolve(req.responseText);
                        }
                        else {
                            reject(req.statusText);
                        }
                    }
                };
                req.open('GET', url);
                req.send();
            });
            return p;
        }
        AssetManager.getAsset = getAsset;
    })(AssetManager = Frost.AssetManager || (Frost.AssetManager = {}));
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var EventHub = (function () {
        function EventHub() {
            this._subscriptions = {};
        }
        EventHub.prototype._getCallbacks = function (eventName) {
            if (!this._subscriptions[eventName]) {
                this._subscriptions[eventName] = [];
            }
            return this._subscriptions[eventName];
        };
        EventHub.prototype.sub = function (eventName, callback) {
            var callbacks = this._getCallbacks(eventName);
            if (callbacks.indexOf(callback) == -1) {
                callbacks.push(callback);
            }
            else {
                console.warn(eventName, ':Subscribing second time');
            }
        };
        EventHub.prototype.pub = function (eventName, data) {
            var callbacks = this._getCallbacks(eventName);
            callbacks.forEach(function (callback) {
                callback(data);
            });
        };
        EventHub.prototype.unsub = function (eventName, callback) {
        };
        EventHub.prototype.unsubscribeAll = function (eventName) {
        };
        EventHub.prototype.schedule = function () {
        };
        EventHub.prototype.unschedule = function () {
        };
        return EventHub;
    })();
    Frost.EventHub = EventHub;
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    Frost.Events = new Frost.EventHub();
    function init() {
        Frost.Routing.startTracking();
    }
    Frost.init = init;
})(Frost || (Frost = {}));
var Frost;
(function (Frost) {
    var Routing;
    (function (Routing) {
        Routing.HISTORY_CHANGE_EVENT = 'Frost:historyChanged';
        var HistoryState = (function () {
            function HistoryState(hash, state) {
                this.hash = hash;
                this.state = state;
            }
            return HistoryState;
        })();
        Routing.HistoryState = HistoryState;
        function navigate(url, data) {
            history.pushState(data, '', '#/' + url);
            handleHistoryChange();
        }
        Routing.navigate = navigate;
        function handleHistoryChange() {
            var hash = location.hash.replace('#/', '');
            var state = history.state;
            var historyState = new HistoryState(hash, state);
            Frost.Events.pub(Routing.HISTORY_CHANGE_EVENT, historyState);
        }
        function startTracking() {
            window.addEventListener('popstate', function (event) {
                handleHistoryChange();
            });
            handleHistoryChange();
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
        var activeView;
        function handleNavigation(data) {
            var nextRoute = Frost.Routing.matchRoute(data.hash);
            if (nextRoute) {
                var nextView = nextRoute.action();
                if (activeView && nextView.isSame(activeView)) {
                    return;
                }
                nextView.prepareForRender().then(function () {
                    if (activeView) {
                        activeView.removeFromDOM();
                    }
                    activeView = nextView;
                    activeView.renderToDOM(document.body);
                });
            }
            else {
                console.error('No route matched');
            }
        }
        Frost.Events.sub(Routing.HISTORY_CHANGE_EVENT, handleNavigation);
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
        function View(viewPath, viewModelConstructor, subViews) {
            this.viewPath = viewPath;
            this.viewModelConstructor = viewModelConstructor;
        }
        View.prototype.prepareForRender = function () {
            var _this = this;
            this._viewModelInstance = new this.viewModelConstructor();
            return Frost.AssetManager.getAsset(this.viewPath).then(function (asset) {
                _this._viewContent = asset;
            });
        };
        View.prototype.renderToDOM = function (parent, sectionName) {
            this._parent = parent;
            var fragment = document.createRange().createContextualFragment(this._viewContent);
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            parent.appendChild(fragment);
            ko.applyBindings(this._viewModelInstance, parent);
        };
        View.prototype.removeFromDOM = function () {
            ko.cleanNode(this._parent);
            this._parent = null;
            this._viewModelInstance = null;
        };
        View.prototype.isSame = function (v) {
            return v.viewPath == this.viewPath && v.viewModelConstructor == this.viewModelConstructor;
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

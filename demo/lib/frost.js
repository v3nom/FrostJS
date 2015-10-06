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
        ko.bindingHandlers['stopBinding'] = {
            init: function () {
                return { controlsDescendantBindings: true };
            }
        };
        ko.virtualElements.allowedBindings['stopBinding'] = true;
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
                    else {
                        // Clean body first
                        while (document.body.firstChild) {
                            document.body.removeChild(document.body.firstChild);
                        }
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
            var _this = this;
            this.sectionName = '_top_';
            this.viewPath = viewPath;
            this.viewModelConstructor = viewModelConstructor;
            this._subViews = [];
            if (subViews) {
                Object.keys(subViews).forEach(function (sectionName) {
                    if (sectionName != '_') {
                        var v = subViews[sectionName];
                        v.sectionName = sectionName;
                        _this._subViews.push(v);
                    }
                    else {
                        var vs = subViews['_'];
                        vs.forEach(function (globalView) {
                            globalView.sectionName = '_';
                            _this._subViews.push(globalView);
                        });
                    }
                });
            }
        }
        View.prototype.prepareForRender = function () {
            var _this = this;
            this._viewModelInstance = new this.viewModelConstructor();
            var subViewAssets = this._subViews.map(function (subView) {
                return subView.prepareForRender();
            });
            return Frost.AssetManager.getAsset(this.viewPath).then(function (asset) {
                _this._viewContent = asset;
                return Promise.all(subViewAssets);
            });
        };
        View.prototype.renderToDOM = function (parent, top) {
            // Create view fragment
            var range = document.createRange();
            range.setStart(document.body, 0);
            var fragment = range.createContextualFragment(this._viewContent);
            var holder = null;
            // find out holder
            if (this.sectionName == '_') {
                holder = top.children[0];
            }
            else if (this.sectionName == '_top_') {
                holder = parent;
                top = fragment;
            }
            else {
                holder = parent.querySelector('[data-frost-view="' + this.sectionName + '"]');
                var koStartComment = document.createComment('ko stopBinding: true');
                var koEndComment = document.createComment('/ko');
                holder.parentElement.insertBefore(koStartComment, holder);
                holder.parentElement.insertBefore(koEndComment, holder.nextSibling);
            }
            // Render sub views first
            this._subViews.forEach(function (subView) {
                subView.renderToDOM(fragment, top);
            });
            // Insert self to parent
            holder.appendChild(fragment);
            //  ko.applyBindings(this._viewModelInstance, holder);this.sectionName=='_'?holder.childNodes[0]:holder;
        };
        View.prototype.removeFromDOM = function () {
            //ko.cleanNode(this._holderElement);
            this._holderElement = null;
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
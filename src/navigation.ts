/// <reference path="routeMatcher.ts" />
/// <reference path="page.ts" />

module Frost.Navigation {

    var routes:Route[] = [];
    var triggerNext = true;
    var pagePool = {};
    var currentPage:Page;

    export var ROUTE_MATCH_EVENT = 'frost:navigation:routeMatch';

    export function addRoute(route:Frost.Route) {
        routes.push(route);
    }

    export function navigate(url:string, trigger:boolean = true, replace:boolean = false, data?:any) {
        triggerNext = trigger;
        if (replace) {
            History.replaceState(url, data);
        } else {
            History.pushState(url, data);
        }
    }

    export function back() {
        History.back();
    }

    function loadPage(route:Route) {
        var routeId = route.routeId;
        var page = pagePool[routeId];
        if (!page) {
            page = new Page(route);
            pagePool[routeId] = page;
        }
        return page;
    }

    function handleState(state:HistoryState) {
        var matchingRoute = Frost.RouteMatcher.match(state.hash, routes);
        var page = loadPage(matchingRoute);

        page.updateState(state);
        page.transitionFrom(currentPage);
        currentPage = page;
    }

    export class HistoryState {
        hash:string;
        data:Object;

        constructor(hash:string, data:Object) {
            this.hash = hash.replace('#', '');
            this.data = data;
        }

    }

    export var INIT_EVENT = 'frost:history:init';
    export var NEW_STATE_EVENT = 'frost:history.newstate';

    class History {
        private static firstTime = true;

        static pushState(url:string, data:any, title:string = '') {
            History.firstTime = false;
            window.history.pushState(data, title, '#' + url);
            Frost.event.pub(NEW_STATE_EVENT, new HistoryState(window.location.hash, data));
        }

        static replaceState(url:string, data:any, title:string = '') {
            History.firstTime = false;
            window.history.replaceState(data, title, '#' + url);
            Frost.event.pub(NEW_STATE_EVENT, new HistoryState(window.location.hash, data));
        }

        static go(i:Number) {
            History.firstTime = false;
            window.history.go(i);
        }

        static back() {
            History.firstTime = false;
            window.history.back();
        }

        static forward() {
            History.firstTime = false;
            window.history.forward();
        }

        private static _is_safari = /^((?!chrome).)*(iPhone|safari|iPad)/i.test(navigator.userAgent);


        static start() {
            window.onpopstate = (event)=> {
                if (!History._is_safari || (History._is_safari && !History.firstTime)) {
                    Frost.event.pub(NEW_STATE_EVENT, new HistoryState(window.location.hash, event.state));
                }
                History.firstTime = false;
            };
            Frost.event.pub(NEW_STATE_EVENT, new HistoryState(window.location.hash, window.history.state));
        }
    }

    Frost.event.sub(INIT_EVENT, ()=> {
        History.start();
    });


    Frost.event.sub(NEW_STATE_EVENT, (state:HistoryState)=> {
        if (triggerNext) {
            handleState(state);
        }
        triggerNext = true;
    });


}
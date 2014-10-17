/// <reference path="event.ts" />
/// <reference path="navigation.ts" />
/// <reference path="route.ts" />
/// <reference path="viewModel.ts"/>

module Frost {
    function startFramework() {
        Frost.event.pub(Frost.Navigation.INIT_EVENT);
    }

    export function start() {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            startFramework();
        } else {
            window.onload = ()=> {
                startFramework();
            }
        }

    }

    export function addRoute(route:Frost.Route) {
        Frost.Navigation.addRoute(route);
    }
}
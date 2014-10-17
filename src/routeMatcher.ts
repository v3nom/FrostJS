/// <reference path="route.ts" />

module Frost.RouteMatcher {
    export function match(urlHash:string, routes:Route[]):Route {
        var matchingRoutes = routes.filter((route:Route)=> {
            return route.paths.indexOf(urlHash) != -1;
        });
        return matchingRoutes[0];
    }
}
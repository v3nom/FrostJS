module Frost.Routing{
  var routingTable = {};

  export function addRoute(route:Route) {
      routingTable[route.url] = route;
  }

  export function matchRoute(url:string) {
      return routingTable[url];
  }
}

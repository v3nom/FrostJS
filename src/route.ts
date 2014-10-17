/// <reference path="view.ts" />

module Frost {
    export class Route {
        paths:string[];
        callback:(urlParams:string, data:any)=>View;
        routeId:string;

        constructor(paths, callback) {
            this.paths = paths;
            this.callback = callback;
            this.routeId = this._generateRouteId();
        }

        private _generateRouteId():string {
            return 'route_' + (Math.round(Math.random() * 10000000000));
        }

    }
}
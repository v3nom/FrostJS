declare module Frost {
    function init(): void;
}
declare module Frost.Routing {
    function startTracking(): void;
}
declare module Frost.Routing {
    function addRoute(route: Route): void;
    function matchRoute(url: string): any;
}
declare module Frost.Routing {
    class Route {
        url: string;
        action: Function;
        constructor(url: string, action: Function);
    }
}
declare module Frost {
    class View {
        viewPath: string;
        viewModelConstructor: Function;
        private _viewContent;
        constructor(viewPath: string, viewModelConstructor: Function);
        prepareForRender(): void;
    }
}
declare module Frost {
    class Section {
        sectionShow(): void;
        sectionHide(): void;
        sectionCreate(): void;
        sectionRemove(): void;
    }
}

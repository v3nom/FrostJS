declare module Frost.AssetManager {
    function getAsset(url: string): Promise<{}>;
}
declare module Frost {
    class EventHub {
        private _subscriptions;
        private _getCallbacks(eventName);
        sub(eventName: string, callback: Function): void;
        pub(eventName: string, data: any): void;
        unsub(eventName: string, callback: Function): void;
        unsubscribeAll(eventName: string): void;
        schedule(): void;
        unschedule(): void;
    }
}
declare module Frost {
    var Events: EventHub;
    function init(): void;
}
declare module Frost.Routing {
    var HISTORY_CHANGE_EVENT: string;
    class HistoryState {
        hash: string;
        state: any;
        constructor(hash: string, state: any);
    }
    function navigate(url: string, data: any): void;
    function startTracking(): void;
}
declare module Frost.Routing {
    function addRoute(route: Route): void;
    function matchRoute(url: string): any;
}
declare module Frost.Routing {
}
declare module Frost.Routing {
    class Route {
        url: string;
        action: () => Frost.View;
        constructor(url: string, action: () => Frost.View);
    }
}
declare module Frost {
    class View {
        viewPath: string;
        viewModelConstructor: any;
        sectionName: string;
        private _viewContent;
        private _subViews;
        private _viewModelInstance;
        private _holderElement;
        constructor(viewPath: string, viewModelConstructor: Function, subViews?: any);
        prepareForRender(): any;
        renderToDOM(parent: Element | DocumentFragment, top?: any): void;
        removeFromDOM(): void;
        isSame(v: View): boolean;
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

module Frost {
  export var Events = new EventHub();

  export function init() {
    ko.bindingHandlers['stopBinding'] = {
      init: function() {
        return { controlsDescendantBindings: true };
      }
    };
    ko.virtualElements.allowedBindings['stopBinding'] = true;

    Frost.Routing.startTracking();
  }
}

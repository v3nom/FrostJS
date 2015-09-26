module Frost{
  export var Events = new EventHub();
  
  export function init(){
    Frost.Routing.startTracking();
  }
}

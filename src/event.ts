module Frost {
    export class event {
        private static _events = {};

        static pub(eventName:string, data?:any) {
            var callbacks = event._events[eventName];
            if (callbacks) {
                callbacks.forEach((callback)=> {
                    callback(data);
                });
            }
        }

        static sub(eventName:string, callback:Function) {
            event._prepareEventName(eventName)
            event._events[eventName].push(callback);
        }

        static unsub(eventName:string, callback:Function) {

        }

        private static _prepareEventName(eventName) {
            if (!event._events[eventName]) {
                event._events[eventName] = [];
            }
        }
    }
}
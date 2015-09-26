module Frost {
    export class EventHub {
        private _subscriptions = {};

        private _getCallbacks(eventName: string) {
            if (!this._subscriptions[eventName]) {
                this._subscriptions[eventName] = [];
            }
            return this._subscriptions[eventName];
        }

        sub(eventName: string, callback: Function) {
            var callbacks = this._getCallbacks(eventName);
            if (callbacks.indexOf(callback) == -1) {
                callbacks.push(callback);
            } else {
                console.warn(eventName, ':Subscribing second time');
            }
        }

        pub(eventName: string, data) {
            var callbacks = this._getCallbacks(eventName);
            callbacks.forEach((callback) => {
                callback(data);
            });
        }

        unsub(eventName: string, callback: Function) {

        }

        unsubscribeAll(eventName: string) {

        }

        schedule() {

        }

        unschedule() {

        }
    }
}

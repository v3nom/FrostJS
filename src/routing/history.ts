module Frost.Routing {
    export var HISTORY_CHANGE_EVENT = 'Frost:historyChanged';

    export class HistoryState {
        constructor(public hash: string, public state: any) { }
    }

    export function navigate(url: string, data) {
        history.pushState(data, '', '#/' + url);
        handleHistoryChange();
    }

    function handleHistoryChange() {
        var hash = location.hash.replace('#/', '');
        var state = history.state;

        var historyState = new HistoryState(hash, state);
        Frost.Events.pub(HISTORY_CHANGE_EVENT, historyState);
    }

    export function startTracking() {
        handleHistoryChange();
        setTimeout(()=>{
          window.addEventListener('popstate', (event) => {
              handleHistoryChange();
          });
        });
    }
}

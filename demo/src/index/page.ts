module App.Page.Index {
    export class Page extends Frost.Section {
        msg = ko.observable("FrostKO");

        openSettings = () => {
            Frost.Routing.navigate('settings', null);
        }
    }
}

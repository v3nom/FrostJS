module App.Page {
    export class IndexPage extends Frost.Section {
        msg = ko.observable("FrostKO");

        openSettings = () => {
            Frost.Routing.navigate('settings', null);
        }
    }
}

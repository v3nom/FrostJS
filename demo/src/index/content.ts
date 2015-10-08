module App.Page.Index {
  export class Content extends Frost.Section {
    content = ko.observable('Contento2');

    constructor() {
      super();
    }

    openSettings = () => {
      Frost.Routing.navigate('settings', null);
    }

    sectionCreate(){
      console.log('content section create');
    }
    sectionRemove(){
      console.log('content section remove');
    }
  }
}

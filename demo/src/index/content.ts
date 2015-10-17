module App.Page.Index {
  export class Content extends Frost.Section {
    content = ko.observable('Contento2');
    timerId;

    constructor() {
      super();
    }

    openSettings = () => {
      Frost.Routing.navigate('settings', null);
    }

    sectionCreate() {
      console.log('content section create');
      this.timerId = setInterval(() => {
        var c = this.content();
        this.content(c + '1');
      }, 1000);
    }
    sectionRemove() {
      console.log('content section remove');
      clearInterval(this.timerId);
    }
  }
}

module App.Page{
  export class SettingPage extends Frost.Section{
    msg = ko.observable('Settings');

    sectionCreate(){
      console.log('Settings page create');
    }
    sectionRemove(){
      console.log('Settings page remove');
    }
  }
}

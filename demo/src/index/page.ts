module App.Page.Index {
    export class Page extends Frost.Section {
        msg = ko.observable("FrostKO");

        increase = ()=>{
          this.msg(this.msg()+'1');
        }
    }
}

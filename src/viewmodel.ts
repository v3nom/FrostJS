module Frost {
  export class Section {
    pageId: string;
    events = {
      eventNames: [],
      sub: (name, callback) => {
        name = this.pageId + name;
        this.events.eventNames.push(name);
        Frost.Events.sub(name, callback);
      },
      pub: (name, data) => {
        name = this.pageId + name;
        Frost.Events.pub(name, data);
      },
      unsubAll:()=>{
        this.events.eventNames.forEach((name)=>{
          Frost.Events.unsubscribeAll(name);
        });
        this.events.eventNames = [];
      }
    };

    constructor(pageId?: string) {
      this.pageId = pageId;
    }

    sectionCreate() {

    }

    sectionRemove() {
      this.events.unsubAll();
    }
  }
}

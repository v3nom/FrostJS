module Frost {
  var runningCounter = 1;

  export class View {
    viewPath: string;
    viewModelConstructor: any;
    sectionName = '_top_';
    private _id;
    private _viewContent: string;
    private _subViews: View[];
    private _viewModelInstance: Section;

    constructor(viewPath: string, viewModelConstructor: Function, subViews?: any) {
      this._id = runningCounter++;
      this.viewPath = viewPath;
      this.viewModelConstructor = viewModelConstructor;
      this._subViews = [];
      if (subViews) {
        Object.keys(subViews).forEach((sectionName) => {
          if (sectionName != '_') {
            var v = subViews[sectionName];
            v.sectionName = sectionName;
            this._subViews.push(v);
          } else {
            var vs = subViews['_'];
            vs.forEach((globalView) => {
              globalView.sectionName = 'external' + globalView._id;
              this._subViews.push(globalView);
            });
          }
        });
      }
    }

    prepareForRender() {
      this._viewModelInstance = new this.viewModelConstructor();
      var subViewAssets = this._subViews.map((subView) => {
        return subView.prepareForRender();
      });
      return Frost.AssetManager.getAsset(this.viewPath).then((asset: string) => {
        this._viewContent = asset;
        return Promise.all(subViewAssets);
      });
    }

    renderToDOM(parent: HTMLElement) {
      // Create view fragment
      var content = this._viewContent;
      var holder: any = null;
      // find out holder
      if (this.sectionName.indexOf('external') == 0) {
        content = '<!-- ko stopBinding: true -->' + content + '<!-- /ko -->';
        holder = parent.childNodes[0];
        holder.innerHTML += content;
        holder.lastElementChild.dataset.frostView = this.sectionName;
      } else if (this.sectionName == '_top_') {
        parent.innerHTML = content;
        holder = parent.firstChild;
        holder.dataset['frostView'] = this.sectionName;
      } else {
        holder = parent.querySelector('[data-frost-view="' + this.sectionName + '"]');
        var existingBindings = holder.dataset.bind;
        var stopBinding = 'stopBinding: true';
        if (existingBindings) {
          existingBindings += ',' + stopBinding;
        } else {
          existingBindings = stopBinding;
        }
        holder.dataset.bind = existingBindings;
        holder.innerHTML = content;
      }

      // Render sub views first
      this._subViews.forEach((subView) => {
        subView.renderToDOM(parent);
      });
    }

    applyBindings(){
      this._viewModelInstance.sectionCreate();
      var target = document.querySelector('[data-frost-view="' + this.sectionName + '"]');
      if (this.sectionName == '_top_' || this.sectionName.indexOf('external') == 0) {
        ko.applyBindings(this._viewModelInstance, target);
      } else {
        ko.applyBindingsToDescendants(this._viewModelInstance, target);
      }
      this._subViews.forEach((v)=>{
        v.applyBindings();
      });
    }

    removeFromDOM() {
      this._viewModelInstance.sectionRemove();
      this._viewModelInstance = null;
      if (this.sectionName == '_top_') {
        while (document.body.firstElementChild) {
          ko.removeNode(document.body.firstElementChild);
        }
      }
      this._subViews.forEach((v) => {
        v.removeFromDOM();
      });
    }

    isSame(v: View) {
      return v.viewPath == this.viewPath && v.viewModelConstructor == this.viewModelConstructor;
    }
  }
}

module Frost {
  export class View {
    viewPath: string;
    viewModelConstructor: any;
    sectionName = '_top_';
    private _viewContent: string;
    private _subViews: View[];
    private _viewModelInstance: Section;
    private _holderElement: Element | DocumentFragment;

    constructor(viewPath: string, viewModelConstructor: Function, subViews?: any) {
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
              globalView.sectionName = '_';
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

    renderToDOM(parent: Element|DocumentFragment, top?) {
      // Create view fragment
      var range = document.createRange();
      range.setStart(document.body, 0);
      var fragment = range.createContextualFragment(this._viewContent);

      var holder = null;
      // find out holder
      if (this.sectionName == '_') {
        holder = top.children[0];
      } else if (this.sectionName == '_top_') {
        holder = parent;
        top = fragment;
      } else {
        holder = parent.querySelector('[data-frost-view="' + this.sectionName + '"]');
        var koStartComment = document.createComment('ko stopBinding: true');
        var koEndComment = document.createComment('/ko');
        holder.parentElement.insertBefore(koStartComment, holder);
        holder.parentElement.insertBefore(koEndComment, holder.nextSibling);
      }

      // Render sub views first
      this._subViews.forEach((subView) => {
        subView.renderToDOM(fragment, top);
      });

      // Insert self to parent
      holder.appendChild(fragment);
      //  ko.applyBindings(this._viewModelInstance, holder);this.sectionName=='_'?holder.childNodes[0]:holder;
    }

    removeFromDOM() {
      //ko.cleanNode(this._holderElement);
      this._holderElement = null;
      this._viewModelInstance = null;
    }

    isSame(v: View) {
      return v.viewPath == this.viewPath && v.viewModelConstructor == this.viewModelConstructor;
    }
  }
}

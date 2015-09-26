module Frost {
    export class View {
        viewPath: string;
        viewModelConstructor: any;
        private _viewContent: string;
        private _subViews;
        private _viewModelInstance: Section;
        private _parent: HTMLElement;

        constructor(viewPath: string, viewModelConstructor: Function, subViews?: any) {
            this.viewPath = viewPath;
            this.viewModelConstructor = viewModelConstructor;
        }

        prepareForRender() {
            this._viewModelInstance = new this.viewModelConstructor();
            return Frost.AssetManager.getAsset(this.viewPath).then((asset: string) => {
                this._viewContent = asset;
            });
        }

        renderToDOM(parent: HTMLElement, sectionName?: string) {
            this._parent = parent;
            var fragment = document.createRange().createContextualFragment(this._viewContent);
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
            parent.appendChild(fragment);
            ko.applyBindings(this._viewModelInstance, parent);
        }

        removeFromDOM() {
            ko.cleanNode(this._parent);
						this._parent = null;
            this._viewModelInstance = null;
        }

        isSame(v: View) {
            return v.viewPath == this.viewPath && v.viewModelConstructor == this.viewModelConstructor;
        }
    }
}

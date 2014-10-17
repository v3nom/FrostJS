module Frost {
    export class View {
        private _viewHtml;
        private _viewModelConstructor;

        constructor(viewHtml:string, viewModelConstructor:any) {
            this._viewHtml = viewHtml;
            this._viewModelConstructor = viewModelConstructor;
        }

        public getViewModelConstrucotr() {
            return this._viewModelConstructor;
        }

        public getViewHtml():string {
            return this._viewHtml;
        }
    }
}
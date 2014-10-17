/// <reference path="../libs/knockout.d.ts" />
/// <reference path="view.ts"/>

module Frost {
    export class Page {
        private _route:Route;
        private _view:View;
        private _state:Frost.Navigation.HistoryState;
        private _viewModel:ViewModel;
        private _isPartOfDOM:boolean;

        constructor(route:Route) {
            this._isPartOfDOM = false;
            this._route = route;
        }

        public updateState(state:Frost.Navigation.HistoryState) {
            this._state = state;
            if (!this._view) {
                var view = this._route.callback(state.hash, state.data);
                this._view = view;
                this.addPageToDOM();
            }
        }

        private addPageToDOM() {
            var viewHtml = this._view.getViewHtml();
            var newHTML = this._wrapInPage();
            newHTML.innerHTML = viewHtml;
            document.body.appendChild(newHTML);
            this.applyBindings();
            this._isPartOfDOM = true;
        }

        private applyBindings() {
            var c:any = this._view.getViewModelConstrucotr();
            this._viewModel = new c();
            ko.applyBindingsToDescendants(this._viewModel, document.getElementById(this._route.routeId));
            this._viewModel.onCreate(this._state.hash, this._state.data);
        }

        private _wrapInPage() {
            var el = document.createElement('div');
            el.setAttribute('data-frost-role', 'page');
            el.setAttribute('id', this._route.routeId);
            return el;
        }

        private removePageFromDOM() {
            ko.removeNode(document.getElementById(this._route.routeId));
            this._isPartOfDOM = false;
        }

        private showPage() {
            this.getPageElement().style.display = 'initial';
        }

        private hidePage() {
            this.getPageElement().style.display = 'none';
        }

        private getPageElement() {
            return document.getElementById(this._route.routeId);
        }

        public transitionFrom(page:Page) {
            this.showPage();
            if (page) {
                page.hidePage();
            }
            this._viewModel.onShow(this._state.hash, this._state.data);
            if (page) {
                page._viewModel.onHide();
            }
        }
    }
}
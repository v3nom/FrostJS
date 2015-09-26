module Frost.Routing{
  export class Route {
      constructor(public url:string, public action:()=>Frost.View){

      }
  }
}

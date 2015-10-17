module Frost.AssetManager {
  var assetCache = {};

  export function getAsset(url: string) {
    var p = new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState == 4) {
          if (req.status == 200 || req.status == 0) {
            resolve(req.responseText);
          } else {
            reject(req.statusText);
          }
        }
      };
      req.open('GET', url);
      req.send();
    });
    return p;
  }

}

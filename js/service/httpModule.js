(function(http) {
  // public methods and properties
  http.getProducts = function() {
    return fetch(
      "http://interviews-env.b8amvayt6w.eu-west-1.elasticbeanstalk.com/products"
    )
      .then(function(response) {
        return response.json();
      })
      .catch(function(error) {
        console.log("Request failed", error);
      });
  };
})((window.httpModule = window.httpModule || {}));

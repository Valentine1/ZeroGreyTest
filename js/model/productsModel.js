(function(pm) {
  // private
  let products = [];
  let selectedProduct = null;
  let searchedProducts = [];

  // public
  pm.init = function(search) {
    let searchValue = search;
    //local storage is used if it is not search
    //in ptoduction there would be need for clearing policy (once in a certain period of time or maybe after requesting server)
    if (
      searchValue !== undefined ||
      window.localStorage.getItem("searchUsed")
    ) {
      window.localStorage.clear();
      if (searchValue !== undefined && searchValue !== "") {
        //setting info that search has been used, so as in case of abrupt page reload without
        //clearing search text box the cached data from localstorage was not used
        localStorage.setItem("searchUsed", "exist");
      } else {
        localStorage.removeItem("searchUsed");
      }
    }
    return new Promise((resolve, reject) => {
      if (
        window.localStorage &&
        window.localStorage.getItem("products") !== null
      ) {
        products = JSON.parse(localStorage.getItem("products"));
        resolve();
      } else {
        var productsPromise = window.httpModule.getProducts();
        productsPromise.then(productsRaw => {
          products = [];
          let orderNumber = 0;
          //it is basic form of searching, more elaborate regular expression would be needed for production
          productsRaw
            .filter(p => {
              return (
                searchValue === undefined ||
                searchValue === "" ||
                p.name.toUpperCase().search(" " + searchValue.toUpperCase()) !==
                  -1 ||
                p.name.toUpperCase().search(searchValue.toUpperCase()) === 0
              );
            })
            .forEach(pr => {
              var p = Object.create(product);
              p.defaultOrderNumber = orderNumber++;
              p.items = [];
              for (var itemCode in pr.options["4"].values) {
                if (pr.options["4"].values[itemCode].images) {
                  var it = Object.create(item);
                  it.item_code = itemCode;
                  it.color_name = pr.options["4"].values[itemCode].name;
                  it.thumb = pr.options["4"].values[itemCode].images.thumb;
                  it.small = pr.options["4"].values[itemCode].images.small;
                  it.medium = pr.options["4"].values[itemCode].images.medium;

                  for (var prop in pr.skus) {
                    if (
                      pr.skus[prop].options !== null &&
                      pr.skus[prop].options["4"] == itemCode
                    ) {
                      if (pr.skus[prop].promotions.discount !== 0) {
                        it.price = pr.skus[prop].price.to_discount;
                        it.discount_price = pr.skus[prop].price.sell;
                        it.discount_percantage = (
                          (pr.skus[prop].promotions.discount * 100) /
                          pr.skus[prop].price.to_discount
                        ).toFixed(2);
                      } else {
                        it.price = pr.skus[prop].price.sell;
                      }
                      break;
                    }
                  }
                  p.items.push(it);
                }
              }
              p.code = pr.code;
              p.name = pr.name;
              p.short_descrip = pr.descriptions.short;
              p.currency_symbol = pr.price.currency_symbol;
              products.push(p);
            });

          localStorage.removeItem("products");
          localStorage.setItem("products", JSON.stringify(products));
          resolve();
        });
      }
    });
  };

  pm.getProductsForPagination = function() {
    let itemsOnPage = paginationModel.getPageCapacity();
    let selPageIndex = paginationModel.getSelectedPageIndex();
    let startIndex = selPageIndex * itemsOnPage;
    let endIndex = (selPageIndex + 1) * itemsOnPage;
    endIndex =
      endIndex > pm.getAllProducts().length
        ? pm.getAllProducts().length
        : endIndex;

    if (
      sortedProductsMapModel.getSelectedSortType() ===
      sortedProductsMapModel.sortEnum.byName
    ) {
      return sortedProductsMapModel.getSortedProducts(startIndex, endIndex);
    } else if (
      sortedProductsMapModel.getSelectedSortType() ===
      sortedProductsMapModel.sortEnum.byPrice
    ) {
      return sortedProductsMapModel.getSortedProducts(startIndex, endIndex);
    } else {
      return pm.getAllProducts().slice(startIndex, endIndex);
    }
  };

  pm.getAllProducts = function() {
    if (searchedProducts.length > 0) {
      return searchedProducts;
    } else {
      return products;
    }
  };

  pm.setSelectedProduct = function(code) {
    selectedProduct = products.find(p => p.code === code);
  };

  pm.getSelectedProduct = function() {
    return selectedProduct;
  };

  pm.disselectProduct = function() {
    selectedProduct = null;
  };

  pm.setSelectedProductItem = function(code) {
    selectedProduct.selectedItem = selectedProduct.items.find(
      it => it.item_code === code
    );
  };

  pm.searchForProduct = function(name) {
    searchedProducts = [];
    searchedProducts = products.filter(p => {
      return (
        p.name.toUpperCase().search(" " + name.toUpperCase()) !== -1 ||
        p.name.toUpperCase().search(name.toUpperCase() + " ") !== -1
      );
    });
  };
})((window.productsModel = window.productsModel || {}));

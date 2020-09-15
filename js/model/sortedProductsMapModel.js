(function(pm) {
  /*  the idea is to use slim sorted arrays where we store product ordinal number
    in the original array.
    thus we spare memory as compared to storing full sorted copy of the array,
    we make full copy only for short period in the local scope.
    (if we sorted original one on the fly when needed we would lost original one
    so copy needed and, also, sorting is rather demanding operation for resources).
    
    original array:
        products = [
            [0] {name: Puma,   ordinalNumber: 0, ......}
            [1] {name: Adidas, ordinalNumber: 1, ....}
            [2] {name; Reebok, ordinalNumber: 2, ....}
        ]

    sorted by name slim array:
        sortedByNameProducts = [
            [0] 1
            [1] 0
            [2] 2
        ]
    
    getting ordered by name products:
        sortedByNameProducts.forEach (sp => {
            return products[sp];
        })
    */

  // private
  let sortedByPriceMap = [];
  let sortedByNameMap = [];

  pm.sortEnum = Object.freeze({
    default: "default",
    byName: "byName",
    byPrice: "byPrice"
  });
  let selectedSort = pm.sortEnum.default;

  // public
  pm.init = function() {
    sortedByNameMap = [];
    sortedByPriceMap = [];
    let allProducts = productsModel.getAllProducts();

    //create slim mapping for sorted by name porducts
    let sortedProducts = allProducts.concat().sort((p1, p2) => {
      return p1.name.localeCompare(p2.name);
    });
    sortedProducts.forEach(p => {
      sortedByNameMap.push(p.defaultOrderNumber);
    });
    //create slim mapping for sorted by price porducts
    sortedProducts = allProducts.concat().sort((p1, p2) => {
      return (
        (p1.items[0].discount_price || p1.items[0].price) -
        (p2.items[0].discount_price || p2.items[0].price)
      );
    });
    sortedProducts.forEach(p => {
      sortedByPriceMap.push(p.defaultOrderNumber);
    });
  };

  pm.getSortedProducts = function(startIndex, endIndex) {
    let originalProducts = productsModel.getAllProducts();
    let outputProducts = [];
    if (selectedSort === this.sortEnum.byName) {
      for (let i = startIndex; i < endIndex; i++) {
        outputProducts.push(originalProducts[sortedByNameMap[i]]);
      }
    } else if (selectedSort === this.sortEnum.byPrice) {
      for (let i = startIndex; i < endIndex; i++) {
        outputProducts.push(originalProducts[sortedByPriceMap[i]]);
      }
    }
    return outputProducts;
  };

  pm.setSelectedSortType = function(sortType) {
    selectedSort = sortType;
  };

  pm.getSelectedSortType = function(sortType) {
    return selectedSort;
  };
})((window.sortedProductsMapModel = window.sortedProductsMapModel || {}));

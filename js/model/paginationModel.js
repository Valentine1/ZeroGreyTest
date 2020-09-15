(function(pm) {
  // private
  let pagesCount = 0;
  let selectedPageIndex = 0;
  let pageCapacity = 16;

  // public
  pm.init = function() {
    pagesCount = Math.ceil(
      productsModel.getAllProducts().length / pageCapacity
    );
    selectedPageIndex = 0;
  };

  pm.getPaginationLength = function() {
    return pagesCount;
  };

  pm.setSelectedPage = function(index) {
    selectedPageIndex = index;
  };

  pm.setNextPage = function() {
    selectedPageIndex =
      selectedPageIndex < pagesCount - 1
        ? ++selectedPageIndex
        : selectedPageIndex;
  };

  pm.setPreviousPage = function() {
    selectedPageIndex =
      selectedPageIndex > 0 ? --selectedPageIndex : selectedPageIndex;
  };

  pm.getSelectedPageIndex = function() {
    return selectedPageIndex;
  };

  pm.getPageCapacity = function() {
    return pageCapacity;
  };
})((window.paginationModel = window.paginationModel || {}));

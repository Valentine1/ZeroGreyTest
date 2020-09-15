(function(vm) {
  vm.init = async function() {
    //first load ll products from entry point API
    await productsModel.init();
    //initialize all dependent model, e.g. pagination is setting its boundaries
    paginationModel.init();
    sortedProductsMapModel.init();
    //loading html templates for modules
    await productView.init();
    await paginationView.init();
    //now views can fill and compose all html using data from initialized models
    paginationView.render(
      paginationModel.getPaginationLength(),
      paginationModel.getSelectedPageIndex()
    );
    productView.render(productsModel.getProductsForPagination());
  };

  vm.mouseOverProduct = function(code) {
    productsModel.setSelectedProduct(code);
    productView.renderProductExpanded(productsModel.getSelectedProduct());
    productView.renderMiniSlide(productsModel.getSelectedProduct());
  };

  vm.mouseLeaveProduct = function(code) {
    productsModel.disselectProduct();
    productView.cleanProductExpanded(code);
    productView.cleanMiniSlide(code);
  };

  vm.clickProductItem = function(code) {
    productsModel.setSelectedProductItem(code);
    productView.renderSelectedProductItem(productsModel.getSelectedProduct());
  };

  vm.clickPaginationNumber = function(index) {
    paginationModel.setSelectedPage(index);
    paginationView.renderSelectedPaginationNumber(
      paginationModel.getSelectedPageIndex()
    );
    productView.render(productsModel.getProductsForPagination());
  };

  vm.clickPaginationNext = function() {
    let previousIndex = paginationModel.getSelectedPageIndex();
    paginationModel.setNextPage();

    if (previousIndex !== paginationModel.getSelectedPageIndex()) {
      paginationView.renderSelectedPaginationNumber(
        paginationModel.getSelectedPageIndex()
      );
      productView.render(productsModel.getProductsForPagination());
    }
  };

  vm.clickPaginationPrevious = function() {
    let previousIndex = paginationModel.getSelectedPageIndex();
    paginationModel.setPreviousPage();

    if (previousIndex !== paginationModel.getSelectedPageIndex()) {
      paginationView.renderSelectedPaginationNumber(
        paginationModel.getSelectedPageIndex()
      );
      productView.render(productsModel.getProductsForPagination());
    }
  };

  vm.sortChanged = function(sortingType) {
    sortedProductsMapModel.setSelectedSortType(sortingType);
    //on changing sorting type we reset our pagination
    paginationModel.setSelectedPage(0);

    paginationView.renderSelectedPaginationNumber(
      paginationModel.getSelectedPageIndex()
    );
    productView.render(productsModel.getProductsForPagination());
  };

  vm.search = async function(search) {
    await productsModel.init(search);
    paginationModel.init();
    sortedProductsMapModel.init();
    paginationView.render(
      paginationModel.getPaginationLength(),
      paginationModel.getSelectedPageIndex()
    );
    productView.render(productsModel.getProductsForPagination());
  };
})((window.productVM = window.productVM || {}));

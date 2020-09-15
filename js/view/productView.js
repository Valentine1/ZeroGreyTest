(function(v) {
  let $section = null;

  v.init = function() {
    $section = $("#products");
    // adding event handlres to sort drop down
    $("#sortMenu")
      .children()
      .click(function(eventData) {
        var selText = eventData.currentTarget.innerText;
        $(this)
          .parents(".dropdown")
          .children(".sort-drop")
          .children("span")
          .text(selText);
        productVM.sortChanged($(eventData.currentTarget).attr("id"));
      });

    // adding event handlres to search button
    $("#butSearch").click(eventData => {
      let search = $("#inputSearch")
        .val()
        .trim();
      if (search.length > 2) {
        productVM.search(search);
      }
      eventData.preventDefault();
    });

    //need to catch "enter" to prevent reload otherwise we do not get to keyup event
    $("#inputSearch").keydown(eventData => {
      if (eventData.which === 13) {
        eventData.preventDefault();
      }
    });

    $("#inputSearch").keyup(eventData => {
      let search = $(eventData.currentTarget).val();
      // either enter or input cleared
      if (eventData.which == 13 || search.length === 0) {
        if (search.trim().length > 2) {
          productVM.search(search);
        }
        // make default product get operation after user cleared the input
        else if (search.length === 0) {
          productVM.search(search);
        }
      }
      eventData.preventDefault();
    });

    return new Promise((resolve, reject) => {
      //load html template for product view
      fetch("product.html", { mode: "no-cors" })
        .then(function(response) {
          return response.text();
        })
        .then(function(html) {
          $("body").append(html);
          resolve();
        })
        .catch(function(error) {
          console.log("Request failed", error);
          reject();
        });
    });
  };

  v.render = function(products) {
    //empty all products
    $section.html("");
    let temp = $("#tmplProd")[0];
    // add products cards one-by-one
    products.forEach(function(p) {
      let node = temp.content.cloneNode(true);
      let cardContainer = $(node).find(".card-container")[0];
      $(cardContainer).attr("id", p.code);

      let imageElem = $(node).find(".card-img-top")[0];
      $(imageElem).attr("src", p.items[0].medium);

      let titleElem = $(node).find(".product-name")[0];
      titleElem.innerHTML = titleElem.innerHTML.replace(/{{name}}/g, p.name);

      let descripElem = $(node).find(".short-description")[0];
      descripElem.innerHTML = descripElem.innerHTML.replace(
        /{{description}}/g,
        p.short_descrip
      );

      let priceElem = $(node).find(".price")[0];
      priceElem.innerHTML = priceElem.innerHTML
        .replace(/{{full-price}}/g, p.items[0].price)
        .replace(/{{currency}}/g, p.currency_symbol);

      if (
        p.items[0].discount_percantage === 0 ||
        p.items[0].discount_percantage === undefined
      ) {
        $(priceElem)
          .find(".discount")
          .addClass("d-none");
        $(priceElem)
          .find(".discount-price")
          .addClass("d-none");
      } else {
        $(priceElem)
          .find(".full-price")
          .css("text-decoration-line", "line-through");
        priceElem.innerHTML = priceElem.innerHTML
          .replace(/{{discount-price}}/g, p.items[0].discount_price)
          .replace(/{{discount}}/g, p.items[0].discount_percantage);
      }

      let cardConainer = $(node).children(".card-container")[0];
      let cardElem = $(cardConainer).children(".card")[0];

      let isMouseOverProduct = false;
      $(cardElem).mouseover(eventData => {
        //mouse over event is triggerd multiple times from cards' children but we need it only once
        if (!isMouseOverProduct) {
          isMouseOverProduct = true;
          productVM.mouseOverProduct(
            $(eventData.currentTarget)
              .parents(".card-container")
              .attr("id")
          );
        }
      });

      $(cardElem).mouseleave(eventData => {
        isMouseOverProduct = false;
        productVM.mouseLeaveProduct(
          $(eventData.currentTarget)
            .parents(".card-container")
            .attr("id")
        );
      });
      $section.append(node);
    });
  };

  v.renderProductExpanded = function(product) {
    let cardContainer = $($section).children("#" + product.code)[0];
    let cardElem = $(cardContainer).children(".card")[0];

    //'freeze' container to size before expand so as keep overall layout fixed
    $(cardContainer).css("height", $(cardElem).css("height"));

    //prevent from shrinking img when its container is set to absolute
    let imageElem = $(cardElem).find(".card-img-top")[0];
    $(imageElem).css("width", $(imageElem).css("width"));

    //show 'add to cart' button
    let buyElem = $(cardElem).find(".buy")[0];
    $(buyElem).css("display", "block");

    //allow card to go over another elements
    $(cardElem).css("position", "absolute");
    $(cardElem).css("z-index", "999");
    $(cardElem).css("border-color", "gray");
  };

  v.renderMiniSlide = function(product) {
    let cardContainer = $($section).children("#" + product.code)[0];
    let sliderElem = $(cardContainer).find(".items-slider")[0];
    sliderElem.innerHTML = "";
    let imgWidth = sliderElem.clientWidth / 3;

    for (let i = 0; i < product.items.length; i++) {
      let div = $("<div />").css("width", imgWidth + "px");
      let img = $("<img />", { src: product.items[i].thumb }).css(
        "width",
        "100%"
      );
      $(img).attr("id", product.items[i].item_code);
      $(img).addClass("px-2");
      $(img).addClass("product-item");

      //row can contain only 3 visible images
      //we ignore the rest, that is simplification for lack of time
      if (i > 2) {
        $(div).addClass("d-none");
      }

      $(img).click(eventData => {
        productVM.clickProductItem($(img).attr("id"));
      });

      img.appendTo($(div));
      div.appendTo($(sliderElem));
    }
  };

  v.cleanProductExpanded = function(code) {
    let cardContainer = $($section).children("#" + code)[0];
    let cardElem = $(cardContainer).children(".card")[0];
    $(cardContainer).css("height", "auto");

    let imageElem = $(cardElem).find(".card-img-top")[0];
    $(imageElem).css("width", "100%");

    //return card into its usual flow
    $(cardElem).css("position", "relative");
    $(cardElem).css("z-index", "1");
    $(cardElem).css("border-color", "transparent");

    // hide 'add to cart' button
    let buyElem = $(cardElem).find(".buy")[0];
    $(buyElem).css("display", "none");
  };

  v.cleanMiniSlide = function(code) {
    let cardContainer = $($section).children("#" + code)[0];
    let sliderElem = $(cardContainer).find(".items-slider")[0];
    sliderElem.innerHTML = "";
  };

  v.renderSelectedProductItem = function(product) {
    let cardContainer = $($section).children("#" + product.code)[0];

    //set main image to selected item
    let mainImgElem = $(cardContainer).find(".card-img-top")[0];
    $(mainImgElem).attr("src", product.selectedItem.medium);
  };
})((window.productView = window.productView || {}));

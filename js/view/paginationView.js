(function(v) {
  let $pagination = null;

  v.init = function() {
    return new Promise((resolve, reject) => {
      //load html template for pagination view
      fetch("pagination.html", { mode: "no-cors" })
        .then(function(response) {
          return response.text();
        })
        .then(function(html) {
          $("body").append(html);
          $pagination = $("#pagination");
          resolve();
        })
        .catch(function(error) {
          console.log("Request to pagination tempate failed", error);
          reject();
        });
    });
  };

  v.render = function(pageNumber, pageIndex) {
    let templ = $("#tmplPagination")[0];
    let node = templ.content.cloneNode(true);
    let pagElem = $(node).find(".pagination")[0];

    $(pagElem)
      .find(".previous")
      .click(ea => {
        productVM.clickPaginationPrevious();
      });

    $(pagElem)
      .find(".next")
      .click(ea => {
        productVM.clickPaginationNext();
      });

    for (let i = 0; i < pageNumber; i++) {
      let li = $("<li />", { class: "page-item number" });
      if (i === pageIndex) {
        $(li).addClass("active");
      }

      let span = $("<span />", { class: "page-link" });
      span.text(i + 1);

      $(span).click(eventData => {
        productVM.clickPaginationNumber(
          parseInt(eventData.currentTarget.innerText) - 1
        );
      });

      li.append(span);
      $(pagElem)
        .children("li")
        .eq(i)
        .after(li);
    }
    $pagination.empty();
    $pagination.append(node);
  };

  v.renderSelectedPaginationNumber = function(index) {
    $($pagination)
      .find(".number")
      .each((i, p) => {
        $(p).removeClass("active");
        if (
          parseInt(
            $(p)
              .first()
              .text()
          ) -
            1 ===
          index
        ) {
          $(p).addClass("active");
        }
      });

    $("html, body")
      .delay(500)
      .animate(
        {
          scrollTop: $("#breadcrumb").offset().top
        },
        500
      );
  };
})((window.paginationView = window.paginationView || {}));

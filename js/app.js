//some caution against old browsers
if (
    typeof Promise === "undefined" ||
    Promise.toString().indexOf("[native code]") === -1
  ) {
    alert("Older browsers and <= Internet Explorer 11 are not supported. Please, use up to date ones.");
  }
  productVM.init();
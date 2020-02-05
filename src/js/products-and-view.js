console.time("PRODUCTS MOUNTED");
Z.load(
  [
    {
      id: "products",
      url: "/json/products.json",
      callback: function(data) {
        return JSON.parse(data);
      }
    }
  ],
  function() {
    Z.mount({
      id: "products",
      render: function(state) {
        return state
          .map(function(product, index) {
            return `
              <div class="product" onclick='console.time("VIEW UPDATED");Z.update("view", {state:Z.products[${index}]});console.timeEnd("VIEW UPDATED");'>
                <h2>${product.name}</h2>
                <img src="/images/${product.images[0]}" width="200">
                <span>${product.price} €</span>
              </div>`;
          })
          .join("");
      },
      inner: document.getElementById("products"),
      state: Z.load.products
    });
    console.timeEnd("PRODUCTS MOUNTED");
  }
);
console.time("VIEW MOUNTED");
Z.mount({
  id: "view",
  render: function(state) {
    var btn = `<button onclick='console.time("BASKET UPDATED");Z.basket.addToBasket(Z.view);console.timeEnd("BASKET UPDATED");'>Add To Cart</button>`;
    Z.basket.products.forEach(function(product, index) {
      if (product.name === state.name) {
        btn = `<button onclick='console.time("BASKET UPDATED");Z.basket.adjustCart(${index}, -1);console.timeEnd("BASKET UPDATED");'>-</button> <span>${product.quantity}</span> <button onclick='console.time("BASKET UPDATED");Z.basket.adjustCart(${index}, 1);console.timeEnd("BASKET UPDATED");'>+</button>`;
      }
    });
    return state.name
      ? `
        <div class="view-modal">
          <div class="view">
              <button onclick='console.time("VIEW UPDATED");Z.update("view", {state:{}});console.timeEnd("VIEW UPDATED");'>close</button>
              <h3>${state.fullname}</h3>
              <div>
                ${state.images
                  .map(function(image) {
                    return `<img src="/images/${image}" height="150">`;
                  })
                  .join("")}
              </div>
              <p>${state.description}</p>
              <div class="included">
              ${state.included
                .map(function(inc) {
                  return `
                    <div>
                      <img src="/images/details/${inc.image}" height="40">
                      <p>${inc.name}</p>
                    </div>`;
                })
                .join("")}
              </div>
              <p>${state.price} €</p>
              <div id="button"></div>
          </div>
        </div>
        `
      : "";
  },
  after: function(viewState) {
    if (viewState.name) {
      console.time("BUTTON MOUNTED");
      Z.mount({
        id: "button",
        render: function() {
          var btn = `<button onclick='console.time("BASKET UPDATED");Z.basket.addToBasket(Z.view);console.timeEnd("BASKET UPDATED");'>Add To Cart</button>`;
          Z.basket.products.forEach(function(product, index) {
            if (product.name === viewState.name) {
              btn = `<button onclick='console.time("BASKET UPDATED");Z.basket.adjustCart(${index}, -1);console.timeEnd("BASKET UPDATED");'>-</button> <span>${product.quantity}</span> <button onclick='console.time("BASKET UPDATED");Z.basket.adjustCart(${index}, 1);console.timeEnd("BASKET UPDATED");'>+</button>`;
            }
          });
          return btn;
        },
        inner: document.getElementById("button")
      });
      console.timeEnd("BUTTON MOUNTED");
    }
  },
  inner: document.getElementById("view"),
  state: {}
});
console.timeEnd("VIEW MOUNTED");

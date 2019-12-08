Z.mount({
  key: "basket",
  render: function() {
    var total = Z.basket.products.reduce(function(acc, current) {
      return acc + current.quantity * current.price;
    }, 0);

    return Z.basket.products.length
      ? Z.basket.products
          .map(function(product, index) {
            return `
              <div>
                  <span>${
                    product.name
                  }</span> <span><button onclick="Z.basket.adjustCart(${index}, -1)">-</button> <span>${product.quantity}</span> <button onclick="Z.basket.adjustCart(${index}, 1)">+</button></span> <span>${(product.price * product.quantity).toFixed(2)}</span>
              </div>
            `;
          })
          .join("") +
          `<div>
            <span>Total: ${total.toFixed(2)}</span>
          </div>
          `
      : "";
  },
  inner: document.getElementById("basket"),
  before: function() {},
  data: {
    products: JSON.parse(localStorage.getItem("basket")) || [],
    update: function() {
      localStorage.setItem("basket", JSON.stringify(this.products));
      Z.update("basket", {
        data: this
      });
      Z.update("button");
    },

    adjustCart: function(index, increment) {
      Z.basket.products[index].quantity += increment;
      if (!Z.basket.products[index].quantity) {
        Z.basket.products.splice(index, 1);
      }
      Z.basket.update();
    },

    addToBasket: function(item) {
      var basketObj = {
        name: item.name,
        price: item.price
      };

      var cartContainsItem = Z.basket.products.some(function(product, index) {
        if (product.name === basketObj.name) {
          product.quantity = product.quantity + 1;
          return true;
        }
      });

      if (!cartContainsItem) {
        basketObj.quantity = 1;
        Z.basket.products.push(basketObj);
      }
      Z.basket.update();
    }
  }
});

Z.mount({
  key: "products",
  render: function() {
    return Z.products
      .map(function(product, index) {
        return `
        <div class="product" onclick='Z.update("view", {data:Z.products[${index}]})'>
            <h2>${product.name}</h2>
            <img src="images/${product.image}" width="200">
            <span>${product.price} €</span>
        </div>
      `;
      })
      .join("");
  },
  inner: document.getElementById("products"),
  data: "json/products.json"
});

Z.listen("view", function() {
  console.log(Z.previous.view === Z.view);
});

Z.mount({
  key: "view",
  render: function() {
    var btn = `<button onclick="Z.basket.addToBasket(Z.view)">Add To Cart</button>`;
    Z.basket.products.forEach(function(product, index) {
      if (product.name === Z.view.name) {
        btn = `<button onclick="Z.basket.adjustCart(${index}, -1)">-</button> <span>${product.quantity}</span> <button onclick="Z.basket.adjustCart(${index}, 1)">+</button>`;
      }
    });

    return Z.view.name
      ? `
      <div class="view-modal">
        <div class="view">
            <button onclick='Z.update("view", {data:{}})'>close</button>
            <h3>${Z.view.name}</h3>
            <img src="images/${Z.view.image}" width="250">
            <p>${Z.view.price} €</p>
            <div id="button"></div>
        </div>
      </div>
      `
      : "";
  },
  after: function() {
    if (Z.view.name) {
      Z.mount({
        key: "button",
        render: function() {
          var btn = `<button onclick="Z.basket.addToBasket(Z.view)">Add To Cart</button>`;
          Z.basket.products.forEach(function(product, index) {
            if (product.name === Z.view.name) {
              btn = `<button onclick="Z.basket.adjustCart(${index}, -1)">-</button> <span>${product.quantity}</span> <button onclick="Z.basket.adjustCart(${index}, 1)">+</button>`;
            }
          });
          return btn;
        },
        inner: document.getElementById("button")
      });
    }
  },
  inner: document.getElementById("view"),
  data: {}
});

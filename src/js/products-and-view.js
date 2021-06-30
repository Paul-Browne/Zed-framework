Z.xhr({
  id: "products",
  url: "/json/products.json",
  callback: function(data) {
    Z({
      id: "products",
      render: function() {
        document.getElementById(this.id).innerHTML = this.data
          .map(function(product, index) {
            return `
              <div class="product" onclick='Z.view.update(${index});'>
                <h2>${product.name}</h2>
                <img src="/images/${product.images[0]}" width="200">
                <span>${product.price} €</span>
              </div>`;
          })
          .join("");
      },
      data: JSON.parse(data)
    });
    Z.products.render();
  }
});

Z({
  id: "view",
  render: function() {
    if (this.state) {
      var btn = `<button onclick='Z.basket.addToBasket(Z.view.state);'>Add To Cart</button>`;
      Z.basket.cart.forEach((product, index) => {
        if (product.name === this.state.name) {
          btn = `<button onclick='Z.basket.adjustCart(${index}, -1);'>-</button> <span>${product.quantity}</span> <button onclick='Z.basket.adjustCart(${index}, 1);'>+</button>`;
        }
      });
      document.getElementById("view").innerHTML = `
      <div class="view-modal">
        <div class="view">
          <button onclick='Z.view.update();'>close</button>
          <h3>${this.state.fullname}</h3>
          <div>
            ${this.state.images
              .map(function(image) {
                return `<img src="/images/${image}" height="150">`;
              })
              .join("")}
          </div>
          <p>${this.state.description}</p>
          <div class="included">
          ${this.state.included
            .map(function(inc) {
              return `
                <div>
                  <img src="/images/details/${inc.image}" height="40">
                  <p>${inc.name}</p>
                </div>`;
            })
            .join("")}
          </div>
          <p>${this.state.price} €</p>
          <div id="button"></div>
        </div>
      </div>
      `;
    } else {
      document.getElementById("view").innerHTML = "";
    }
  },
  update: function(index) {
    this.state = index >= 0 ? Z.products.data[index] : null;
    this.render();
    this.state && Z.button.render();
  },
  state: null
});

Z({
  id: "button",
  render: function() {
    var btn = `<button onclick='Z.basket.addToBasket(Z.view.state);'>Add To Cart</button>`;
    Z.basket.cart.forEach((product, index) => {
      if (product.name === Z.view.state.name) {
        btn = `<button onclick='Z.basket.adjustCart(${index}, -1);'>-</button> <span>${product.quantity}</span> <button onclick='Z.basket.adjustCart(${index}, 1);'>+</button>`;
      }
    });
    document.getElementById(this.id).innerHTML = btn;
  }
});

Z.mount({
  key: "basket",
  render: function() {
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
            <span>Total: ${Z.basket.total.toFixed(2)}</span>
          </div>
          `
      : "";
  },
  inner: document.getElementById("basket"),
  data: {
    products: JSON.parse(localStorage.getItem("basket")) || [],
    total: JSON.parse(localStorage.getItem("total")) || 0,
    update: function() {
      this.total = 0;
      this.products.forEach(function(product) {
        this.total += product.quantity * product.price;
      }, this);
      localStorage.setItem("basket", JSON.stringify(this.products));
      localStorage.setItem("total", JSON.stringify(this.total));
      Z.update("basket", {
        data: this
      });
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

      var found = false;
      Z.basket.products.forEach(function(basketItem) {
        if (basketItem.name === basketObj.name) {
          found = true;
          basketItem.quantity = basketItem.quantity + 1;
        }
      });
      if (!found) {
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

Z.mount({
  key: "view",
  render: function() {
    return Z.view.name
      ? `
      <div class="view-modal">
        <div class="view">
            <button onclick='Z.update("view", {data:{}})'>close</button>
            <h3>${Z.view.name}</h3>
            <img src="images/${Z.view.image}" width="250">
            <p>${Z.view.price} €</p>
            <button onclick="Z.basket.addToBasket(Z.view)">Add To Cart</button>
        </div>
      </div>
      `
      : "";
  },
  inner: document.getElementById("view"),
  data: {}
});

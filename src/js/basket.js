Z({
  id: "basket",
  render: function() {
    var total = this.cart.reduce(function(acc, current) {
      return acc + current.quantity * current.price;
    }, 0);
    document.getElementById(this.id).innerHTML =
      this.cart
        .map(function(product, index) {
          return `
          <div>
            <span>${
              product.name
            }</span> <span><button onclick='Z.basket.adjustCart(${index}, -1);'>-</button> <span>${product.quantity}</span> <button onclick='Z.basket.adjustCart(${index}, 1);'>+</button></span> <span>${(product.price * product.quantity).toFixed(2)}</span>
          </div>`;
        })
        .join("") + `<div><span>Total: ${total.toFixed(2)}</span></div>`;
  },
  cart: JSON.parse(localStorage.getItem("basket")) || [],
  update: function() {
    localStorage.setItem("basket", JSON.stringify(this.cart));
    this.render();
    if (Z.view.state) {
      Z.button.render();
    }
  },
  adjustCart: function(index, increment) {
    this.cart[index].quantity += increment;
    if (!this.cart[index].quantity) {
      this.cart.splice(index, 1);
    }
    this.update();
  },
  addToBasket: function(item) {
    var basketObj = {
      name: item.name,
      price: item.price
    };

    var cartContainsItem = this.cart.some(function(product, index) {
      if (product.name === basketObj.name) {
        product.quantity = product.quantity + 1;
        return true;
      }
    });

    if (!cartContainsItem) {
      basketObj.quantity = 1;
      this.cart.push(basketObj);
    }
    this.update();
  }
});
Z.basket.render();

Z.mount({
  id: "basket",
  render: function(state) {
    var total = state.products.reduce(function(acc, current) {
      return acc + current.quantity * current.price;
    }, 0);
    return (
      state.products
        .map(function(product, index) {
          return `
          <div>
            <span>${
              product.name
            }</span> <span><button onclick="Z.basket.adjustCart(${index}, -1)">-</button> <span>${product.quantity}</span> <button onclick="Z.basket.adjustCart(${index}, 1)">+</button></span> <span>${(product.price * product.quantity).toFixed(2)}</span>
          </div>`;
        })
        .join("") + `<div><span>Total: ${total.toFixed(2)}</span></div>`
    );
  },
  inner: document.getElementById("basket"),
  state: {
    products: JSON.parse(localStorage.getItem("basket")) || [],
    update: function() {
      localStorage.setItem("basket", JSON.stringify(this.products));
      Z.update("basket", {
        state: this
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

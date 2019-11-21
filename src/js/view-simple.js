document.getElementById("output-view").innerHTML = Z.view.name
  ? `
    <style>
        .view-modal:before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: rgba(0, 0, 0, 0.4);
        }

        .view {
            background: #fff;
            border-radius: 6px;
            padding: 1em 2em;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-height: 100%;
            max-width: 100%;
            overflow: auto;
            box-sizing: border-box;
        }
    </style>
    <div class="view">
        <button onclick='Z.update({key:"view", data:{}})''>close</button>
        <h3>${Z.view.name}</h3>
        <img src="images/${Z.view.image}" width="250">
        <p>${Z.view.price} €</p>
        <button onclick="addToBasket(Z.view)">Add To Cart</button>
    </div>
`
  : "";

function addToBasket(item) {
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

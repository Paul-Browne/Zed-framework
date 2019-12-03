document.getElementById("output").innerHTML = Z.products
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

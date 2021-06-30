"use strict";Z.xhr({id:"products",url:"/json/products.json",callback:function(t){Z({id:"products",render:function(){document.getElementById(this.id).innerHTML=this.data.map(function(t,n){return'\n              <div class="product" onclick=\'Z.view.update('.concat(n,");'>\n                <h2>").concat(t.name,'</h2>\n                <img src="/images/').concat(t.images[0],'" width="200">\n                <span>').concat(t.price," €</span>\n              </div>")}).join("")},data:JSON.parse(t)}),Z.products.render()}}),Z({id:"view",render:function(){var a=this;if(this.state){Z.basket.cart.forEach(function(t,n){t.name===a.state.name&&"<button onclick='Z.basket.adjustCart(".concat(n,", -1);'>-</button> <span>").concat(t.quantity,"</span> <button onclick='Z.basket.adjustCart(").concat(n,", 1);'>+</button>")}),document.getElementById("view").innerHTML='\n      <div class="view-modal">\n        <div class="view">\n          <button onclick=\'Z.view.update();\'>close</button>\n          <h3>'.concat(this.state.fullname,"</h3>\n          <div>\n            ").concat(this.state.images.map(function(t){return'<img src="/images/'.concat(t,'" height="150">')}).join(""),"\n          </div>\n          <p>").concat(this.state.description,'</p>\n          <div class="included">\n          ').concat(this.state.included.map(function(t){return'\n                <div>\n                  <img src="/images/details/'.concat(t.image,'" height="40">\n                  <p>').concat(t.name,"</p>\n                </div>")}).join(""),"\n          </div>\n          <p>").concat(this.state.price,' €</p>\n          <div id="button"></div>\n        </div>\n      </div>\n      ')}else document.getElementById("view").innerHTML=""},update:function(t){this.state=0<=t?Z.products.data[t]:null,this.render(),this.state&&Z.button.render()},state:null}),Z({id:"button",render:function(){var a="<button onclick='Z.basket.addToBasket(Z.view.state);'>Add To Cart</button>";Z.basket.cart.forEach(function(t,n){t.name===Z.view.state.name&&(a="<button onclick='Z.basket.adjustCart(".concat(n,", -1);'>-</button> <span>").concat(t.quantity,"</span> <button onclick='Z.basket.adjustCart(").concat(n,", 1);'>+</button>"))}),document.getElementById(this.id).innerHTML=a}});
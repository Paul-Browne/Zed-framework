"use strict";!function(e,i){if(!e.Z){var a=function(e,n){if("data"in e&&"render"in e){if(Z.previous[n.key]=Z[n.key],Z[n.key]=o(e.data)?JSON.parse(e.data):e.data,n.before&&n.before(),o(e.render)){n.inner?n.inner.innerHTML=e.render:n.outer.outerHTML=e.render;for(var r=(new DOMParser).parseFromString(e.render,"text/html").querySelectorAll("SCRIPT"),t=0;t<r.length;t++){var a=i.createElement("SCRIPT");r[t].src?a.src=r[t].src:a.innerHTML=r[t].innerHTML,i.head.appendChild(a)}}else n.inner?n.inner.innerHTML=e.render():n.outer.outerHTML=e.render();n.after&&n.after()}},o=function(e){return"string"==typeof e},t={};e.Z={previous:{},update:function(e,n){t[e].f(n),t[e].l.forEach(function(e){e()})},mount:function(r,e){r.key&&!e&&(t[r.key]={l:[],f:function(e){for(var n in e)r[n]=e[n];Z.mount(r,!0)}});var n={};["data","render"].forEach(function(e){o(r[e])?function(e,n,r){var t=new XMLHttpRequest;t.onreadystatechange=function(){4==t.readyState&&200==t.status&&(e[r]=t.responseText,a(e,n))},t.open("GET",n[r],!0),t.send()}(n,r,e):n[e]=r[e]}),a(n,r)},listen:function(e,n){t[e].l.push(n)}}}}(window,document);
# Zed, the 1kb microframework

Zed is a microframework that only focuses on rendering and updating. It doesn't include a templating engine of any kind, meaning you are free to use whatever one you want!

### Z.render

##### index.html
```html
<div id="container"></div>
<script>
  Z.render({
    html: "component/people.html",
    people: "data/people.json",
    entry: document.getElementById("container")
  })
</script>
```

##### people.json
```json
[
  {"name": "Bob", "age": 21, "job": "Developer"},
  {"name": "Mike", "age": 31, "job": "Lawyer"},
  {"name": "Sarah", "age": 41, "job": "Doctor"}
]
```

##### people.html
```html
<div id="list"></div>
<script>
  var list = document.getElementById("list");
  Z.people.forEach(function (person) {
    list.innerHTML += ("<span>" + person.name + " is " + person.age + " years old and works as a " + person.job + "!</span>");
  })
</script>
```

##### output
```html
<div id="container">
  <div id="people">
    <span>Bob is 21 years old and works as a Developer!</span>
    <span>Mike is 31 years old and works as a Lawyer!</span>
    <span>Sarah is 41 years old and works as a Doctor!</span>
  </div>
</div>
```

### Z.update
```js
```

##### output
```html
<div id="container">
  <div id="people">
    <span>Andrew is 35 years old and works as a Dentist!</span>
  </div>
</div>
```


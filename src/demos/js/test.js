Z.mount({
  key: "greeting",
  state: {
    name: "John",
    age: 35
  },
  render: function(state, prev) {
    return `<h1>hello ${state.name}</h1>`;
  },
  inner: document.getElementById("welcome")
});

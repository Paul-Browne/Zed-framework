Z.mount({
  key: "todos",
  render: function() {
    return Z.todos
      .map(function(todo, index) {
        return `
          <div>
            <span>${todo}</span>
            <button onclick="Z.todos.splice(${index}, 1); Z.update('todos', {data: Z.todos})">remove</button>
          </div>
        `;
      })
      .join("");
  },
  inner: document.getElementById("todo-list"),
  data: []
});

Z.mount({
  render: function() {
    return `
      <input id="task" type="text" placeholder="add task" />
      <button>Add</button>
    `;
  },
  after: function() {
    document
      .querySelector("#task + button")
      .addEventListener("click", function() {
        var task = document.getElementById("task");
        Z.todos.push(task.value);
        Z.update("todos", {
          data: Z.todos
        });
        task.value = "";
      });
  },
  outer: document.getElementById("todo-add")
});

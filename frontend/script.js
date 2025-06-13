const API_URL = "http://localhost:3000/tasks";

const listElement = document.querySelector(".list");
const textElement = document.querySelector("input");
const buttonElement = document.querySelector("button.add");

async function fetchTasks() {
  const res = await fetch(API_URL);
  return await res.json();
}

function renderTodo(tasks) {
  listElement.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = task.title;

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.classList.add("edit");

    btnEdit.addEventListener("click", () => {
      const input = document.createElement("input");
      input.value = task.title;
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Salvar";
      saveBtn.classList.add("save");

      saveBtn.addEventListener("click", async () => {
        await updateTask(task.id, input.value);
        loadAndRender();
      });

      li.innerHTML = "";
      li.appendChild(input);
      li.appendChild(saveBtn);
    });

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Excluir";
    btnDelete.classList.add("delete");

    btnDelete.addEventListener("click", async () => {
      await deleteTask(task.id);
      loadAndRender();
    });

    const actions = document.createElement("div");
    actions.classList.add("task-actions");
    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    li.appendChild(span);
    li.appendChild(actions);
    listElement.appendChild(li);
  });
}

async function addTask(title) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

async function updateTask(id, title) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

async function loadAndRender() {
  const tasks = await fetchTasks();
  renderTodo(tasks);
}

buttonElement.addEventListener("click", async () => {
  const text = textElement.value.trim();
  if (text) {
    await addTask(text);
    textElement.value = "";
    loadAndRender();
  }
});

textElement.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const text = textElement.value.trim();
    if (text) {
      await addTask(text);
      textElement.value = "";
      loadAndRender();
    }
  }
});

// Carrega tarefas ao abrir a página
loadAndRender();

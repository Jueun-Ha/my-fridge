// My Fridge 2주차: 이벤트, DOM 조작, 배열, 객체
// 4주차에 localStorage를 연결할 예정이므로, 현재 데이터는 새로고침하면 초기화됩니다.

let foods = [];
let shoppingItems = [];
let nextFoodId = 1;
let nextShoppingId = 1;
let editingFoodId = null;

const foodForm = document.querySelector("#food-form");
const nameInput = document.querySelector("#food-name");
const quantityInput = document.querySelector("#food-quantity");
const expiryInput = document.querySelector("#food-expiry");
const foodList = document.querySelector("#food-list");
const foodSubmit = document.querySelector("#food-submit");
const cancelEdit = document.querySelector("#cancel-edit");
const shoppingForm = document.querySelector("#shopping-form");
const shoppingName = document.querySelector("#shopping-name");
const shoppingList = document.querySelector("#shopping-list");

const sortSelect = document.querySelector("#sort-select");

// 식품 등록 또는 수정: form 제출 이벤트
foodForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const quantity = Number(quantityInput.value);
  const expiry = expiryInput.value;

  if (!name || !expiry || !Number.isInteger(quantity) || quantity < 1) {
    alert("식품명, 1개 이상의 수량, 소비기한을 올바르게 입력해 주세요.");
    return;
  }

  if (editingFoodId === null) {
    const food = { id: nextFoodId++, name, quantity, expiry };
    foods.push(food);
  } else {
    const food = foods.find(function (item) { return item.id === editingFoodId; });
    if (food) { food.name = name; food.quantity = quantity; food.expiry = expiry; }
  }
  resetFoodForm();
  renderFoods();
});

function resetFoodForm() {
  editingFoodId = null;
  foodForm.reset();
  quantityInput.value = "1";
  foodSubmit.textContent = "식품 등록";
  cancelEdit.hidden = true;
}

cancelEdit.addEventListener("click", resetFoodForm);

function renderFoods() {
  document.querySelector("#total-count").textContent = foods.length;
  foodList.innerHTML = "";
  if (foods.length === 0) {
    foodList.className = "empty-state";
    const p = document.createElement("p");
    p.textContent = "아직 등록된 식품이 없습니다.";
    foodList.appendChild(p);
    return;
  }
  foodList.className = "";
  // 배열을 복사한 뒤 소비기한이 빠른 순서로 보여줍니다.
  const sortedFoods = [...foods];
  
  if (sortSelect.value === "expiry-asc") {
  sortedFoods.sort(function (a, b) {
    return a.expiry.localeCompare(b.expiry);
  });
} else if (sortSelect.value === "name-asc") {
  sortedFoods.sort(function (a, b) {
    return a.name.localeCompare(b.name, "ko");
  });
} else if (sortSelect.value === "recent") {
  sortedFoods.sort(function (a, b) {
    return b.id - a.id;
  });
}
   
  sortedFoods.forEach(function (food) {
    const row = document.createElement("div");
    row.className = "food-item";
    const info = document.createElement("div");
    const title = document.createElement("div");
    title.className = "item-name";
    title.textContent = food.name;
    const date = document.createElement("div");
    date.className = "item-meta";
    date.textContent = "소비기한: " + food.expiry;
    info.append(title, date);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const minus = createButton("−", "small-button", function () {
      if (food.quantity > 1) { food.quantity--; renderFoods(); }
      else { alert("수량은 1개 이상이어야 합니다. 삭제하려면 삭제 버튼을 눌러주세요."); }
    });
    const number = document.createElement("span");
    number.className = "qty-number";
    number.textContent = food.quantity + "개";
    const plus = createButton("+", "small-button", function () {
      food.quantity++;
      renderFoods();
    });
    const edit = createButton("수정", "small-button", function () {
      editingFoodId = food.id;
      nameInput.value = food.name;
      quantityInput.value = food.quantity;
      expiryInput.value = food.expiry;
      foodSubmit.textContent = "수정 완료";
      cancelEdit.hidden = false;
      nameInput.focus();
    });
    const addToShopping = createButton("장보기로", "small-button", function () {
      addShoppingItem(food.name);
    });
    const remove = createButton("삭제", "small-button danger-button", function () {
      if (confirm(food.name + "을(를) 삭제할까요?")) {
        foods = foods.filter(function (item) { return item.id !== food.id; });
        if (editingFoodId === food.id) resetFoodForm();
        renderFoods();
      }
    });
    actions.append(minus, number, plus, edit, addToShopping, remove);
    row.append(info, actions);
    foodList.appendChild(row);
  });
}

// 사용자 입력을 innerHTML에 넣지 않고 textContent를 이용해 표시합니다.
function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

shoppingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = shoppingName.value.trim();
  if (!name) return;
  addShoppingItem(name);
  shoppingForm.reset();
  shoppingName.focus();
});

function addShoppingItem(name) {
  shoppingItems.push({ id: nextShoppingId++, name: name, checked: false });
  renderShopping();
}

function renderShopping() {
  document.querySelector("#shopping-count").textContent = shoppingItems.length + "개";
  shoppingList.innerHTML = "";
  if (shoppingItems.length === 0) {
    shoppingList.className = "empty-state";
    const p = document.createElement("p");
    p.textContent = "장보기 목록이 비어 있습니다.";
    shoppingList.appendChild(p);
    return;
  }
  shoppingList.className = "";
  shoppingItems.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "shopping-item";
    const label = document.createElement("label");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = item.checked;
    check.addEventListener("change", function () {
      item.checked = check.checked;
      renderShopping();
    });
    const text = document.createElement("span");
    text.textContent = item.name;
    if (item.checked) text.className = "is-checked";
    label.append(check, text);
    const remove = createButton("삭제", "small-button danger-button", function () {
      shoppingItems = shoppingItems.filter(function (entry) { return entry.id !== item.id; });
      renderShopping();
    });
    row.append(label, remove);
    shoppingList.appendChild(row);
  });
}

sortSelect.addEventListener("change", function () {
  renderFoods();
});

renderFoods();
renderShopping();

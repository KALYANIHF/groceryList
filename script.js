const submit_btn = document.querySelector(".submit");
const clear_btn = document.querySelector(".clear-list");
const container = document.querySelector(".list-container");
const list = document.querySelector(".grocery-list");
const grocery = document.querySelector(".grocery-value");

const alert_msg = document.querySelector(".alert");
let editID = "";
let editFlag = false;
let editElement;

// Add item to the list
submit_btn.addEventListener("click", additem);
clear_btn.addEventListener("click", clearAllList);

// define additem
function additem(e) {
  e.preventDefault();
  let id = new Date().getTime().toString();
  let value = grocery.value;
  if (value !== "" && !editFlag) {
    const articel = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    articel.setAttributeNode(attr);
    articel.classList.add("grocery-item");
    articel.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button class="btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn modify-btn">
                <i class="fas fa-sync"></i>
              </button>
            </div>`;
    // appending the child element to the list
    list.appendChild(articel);
    // show the hidden container
    container.classList.add("show-container");
    // set back to default (mean clear the input field)
    setbacktoDefault();
    // popup massage
    showalert("The Item is Added to the List", "success");

    // add item to localStroage
    setLocalStroage(id, value);
  } else if (value !== "" && editFlag) {
    editElement.textContent = value;
    showalert("The Item value is changed", "success");
    editLocalStroage(editID, value);
    setbacktoDefault();
  } else {
    showalert("Please Enter some Item", "danger");
  }
}

// define clearlist
function clearAllList() {
  editFlag = false;
  editID = "";
  submit_btn.textContent = "Add";
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  showalert("empty List", "danger");
  setbacktoDefault();
  container.classList.remove("show-container");
  localStorage.removeItem("item");
}

// setbacktodefault define
function setbacktoDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
}

// define show alert
function showalert(mass, context) {
  alert_msg.textContent = mass;
  alert_msg.classList.add(`alert-${context}`);
  setTimeout(() => {
    alert_msg.textContent = "";
    alert_msg.classList.remove(`alert-${context}`);
  }, 1500);
}

// define setLocalStroage
function setLocalStroage(id, value) {
  let items = getLocalStroage();
  const local_object = { id, value };
  items.push(local_object);
  localStorage.setItem("item", JSON.stringify(items));
}

// define getLocalStroage
function getLocalStroage() {
  return localStorage.getItem("item")
    ? JSON.parse(localStorage.getItem("item"))
    : [];
}

// get values form local stroage
window.addEventListener("DOMContentLoaded", setList);

// define setList
function setList() {
  let items = getLocalStroage();
  items.forEach((item) => {
    createListItem(item);
  });
}

// define createListItem
function createListItem(item) {
  const articel = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = item.id;
  articel.setAttributeNode(attr);
  articel.classList.add("grocery-item");
  articel.innerHTML = `<p class="title">${item.value}</p>
            <div class="btn-container">
              <button class="btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn modify-btn">
                <i class="fas fa-sync"></i>
              </button>
            </div>`;
  // appending the child element to the list
  list.appendChild(articel);
  // show the hidden container
  container.classList.add("show-container");
}

// define delete_item
function delete_item(e) {
  const element = e;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  showalert("item removed", "danger");
  setbacktoDefault();
  removeformLocalStroage(id);
}

// define modify_item
function modify_item(e) {
  const element = e;
  const id = element.dataset.id;
  editElement = e.children[0];
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = id;
  submit_btn.textContent = "Edit";
}

// define removeformLocalStroage
function removeformLocalStroage(id) {
  let items = getLocalStroage();
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("item", JSON.stringify(items));
}

// define editLocalStroage
function editLocalStroage(id, value) {
  let items = getLocalStroage();
  items = items.filter((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("item", JSON.stringify(items));
}

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    delete_item(e.target.parentElement.parentElement);
  } else if (e.target.classList.contains("modify-btn")) {
    modify_item(e.target.parentElement.parentElement);
    console.log(e.target.parentElement.parentElement);
  }
});

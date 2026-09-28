const API_URL =
  "https://crudcrud.com/api/720f8cb18f6643f8a74d56ed4de34bf4/orders";

const menu = {
  "Chicken Biryani": 200,
  "Fried Rice": 120,
  "Veg Noodles": 130,
  "Paneer Tikka": 180,
  "Burger": 150,
  "Pizza": 250,
  "French Fries": 100,
  "Cold Drink": 50
};

const itemSelect = document.getElementById("item");

Object.keys(menu).forEach(function (item) {
  itemSelect.innerHTML +=
    `<option value="${item}">${item} - ₹${menu[item]}</option>`;
});

itemSelect.addEventListener("change", function () {
  const item = itemSelect.value;
  document.getElementById("price").value =
    item ? "₹ " + menu[item] : "";
});

function getOrders() {
  axios.get(API_URL)
    .then(function (response) {
      displayOrders(response.data);
    })
    .catch(function () {
      alert("Could not load orders. Check your API URL.");
    });
}

function addOrder() {
  const table = document.getElementById("table").value;
  const item = document.getElementById("item").value;

  if (!table || !item) {
    alert("Please select table and food item");
    return;
  }

  axios.post(API_URL, {
    table: table,
    item: item,
    price: menu[item]
  })
    .then(function () {
      document.getElementById("table").value = "";
      document.getElementById("item").value = "";
      document.getElementById("price").value = "";
      getOrders();
    })
    .catch(function () {
      alert("Could not add order. Check your API URL.");
    });
}

function displayOrders(orders) {
  const tables = {
    "Table 1": document.getElementById("table1Orders"),
    "Table 2": document.getElementById("table2Orders"),
    "Table 3": document.getElementById("table3Orders")
  };

  Object.values(tables).forEach(function (table) {
    table.innerHTML = "";
  });

  orders.forEach(function (order) {
    if (tables[order.table]) {
      tables[order.table].innerHTML += `
        <div class="order-row">
          <span>${order.item}</span>
          <span class="order-price">₹${order.price}</span>
          <button onclick="deleteOrder('${order._id}')" class="delete-button">
            Delete
          </button>
        </div>
      `;
    }
  });

  Object.values(tables).forEach(function (table) {
    if (!table.innerHTML) {
      table.innerHTML = `<div class="no-orders">No orders</div>`;
    }
  });
}

function deleteOrder(id) {
  axios.delete(API_URL + "/" + id)
    .then(function () {
      getOrders();
    })
    .catch(function () {
      alert("Could not delete order. Check your API URL.");
    });
}

getOrders();
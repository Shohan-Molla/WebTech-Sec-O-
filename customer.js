/* =====================================================
   FoodieRest - customer.js
   Home, Menu, Cart, Order Success, My Orders, Profile
   ===================================================== */


/* ---------- 1. Food card er HTML ---------- */

function makeFoodCard(food, showButton) {
    let html = '<div class="food-card">';
    html += '<img src="images/' + food.image + '" alt="' + food.foodName + '">';
    html += '<div class="food-info">';
    html += '<h3>' + food.foodName + '</h3>';
    html += '<p class="desc">' + food.description + '</p>';
    html += '<div class="food-bottom">';
    html += '<span class="price">Tk ' + food.price + '</span>';
    if (showButton) {
        html += '<button type="button" class="btn btn-primary btn-small" onclick="addToCart(' + food.foodId + ')">Add to Cart</button>';
    }
    html += '</div></div></div>';
    return html;
}


/* ---------- 2. Home page: popular dishes ---------- */

function loadHomePage() {
    let menuItems = getData("menuItems");
    let html = "";
    let count = 0;
    for (let i = 0; i < menuItems.length; i++) {
        // prothom 4 ta available food
        if (menuItems[i].available && count < 4) {
            html += makeFoodCard(menuItems[i], false);
            count++;
        }
    }
    document.getElementById("popularList").innerHTML = html;
}


/* ---------- 3. Menu page ---------- */

let selectedCategory = "All";
const categories = ["All", "Burger", "Pizza", "Rice", "Chicken", "Snacks", "Drinks", "Desserts"];

function loadMenuPage() {
    checkLogin("customer");
    showUserName();
    updateCartCount();
    showCategories();
    showFoods();

    // search box e type korar sathe sathe filter
    document.getElementById("search").addEventListener("keyup", showFoods);
}

// bam pasher category button gula
function showCategories() {
    let html = "<h3>Categories</h3>";
    for (let i = 0; i < categories.length; i++) {
        let cls = "";
        if (categories[i] == selectedCategory) {
            cls = ' class="active"';
        }
        html += '<a href="#"' + cls + ' onclick="chooseCategory(\'' + categories[i] + '\'); return false;">' + categories[i] + '</a>';
    }
    document.getElementById("categoryList").innerHTML = html;
}

function chooseCategory(name) {
    selectedCategory = name;
    showCategories();
    showFoods();
}

// category ar search onujayi food dekhano
function showFoods() {
    let menuItems = getData("menuItems");
    let searchText = document.getElementById("search").value.toLowerCase();
    let html = "";
    let count = 0;

    for (let i = 0; i < menuItems.length; i++) {
        let food = menuItems[i];
        let nameMatch = food.foodName.toLowerCase().includes(searchText);
        let categoryMatch = (selectedCategory == "All" || food.category == selectedCategory);

        if (food.available && nameMatch && categoryMatch) {
            html += makeFoodCard(food, true);
            count++;
        }
    }

    if (count == 0) {
        html = '<p class="empty-text">No food found. Try another name or category.</p>';
    }

    document.getElementById("foodList").innerHTML = html;
    document.getElementById("menuTitle").innerHTML = selectedCategory + " (" + count + ")";
}

// Add to Cart button
function addToCart(foodId) {
    let cartKey = getCartKey();
    let cart = getData(cartKey);
    let found = false;

    // age theke cart e thakle shudhu quantity barao
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].foodId == foodId) {
            cart[i].qty++;
            found = true;
        }
    }
    if (!found) {
        cart.push({ foodId: foodId, qty: 1 });
    }

    saveData(cartKey, cart);
    updateCartCount();

    let food = findFood(foodId);
    showMessage("menuMessage", food.foodName + " added to cart.", false);
}

// id diye food khuje ber kora
function findFood(foodId) {
    let menuItems = getData("menuItems");
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].foodId == foodId) {
            return menuItems[i];
        }
    }
    return null;
}


/* ---------- 4. Cart page ---------- */

function loadCartPage() {
    checkLogin("customer");
    showUserName();
    showCart();
}

function showCart() {
    let cart = getData(getCartKey());
    let html = "";
    let totalItems = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        let food = findFood(cart[i].foodId);
        if (food == null) {
            continue;   // admin food delete kore dile skip
        }
        let subtotal = food.price * cart[i].qty;
        totalItems += cart[i].qty;
        totalPrice += subtotal;

        html += '<div class="cart-item">';
        html += '<img src="images/' + food.image + '" alt="' + food.foodName + '">';
        html += '<div class="item-name"><h3>' + food.foodName + '</h3><p>Tk ' + food.price + ' each</p></div>';
        html += '<div class="qty-control">';
        html += '<button type="button" onclick="changeQty(' + food.foodId + ', -1)">-</button>';
        html += '<span>' + cart[i].qty + '</span>';
        html += '<button type="button" onclick="changeQty(' + food.foodId + ', 1)">+</button>';
        html += '</div>';
        html += '<p class="subtotal">Tk ' + subtotal + '</p>';
        html += '<button type="button" class="btn btn-red btn-small" onclick="removeFromCart(' + food.foodId + ')">Remove</button>';
        html += '</div>';
    }

    if (cart.length == 0) {
        html = '<p class="empty-text">Your cart is empty. <a href="customer-menu.html">Go to menu</a></p>';
    }

    document.getElementById("cartList").innerHTML = html;
    document.getElementById("totalItems").innerHTML = totalItems;
    document.getElementById("subtotal").innerHTML = "Tk " + totalPrice;
    document.getElementById("totalPrice").innerHTML = "Tk " + totalPrice;
    updateCartCount();
}

// + dile 1 barbe, - dile 1 kombe (1 er niche jabe na)
function changeQty(foodId, change) {
    let cartKey = getCartKey();
    let cart = getData(cartKey);
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].foodId == foodId) {
            cart[i].qty = cart[i].qty + change;
            if (cart[i].qty < 1) {
                cart[i].qty = 1;
            }
        }
    }
    saveData(cartKey, cart);
    showCart();
}

function removeFromCart(foodId) {
    let cartKey = getCartKey();
    let cart = getData(cartKey);
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].foodId != foodId) {
            newCart.push(cart[i]);
        }
    }
    saveData(cartKey, newCart);
    showCart();
}

// Place Order button
function placeOrder() {
    let user = getCurrentUser();
    let cartKey = getCartKey();
    let cart = getData(cartKey);

    if (cart.length == 0) {
        alert("Your cart is empty. Add some food first.");
        return;
    }

    // cart theke order er item list banai
    let items = [];
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        let food = findFood(cart[i].foodId);
        if (food != null) {
            items.push({ foodId: food.foodId, foodName: food.foodName, price: food.price, qty: cart[i].qty });
            total += food.price * cart[i].qty;
        }
    }

    let orders = getData("orders");
    let newOrder = {
        orderId: getNextId(orders, "orderId"),
        customerId: user.userId,
        customerName: user.fullName,
        orderDate: getTodayDate(),
        orderTime: getCurrentTime(),
        items: items,
        totalPrice: total,
        status: "Pending",
        note: document.getElementById("note").value
    };
    if (newOrder.orderId < 1001) {
        newOrder.orderId = 1001;
    }

    orders.push(newOrder);
    saveData("orders", orders);
    saveData(cartKey, []);                       // cart khali
    localStorage.setItem("lastOrderId", newOrder.orderId);

    window.location.href = "order-success.html";
}


/* ---------- 5. Order success page ---------- */

function loadSuccessPage() {
    checkLogin("customer");
    showUserName();
    updateCartCount();

    let lastId = localStorage.getItem("lastOrderId");
    let orders = getData("orders");
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].orderId == lastId) {
            document.getElementById("orderInfo").innerHTML =
                "Order ID: #" + orders[i].orderId + " &nbsp;|&nbsp; Total: Tk " + orders[i].totalPrice;
        }
    }
}


/* ---------- 6. My Orders page ---------- */

function loadMyOrdersPage() {
    let user = checkLogin("customer");
    showUserName();
    updateCartCount();

    let orders = getData("orders");
    let html = "";
    let number = 1;

    // ulta dik theke loop: notun order upore
    for (let i = orders.length - 1; i >= 0; i--) {
        if (orders[i].customerId == user.userId) {
            html += "<tr>";
            html += "<td>" + number + "</td>";
            html += "<td>#" + orders[i].orderId + "</td>";
            html += "<td>" + orders[i].orderDate + "<span class='order-time'>" + orders[i].orderTime + "</span></td>";
            html += "<td>" + getItemsText(orders[i].items) + "</td>";
            html += "<td>Tk " + orders[i].totalPrice + "</td>";
            html += "<td>" + getBadge(orders[i].status) + "</td>";
            html += "</tr>";
            number++;
        }
    }

    if (html == "") {
        html = '<tr><td colspan="6" class="empty-text">No orders yet. <a href="customer-menu.html">Order now</a></td></tr>';
    }
    document.getElementById("orderRows").innerHTML = html;
}


/* ---------- 7. Profile page ---------- */

function loadProfilePage() {
    let current = checkLogin("customer");
    showUserName();
    updateCartCount();

    let user = findUser(current.userId);
    document.getElementById("profileName").innerHTML = user.fullName;
    document.getElementById("profileEmail").innerHTML = user.email;
    document.getElementById("avatarBig").innerHTML = user.fullName.slice(0, 1).toUpperCase();
    document.getElementById("fullName").value = user.fullName;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("address").value = user.address;

    // order count
    let orders = getData("orders");
    let total = 0;
    let delivered = 0;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].customerId == user.userId) {
            total++;
            if (orders[i].status == "Delivered") {
                delivered++;
            }
        }
    }
    document.getElementById("totalOrders").innerHTML = total;
    document.getElementById("deliveredOrders").innerHTML = delivered;
}

function findUser(userId) {
    let users = getData("users");
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId == userId) {
            return users[i];
        }
    }
    return null;
}

// Save Changes button
function saveProfile() {
    let current = getCurrentUser();
    let fullName = document.getElementById("fullName").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if (fullName == "" || address == "") {
        showMessage("formMessage", "Name and address cannot be empty.", true);
        return false;
    }
    if (phone.length != 11 || phone.slice(0, 2) != "01") {
        showMessage("formMessage", "Phone number must be 11 digits and start with 01.", true);
        return false;
    }

    let users = getData("users");
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId == current.userId) {
            users[i].fullName = fullName;
            users[i].phone = phone;
            users[i].address = address;
        }
    }
    saveData("users", users);

    // navbar er nam o bodlabe
    current.fullName = fullName;
    localStorage.setItem("currentUser", JSON.stringify(current));

    showMessage("formMessage", "Profile updated successfully.", false);
    loadProfilePage();
    return false;
}

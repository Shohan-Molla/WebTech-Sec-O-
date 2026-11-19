// ---------- Read Data ----------

function getData(key) {
    let text = localStorage.getItem(key);

    if (text == null) {
        return [];
    }

    return JSON.parse(text);
}


// ---------- Save Data ----------

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// ---------- Get Next ID ----------

function getNextId(list, idName) {
    let maxId = 0;

    for (let i = 0; i < list.length; i++) {
        if (list[i][idName] > maxId) {
            maxId = list[i][idName];
        }
    }

    return maxId + 1;
}


// ---------- Date ----------

function getTodayDate() {
    let months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let d = new Date();

    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}


// ---------- Time ----------

function getCurrentTime() {
    let d = new Date();

    let hour = d.getHours();
    let minute = d.getMinutes();
    let ampm = "AM";

    if (hour >= 12) {
        ampm = "PM";
    }

    if (hour > 12) {
        hour = hour - 12;
    }

    if (hour == 0) {
        hour = 12;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    return hour + ":" + minute + " " + ampm;
}


// ---------- Default Food and Customer Data ----------

function setupDefaultData() {

    // Food Menu
    if (getData("menuItems").length == 0) {

        let menuItems = [
            { foodId: 1, foodName: "Chicken Burger", category: "Burger", price: 250, image: "burger.svg", description: "Crispy chicken, cheese and lettuce", available: true },
            { foodId: 2, foodName: "Beef Cheese Burger", category: "Burger", price: 320, image: "burger.svg", description: "Double beef patty with cheddar", available: true },
            { foodId: 3, foodName: "BBQ Chicken Pizza", category: "Pizza", price: 650, image: "pizza.svg", description: "12 inch, BBQ sauce and chicken", available: true },
            { foodId: 4, foodName: "Margherita Pizza", category: "Pizza", price: 550, image: "pizza.svg", description: "12 inch, tomato and mozzarella", available: true },
            { foodId: 5, foodName: "Chicken Biryani", category: "Rice", price: 280, image: "biryani.svg", description: "Basmati rice with spicy chicken", available: true },
            { foodId: 6, foodName: "Beef Tehari", category: "Rice", price: 260, image: "biryani.svg", description: "Old Dhaka style beef tehari", available: false },
            { foodId: 7, foodName: "Fried Chicken", category: "Chicken", price: 220, image: "chicken.svg", description: "2 pieces, crispy and juicy", available: true },
            { foodId: 8, foodName: "Chicken Wings", category: "Chicken", price: 240, image: "chicken.svg", description: "6 pieces with hot sauce", available: true },
            { foodId: 9, foodName: "French Fries", category: "Snacks", price: 120, image: "fries.svg", description: "Regular box, lightly salted", available: true },
            { foodId: 10, foodName: "Cold Coffee", category: "Drinks", price: 180, image: "coffee.svg", description: "Chilled coffee with cream", available: true },
            { foodId: 11, foodName: "Lemon Mint", category: "Drinks", price: 100, image: "lemonade.svg", description: "Fresh lemon and mint juice", available: true },
            { foodId: 12, foodName: "Chocolate Cake", category: "Desserts", price: 200, image: "cake.svg", description: "One slice of rich chocolate cake", available: true }
        ];

        saveData("menuItems", menuItems);
    }


    // Demo Customer
    if (getData("users").length == 0) {

        let users = [
            {
                userId: 1,
                fullName: "Rahim Ahmed",
                email: "rahim@gmail.com",
                phone: "01712345678",
                password: "123456",
                gender: "Male",
                address: "Dhaka",
                role: "customer"
            }
        ];

        saveData("users", users);
    }


    // Empty Order List
    if (localStorage.getItem("orders") == null) {
        saveData("orders", []);
    }
}


// Run default data
setupDefaultData();


// ---------- Current User ----------

function getCurrentUser() {
    let text = localStorage.getItem("currentUser");

    if (text == null) {
        return null;
    }

    return JSON.parse(text);
}


// ---------- Check Customer Login ----------

function checkLogin(allowedRole) {
    let user = getCurrentUser();

    if (user == null || user.role != "customer") {
        alert("Please login as customer first.");
        window.location.href = "customer-login.html";
        return null;
    }

    return user;
}


// ---------- Logout ----------

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "customer-login.html";
}


// ---------- Show Customer Name ----------

function showUserName() {
    let user = getCurrentUser();

    if (user == null) {
        return;
    }

    let nameBox = document.getElementById("userName");
    let letterBox = document.getElementById("avatarLetter");

    if (nameBox != null) {
        nameBox.innerHTML = "Hello, " + user.fullName;
    }

    if (letterBox != null) {
        letterBox.innerHTML = user.fullName.slice(0, 1).toUpperCase();
    }
}


// ---------- Customer Cart ----------

function getCartKey() {
    let user = getCurrentUser();

    if (user == null) {
        return "cart_guest";
    }

    return "cart_" + user.userId;
}


// ---------- Update Cart Number ----------

function updateCartCount() {
    let countBox = document.getElementById("cartCount");

    if (countBox == null || getCurrentUser() == null) {
        return;
    }

    let cart = getData(getCartKey());
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total = total + cart[i].qty;
    }

    countBox.innerHTML = total;
}


// ---------- Order Status Badge ----------

function getBadge(status) {
    return '<span class="badge badge-' + status.toLowerCase() + '">' + status + '</span>';
}


// ---------- Order Items Text ----------

function getItemsText(items) {
    let text = "";

    for (let i = 0; i < items.length; i++) {
        text += items[i].foodName + " x" + items[i].qty;

        if (i < items.length - 1) {
            text += "<br>";
        }
    }

    return text;
}


// ---------- Show Message ----------

function showMessage(boxId, text, isError) {
    let box = document.getElementById(boxId);

    if (box == null) {
        return;
    }

    box.innerHTML = text;
    box.style.display = "block";

    if (isError) {
        box.style.backgroundColor = "#FEE2E2";
        box.style.color = "#B91C1C";
    } else {
        box.style.backgroundColor = "#DCFCE7";
        box.style.color = "#15803D";
    }
}
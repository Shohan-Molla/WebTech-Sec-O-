// ---------- Customer Registration ----------

function validateRegister(role) {
    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let address = document.getElementById("address").value;
    let agree = document.getElementById("agree").checked;

    let gender = "";
    let genderBoxes = document.getElementsByName("gender");

    for (let i = 0; i < genderBoxes.length; i++) {
        if (genderBoxes[i].checked) {
            gender = genderBoxes[i].value;
        }
    }

    let errors = [];

    if (fullName == "") {
        errors.push("Full name is required.");
    }

    if (email == "" || email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        errors.push("Enter a valid email.");
    }

    if (phone.length != 11 || phone.slice(0, 2) != "01" || isNaN(phone)) {
        errors.push("Phone number must be 11 digits and start with 01.");
    }

    if (address == "") {
        errors.push("Address is required.");
    }

    if (password.length < 6) {
        errors.push("Password must be at least 6 characters.");
    }

    if (password != confirmPassword) {
        errors.push("Passwords do not match.");
    }

    if (!agree) {
        errors.push("Please agree to the terms and conditions.");
    }

    let users = getData("users");

    for (let i = 0; i < users.length; i++) {
        if (users[i].email == email) {
            errors.push("This email is already registered.");
        }
    }

    if (errors.length > 0) {
        showMessage("formMessage", errors.join("<br>"), true);
        return false;
    }

    let newUser = {
        userId: getNextId(users, "userId"),
        fullName: fullName,
        email: email,
        phone: phone,
        password: password,
        gender: gender,
        address: address,
        role: "customer"
    };

    users.push(newUser);
    saveData("users", users);

    alert("Registration successful! Please login.");
    window.location.href = "customer-login.html";

    return false;
}


// ---------- Customer Login ----------

function validateLogin(role) {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let rememberBox = document.getElementById("remember");
    let remember = false;

    if (rememberBox != null) {
        remember = rememberBox.checked;
    }

    if (email == "" || password == "") {
        showMessage("formMessage", "Please enter email and password.", true);
        return false;
    }

    let users = getData("users");
    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (
            users[i].email == email &&
            users[i].password == password &&
            users[i].role == "customer"
        ) {
            foundUser = users[i];
            break;
        }
    }

    if (foundUser == null) {
        showMessage("formMessage", "Invalid email or password.", true);
        return false;
    }

    if (remember) {
        localStorage.setItem("rememberEmail", email);
    } else {
        localStorage.removeItem("rememberEmail");
    }

    let currentUser = {
        userId: foundUser.userId,
        fullName: foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    window.location.href = "customer-menu.html";

    return false;
}


// ---------- Remember Email ----------

function fillRememberedEmail() {
    let saved = localStorage.getItem("rememberEmail");

    if (saved != null) {
        document.getElementById("email").value = saved;

        let rememberBox = document.getElementById("remember");

        if (rememberBox != null) {
            rememberBox.checked = true;
        }
    }
}
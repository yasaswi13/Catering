document.addEventListener("DOMContentLoaded", () => {
    // Helper function to convert image to Base64
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // Registration Logic
    if (document.getElementById("register-form")) {
        document.getElementById("register-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("register-username").value;
            const password = document.getElementById("register-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const role = document.getElementById("register-role").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some((user) => user.username === username)) {
                alert("Username already exists!");
                return;
            }

            users.push({ username, password, role });
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registration successful! Please login.");
            window.location.href = "index.html";
        });
    }

    // Login Logic
    if (document.getElementById("login-form")) {
        document.getElementById("login-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(
                (user) => user.username === username && user.password === password
            );

            if (user && user.role === role) {
                localStorage.setItem("role", role);
                localStorage.setItem("username", username);
                window.location.href = role === "admin" ? "admin.html" : "user.html";
            } else {
                alert("Invalid credentials or role mismatch!");
            }
        });
    }

    // Admin: Add Product
    if (document.getElementById("product-form")) {
        document.getElementById("product-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("product-name").value;
            const price = parseFloat(document.getElementById("product-price").value);
            const description = document.getElementById("product-description").value;
            const imageFile = document.getElementById("product-image").files[0];

            if (!imageFile) {
                alert("Please upload an image!");
                return;
            }

            const imageBase64 = await toBase64(imageFile);

            let products = JSON.parse(localStorage.getItem("products")) || [];
            products.push({ name, price, description, image: imageBase64 });
            localStorage.setItem("products", JSON.stringify(products));

            alert("Product added successfully!");
            document.getElementById("product-form").reset();
            document.getElementById("image-preview").style.display = "none"; // Hide preview
        });

        // Preview uploaded image
        document.getElementById("product-image").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgPreview = document.getElementById("image-preview");
                    imgPreview.src = event.target.result;
                    imgPreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Admin: View Uploaded Products
    if (document.getElementById("admin-product-list")) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const adminProductList = document.getElementById("admin-product-list");

        if (products.length === 0) {
            adminProductList.innerHTML = "<p>No products uploaded yet.</p>";
        } else {
            products.forEach((product) => {
                const price = parseFloat(product.price); // Ensure price is numeric
                const productDiv = document.createElement("div");
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;" />
                    <p>${product.description}</p>
                    <p>Price: $${price.toFixed(2)}</p>
                `;
                adminProductList.appendChild(productDiv);
            });
        }
    }
    // Admin: View Pending Orders
    if (document.getElementById("orders-list")) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const pendingOrders = orders.filter((order) => order.status === "pending"); // Filter pending orders
        const ordersList = document.getElementById("orders-list");

        if (pendingOrders.length === 0) {
            ordersList.innerHTML = "<p>No pending orders available.</p>";
        } else {
            pendingOrders.forEach((order, index) => {
                const globalIndex = orders.findIndex(o => o.username === order.username && o.products === order.products && o.status === "pending");
                const orderDiv = document.createElement("div");
                orderDiv.innerHTML = `
                <h3>Order #${index + 1}</h3>
                <p>Username: ${order.username}</p>
                <p>Products: ${order.products
                        .map((p) => `${p.name} ($${parseFloat(p.price).toFixed(2)}) x ${p.quantity}`)
                        .join(", ")}</p>
                <button onclick="acceptOrder(${globalIndex})">Accept</button>
                <button onclick="rejectOrder(${globalIndex})">Reject</button>
            `;
                ordersList.appendChild(orderDiv);
            });
        }
    }
    // Admin: Accept Order
    window.acceptOrder = (index) => {
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders[index].status = "accepted"; // Update status to "accepted"
        localStorage.setItem("orders", JSON.stringify(orders)); // Save updated orders
        alert("Order accepted!");
        window.location.reload(); // Refresh the page
    };
    // Admin: View Accepted Orders
    if (document.getElementById("accepted-orders")) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const acceptedOrders = orders.filter((order) => order.status === "accepted"); // Filter accepted orders
        const acceptedOrdersContainer = document.getElementById("accepted-orders");

        if (acceptedOrders.length === 0) {
            acceptedOrdersContainer.innerHTML = "<p>No accepted orders found.</p>";
        } else {
            acceptedOrders.forEach((order, index) => {
                const orderDiv = document.createElement("div");
                orderDiv.innerHTML = `
                <h3>Accepted Order #${index + 1}</h3>
                <p>Username: ${order.username}</p>
                <p>Products: ${order.products
                        .map((p) => `${p.name} ($${parseFloat(p.price).toFixed(2)}) x ${p.quantity}`)
                        .join(", ")}</p>
            `;
                acceptedOrdersContainer.appendChild(orderDiv);
            });
        }
    }


    // Admin: Reject Order
    window.rejectOrder = (index) => {
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders[index].status = "rejected"; // Update status to "rejected"
        localStorage.setItem("orders", JSON.stringify(orders)); // Save updated orders
        alert("Order rejected!");
        window.location.reload(); // Refresh the page
    };
    // Admin: View Rejected Orders
    if (document.getElementById("rejected-orders")) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const rejectedOrders = orders.filter((order) => order.status === "rejected"); // Filter rejected orders
        const rejectedOrdersContainer = document.getElementById("rejected-orders");

        if (rejectedOrders.length === 0) {
            rejectedOrdersContainer.innerHTML = "<p>No rejected orders found.</p>";
        } else {
            rejectedOrders.forEach((order, index) => {
                const orderDiv = document.createElement("div");
                orderDiv.innerHTML = `
                <h3>Rejected Order #${index + 1}</h3>
                <p>Username: ${order.username}</p>
                <p>Products: ${order.products
                        .map((p) => `${p.name} ($${parseFloat(p.price).toFixed(2)}) x ${p.quantity}`)
                        .join(", ")}</p>
            `;
                rejectedOrdersContainer.appendChild(orderDiv);
            });
        }
    }





    // User: View Products
    if (document.getElementById("product-list")) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const productList = document.getElementById("product-list");

        if (products.length === 0) {
            productList.innerHTML = "<p>No products available.</p>";
        } else {
            products.forEach((product, index) => {
                const price = parseFloat(product.price); // Ensure price is numeric
                const productDiv = document.createElement("div");
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;" />
                    <p>${product.description}</p>
                    <p>Price: $${price.toFixed(2)}</p>
                    <button onclick="addToCart(${index})">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        }
    }

    // User: Add to Cart
    window.addToCart = (index) => {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const productToAdd = products[index];
        const existingProductIndex = cart.findIndex((item) => item.name === productToAdd.name);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    };

    // User: View Cart and Manage Items
    if (document.getElementById("cart")) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartContainer = document.getElementById("cart");

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartContainer.innerHTML = "";
            cart.forEach((item, index) => {
                const price = parseFloat(item.price); // Ensure price is numeric
                const cartItem = document.createElement("div");
                cartItem.innerHTML = `
                    <p>${item.name} - $${price.toFixed(2)} x ${item.quantity} = $${(price * item.quantity).toFixed(2)}</p>
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;" />
                    <div>
                        <button onclick="updateQuantity(${index}, 'increase')">+</button>
                        <button onclick="updateQuantity(${index}, 'decrease')">-</button>
                        <button onclick="removeFromCart(${index})">Remove</button>
                    </div>
                `;
                cartContainer.appendChild(cartItem);
            });
        }
    }

    // Update Quantity
    window.updateQuantity = (index, action) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (action === "increase") {
            cart[index].quantity += 1;
        } else if (action === "decrease") {
            cart[index].quantity -= 1;
            if (cart[index].quantity === 0) {
                cart.splice(index, 1);
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
    };

    // User: Place Order
    if (document.getElementById("place-order")) {
        document.getElementById("place-order").addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const username = localStorage.getItem("username");

            if (cart.length === 0) {
                alert("Your cart is empty! Please add some products before placing an order.");
                return;
            }

            let orders = JSON.parse(localStorage.getItem("orders")) || [];
            orders.push({ username, products: cart, status: "pending" }); // Add "status" to order
            localStorage.setItem("orders", JSON.stringify(orders)); // Save orders to localStorage
            localStorage.removeItem("cart"); // Clear the cart

            alert("Order placed successfully!");
            window.location.reload(); // Reload the page to refresh the cart
        });
    }

    // User: View My Orders
    if (document.getElementById("my-orders")) {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const username = localStorage.getItem("username");
        const userOrders = orders.filter((order) => order.username === username); // Filter orders by username
        const ordersContainer = document.getElementById("my-orders");

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = "<p>No orders found.</p>";
        } else {
            userOrders.forEach((order, index) => {
                const orderDiv = document.createElement("div");
                orderDiv.innerHTML = `
                <h3>Order #${index + 1}</h3>
                <p>Products: ${order.products
                        .map((p) => `${p.name} ($${parseFloat(p.price).toFixed(2)}) x ${p.quantity}`)
                        .join(", ")}</p>
            `;
                ordersContainer.appendChild(orderDiv);
            });
        }
    }




    // Remove Product from Cart
    window.removeFromCart = (index) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
    };

    // Logout
    if (document.getElementById("logout")) {
        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem("role");
            localStorage.removeItem("username");
            window.location.href = "index.html";
        });
    }
});









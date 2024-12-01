# Catering
Catering Website
Overview


A dynamic catering website that allows admins to manage products and orders, while users can browse products, manage their cart, and place orders. The project is built using HTML, CSS, and JavaScript with `localStorage` for data persistence.


Features


Admin Features
* Login/Logout: Admins can log in to access their dashboard.
* Add Products: Admins can add products with a name, price, description, and image.
* View Products: Admins can see all uploaded products.
* Manage Orders:
View pending orders.
Accept or reject orders.
* Order Status
*  Accepted orders are displayed in the "Accepted Orders" section.
*  Rejected orders are displayed in the "Rejected Orders" section.


 User Features
* Login/Logout: Users can register and log in to access the website.
* Browse Products: Users can view available products with images, descriptions, and prices.
* Cart Management:
Add products to the cart.
         Update product quantities.
Remove products from the cart.
* Place Orders: Users can place orders from their cart.
* View Orders: Users can see their order history.


  `localStorage` is used for saving user, product, and order data as firebase is not working in my laptop.


Usage Instructions


Admin
1. **Login**:
   - Use the role `Admin` during registration or login as an existing admin user.
2. **Manage Products**:
   - Go to the "Add Products" section to upload products with an image.
3. **View Orders**:
   - Navigate to the "Pending Orders" section to manage orders.
   - Accept or reject orders as necessary.
4. **View Accepted/Rejected Orders**:
   - Use the "Accepted Orders" and "Rejected Orders" sections to review processed orders.


User
1. **Register/Login**:
   - Register as a user and log in to access the website.
2. **Browse Products**:
   - View the products listed on the homepage.
3. **Add to Cart**:
   - Click the "Add to Cart" button for any product.
4. **Manage Cart**:
   - Update product quantities or remove items.
5. **Place Order**:
   - Click "Place Order" to confirm your purchase.
6. **View Orders**:
   - Navigate to the "My Orders" section to review past orders.

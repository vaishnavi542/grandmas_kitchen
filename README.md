# 🍲 Grandma's Kitchen - Django eCommerce Website

---

## 📜 Description
Grandma's Kitchen is a fully functional eCommerce web application built using **Django** for the backend and **HTML/CSS/JavaScript** for the frontend. It features a clean and responsive UI for browsing and buying delicious homemade **Pickles**, **Sweets**, and **Snacks**. Users can manage their accounts, carts, wishlist, and orders—all with real-time interactions and smooth navigation.

---

## ✨ Features Implemented

### 🏠 Home Page:
- Category navigation for Pickles, Sweets, and Snacks
- Responsive and stylish layout with hover effects

### 🔐 Authentication:
- Login & Register pages with custom styling and responsive design
- Successful registration popup message
- Forgot Password feature:
  - OTP verification via email
  - Password reset on the same page (no redirect)

### 🛍️ Products Section:
- Dynamic product listing from the database using Django models
- Filter options:
  - **Pickles**: Veg / Non-Veg / Price (Low to High)
  - **Sweets**: Sugar / No Sugar / Price (Low to High)
  - **Snacks**: Future filters supported

### 🛒 Cart Functionality:
- Add to Cart without redirection using hidden `<iframe>` (no JSON)
- Popup confirmation message after add
- Quantity update and item removal in the cart
- "Go to Cart" button styled and without underline

### ❤️ Wishlist:
- Add to wishlist using JavaScript (`fetch`)
- Stylish popup for wishlist updates
- View/manage wishlist from profile

### 🙍‍♂️ User Profile Section:
- Username dropdown after login with options:
  - Profile, Orders, Wishlist, Logout
- Sidebar layout with dynamic content display for:
  - My Orders (with reorder and help buttons)
  - Wishlist
  - Payments (placeholder)
  - Addresses (Add, Edit, Delete)
  - Settings + Change Password
- Upload/update profile picture

### 📱 Mobile App Feature Section:
- Zomato-style layout with mobile phone center and feature cards around it

### 📦 Checkout Page:
- Select saved address or add new address during checkout
- Starbucks-style layout UI with:
  - Delivery Address
  - Payment Methods: COD, PayPal, Card
  - Order Summary

### 📊 Custom Admin Dashboard:
- View total orders, revenue, top-selling products
- Clean layout for business insights

### 🔁 Reorder & ❓ Help:
- One-click reorder option in orders
- Help button placeholder for support per order

---

## 🧰 Requirements Installed

```
Python 3.8+
Django==5.1.7
Pillow==10.0.1
```

---

## ⚙️ Setup Instructions

```bash
# Step 1: Clone or download the repo
$ cd grandmas_kitchen

# Step 2: (Optional but recommended) Create a virtual environment
$ python -m venv myenv
$ myenv\Scripts\activate      # On Windows

# Step 3: Install dependencies
$ pip install -r requirements.txt
# OR manually
$ pip install django pillow

# Step 4: Apply migrations
$ python manage.py makemigrations
$ python manage.py migrate

# Step 5: Create superuser for admin access
$ python manage.py createsuperuser

# Step 6: Run the development server
$ python manage.py runserver

# Step 7: Open your browser
http://127.0.0.1:8000/
```

---

## 🗂️ Project Structure

```
grandmas_kitchen/
│
├── app1/                        # Main Django App
│   ├── models.py                # Product, Order, Wishlist, OTP, etc.
│   ├── views.py                 # All views and logic
│   ├── urls.py                  # URL routing for app1
│
├── grandmas_kitchen/
│   ├── settings.py              # Project settings
│   ├── urls.py                  # Main URL config
│   └── asgi.py / wsgi.py        # Deployment entry points
│   ├── templates/               # All HTML templates
│   └── static/                  # All static assets (CSS, JS, images)
├── manage.py                    # Django management tool
└── requirements.txt             # Installed packages
```

---

## 🛡️ Security Features

- ✅ OTP verification for password reset via email
- ✅ CSRF protection on all forms
- ✅ Input validation and form handling
- ✅ Session-based user authentication

---

## 🚀 Deployment Notes

For deploying to production:

- Set `DEBUG = False` in `settings.py`
- Use a strong `SECRET_KEY` and configure `ALLOWED_HOSTS`
- Serve static files with:
  ```bash
  python manage.py collectstatic
  ```
- Recommended stack: Gunicorn + Nginx or any WSGI-compatible server
- Use HTTPS and secure database credentials

---

## 🧪 Testing (Optional)

To run basic Django tests:

```bash
python manage.py test
```

You can add custom test cases inside `app1/tests.py`

---

## 🛠️ Customization Tips

- To add new product categories: Extend the Product model and views
- To integrate payment gateways: Add Razorpay/Stripe JS and backend API
- To restyle the UI: Edit the CSS files inside `/static/css/`

---

## 🧑‍💻 Credits

**Developed By:** BILLAKANTI VAMSHI  
📧 Email: [vamshibillakanti11@gmail.com](mailto:vamshibillakanti11@gmail.com)  
🌐 Project: Grandma's Kitchen  
⚙️ Framework: Django  
🎨 Frontend: HTML, CSS, JavaScript  
🧠 Backend: Python (Django)

---

> 💖 Thank you for visiting Grandma’s Kitchen — Where Every Byte Tastes Like Home!


from django.shortcuts import render, redirect, get_object_or_404
from .forms import Regform, LoginForm,AddressForm
from django.contrib.auth import login as auth_login, authenticate, logout,update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Product,Order, OrderItem,Wishlist,Address,Profile
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from .utils import send_order_confirmation_email
from django.db.models import Q
from .models import Profile  # Make sure this import is at the top

def register(request):
    if request.method == 'POST':
        form = Regform(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()  # Save the user
            Profile.objects.create(user=user)  # ✅ Create profile for the user
            return redirect('app1:login')  # Redirect to login
        else:
            return render(request, 'reg.html', {'form': form})
    else:
        form = Regform()  # Initialize the form for GET requests
    return render(request, 'reg.html', {'form': form})
# Login View
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)  # Assuming LoginForm is a custom form for login
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)  # Use auth_login to log the user in
                return redirect('app1:home1')
            else:
                return render(request, 'login.html', {'form': form, 'error': 'Invalid username or password.'})  # Add a custom error message
    else:
        form = LoginForm()  # Initialize the login form for GET requests
    return render(request, 'login.html', {'form': form})


# Home View (requires login)
# @login_required(login_url='app1:login')
# def home(request):
#     data = request.user
#     return render(request, 'home.html', {'data': data})

# Logout View
def logout_view(request):
    logout(request)
    messages.success(request, "You have successfully logged out.")
    return redirect('app1:home1')

def home_view(request):
    return render(request, 'home1.html')

# Import the Product model
def pickles(request):
    pickles = Product.objects.filter(category="Pickles")
    filter_type = request.GET.get("filter")

    if filter_type == "veg":
        pickles = pickles.filter(pickle_type="veg")
    elif filter_type == "nonveg":
        pickles = pickles.filter(pickle_type="nonveg")
    elif filter_type == "lowtohigh":
        pickles = pickles.order_by("price")

    # ✅ Extract product IDs from session cart
    cart = request.session.get("cart", {})
    cart_product_ids = [int(pid) for pid in cart.keys()]

    # ✅ Include the source info for back navigation
    return render(request, "pickles.html", {
        "products": pickles,
        "cart_product_ids": cart_product_ids,
        "source": "pickles",  # for dynamic back button in cart
    })

def sweets(request):
    sweets = Product.objects.filter(category="Sweets")
    filter_type = request.GET.get("filter")

    if filter_type == "sugar":
        sweets = sweets.filter(sweet_type="Sugar")
    elif filter_type == "nosugar":
        sweets = sweets.filter(sweet_type="No-Sugar")
    elif filter_type == "lowtohigh":
        sweets = sweets.order_by("price")

    # ✅ Get cart product IDs from session
    cart = request.session.get("cart", {})
    cart_product_ids = [int(pid) for pid in cart.keys()]

    return render(request, "sweets.html", {
        "products": sweets,
        "cart_product_ids": cart_product_ids,
        "source": "sweets",  # used to send where the user came from
    })



def snacks(request):
    snacks = Product.objects.filter(category="Snacks")

    # ✅ Get cart product IDs from session
    cart = request.session.get("cart", {})
    cart_product_ids = [int(pid) for pid in cart.keys()]

    return render(request, "snacks.html", {
        "products": snacks,
        "cart_product_ids": cart_product_ids,
        "source": "snacks",  # used to track where user came from
    })


# Cart View - Displays items in the cart
from django.urls import reverse

def cart(request):
    cart = request.session.get('cart', {})
    cart_items = []
    total_price = 0

    for product_id, item in cart.items():
        product = get_object_or_404(Product, id=product_id)
        subtotal = product.price * item['quantity']
        total_price += subtotal
        cart_items.append({
            'product': product,
            'quantity': item['quantity'],
            'subtotal': subtotal
        })

    # ✅ Handle the back source for navigation
    source = request.GET.get("source")
    if source:
        request.session["cart_back_source"] = source  # Save source in session

    # Determine the URL to go back
    back_source = request.session.get("cart_back_source", "")
    back_url = ""
    if back_source == "pickles":
        back_url = reverse("app1:pickles")
    elif back_source == "sweets":
        back_url = reverse("app1:sweets")
    elif back_source == "snacks":
        back_url = reverse("app1:snacks")

    return render(request, "cart.html", {
        "cart_items": cart_items,
        "total_price": total_price,
        "back_url": back_url,
    })


# Add to Cart View


def add_to_cart(request, product_id):
    cart = request.session.get('cart', {})

    if str(product_id) in cart:
        cart[str(product_id)]['quantity'] += 1
    else:
        product = get_object_or_404(Product, id=product_id)
        cart[str(product_id)] = {'quantity': 1}

    request.session['cart'] = cart  # Save cart to session

    # Return a JSON response for AJAX requests (as expected by your js code)
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({'success': True})
    else:
        return redirect('app1:cart') #Handle non-AJAX requests if needed.

# Update Cart Quantity View
def update_cart(request, product_id):
    if request.method == "POST":
        action = request.POST.get('action')
        cart = request.session.get('cart', {})

        product_id_str = str(product_id)
        if product_id_str in cart:
            current_qty = cart[product_id_str]['quantity']

            if action == "increase":
                cart[product_id_str]['quantity'] = current_qty + 1
            elif action == "decrease" and current_qty > 1:
                cart[product_id_str]['quantity'] = current_qty - 1

        request.session['cart'] = cart

    return redirect('app1:cart')

# Remove from Cart View
def remove_from_cart(request, product_id):
    cart = request.session.get('cart', {})

    if str(product_id) in cart:
        del cart[str(product_id)]

    request.session['cart'] = cart
    return redirect('app1:cart')

#  checkout view

# Import OrderItem

@login_required
@csrf_exempt  # ⚠️ Remove if you're using {% csrf_token %} in the form
def checkout(request):
    cart = request.session.get('cart', {})
    cart_items = []
    total_price = 0

    for product_id, item in cart.items():
        try:
            product = Product.objects.get(id=product_id)
            subtotal = product.price * item['quantity']
            total_price += subtotal
            cart_items.append({
                'product': product,
                'quantity': item['quantity'],
                'subtotal': subtotal
            })
        except Product.DoesNotExist:
            return JsonResponse({"success": False, "message": "Product not found."})

    addresses = Address.objects.filter(user=request.user)

    if request.method == "POST":
        selected_address_str = None
        phone = None

        # Check if user added a new address
        if request.POST.get("full_name") and request.POST.get("street"):
            # Get new address details from POST
            full_name = request.POST.get("full_name")
            street = request.POST.get("street")
            city = request.POST.get("city")
            state = request.POST.get("state")
            postal_code = request.POST.get("postal_code")
            country = request.POST.get("country")
            phone = request.POST.get("phone")

            # Create new address
            new_address = Address.objects.create(
                user=request.user,
                full_name=full_name,
                street=street,
                city=city,
                state=state,
                postal_code=postal_code,
                country=country,
                phone=phone
            )

            selected_address_str = f"{full_name}, {street}, {city}, {state} - {postal_code}, {country}"
        else:
            # Use saved address
            address_id = request.POST.get("selected_address")
            try:
                selected_address = Address.objects.get(id=address_id, user=request.user)
                selected_address_str = f"{selected_address.full_name}, {selected_address.street}, {selected_address.city}, {selected_address.state} - {selected_address.postal_code}, {selected_address.country}"
                phone = selected_address.phone
            except Address.DoesNotExist:
                return JsonResponse({"success": False, "message": "Selected address not found."})

        payment_method = request.POST.get("payment_method")

        if not selected_address_str or not payment_method:
            return JsonResponse({"success": False, "message": "Address or payment method missing."})

        try:
            # Create the order
            order = Order.objects.create(
                user=request.user,
                total_price=total_price,
                address=selected_address_str,
                phone=phone if phone else request.user.profile.phone,
                payment_method=payment_method,
                status="Pending"
            )

            # Add items to the order
            for product_id, item in cart.items():
                product = Product.objects.get(id=product_id)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    price=product.price * item['quantity']
                )
            # Send confirmation email to the user
            send_order_confirmation_email(request.user, order)
            request.session["cart"] = {}
            return redirect('app1:order_confirmation', order_id=order.id)

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)})

    return render(request, "checkout.html", {
        "cart_items": cart_items,
        "total_price": total_price,
        "addresses": addresses
    })

def order_confirmation(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    order_items = OrderItem.objects.filter(order=order)  # Fetch items for the order

    return render(request, "order_confirmation.html", {
        "order": order,
        "order_items": order_items  # Pass order items to the template
    })

# successful confirmation
# def order_success(request):
#     return render(request, 'order_success.html')

@login_required
def order_history(request):
    # Get only the orders of the currently logged-in user
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, "order_history.html", {"orders": orders})



# wishlist views.
@login_required
def wishlist(request):
    """Display the wishlist for the logged-in user."""
    wishlist_items = Wishlist.objects.filter(user=request.user)
    return render(request, "wishlist.html", {"wishlist_items": wishlist_items})

@login_required
def add_to_wishlist(request, product_id):
    """Add a product to the wishlist."""
    product = get_object_or_404(Product, id=product_id)

    # Check if product is already in wishlist
    if Wishlist.objects.filter(user=request.user, product=product).exists():
        return JsonResponse({"success": False, "message": "Product already in wishlist!"})

    Wishlist.objects.create(user=request.user, product=product)
    return JsonResponse({"success": True, "message": "Added to wishlist!"})

@login_required
def remove_from_wishlist(request, product_id):
    """Remove a product from the wishlist."""
    product = get_object_or_404(Product, id=product_id)
    Wishlist.objects.filter(user=request.user, product=product).delete()
    return JsonResponse({"success": True, "message": "Removed from wishlist!"})


# profile view
@login_required
def profile(request):
    orders = Order.objects.filter(user=request.user)
    wishlist = Wishlist.objects.filter(user=request.user)
    addresses = Address.objects.filter(user=request.user)
    address_form = AddressForm()

    context = {
        'orders': orders,
        'wishlist': wishlist,
        'addresses': addresses,
        'address_form': address_form,
    }
    return render(request, 'profile.html', context)

@login_required
def edit_profile(request):
    user = request.user

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        confirm_new_password = request.POST.get('confirm_new_password')

        user.username = username
        user.email = email

        if new_password or confirm_new_password:
            if not user.check_password(current_password):
                messages.error(request, "Current password is incorrect.")
                return redirect('app1:profile')

            if new_password != confirm_new_password:
                messages.error(request, "New passwords do not match.")
                return redirect('app1:profile')

            user.set_password(new_password)
            update_session_auth_hash(request, user)  # Keep user logged in
            # messages.success(request, "Password updated successfully.")  # ✅ Success message here

        user.save()
        messages.success(request, "Profile updated successfully.")  # ✅ Also shows profile update success

        return redirect('app1:profile')

    return render(request, 'profile.html')


# address views
@login_required
def add_address(request):
    if request.method == 'POST':
        form = AddressForm(request.POST)
        if form.is_valid():
            address = form.save(commit=False)
            address.user = request.user
            address.save()
            return redirect('app1:profile')
    else:
        form = AddressForm()
    return render(request, 'address_form.html', {'form': form})


@login_required
def edit_address(request, address_id):
    address = get_object_or_404(Address, id=address_id, user=request.user)
    if request.method == 'POST':
        form = AddressForm(request.POST, instance=address)
        if form.is_valid():
            form.save()
            return redirect('app1:profile')
    else:
        form = AddressForm(instance=address)
    return render(request, 'address_form.html', {'form': form, 'address': address})

@login_required
def delete_address(request, pk):
    address = get_object_or_404(Address, pk=pk, user=request.user)
    if request.method == 'POST':
        address.delete()
        return redirect('app1:profile')  # Make sure this name matches your profile URL name
    return redirect('app1:profile')


# search functionality for products
# views.py

def search_products(request):
    query = request.GET.get('q')
    results = []

    if query:
        results = Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__icontains=query)
        ).distinct()

    # If you’re using cart logic, you might want to pass cart_product_ids
    cart_product_ids = []  # or fetch from session/database if needed

    return render(request, 'search_results.html', {
        'query': query,
        'products': results,  # not "results" to match your HTML template
        'cart_product_ids': cart_product_ids,
    })

# Search products
def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'product_detail.html', {'product': product})

# upload image 
@login_required
def update_profile_photo(request):
    if request.method == 'POST' and request.FILES.get('profile_image'):
        profile = Profile.objects.get(user=request.user)
        profile.profile_image = request.FILES['profile_image']
        profile.save()
    return redirect('app1:profile')  # redirect to profile page


# reorder views
from decimal import Decimal
@login_required
def reorder(request, order_id):
    old_order = get_object_or_404(Order, id=order_id, user=request.user)
    cart = request.session.get('cart', {})

    for item in old_order.items.all():
        product_id = str(item.product.id)

        # If already in cart, increase quantity
        if product_id in cart:
            cart[product_id]['quantity'] += item.quantity
        else:
            cart[product_id] = {
                'quantity': item.quantity
            }

    request.session['cart'] = cart  # Save updated cart
    request.session.modified = True  # Mark session as modified

    return redirect('app1:cart')  # or wherever your cart URL name is

# help
from .forms import HelpRequestForm
from django.contrib import messages

@login_required
def help_request(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)

    if request.method == 'POST':
        form = HelpRequestForm(request.POST)
        if form.is_valid():
            help_request = form.save(commit=False)
            help_request.user = request.user
            help_request.order = order
            help_request.save()
            messages.success(request, "Your help request has been submitted.")
            return redirect('/profile/?tab=orders')  # or your profile orders section
    else:
        form = HelpRequestForm()

    return render(request, 'help_request.html', {'form': form, 'order': order})




# otp
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import PasswordResetOTP
import random

User = get_user_model()

def forgot_password_view(request):
    context = {}
    
    if request.method == "POST":
        action = request.POST.get("action")

        # Step 1: Send OTP
        if action == "send_otp":
            identifier = request.POST.get("identifier")
            try:
                user = User.objects.get(username=identifier)
            except User.DoesNotExist:
                try:
                    user = User.objects.get(email=identifier)
                except User.DoesNotExist:
                    context["error"] = "User not found."
                    return render(request, "forgot_password.html", context)

            # Generate OTP
            otp_code = str(random.randint(100000, 999999))
            PasswordResetOTP.objects.create(user=user, otp_code=otp_code)

            # Send OTP via email
            send_mail(
                subject="Your OTP Code",
                message=f"Your OTP code is: {otp_code}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            context["step"] = "otp_sent"
            context["identifier"] = identifier
            return render(request, "forgot_password.html", context)

        # Step 2: Verify OTP
        elif action == "verify_otp":
            identifier = request.POST.get("identifier")
            otp = request.POST.get("otp")
            try:
                user = User.objects.get(username=identifier)
            except User.DoesNotExist:
                user = User.objects.get(email=identifier)

            otp_entry = PasswordResetOTP.objects.filter(user=user, otp_code=otp, is_verified=False).order_by("-created_at").first()
            if otp_entry and timezone.now() - otp_entry.created_at < timezone.timedelta(minutes=10):
                otp_entry.is_verified = True
                otp_entry.save()
                context["step"] = "otp_verified"
                context["identifier"] = identifier
            else:
                context["step"] = "otp_sent"
                context["identifier"] = identifier
                context["error"] = "Invalid or expired OTP."
            return render(request, "forgot_password.html", context)

        # Step 3: Set New Password
        elif action == "reset_password":
            identifier = request.POST.get("identifier")
            new_password = request.POST.get("new_password")
            confirm_password = request.POST.get("confirm_password")

            if new_password != confirm_password:
                context["step"] = "otp_verified"
                context["identifier"] = identifier
                context["error"] = "Passwords do not match."
                return render(request, "forgot_password.html", context)

            try:
                user = User.objects.get(username=identifier)
            except User.DoesNotExist:
                user = User.objects.get(email=identifier)

            user.password = make_password(new_password)
            user.save()
            context["success"] = "Password reset successful. You can now log in."
            return redirect('app1:login')

    return render(request, "forgot_password.html", context)

# about profile
def about_view(request):
    return render(request, 'about.html')
def contactus(request):
    return render(request, 'contactus.html')



# viewmore

# def category_preview(request):
#     pickles = Product.objects.filter(category="Pickles")[:4]
#     sweets = Product.objects.filter(category="Sweets")[:4]
#     snacks = Product.objects.filter(category="Snacks")[:4]

#     cart = request.session.get("cart", {})
#     cart_product_ids = [int(pid) for pid in cart.keys()]

#     return render(request, "preview.html", {
#         "pickles": pickles,
#         "sweets": sweets,
#         "snacks": snacks,
#         "cart_product_ids": cart_product_ids,
#     })

def view_more(request):
    pickles = Product.objects.filter(category="Pickles")[:4]
    snacks = Product.objects.filter(category="Snacks")[:4]
    sweets = Product.objects.filter(category="Sweets")[:4]

    cart = request.session.get("cart", {})
    cart_product_ids = [int(pid) for pid in cart.keys()]

    return render(request, "ex.html", {
        "pickles": pickles,
        "snacks": snacks,
        "sweets": sweets,
        "cart_product_ids": cart_product_ids,
        "source": "ex",
    })
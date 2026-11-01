
/* =====================================
   ذخیره سفارش‌ها در مرورگر
   ===================================== */

const orderForm = document.getElementById("orderForm");
const orderResult = document.getElementById("orderResult");

const STORAGE_KEY = "nazBakeryOrders";

// خواندن سفارش‌های ذخیره‌شده
function getSavedOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("خطا در خواندن سفارش‌ها:", error);
        return [];
    }
}

// هنگام ثبت فرم
orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
    }

    const formData = new FormData(orderForm);

    // دریافت مشخصات مشتری
    const order = {
        id: Date.now().toString(),
        name: String(formData.get("customerName") || "").trim(),
        phone: String(formData.get("customerPhone") || "").trim(),
        product: String(formData.get("productType") || ""),
        quantity: Number(formData.get("quantity") || 1),
        deliveryDate: String(formData.get("deliveryDate") || ""),
        address: String(formData.get("orderAddress") || "").trim(),
        details: String(formData.get("orderDetails") || "").trim(),
        createdAt: new Date().toLocaleString("fa-IR"),
        status: "جدید"
    };

    if (!order.name || !order.phone || !order.product) {
        alert("لطفاً نام، شماره تماس و محصول را وارد کنید.");
        return;
    }

    if (!Number.isInteger(order.quantity) || order.quantity < 1) {
        alert("تعداد سفارش باید حداقل ۱ باشد.");
        return;
    }

    // بررسی تاریخ تحویل
    if (order.deliveryDate && order.deliveryDate < localToday) {
        alert("تاریخ تحویل نمی‌تواند در گذشته باشد.");
        return;
    }

    try {
        // دریافت سفارش‌های قبلی
        const orders = getSavedOrders();

        // افزودن سفارش جدید به فهرست
        orders.push(order);

        // ذخیره تمام سفارش‌ها
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(orders)
        );

        // بررسی ذخیره موفق
        const savedOrders = getSavedOrders();
        const isSaved = savedOrders.some(
            item => item.id === order.id
        );

        if (!isSaved) {
            throw new Error("سفارش ذخیره نشد.");
        }

        // نمایش نتیجه به مشتری
        orderResult.replaceChildren();

        const heading = document.createElement("h4");
        heading.textContent = "✓ سفارش شما ذخیره شد!";

        const message = document.createElement("p");
        message.textContent =
            "شماره سفارش: " + order.id;

        const customer = document.createElement("p");
        customer.textContent =
            "نام مشتری: " + order.name;

        const product = document.createElement("p");
        product.textContent =
            "محصول: " + order.product;

        const phone = document.createElement("p");
        phone.textContent =
            "شماره تماس: " + order.phone;

        const date = document.createElement("p");
        date.textContent =
            "زمان ثبت: " + order.createdAt;

        const note = document.createElement("p");
        note.textContent =
            "این سفارش در همین مرورگر ذخیره شده است و هنوز برای فروشگاه ارسال نشده است.";

        orderResult.append(
            heading,
            message,
            customer,
            product,
            phone,
            date,
            note
        );

        orderResult.hidden = false;

        // پاک کردن فرم پس از ذخیره موفق
        orderForm.reset();

        // به‌روزرسانی تاریخ مجاز پس از پاک شدن فرم
        deliveryDate.min = localToday;

        orderResult.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    } catch (error) {
        console.error("خطا در ذخیره سفارش:", error);

        alert(
            "سفارش ذخیره نشد. لطفاً فضای ذخیره‌سازی مرورگر را بررسی کنید."
        );
    }
});


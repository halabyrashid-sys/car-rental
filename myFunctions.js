
$(document).ready(function () {

    
    $(".detailsButton").click(function () {
        $(this).next(".carDetails").toggle();
    });


  
    $("#continueButton").click(function () {

        if ($("input[name='car']:checked").length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
            return;
        }

        $("#bookingSection").show();
    });


    
    $("#bookingForm").submit(function (event) {

        event.preventDefault();

      
        var fullName = $("#fullName").val().trim();
        var nationalId = $("#nationalId").val().trim();
        var phone = $("#phone").val().trim();
        var email = $("#email").val().trim();
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();


        if (!/^[0-9]{11}$/.test(nationalId)) {
            alert("يجب أن يتكون الرقم الوطني من 11 رقمًا.");
            return;
        }

        var governorateCode = parseInt(
            nationalId.substring(0, 2), 10
        );

        if (governorateCode < 1 || governorateCode > 14) {
            alert("يجب أن يبدأ الرقم الوطني برمز محافظة من 01 إلى 14.");
            return;
        }


      
        if (startDate === "" || endDate === "") {
            alert("يرجى إدخال تاريخ الاستلام وتاريخ التسليم.");
            return;
        }

        if (endDate <= startDate) {
            alert("يجب أن يكون تاريخ التسليم بعد تاريخ الاستلام.");
            return;
        }


    
        if (fullName !== "" &&
            !/^[\u0621-\u064A\s]+$/.test(fullName)) {

            alert("يرجى كتابة الاسم بالأحرف العربية فقط.");
            return;
        }


       
        if (phone !== "" && !/^09[0-9]{8}$/.test(phone)) {
            alert("يرجى إدخال رقم موبايل سوري مؤلف من 10 أرقام ويبدأ بـ 09.");
            return;
        }


    
        if (email !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            alert("يرجى إدخال بريد إلكتروني صحيح.");
            return;
        }


      
        var start = new Date(startDate + "T00:00:00Z");
        var end = new Date(endDate + "T00:00:00Z");

        var millisecondsPerDay = 24 * 60 * 60 * 1000;

        var rentalDays = Math.round(
            (end.getTime() - start.getTime()) / millisecondsPerDay
        );

        if (rentalDays <= 0) {
            alert("مدة الإيجار غير صحيحة.");
            return;
        }


        function escapeHtml(value) {
            return $("<div>").text(value).html();
        }


        
        var total = 0;

        var invoice = "<h3>فاتورة الحجز</h3>";

        invoice += "<p>الاسم: " +
            escapeHtml(fullName || "غير محدد") + "</p>";

        invoice += "<p>الرقم الوطني: " +
            escapeHtml(nationalId) + "</p>";

        invoice += "<p>تاريخ الاستلام: " +
            escapeHtml(startDate) + "</p>";

        invoice += "<p>تاريخ التسليم: " +
            escapeHtml(endDate) + "</p>";

        invoice += "<p>مدة الإيجار: " +
            rentalDays + " يومًا</p>";

        invoice += "<table border='1'>";
        invoice += "<tr>";
        invoice += "<th>رمز السيارة</th>";
        invoice += "<th>الموديل</th>";
        invoice += "<th>السعر اليومي</th>";
        invoice += "<th>عدد الأيام</th>";
        invoice += "<th>التكلفة</th>";
        invoice += "</tr>";


        
        $("input[name='car']:checked").each(function () {

            var row = $(this).closest("tr");
            var cells = row.find("td");

         

            var carCode = cells.eq(2).text().trim();
            var carModel = cells.eq(3).text().trim();
            var priceText = cells.eq(5).text();

           
            var dailyPrice = parseInt(
                priceText.replace(/[^0-9]/g, ""),
                10
            );

           
            if (isNaN(dailyPrice) || dailyPrice <= 0) {
                alert("تعذر قراءة سعر السيارة: " + carCode);
                total = NaN;
                return false;
            }

           
            var carTotal = dailyPrice * rentalDays;

            total += carTotal;

            invoice += "<tr>";
            invoice += "<td>" + escapeHtml(carCode) + "</td>";
            invoice += "<td>" + escapeHtml(carModel) + "</td>";
            invoice += "<td>" + dailyPrice.toLocaleString("en-US") +
                " ل.س</td>";
            invoice += "<td>" + rentalDays + "</td>";
            invoice += "<td>" + carTotal.toLocaleString("en-US") +
                " ل.س</td>";
            invoice += "</tr>";

        });


       
        if (!isFinite(total) || total <= 0) {
            alert("تعذر حساب المجموع. تحقق من ترتيب أعمدة جدول السيارات.");
            return;
        }


        invoice += "</table>";


        
        var discount = 0;

        if (rentalDays > 10) {
            discount = total * 0.05;
        }

        var finalTotal = total - discount;


        
        invoice += "<p>المجموع قبل الخصم: " +
            total.toLocaleString("en-US") + " ل.س</p>";

        invoice += "<p>الخصم: " +
            discount.toLocaleString("en-US") + " ل.س</p>";

        invoice += "<h3>المبلغ النهائي: " +
            finalTotal.toLocaleString("en-US") + " ل.س</h3>";

        if (rentalDays > 10) {
            invoice += "<p>تم تطبيق خصم 5% لأن مدة الإيجار تجاوزت 10 أيام.</p>";
        } else {
            invoice += "<p>لا يوجد خصم لأن مدة الإيجار لا تتجاوز 10 أيام.</p>";
        }


      
        $("#bookingResult").html(invoice);

        alert("تم التحقق من البيانات وحساب تكلفة الحجز بنجاح.");

    });

});

import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import { getResetPasswordTemplate } from '../utils/emailTemplates.js';
import ErrorHandler from '../utils/errorHandler.js';

//Dodaj nowe zamowienie /api/orders/new

export const newOrder = catchAsyncErrors(async (req,res,next) => {
    const {
        orderItems,
        shippingInfo,
        shippingPrice,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        itemsPrice,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        shippingPrice,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        itemsPrice,
        user: req.user._id,
    });

    res.status(200).json({
        order,
    })
});


//Pobierz aktualne zamowienia uzytkownika /api/me/orders

export const myOrders = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.find({user: req.user._id});

    res.status(200).json({
        order,
    });
});


//Pobierz szczegoly zamowienia /api/orders/:id

export const getOrderDetails = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next (new ErrorHandler('Nie znaleziono zamówienia z takim ID', 404))
    }
    res.status(200).json({
        order,
    });
});


//Pobierz wszystkie zamowienia -ADMIN /api/admin/orders

export const allOrders = catchAsyncErrors(async (req,res,next) => {
    const orders = await Order.find();

    res.status(200).json({
        orders,
    });
});

//Aktualizuj  zamowienie -ADMIN /api/admin/orders/:id

export const updateOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Nie ma zamówienia o podanym ID", 404));
    }
    if(!order?.orderStatus === "Wysłane"){
        return next(new ErrorHandler("Już wysłano to zamówienie ", 400));
    }

    let productNotFound = false
    //aktualizuj bazę produktów
    for (const item of order.orderItems) {
        const product = await Product.findById(item?.product?.toString());
        if(!product){
            productNotFound =true;
            break
        }
        product.stock = product.stock - item.quantity;
        await product.save({validateBeforeSave: false});
    };
    if(productNotFound){
        return next(new ErrorHandler("Nie ma produktu o podanym ID", 404));
    }

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success:true,
    });
});

//Usuń  zamowienie /api/admin/orders/:id

export const deleteOrder = catchAsyncErrors(async (req,res,next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next (new ErrorHandler('Nie znaleziono zamówienia z takim ID', 404))
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
    });
});

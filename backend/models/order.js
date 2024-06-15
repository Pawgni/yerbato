import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
        },
    ],
    paymentMethod: {
        type: String,
        required: [true, "Wybierz rodzaj płatności"],
        enum: {
            values: ['Gotówka', 'Karta'],
            message: "Wybierz: Gotówka lub Karta"
        },
    },
    paymentInfo: {
        id: String,
        status: String,
    },
    itemsPrice: {
        type: Number,
        required: true,
    },
    shippingAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: {
            values: ['Przetwarzanie', 'Wysłane', 'Dostarczone'],
            message: "Wybierz status zamówienia"
        },
        required: true,
        default: "Przetwarzanie",
    },
    deliveredAt: Date
}, {timestamps: true} 
);


export default mongoose.model("Order", orderSchema);
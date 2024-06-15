import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Wprowadź nazwę produktu'],
        maxLength: [50, 'Nazwa produktu nie może przekroczyć 50 znaków']
    },
    price: {
        type: Number,
        required: [true, 'Wprowadź cenę produktu'],
        maxLength: [5, 'Cena nie może zawierać więcej niż 5 cyfr']
    },
    description: {
        type: String,
        required: [true, 'Wprowadź opis produktu'],
        maxLength: [200, 'Opis produktu nie może przekroczyć 200 znaków']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
               type: String,
                required: true,
            },
        },
    ],
    category: {
        type: [String], 
        required: [true, "Wprowadź kategorię produktu"],
        enum: {
            values: [ 
                "Argentyńska",
                "Brazylijska",
                "Paragwajska",
                "Urugwajska",
            ],
            message: "Wybierz poprawną kategorie",
        },
    },
    stock: {
        type: Number,
        required: [true, "Podaj ilość produktu w magazynie"],
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
   },
   { timestamps: true}
);

export default mongoose.model("Product", productSchema);
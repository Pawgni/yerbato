import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import {upload_file} from "../utils/cloudinary.js";
//Stwórz nowy produkt => /api/produkty
export const getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 4;
    const apiFilters= new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount= products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    });
});

//Stwórz nowy produkt => /api/admin/produkty
export const newProduct = catchAsyncErrors (async (req, res) => {

   req.body.user = req.user._id;
    
    const product = await Product.create(req.body)

    res.status(200).json({
        product,
    });
});

// Pobierz jeden produkt => /api/produkty/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    
    const product = await Product.findById(req?.params?.id).populate("reviews.user")

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    res.status(200).json({
        product,
    });
});

// Pobierz  produkty ADMIN => /api/admin/produkty
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    
    const products = await Product.find();

    res.status(200).json({
        products,
    });
});

// Edytuj jeden produkt => /api/produkty/:id
export const updateProduct = catchAsyncErrors(async (req, res,next) => {
    
    let product = await Product.findById(req?.params?.id)

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new: true})

    res.status(200).json({
        product,
    });
});
// Dodaj obrazek => /api/admin/produkty/:id/upload_images
export const uploadProductImages = catchAsyncErrors(async (req, res,next) => {
    
    let product = await Product.findById(req?.params?.id)

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    const uploader = async (image) => upload_file(image, "products");
    const urls = await Promise.all((req?.body?.images).map(uploader));

    product?.images.push(...urls)

    await product?.save();

    res.status(200).json({
        product,
    });
});

// Usuń jeden produkt => /api/produkty/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    
    const product = await Product.findById(req?.params?.id)

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    //usuwanie zdjęcia
    for(let i=0; i<product?.images?.length; i++) {
        await delete_file(product?.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        message: "Produkt usunięty",
    });
});

// Stwórz/aktualizuj ocenę produktu => /api/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {

    const {rating, comment, productId} = req.body

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };
    
    const product = await Product.findById(productId);

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString()===req?.user?._id.toString()
    );

        if(isReviewed) {

            product.reviews.forEach((review) => {
                if(review?.user?.toString() === req?.user?._id.toString()) {
                    review.comment = comment;
                    review.rating = rating;
                }
            });

        } else {
            product.reviews.push(review)
            product.numberOfReviews = product.reviews.length;
        }

        product.ratings = product.reviews.reduce((acc,item) => item.rating + acc, 0) / product.reviews.length;

        await product.save({validateBeforeSave: false}); 

    res.status(200).json({
        success: true,
    });
});

// Pobierz opinie produktu => /api/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user")

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    res.status(200).json({
       reviews: product.reviews, 
    });
});


// usuń ocenę produktu => /api/admin/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.query.productId);

    if(!product)
    {
        return next(new ErrorHandler("Nie odnaleziono produktu", 404));
    }

    const reviews = product?.reviews?.filter(
        (review) => review._id.toString()!==req?.query?.id.toString()
    );

        const numberOfReviews=reviews.length;

        const ratings = numberOfReviews === 0 
        ? 0 
        : product.reviews.reduce((acc,item) => item.rating + acc, 0) / numberOfReviews;

         product = await Product.findByIdAndUpdate(req.query.productId, {reviews, numberOfReviews, ratings }, {new: true})



    res.status(200).json({
        success: true,
        product

    });
});
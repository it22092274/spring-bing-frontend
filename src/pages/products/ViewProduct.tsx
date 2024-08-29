import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Product from "../../interfaces/Product";
import Category from "../../interfaces/Category";
import SubCategory from "../../interfaces/SubCategory";

const ViewProduct = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [colorOptions, setColorOptions] = useState<string[]>([]);
    const [sizeOptions, setSizeOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/product/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProduct(data.data);

                // Extract color and size options from metadata
                const colors = Array.from(new Set(data.data.metadata.map((item: any) => item.color)));
                const sizes = Array.from(new Set(data.data.metadata.map((item: any) => item.size)));
                setColorOptions(colors);
                setSizeOptions(sizes);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/category');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchSubcategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/subcategory');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSubcategories(data.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };

        fetchProduct();
        fetchCategories();
        fetchSubcategories();
    }, [id]);

    const handleBuyNow = () => {
        console.log('Buy Now button clicked');
        // Directly navigate to checkout or perform a buy now action here
    };

    const handleAddToCart = () => {
        console.log('Add to Cart button clicked');
        // Add functionality to add the product to the cart here
    };

    if (!product) return <div>Loading...</div>;

    const productCategory = categories.find(category => category._id === product.category[0])?.name || 'Unknown';
    const productSubcategory = subcategories.find(subcategory => subcategory._id === product.sub_category[0])?.name || 'Unknown';

    return (
        <div>
            <div className='px-4 lg:px-24 my-20 flex flex-col md:flex-row justify-between items-center gap-12'>
                <div className='md:w-1/2'>
                    <img src={product.images_path[0]} alt={product.name} className='rounded md:w-8/12' />
                </div>

                <div className='md:w-1/2 space-y-6'>
                    <h2 className='text-4xl text-green-700 font-bold my-5 md:w-4/5 leading-snug'>{product.name}</h2>
                    <hr/>

                    <p className='mb-10 text-lg md:w-5/6'><strong>Category: </strong>{productCategory}</p>
                    <hr/>

                    <p className='mb-10 text-lg md:w-5/6'><strong>Subcategory: </strong>{productSubcategory}</p>
                    <hr/>

                    <p className='mb-10 text-lg md:w-5/6'>{product.description}</p>
                    <hr/>

                    <p className='mb-10 text-lg md:w-5/6'><strong>Price: </strong>LKR {product.unit_price}</p>

                    <hr/>

                    {/* Size Selector */}
                    <div className="mb-4">
                        <label htmlFor="size" className="block text-lg font-medium">Size:</label>
                        <select
                            id="size"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md w-full"
                        >
                            <option value="">Select Size</option>
                            {sizeOptions.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <hr/>

                    {/* Color Selector */}
                    <div className="mb-4">
                        <label htmlFor="color" className="block text-lg font-medium">Color:</label>
                        <select
                            id="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="border border-gray-300 p-2 rounded-md w-full"
                        >
                            <option value="">Select Color</option>
                            {colorOptions.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    <hr/>

                    <div className="flex gap-4">
                        <button
                            className='bg-green-700 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-800 hover:shadow-lg transition-all duration-300 w-full'
                            onClick={handleBuyNow}>Buy Now
                        </button>
                        <button
                            className='bg-green-200 text-green-600 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-300 hover:shadow-lg transition-all duration-300 w-full'
                            onClick={handleAddToCart}>Add to Cart
                        </button>
                    </div>

                    <br/>
                </div>
            </div>
        </div>
    );
}

export default ViewProduct;
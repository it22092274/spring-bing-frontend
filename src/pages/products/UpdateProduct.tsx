import React, { useState, useEffect } from 'react';
import { Button, Label, Select, TextInput, Textarea } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import { PiCheckCircleBold } from "react-icons/pi";

const UpdateProduct: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        // Fetch the product details to populate the form
        fetch(`http://localhost:3000/product/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data.data));

        // Fetch categories and subcategories
        fetch('http://localhost:3000/category')
            .then(res => res.json())
            .then(data => setCategories(data.data));

        fetch('http://localhost:3000/subcategory')
            .then(res => res.json())
            .then(data => setSubCategories(data.data));
    }, [id]);

    const handleUpdate = (event) => {
        event.preventDefault();
        const form = event.target;

        const updatedProduct = {
            name: form.name.value,
            unit_price: parseFloat(form.unit_price.value),
            metadata: [
                {
                    color: form.color.value,
                    size: form.size.value,
                    quantity: parseFloat(form.quantity.value)
                }
            ],
            description: form.description.value,
            category: [form.category.value],
            sub_category: [form.sub_category.value],
            images_path: [form.images_path.value]
        };

        fetch(`http://localhost:3000/product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
            .then(res => res.json())
            .then(() => {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 5000);
            });
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className='px-4 my-12'>
            <h2 className='mb-8 text-3xl font-bold'>Update Product</h2>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className='flex gap-8'>
                    <div className='lg:w-1/2'>
                        <Label htmlFor="name" value="Product Name" />
                        <TextInput id="name" name="name" type="text" defaultValue={product.name} required />
                    </div>

                    <div className='lg:w-1/2'>
                        <Label htmlFor="unit_price" value="Unit Price" />
                        <TextInput id="unit_price" name="unit_price" type="number" step="0.01" defaultValue={product.unit_price} required />
                    </div>
                </div>

                <div className='flex gap-8'>
                    <div className='lg:w-1/2'>
                        <Label htmlFor="color" value="Color" />
                        <TextInput id="color" name="color" type="text" defaultValue={product.metadata[0].color} required />
                    </div>

                    <div className='lg:w-1/2'>
                        <Label htmlFor="size" value="Size" />
                        <TextInput id="size" name="size" type="text" defaultValue={product.metadata[0].size} required />
                    </div>
                </div>

                <div className='flex gap-8'>
                    <div className='lg:w-1/2'>
                        <Label htmlFor="quantity" value="Quantity" />
                        <TextInput id="quantity" name="quantity" type="number" defaultValue={product.metadata[0].quantity} required />
                    </div>

                    <div className='lg:w-1/2'>
                        <Label htmlFor="category" value="Category" />
                        <Select id="category" name="category" defaultValue={product.category[0]} required>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className='flex gap-8'>
                    <div className='lg:w-1/2'>
                        <Label htmlFor="sub_category" value="Sub Category" />
                        <Select id="sub_category" name="sub_category" defaultValue={product.sub_category[0]} required>
                            {subCategories.map((sub) => (
                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                            ))}
                        </Select>
                    </div>

                    <div className='lg:w-1/2'>
                        <Label htmlFor="images_path" value="Image URL" />
                        <TextInput id="images_path" name="images_path" type="text" defaultValue={product.images_path[0]} required />
                    </div>
                </div>

                <div>
                    <Label htmlFor="description" value="Description" />
                    <Textarea id="description" name="description" rows={6} defaultValue={product.description} required />
                </div>

                <div className='flex justify-end space-x-4'>
                    <Button type="submit" className='w-48 h-10 bg-green-500'>Update Product</Button>
                </div>
            </form>

            {showSuccessMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg flex items-center">
                    <PiCheckCircleBold className="h-6 w-6 mr-2" />
                    <span className="text-lg">Product Updated Successfully!</span>
                </div>
            )}
        </div>
    );
};

export default UpdateProduct
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

const AddNewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [viewProductPreviewModal, setViewProductPreviewModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState<(File | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([
    "",
    "",
    "",
  ]);

  const handleCancel = () => {
    navigate("/admin/products");
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/products");
  };
  const handleImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB");
        return;
      }

      const newImages = [...images];
      const newImagePreviewUrls = [...imagePreviewUrls];

      newImages[index] = file;
      newImagePreviewUrls[index] = URL.createObjectURL(file);

      setImages(newImages);
      setImagePreviewUrls(newImagePreviewUrls);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className={`mb-6  ${viewProductPreviewModal ? "hidden" : ""}`}>
        <h1 className="text-2xl font-bold text-gray-900">Your Products</h1>
        <p className="text-gray-500 text-sm">
          Here is the information about all your Product
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className={`bg-gray-100 rounded-lg px-3 py-3 mb-6 flex justify-between items-center  ${viewProductPreviewModal ? "hidden" : ""}`}>
        <p
          className="font-medium text-gray-800"
          style={{ fontSize: "clamp(11.5px, 3vw, 17px)" }}
        >
          My Product List
        </p>
        <button
          style={{ fontSize: "clamp(10px, 3vw, 14px)" }}
          className="bg-white py-2 px-2 rounded-md font-medium text-gray-800"
        >
          Add New Product
        </button>
      </div>

      <form
        onSubmit={handleSaveChanges}
        className={`bg-white rounded-lg shadow-sm ${viewProductPreviewModal ? "hidden" : ""}`}
      >
        {/* Preview & Action Buttons */}
        <div className="flex justify-between items-center p-4 border-b">
          <p
            style={{ fontSize: "clamp(13px, 3vw, 18px)" }}
            className="text-gray-500 cursor-pointer hover:text-blue-950"
            onClick={() => setViewProductPreviewModal(true)}
          >
            Preview
          </p>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              style={{ fontSize: "clamp(9px, 3vw, 13px)" }}
              className="px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              style={{ fontSize: "clamp(9px, 3vw, 13px)" }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Details</h2>

            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                placeholder="e.g Plain T-Shirt"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ fontSize: "clamp(8px, 3vw, 13.5px)" }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Product Category</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your product"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Price, Quantity, Color */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pricing (#)
                </label>
                <input
                  type="text"
                  id="price"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity in stock
                </label>
                <input
                  type="text"
                  id="quantity"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-1/2 md:w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color (Optional)
                </label>
                <input
                  type="text"
                  id="color"
                  placeholder="#"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-1/2 md:w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Other Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Other Information (Optional)
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="size"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    placeholder="e.g L, XL"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Weight
                  </label>
                  <input
                    type="text"
                    id="weight"
                    placeholder="0.00"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="length"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Length
                  </label>
                  <input
                    type="text"
                    id="length"
                    placeholder="0"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="width"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Width
                  </label>
                  <input
                    type="text"
                    id="width"
                    placeholder="0"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Height
                  </label>
                  <input
                    type="text"
                    id="height"
                    placeholder="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Product Image
            </h2>
            <p className="text-sm text-gray-500">
              PNG, JPG or WEBP (max. 2MB each)
            </p>

            {/* Main Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image 1 (Main Image)
              </label>
              <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleImageChange(0, e)}
                    className="text-sm text-gray-500"
                    id="image-1"
                  />
                </div>
              </div>
            </div>

            {/* Optional Images */}
            {[1, 2].map((index) => (
              <div key={index + 1} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image {index + 1} (Optional)
                </label>
                <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => handleImageChange(index, e)}
                      className="text-sm text-gray-500"
                      id={`image-${index + 1}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

      {viewProductPreviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-[500px] md:max-w-[900px] rounded-lg max-h-[100vh] overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center p-4 md:hidden border-b">
              <button
                onClick={() => setViewProductPreviewModal(false)}
                className="text-gray-700"
              >
                <IoChevronBack size={24} />
              </button>
              <h1 className="flex-1 text-center font-medium">Products</h1>
              <div className="w-8" />
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center p-4 border-b">
              <h1 className="text-2xl font-bold">My Products</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewProductPreviewModal(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-gray-900 text-white rounded-lg">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="md:flex md:space-x-8">
                {/* Image Section */}
                <div className="md:w-1/2">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                    <img
                      src={
                        imagePreviewUrls[selectedImageIndex] ||
                        // imagePreviewUrls[0] ||
                        "/placeholder-image.jpg"
                      }
                      alt={productName || "Product Image"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviewUrls.map((url, idx) => (
                      <article
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`aspect-square rounded-lg border-2 ${
                          idx === selectedImageIndex
                            ? "border-blue-500"
                            : url
                            ? "border-gray-200"
                            : "border-dashed border-gray-300"
                        }`}
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image {idx + 1}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <h2 className="text-2xl font-bold mb-2">
                    {productName || "No product name"}
                  </h2>
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm mb-4">
                    Stock: {quantity || "-"}
                  </div>

                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold">
                      ${price || "260"}
                    </span>
                    <span className="ml-2 text-gray-500 line-through">
                      ${"300"}
                    </span>
                    <span className="ml-2 text-red-500">-40%</span>
                  </div>

                  <p className="text-gray-600 mb-6">
                    <span className="font-bold block">Description</span>
                    {description || "None"}
                  </p>

                  <p className="text-gray-600 mb-6">
                    <span className="font-bold">Color:</span>{" "}
                    {color || "None"}
                  </p>

                  <p className="text-gray-600 mb-6">
                    <span className="font-bold">Category:</span>{" "}
                    {category || "None"}
                  </p>

                  <div className="grid grid-cols-3">
                    <div className="text-gray-600 mb-6">
                      <span className="font-bold">Size:</span>{" "}
                      <button className="bg-gray-700 text-white px-2 rounded-md">
                        {size || "None"}
                      </button>
                    </div>
                    <div className="text-gray-600 mb-6">
                      <span className="font-bold">Weight:</span>{" "}
                      <button className="bg-gray-700 text-white px-2 rounded-md">
                        {weight || "None"}
                      </button>
                    </div>
                    <div className="text-gray-600 mb-6">
                      <span className="font-bold">Length:</span>{" "}
                      <button className="bg-gray-700 text-white px-2 rounded-md">
                        {length || "None"}
                      </button>
                    </div>
                    <div className="text-gray-600 mb-6">
                      <span className="font-bold">Width:</span>{" "}
                      <button className="bg-gray-700 text-white px-2 rounded-md">
                        {width || "None"}
                      </button>
                    </div>
                    <div className="text-gray-600 mb-6">
                      <span className="font-bold">Height:</span>{" "}
                      <button className="bg-gray-700 text-white px-2 rounded-md">
                        {height || "None"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewProduct;

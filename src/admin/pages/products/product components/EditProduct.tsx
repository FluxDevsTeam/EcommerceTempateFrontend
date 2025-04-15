import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Add state to track the selected image index
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([
    "https://th.bing.com/th/id/OIP.GuOfRbgNi7aCQug2U_T3ywHaIa?w=205&h=233&c=7&r=0&o=5&pid=1.7",
    "https://th.bing.com/th/id/OIP._OTpp91FGf3h-FdksLC-6wHaHl?w=205&h=209&c=7&r=0&o=5&pid=1.7",
    "https://th.bing.com/th/id/OIP.isIzC64ISx8G8jPpKeiPRwHaHa?w=184&h=184&c=7&r=0&o=5&pid=1.7",
  ]);

  useEffect(() => {
    console.log(`Fetching product with ID: ${id}`);
  }, [id]);

  const handleCancel = () => {
    navigate("/admin/products");
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin/products");
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = file;
      setSelectedImages(newSelectedImages);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        const newPreviewImages = [...previewImages];
        newPreviewImages[index] = reader.result as string;
        setPreviewImages(newPreviewImages);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Products</h1>
        <p className="text-gray-500 text-sm">
          Here is the information about all your Product
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-100 rounded-lg px-6 py-3 mb-6 flex justify-between items-center">
        <p
          className="font-medium text-gray-800"
          style={{ fontSize: "clamp(14px, 3vw, 17px)" }}
        >
          My Product List
        </p>
        <button
          style={{ fontSize: "clamp(13px, 3vw, 14px)" }}
          className="bg-white py-2 px-4 rounded-md font-medium text-gray-800"
        >
          Edit Product
        </button>
      </div>

      <form
        onSubmit={handleSaveChanges}
        className="bg-white rounded-lg shadow-sm"
      >
        {/* Preview & Action Buttons */}
        <div className="flex justify-between items-center p-4 border-b">
          <p
            style={{ fontSize: "clamp(13px, 3vw, 18px)" }}
            className="text-gray-500"
          >
            Preview
          </p>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              style={{ fontSize: "clamp(9px, 3vw, 13px)" }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              style={{ fontSize: "clamp(9px, 3vw, 13px)" }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid  px-3 md:grid-cols-[60%_40%] md:gap-x-7">
          {/* Left Column - Product Details */}
          <div className="mb-6 space-y-6 md:w-[85%]">
            <h2
              className="mt-6 font-semibold text-gray-800"
              style={{ fontSize: "clamp(17px, 3vw, 25px)" }}
            >
              Details
            </h2>

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
                // value={productName
                // onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                // value={category}
                // onChange={(e) => setCategory(e.target.value)}
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
                // value={description}
                // onChange={(e) => setDescription(e.target.value)}
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
                  //   value={price}
                  //   onChange={(e) => setPrice(e.target.value)}
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
                  //   value={quantity}
                  //   onChange={(e) => setQuantity(e.target.value)}
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
                  //   value={color}
                  //   onChange={(e) => setColor(e.target.value)}
                  className="w-1/2 md:w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Other Information */}
            <div>
              <h3
                className="font-medium text-gray-800 mb-4"
                style={{ fontSize: "clamp(17px, 3vw, 25px)" }}
              >
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
                    // value={size}
                    // onChange={(e) => setSize(e.target.value)}
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
                    // value={weight}
                    // onChange={(e) => setWeight(e.target.value)}
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
                    // onChange={(e) => setLength(e.target.value)}
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
                    // value={width}
                    // onChange={(e) => setWidth(e.target.value)}
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
                    // value={height}
                    // onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="md:mt-5 md:px-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Product Image
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              PNG, JPG or WEBP (max. 2MB each)
            </p>

            {/* Image Upload Fields */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((num, index) => (
                <div key={num} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image {num} {num === 1 ? "(Main Image)" : "(Optional)"}
                  </label>
                  <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
                    <span className="text-gray-500">
                      {selectedImages[index]
                        ? selectedImages[index].name
                        : `Image${num}.jpg`}
                    </span>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                      <FiUpload className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Preview */}
            <div className="grid md:grid-cols-[30%_70%] md:mt-6">
              <div className={`my-4 md:col-start-2 md:col-end-3`}>
                <img
                  src={previewImages[selectedImageIndex]}
                  alt="Product preview"
                  className="w-full object-contain rounded-md"
                />
              </div>

              {/* 3 preview images */}
              <div className="grid grid-cols-3 md:grid-cols-none md:row-start-1 md:col-start-1 md:cols-end-2">
                {previewImages.map((mapFn, indexPurpose) => (
                  <div
                    key={indexPurpose}
                    className={`border rounded-md p-1 w-20 h-20 cursor-pointer transition-colors ${
                      indexPurpose === selectedImageIndex
                        ? "border-blue-500 border-2"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                    onClick={() => setSelectedImageIndex(indexPurpose)}
                  >
                    <img
                      src={mapFn}
                      alt={`Thumbnail for image ${indexPurpose}`}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

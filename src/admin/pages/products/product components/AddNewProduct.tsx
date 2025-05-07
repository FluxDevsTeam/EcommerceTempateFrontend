import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/ui/Modal";
import { IoChevronBack, IoSearch, IoClose } from "react-icons/io5";

interface SubCategory {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

const AddNewProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [viewProductPreviewModal, setViewProductPreviewModal] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(0);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sub_category: null as number | null,
    colour: "",
    price: "",
    is_available: false,
    dimensional_size: null as string | null,
    weight: null as string | null,
    latest_item: false,
    latest_item_position: null as number | null,
    top_selling_items: false,
    top_selling_position: null as number | null,
    unlimited: false,
    production_days: null as number | null,
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
  });

  const [categories, setCategories] = useState<SubCategory[]>([]);

  // Define size and weight options
  const sizeOptions = [
    "Very Small",
    "Small",
    "Medium",
    "Large",
    "Very Large",
    "XXL",
  ];
  const weightOptions = [
    "Very Light",
    "Light",
    "Medium",
    "Heavy",
    "Very Heavy",
    "XX Heavy",
  ];

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<SubCategory[]>(
    []
  );

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "No access token found. Please login again.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      try {
        // First fetch to get total count
        const initialResponse = await fetch(
          "https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/",
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!initialResponse.ok) {
          throw new Error(`HTTP error! status: ${initialResponse.status}`);
        }

        const initialData = await initialResponse.json();
        const totalItems = initialData.count;
        const itemsPerPage = 10;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Fetch all pages
        const fetchPromises = [];
        for (let page = 1; page <= totalPages; page++) {
          fetchPromises.push(
            fetch(
              `https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/?page=${page}`,
              {
                headers: {
                  Authorization: `JWT ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            ).then((response) => response.json())
          );
        }

        // Wait for all requests to complete
        const responses = await Promise.all(fetchPromises);

        // Combine all results
        const allCategories = responses.reduce((acc, response) => {
          return [...acc, ...response.results];
        }, []);

        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setModalConfig({
          isOpen: true,
          title: "Error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch categories",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCancel = () => {
    navigate("/admin/products");
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      navigate("/admin/products");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    imageField: "image1" | "image2" | "image3",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageIndex = parseInt(imageField.charAt(5)) - 1;

      setFormData((prev) => ({
        ...prev,
        [imageField]: file,
      }));

      // Create preview URL
      const newImagePreviewUrls = [...imagePreviewUrls];
      newImagePreviewUrls[imageIndex] = URL.createObjectURL(file);
      setImagePreviewUrls(newImagePreviewUrls);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "No access token found. Please login again.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        formData[key as keyof typeof formData] !== null &&
        key !== "image1" &&
        key !== "image2" &&
        key !== "image3"
      ) {
        formDataToSend.append(key, String(formData[key as keyof typeof formData]));
      }
    });

    if (formData.image1) formDataToSend.append("image1", formData.image1);
    if (formData.image2) formDataToSend.append("image2", formData.image2);
    if (formData.image3) formDataToSend.append("image3", formData.image3);

    // Log the form data for debugging
    // console.log("Form data being sent:", {
    //   name: formData.name,
    //   description: formData.description,
    //   sub_category: formData.sub_category,
    //   colour: formData.colour,
    //   price: formData.price,
    //   discounted_price: formData.discounted_price,
    //   is_available: formData.is_available,
    //   latest_item: formData.latest_item,
    //   latest_item_position: formData.latest_item_position,
    //   dimensional_size: formData.dimensional_size,
    //   weight: formData.weight,
    //   top_selling_items: formData.top_selling_items,
    //   top_selling_position: formData.top_selling_position,
    //   images: {
    //     image1: formData.image1?.name,
    //     image2: formData.image2?.name,
    //     image3: formData.image3?.name,
    //   },
    // });

    try {
      const response = await fetch(
        "https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/",
        {
          method: "POST",
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(
          errorData.message || `Failed to add product: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Product added successfully:", data);

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Product added successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to add product. Please check the console for details.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="grid md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the product details to add a new item to your inventory
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <button
                type="button"
                onClick={() => setViewProductPreviewModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Preview Product
              </button>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSaveChanges} className="space-y-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Basic Information Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    {isSearchMode ? (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchMode(false);
                            setSearchQuery("");
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <IoClose size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          name="sub_category"
                          required
                          value={formData.sub_category || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none"
                        >
                          <option value="">Select Category</option>
                          {filteredCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsSearchMode(true);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <IoSearch size={20} />
                        </button>
                      </div>
                    )}
                    {isSearchMode && searchQuery && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  sub_category: category.id,
                                }));
                                setIsSearchMode(false);
                                setSearchQuery("");
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                              {category.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">
                            No categories found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Describe your product..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Specifications Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="colour"
                    value={formData.colour}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Size
                  </label>
                  <select
                    name="dimensional_size"
                    value={formData.dimensional_size || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">Select Size</option>
                    {sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Weight
                  </label>
                  <select
                    name="weight"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">Select Weight</option>
                    {weightOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Production Days
                  </label>
                  <input
                    type="number"
                    name="production_days"
                    value={formData.production_days || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        production_days: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter production days"
                  />
                </div>
              </div>
            </div>

            {/* Product Options Section */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Product Options
              </h2>
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_available: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Product is Available
                  </label>
                </div>

                <div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="unlimited"
                      checked={formData.unlimited}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          unlimited: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">
                      Stock is unlimited
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="latest_item"
                      checked={formData.latest_item}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          latest_item: e.target.checked,
                          latest_item_position: e.target.checked
                            ? prev.latest_item_position
                            : null,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Mark as Latest Item
                    </label>
                  </div>

                  {formData.latest_item && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latest Item Position
                      </label>
                      <input
                        type="number"
                        name="latest_item_position"
                        value={formData.latest_item_position || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            latest_item_position: e.target.value
                              ? Number(e.target.value)
                              : null,
                          }))
                        }
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="Enter position number"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="top_selling_items"
                      checked={formData.top_selling_items}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          top_selling_items: e.target.checked,
                          top_selling_position: e.target.checked
                            ? prev.top_selling_position
                            : null,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Mark as Top Selling Item
                    </label>
                  </div>

                  {formData.top_selling_items && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Top Selling Position
                      </label>
                      <input
                        type="number"
                        name="top_selling_position"
                        value={formData.top_selling_position || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            top_selling_position: e.target.value
                              ? Number(e.target.value)
                              : null,
                          }))
                        }
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="Enter position number"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Product Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image (Required)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        {imagePreviewUrls[0] ? (
                          <div className="relative">
                            <img
                              src={imagePreviewUrls[0]}
                              alt="Preview"
                              className="max-h-32 mx-auto rounded"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200 rounded cursor-pointer">
                              <span>Change Image</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageChange("image1", e)}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="text-gray-600">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleImageChange("image1", e)}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Images */}
                {[2, 3].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Image {num - 1}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                        <div className="space-y-1 text-center">
                          {imagePreviewUrls[num - 1] ? (
                            <div className="relative">
                              <img
                                src={imagePreviewUrls[num - 1]}
                                alt={`Preview ${num}`}
                                className="max-h-32 mx-auto rounded"
                              />
                              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200 rounded cursor-pointer">
                                <span>Change Image</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageChange(
                                      `image${num}` as "image2" | "image3",
                                      e
                                    )
                                  }
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="text-gray-600">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleImageChange(
                                      `image${num}` as "image2" | "image3",
                                      e
                                    )
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Product...
                </div>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {viewProductPreviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-[1000px] rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center p-4 md:hidden border-b">
              <button
                onClick={() => setViewProductPreviewModal(false)}
                className="text-gray-700"
              >
                <IoChevronBack size={24} />
              </button>
              <h1 className="flex-1 text-center font-medium">
                Product Preview
              </h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800">
                Product Preview
              </h1>
              <button
                onClick={() => setViewProductPreviewModal(false)}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close Preview
              </button>
            </div>

            <div className="p-6">
              <div className="md:flex md:space-x-8">
                {/* Image Section */}
                <div className="md:w-1/2 space-y-4">
                  {/* Main Image Display */}
                  <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    {imagePreviewUrls[selectedPreviewImage] ? (
                      <img
                        src={imagePreviewUrls[selectedPreviewImage]}
                        alt={formData.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p>No image available</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedPreviewImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === selectedPreviewImage
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                            <span className="text-sm">Image {index + 1}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {formData.name || "Product Name"}
                      </h2>
                      <div className="flex items-baseline space-x-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ${formData.price || "0.00"}
                        </span>
                        
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">
                        {formData.description || "No description available"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Category
                        </h3>
                        <p className="text-gray-600">
                          {categories.find(
                            (c) =>
                              c.id.toString() ===
                              formData.sub_category?.toString()
                          )?.name || "Not specified"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Color
                        </h3>
                        <p className="text-gray-600">
                          {formData.colour || "Not specified"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Size
                        </h3>
                        <p className="text-gray-600">
                          {formData.dimensional_size || "Not specified"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Weight
                        </h3>
                        <p className="text-gray-600">
                          {formData.weight || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            formData.is_available
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-gray-700">
                          {formData.is_available ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      {formData.latest_item && (
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                          Latest Item (Position: {formData.latest_item_position}
                          )
                        </div>
                      )}

                      {formData.top_selling_items && (
                        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
                          Top Selling Item (Position:{" "}
                          {formData.top_selling_position})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default AddNewProduct;

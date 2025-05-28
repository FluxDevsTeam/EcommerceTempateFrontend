import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack, IoSearch, IoClose } from "react-icons/io5";
import Modal from "../../../../components/ui/Modal";
import PaginatedDropdown from "./PaginatedDropdown";

interface SubCategory {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

interface WeightSizePair {
  label: string;
  weight: string;
  size: string;
}

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [previewImages, setPreviewImages] = useState<string[]>(["", "", ""]);
  const [categories, setCategories] = useState<SubCategory[]>([]);
  const [individualProductCategory, setIndividualProductCategory] =
    useState<string>("");

  const [viewProductPreviewModal, setViewProductPreviewModal] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(0);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const weightSizePairs: WeightSizePair[] = [
    { label: "Very Light - Very Small", weight: "Very Light", size: "Very Small" },
    { label: "Very Light - Small", weight: "Very Light", size: "Small" },
    { label: "Light - Small", weight: "Light", size: "Small" },
    { label: "Light - Medium", weight: "Light", size: "Medium" },
    { label: "Medium - Medium", weight: "Medium", size: "Medium" },
    { label: "Medium - Large", weight: "Medium", size: "Large" },
    { label: "Heavy - Large", weight: "Heavy", size: "Large" },
    { label: "Heavy - Very Large", weight: "Heavy", size: "Very Large" },
    { label: "Very Heavy - Very Large", weight: "Very Heavy", size: "Very Large" },
    { label: "Very Heavy - XXL", weight: "Very Heavy", size: "XXL" },
    { label: "XXHeavy - XXL", weight: "XXHeavy", size: "XXL" },
  ];

  // Update formData to match API input structure
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sub_category: "",
    colour: "",
    image1: null,
    image2: null,
    image3: null,
    undiscounted_price: null as number | null,
    is_available: false,
    latest_item: false,
    latest_item_position: null as number | null,
    weightSizePair: "" as string,
    top_selling_items: false,
    top_selling_position: null as number | null,
    unlimited: false,
    production_days: null as number | null,
  });

  const [initialFormData, setInitialFormData] = useState({
    name: "",
    description: "",
    sub_category: "",
    colour: "",
    is_available: false,
    latest_item: false,
    latest_item_position: null as number | null,
    weightSizePair: "" as string,
    top_selling_items: false,
    top_selling_position: null as number | null,
    unlimited: false,
    production_days: null as number | null,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<SubCategory[]>([]);

  const [isSearchMode, setIsSearchMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "No access token found. Please login again.",
          type: "error",
        });
        return;
      }

      try {
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

        const responses = await Promise.all(fetchPromises);
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
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const fetchProduct = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "No access token found. Please login again.",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${id}/`,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      
      // // Validate the required data exists
      // if (!data || !data.sub_category || !data.sub_category.id) {
      //   throw new Error('Invalid product data received from server');
      // }

      // Find the corresponding weightSizePair label
      const weightSizePair = weightSizePairs.find(
        (pair) =>
          pair.weight === data.weight && pair.size === data.dimensional_size
      )?.label || "";

      const formattedData = {
        name: data.name || "",
        description: data.description || "",
        sub_category: data.sub_category.id || "",
        colour: data.colour || "",
        is_available: data.is_available ?? false,
        latest_item: data.latest_item ?? false,
        latest_item_position: data.latest_item_position || null,
        weightSizePair,
        top_selling_items: data.top_selling_items ?? false,
        top_selling_position: data.top_selling_position || null,
        unlimited: data.unlimited ?? false,
        production_days: data.production_days || 0,
      };

      setInitialFormData(formattedData);
      setFormData(formattedData);
      setIndividualProductCategory(data.sub_category.name);
      setPreviewImages([
        data.image1 || "",
        data.image2 || "",
        data.image3 || "",
      ]);
    } catch (error) {
      console.error("Error fetching product:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to fetch product",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(formData) !== JSON.stringify(initialFormData);
    const hasImageChanges = selectedImages.some((img) => img !== null);
    setHasChanges(hasFormChanges || hasImageChanges);
  }, [formData, selectedImages, initialFormData]);

  const handleCancel = () => {
    navigate("/admin/products");
  };

  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "No access token found. Please login again.",
        type: "error",
      });
      setIsSaving(false);
      return;
    }

    const changedFields = new FormData();
    const selectedPair = weightSizePairs.find(
      (pair) => pair.label === formData.weightSizePair
    );

    // Compare and add changed fields
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof typeof formData;
      if (key === "weightSizePair") {
        if (
          JSON.stringify(formData.weightSizePair) !==
          JSON.stringify(initialFormData.weightSizePair)
        ) {
          if (selectedPair) {
            changedFields.append("weight", selectedPair.weight);
            changedFields.append("dimensional_size", selectedPair.size);
          }
        }
      } else if (
        JSON.stringify(formData[typedKey]) !==
        JSON.stringify(initialFormData[typedKey])
      ) {
        changedFields.append(key, String(formData[typedKey]));
      }
    });

    // Add changed images
    selectedImages.forEach((img, index) => {
      if (img) {
        changedFields.append(`image${index + 1}`, img);
      }
    });

    if ([...changedFields.entries()].length === 0) {
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
          body: changedFields,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(
          errorData.message ||
            `Failed to update product: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Update response:", data);

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Product updated successfully!",
        type: "success",
      });

      await fetchProduct();
    } catch (error) {
      console.error("Error updating product:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to update product",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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

      const reader = new FileReader();
      reader.onload = () => {
        const newPreviewImages = [...previewImages];
        newPreviewImages[index] = reader.result as string;
        setPreviewImages(newPreviewImages);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to get weight and size for preview
  const getWeightSizeForPreview = () => {
    const selectedPair = weightSizePairs.find(
      (pair) => pair.label === formData.weightSizePair
    );
    return {
      weight: selectedPair ? selectedPair.weight : "Not specified",
      size: selectedPair ? selectedPair.size : "Not specified",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Products</h1>
        <p className="text-gray-600">
          Here is the information about all your Products
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
        <div className="px-8 py-4 flex justify-between items-center">
          <p className="font-semibold text-gray-800 text-lg">My Product List</p>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-gray-800 font-medium">Edit Product</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {modalConfig.isOpen && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              modalConfig.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {modalConfig.message}
          </div>
        )}

        <div className="mb-8">
          <div className="grid md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Edit Product
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Update your product details
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

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Sub-Category
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/admin/admin-categories")}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Manage Categories
                    </button>
                  </div>
                  <PaginatedDropdown
                    options={categories}
                    value={formData.sub_category}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, sub_category: value }))
                    }
                    placeholder="Select Sub-Category"
                    required
                  />
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

            <div className="p-6 border-b border-gray-50">
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
                    Weight & Size
                  </label>
                  <select
                    name="weightSizePair"
                    value={formData.weightSizePair}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">Select Weight & Size</option>
                    {weightSizePairs.map((pair) => (
                      <option key={pair.label} value={pair.label}>
                        {pair.label}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>
            </div>

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
                              ? parseInt(e.target.value)
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
                              ? parseInt(e.target.value)
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
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">
                    Unlimited Stock
                  </label>
                </div>
              </div>
            </div>

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
                        {previewImages[0] ? (
                          <div className="relative">
                            <img
                              src={previewImages[0]}
                              alt="Preview"
                              className="max-h-32 mx-auto rounded"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200 rounded cursor-pointer">
                              <span>Change Image</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 0)}
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
                                onChange={(e) => handleImageUpload(e, 0)}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {[1, 2].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Image {num}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                        <div className="space-y-1 text-center">
                          {previewImages[num] ? (
                            <div className="relative">
                              <img
                                src={previewImages[num]}
                                alt={`Preview ${num}`}
                                className="max-h-32 mx-auto rounded"
                              />
                              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-200 rounded cursor-pointer">
                                <span>Change Image</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, num)}
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
                              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus:within:ring-blue-500">
                                <span>Upload a file</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, num)}
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                hasChanges
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
            >
              {isSaving ? (
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
                  Saving Changes...
                </div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {viewProductPreviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-[1000px] rounded-2xl max-h-[90vh] overflow-y-auto">
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
                <div className="md:w-1/2 space-y-4">
                  <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    {previewImages[selectedPreviewImage] ? (
                      <img
                        src={previewImages[selectedPreviewImage]}
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

                  <div className="grid grid-cols-3 gap-4">
                    {previewImages.map((url, index) => (
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

                <div className="md:w-1/2 mt-6 md:mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {formData.name || "Product Name"}
                      </h2>
                      <div className="flex items-baseline space-x-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ₦{formData.undiscounted_price || "0.00"}
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
                          {getWeightSizeForPreview().size}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Weight
                        </h3>
                        <p className="text-gray-600">
                          {getWeightSizeForPreview().weight}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">
                          {formData.is_available
                            ? formData.unlimited
                              ? "Unlimited Stock"
                              : `${formData.total_quantity ?? 0} in Stock`
                            : "Out of Stock"}
                        </span>
                      </div>

                      {formData.latest_item && (
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                          Latest Item (Position: {formData.latest_item_position})
                        </div>
                      )}

                      {formData.top_selling_items && (
                        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
                          Top Selling Item (Position: {formData.top_selling_position})
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

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default EditProduct;

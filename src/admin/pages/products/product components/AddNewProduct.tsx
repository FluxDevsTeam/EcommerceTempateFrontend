import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/ui/Modal";
import { IoChevronBack, IoSearch, IoClose } from "react-icons/io5";
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
  const [newProductId, setNewProductId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sub_category: null as number | null,
    colour: "",
    is_available: true,
    weightSizePair: "" as string,
    latest_item: false,
    latest_item_position: null as number | null,
    top_selling_items: false,
    top_selling_position: null as number | null,
    unlimited: false,
    production_days: 0,
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
  });

  const [categories, setCategories] = useState<SubCategory[]>([]);

  const weightSizePairs: WeightSizePair[] = [
    { label: "Very Light - Very Small (3000 - 7500)", weight: "Very Light", size: "Very Small"},
    { label: "Very Light - Small (4000 - 8500)", weight: "Very Light", size: "Small" },
    { label: "Light - Small (5000 - 9500)", weight: "Light", size: "Small" },
    { label: "Light - Medium (14000 - 27000)", weight: "Light", size: "Medium" },
    { label: "Medium - Medium (23000 - 41000)", weight: "Medium", size: "Medium" },
    { label: "Medium - Large (32200 - 51000)", weight: "Medium", size: "Large" },
    { label: "Heavy - Large (37000 - 55000)", weight: "Heavy", size: "Large" },
    { label: "Heavy - Very Large (42000 - 74000)", weight: "Heavy", size: "Very Large" },
    { label: "Very Heavy - Very Large (50000 - 92000)", weight: "Very Heavy", size: "Very Large"},
    { label: "Very Heavy - XXL (55000 - 106000)", weight: "Very Heavy", size: "XXL" },
    { label: "XXHeavy - XXL (69000 - 138000)", weight: "XXHeavy", size: "XXL" },
  ];

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<SubCategory[]>([]);

  // Filter categories based on search query
  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  // Fetch categories (unchanged)
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
        const initialResponse = await fetch(
          "https://api.fluxdevs.com/api/v1/product/sub-category/?page_size=100",
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
        const itemsPerPage = 100;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const fetchPromises = [];
        for (let page = 1; page <= totalPages; page++) {
          fetchPromises.push(
            fetch(
              `https://api.fluxdevs.com/api/v1/product/sub-category/?page=${page}&page_size=${itemsPerPage}`,
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
        const allCategories = responses
          .reduce((acc, response) => {
            return [...acc, ...response.results];
          }, [])
          .sort((a: SubCategory, b: SubCategory) =>
            a.name.localeCompare(b.name)
          );

        setCategories(allCategories);
      } catch (error) {
        
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
    if (modalConfig.type === "success" && newProductId) {
      setTimeout(() => {
        navigate(`/admin/admin-products-details/${newProductId}`);
      }, 100);
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

      const newImagePreviewUrls = [...imagePreviewUrls];
      newImagePreviewUrls[imageIndex] = URL.createObjectURL(file);
      setImagePreviewUrls(newImagePreviewUrls);
    }
  };

  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setViewProductPreviewModal(false);
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
    const selectedPair = weightSizePairs.find(
      (pair) => pair.label === formData.weightSizePair
    );

    Object.keys(formData).forEach((key) => {
      if (key === "weightSizePair") {
        // Skip weightSizePair, add weight and dimensional_size instead
        if (selectedPair) {
          formDataToSend.append("weight", selectedPair.weight);
          formDataToSend.append("dimensional_size", selectedPair.size);
        }
      } else if (
        formData[key as keyof typeof formData] !== null &&
        key !== "image1" &&
        key !== "image2" &&
        key !== "image3"
      ) {
        formDataToSend.append(
          key,
          String(formData[key as keyof typeof formData])
        );
      }
    });

    if (formData.image1) formDataToSend.append("image1", formData.image1);
    if (formData.image2) formDataToSend.append("image2", formData.image2);
    if (formData.image3) formDataToSend.append("image3", formData.image3);

    try {
      const response = await fetch(
        "https://api.fluxdevs.com/api/v1/product/item/",
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
        
        throw new Error(
          errorData.message || `Failed to add product: ${response.statusText}`
        );
      }

      const data = await response.json();
      

      setNewProductId(data.id);
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Product added successfully!",
        type: "success",
      });
    } catch (error) {
      
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

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.sub_category !== null &&
      formData.weightSizePair !== "" &&
      formData.image1 !== null
    );
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    value={formData.sub_category || ""}
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

            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color (optional)
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
                    Weight & Size (Lagos - Kano)
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
                    Production Days (optional)
                  </label>
                  <input
                    type="number"
                    name="production_days"
                    value={formData.production_days === null || formData.production_days === undefined ? "" : formData.production_days}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        production_days: e.target.value === "" ? 0 : Number(e.target.value),
                      }))
                    }
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter production days"
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

                {[2, 3].map((num) => (
                  <div key={num} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Image {num - 1} (optional)
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
              onClick={() => setViewProductPreviewModal(true)}
              disabled={!isFormValid()}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white
                ${
                  isFormValid()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Preview Product
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={loading || !isFormValid()}
              className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white
                ${
                  loading || !isFormValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
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

                <div className="md:w-1/2 mt-6 md:mt-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {formData.name || "Product Name"}
                      </h2>
                      <div className="flex items-baseline space-x-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ₦{formData.price || "0.00"}
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

              <div className="mt-8 flex justify-end gap-4 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setViewProductPreviewModal(false)}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Back to Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
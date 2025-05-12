import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { BsCheck2Circle } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaThList, FaEdit, FaTh, FaPlus, FaTrash } from "react-icons/fa";
import Modal from "../../../../components/ui/Modal";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Size {
  id: number;
  size: string;
  quantity: number;
  undiscounted_price: string;
  price: string;
}

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  total_quantity: number;
  sub_category: {
    id: number;
    category: {
      id: number;
      name: string;
    };
    name: string;
  };
  colour: string;
  image1: string;
  image2: string | null;
  image3: string | null;
  undiscounted_price: number;
  price: number;
  default_size_id: number | null;
  is_available: boolean;
  latest_item: boolean;
  latest_item_position: number;
  dimensional_size: string;
  weight: string;
  top_selling_items: boolean;
  top_selling_position: number;
  date_created: string;
  date_updated: string;
  unlimited: boolean;
  production_days: number;
  sizes: Size[];
}

interface SizeFormData {
  product: number | null;
  size: string;
  quantity: number | null;
  undiscounted_price: string | null;
  price: string | null;
}

const AdminProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditSizeModal, setShowEditSizeModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [editSizeFormData, setEditSizeFormData] = useState({
    id: 0,
    product: 0,
    size: "",
    quantity: 0,
    undiscounted_price: "",
    price: "",
  });
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    sizeId: 0,
    sizeName: "",
  });
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [addSizeFormData, setAddSizeFormData] = useState<SizeFormData>({
    product: null,
    size: "",
    quantity: null,
    undiscounted_price: null,
    price: null,
  });

  const fetchProductDetails = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Authentication error: No access token found.");
      setLoading(false);
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
        throw new Error("Failed to fetch product details");
      }
      const data = await response.json();

      console.log(data.unlimited);

      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleEditSize = (size: Size) => {
    setEditSizeFormData({
      id: size.id,
      product: Number(id), // product id from params
      size: size.size,
      quantity: size.quantity,
      undiscounted_price: size.undiscounted_price,
      price: size.price,
    });
    setShowEditSizeModal(true);
  };

  const handleEditSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${editSizeFormData.product}/size/${editSizeFormData.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify(editSizeFormData),
        }
      );

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        // console.log(data);

        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Product updated successfully!",
          type: "success",
        });
      } else {
        console.log(data);

        setModalConfig({
          isOpen: true,
          title: "Error",
          message: data.size[0],
          type: "error",
        });
        throw new Error("Failed to fetch product details");
      }

      // Refresh product details
      await fetchProductDetails();
      setShowEditSizeModal(false);
    } catch (error) {
      console.error("Error updating size:", error);
    }
  };

  const handleDeleteSize = (size: Size) => {
    setDeleteModalConfig({
      isOpen: true,
      sizeId: size.id,
      sizeName: size.size,
    });
  };

  const confirmDeleteSize = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !product) return;

    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${product.id}/size/${deleteModalConfig.sizeId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete size");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Size deleted successfully!",
        type: "success",
      });

      // Refresh product details
      await fetchProductDetails();
    } catch (error) {
      console.error("Error deleting size:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete size",
        type: "error",
      });
    } finally {
      setDeleteModalConfig({ isOpen: false, sizeId: 0, sizeName: "" });
    }
  };

  const handleAddSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product?.id) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Authentication error: No access token found.");
      return;
    }

    const requestBody = {
      product: product.id,
      size: addSizeFormData.size,
      quantity: addSizeFormData.quantity,
      undiscounted_price: addSizeFormData.undiscounted_price,
      price: addSizeFormData.price,
    };

    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${product.id}/size/`,
        {
          method: "POST",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to add size: ${response.statusText}`
        );
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Size added successfully!",
        type: "success",
      });

      // Refresh product details
      await fetchProductDetails();
      setShowAddSizeModal(false);
      setAddSizeFormData({
        product: null,
        size: "",
        quantity: null,
        undiscounted_price: null,
        price: null,
      });
    } catch (error) {
      console.error("Error adding size:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to add size",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="grey" highlightColor="white">
        <p className="text-center">
          <Skeleton count={16} height={55} />
        </p>
      </SkeletonTheme>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        {/* Header with breadcrumb and actions */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="hover:text-gray-700"
              >
                <IoChevronBack className="mr-2 inline" />
                Back to Products
              </button>
              <span className="inline-block text-lg"> › </span>
              <span className="text-gray-900">Product Details</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiEdit3 className="mr-2" />
              Edit Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images Section - Modified */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                {[product.image1, product.image2, product.image3]
                  .filter(Boolean)
                  .map((image, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-full">
                        <img
                          src={image || ""}
                          alt={`${product.name} view ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                        <div className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Image {idx + 1}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦ {product.price}
                  </span>
                  {product.undiscounted_price > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ₦{product.undiscounted_price}
                    </span>
                  )}
                </div>
              </div>
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Status Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.is_available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.is_available ? "Available" : "Out of Stock"}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Stock</span>
                  {product.unlimited ? (
                    <span className="font-medium">unlimited units</span>
                  ) : (
                    <span className="font-medium">
                      {product.total_quantity || 0} units
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">
                    {product.sub_category.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Specifications
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Color</span>
                  <span className="font-medium">{product.colour}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Transaction Size</span>
                  <span className="font-medium">
                    {product.dimensional_size || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Transaction Weight</span>
                  <span className="font-medium">{product.weight || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Sizes Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Sizes
                </h3>
                <button
                  onClick={() => setShowAddSizeModal(true)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  <FaPlus /> Add size
                </button>
              </div>
              <div className="space-y-3">
                {product.sizes.map((size) => (
                  <div
                    key={size.id}
                    className="group relative flex flex-col p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        Size: {size.size}
                      </span>
                      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {product.unlimited
                          ? "unlimited stock"
                          : `${size.quantity} in stock`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Price</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₦ {size.price}</span>
                        {Number(size.undiscounted_price) >
                          Number(size.price) && (
                          <span className="text-gray-400 line-through">
                            ₦ {size.undiscounted_price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hidden action buttons that show on hover */}
                    <div className="absolute top-0 left-0 right-0 -bottom-px opacity-0 group-hover:opacity-100 transition-all duration-200 py-2 px-4 bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-end gap-2">
                      <button
                        onClick={() => handleEditSize(size)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1 text-sm"
                        title="Edit Size"
                      >
                        <FaEdit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSize(size)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors inline-flex items-center gap-1 text-sm"
                        title="Delete Size"
                      >
                        <FaTrash size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Size Modal */}
      {showAddSizeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Size
            </h3>
            <form onSubmit={handleAddSizeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  required
                  value={addSizeFormData.size}
                  onChange={(e) =>
                    setAddSizeFormData((prev) => ({
                      ...prev,
                      size: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter size (e.g., S, M, L, XL)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  value={addSizeFormData.quantity || ""}
                  onChange={(e) =>
                    setAddSizeFormData((prev) => ({
                      ...prev,
                      quantity: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={
                    product.unlimited ? "Unlimited" : "Enter quantity"
                  }
                  readOnly={product.unlimited}
                />
                <span
                  className={`${
                    product.unlimited
                      ? "inline-block text-sm text-gray-700"
                      : "hidden"
                  }`}
                >
                  *product qty is unlimited by default
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={addSizeFormData.price || ""}
                  onChange={(e) =>
                    setAddSizeFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Undiscounted Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={addSizeFormData.undiscounted_price || ""}
                  onChange={(e) =>
                    setAddSizeFormData((prev) => ({
                      ...prev,
                      undiscounted_price: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter original price"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddSizeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Size Modal */}
      {showEditSizeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Size
            </h3>
            <form onSubmit={handleEditSizeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  value={editSizeFormData.size}
                  onChange={(e) =>
                    setEditSizeFormData((prev) => ({
                      ...prev,
                      size: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editSizeFormData.quantity}
                  onChange={(e) =>
                    setEditSizeFormData((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  placeholder={
                    product.unlimited ? "Unlimited" : "Enter quantity"
                  }
                  readOnly={product.unlimited}
                />
                <span
                  className={`${
                    product.unlimited
                      ? "inline-block text-sm text-gray-700"
                      : "hidden"
                  }`}
                >
                  *product qty is unlimited by default
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editSizeFormData.price}
                  onChange={(e) =>
                    setEditSizeFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Undiscounted Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editSizeFormData.undiscounted_price}
                  onChange={(e) =>
                    setEditSizeFormData((prev) => ({
                      ...prev,
                      undiscounted_price: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditSizeModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete size "{deleteModalConfig.sizeName}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() =>
                  setDeleteModalConfig({
                    isOpen: false,
                    sizeId: 0,
                    sizeName: "",
                  })
                }
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSize}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
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

export default AdminProductDetails;

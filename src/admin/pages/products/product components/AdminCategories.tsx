import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Category {
  id: number;
  name: string;
  index: number | null;
}

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;
  const [totalCategories, setTotalCategories] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [orderedCategories, setOrderedCategories] = useState<Category[]>([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const baseURL = `https://api.fluxdevs.com`;

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchCategories = async (
    page = currentPage,
    search = debouncedSearch,
    noPagination = false
  ) => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const url = noPagination
        ? `${baseURL}/api/v1/product/category/?page_size=1000&search=${encodeURIComponent(
            search
          )}`
        : `${baseURL}/api/v1/product/category/?page=${page}&page_size=${ITEMS_PER_PAGE}&search=${encodeURIComponent(
            search
          )}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      const fetchedCategories = data.results;
      if (noPagination) {
        setOrderedCategories(
          fetchedCategories.sort((a: Category, b: Category) =>
            a.index !== null && b.index !== null ? a.index - b.index : 0
          )
        );
      } else {
        setCategories(fetchedCategories);
        setTotalCategories(data.count);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      }
    } catch (error) {
      // Remove console.error
      setError(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories when page or debounced search changes
  useEffect(() => {
    fetchCategories(currentPage, debouncedSearch);
    // eslint-disable-next-line
  }, [currentPage, debouncedSearch]);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/category/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Category added successfully!",
        type: "success",
      });

      setShowAddModal(false);
      await fetchCategories();
      setNewCategoryName("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add category"
      );
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: `Failed to add category`,
        type: "error",
      });
      setShowAddModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory || !newCategoryName.trim()) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${baseURL}/api/v1/product/category/${selectedCategory.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategoryName }),
        }
      );

      if (!response.ok) throw new Error("Failed to update category");

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Category updated successfully!",
        type: "success",
      });

      setShowEditModal(false);
      await fetchCategories();
      setNewCategoryName("");
      setSelectedCategory(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update category"
      );
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: `Failed to add category`,
        type: "error",
      });
      setShowEditModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${baseURL}/api/v1/product/category/${category.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete category");

      await fetchCategories();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = orderedCategories.findIndex(
        (cat) => cat.id.toString() === active.id
      );
      const newIndex = orderedCategories.findIndex(
        (cat) => cat.id.toString() === over?.id
      );
      const reorderedCategories = [...orderedCategories];
      const [movedCategory] = reorderedCategories.splice(oldIndex, 1);
      reorderedCategories.splice(newIndex, 0, movedCategory);
      setOrderedCategories(reorderedCategories);
    }
  };

  const handleSaveOrder = async () => {
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const updates = orderedCategories.map((category, index) => ({
        id: category.id,
        index: index + 1,
      }));

      for (const update of updates) {
        const response = await fetch(
          `${baseURL}/api/v1/product/category/${update.id}/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ index: update.index }),
          }
        );

        if (!response.ok) throw new Error("Failed to update category order");
      }

      await fetchCategories();
      setShowOrderModal(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update category order"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const SortableItem = ({
    category,
    index,
  }: {
    category: Category;
    index: number;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: category.id.toString(),
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center p-2 mb-2 bg-gray-100 rounded hover:bg-gray-200 cursor-move"
      >
        <span className="mr-2">☰</span>
        <span>{category.name}</span>
      </div>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCategories / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* success or error modal */}
        {modalConfig.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border-t-4 ${
                modalConfig.type === "success"
                  ? "border-customBlue"
                  : "border-red-500"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-4 ${
                  modalConfig.type === "success"
                    ? "text-customBlue"
                    : "text-red-600"
                }`}
              >
                {modalConfig.title}
              </h2>
              <p className="mb-6">{modalConfig.message}</p>
              <button
                onClick={() =>
                  setModalConfig({
                    ...modalConfig,
                    isOpen: false,
                  })
                }
                className={`w-full py-2 px-4 text-white rounded ${
                  modalConfig.type === "success"
                    ? "bg-customBlue hover:brightness-90"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {modalConfig.type === "success" ? "Continue" : "Close"}
              </button>
            </div>
          </div>
        )}

        {/* Back button and header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <IoChevronBack className="w-5 h-5 mr-1" />
            Back to Products
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <button
                onClick={() =>
                  navigate("/admin/admin-categories/subcategories")
                }
                className="sm:hidden bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
              >
                Subcategory
              </button>
            </div>
            <div className="flex flex-row w-full sm:w-auto gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto sm:whitespace-nowrap bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 text-center"
              >
                + Add Category
              </button>
              <button
                onClick={() => {
                  fetchCategories(1, "", true);
                  setShowOrderModal(true);
                }}
                className="w-full sm:w-auto sm:whitespace-nowrap bg-purple-600 text-white px-4 py-1.5 text-sm rounded hover:bg-purple-700 text-center"
              >
                Re-Arrange Categories
              </button>
              <button
                onClick={() =>
                  navigate("/admin/admin-categories/subcategories")
                }
                className="hidden sm:block bg-green-600 text-white px-4 py-1.5 text-sm rounded hover:bg-green-700 text-center"
              >
                SubCategory
              </button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row w-full gap-4">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search categories..."
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Index
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.index ?? "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedCategory(category);
                              setNewCategoryName(category.name);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing{" "}
            {totalCategories === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to {Math.min(currentPage * ITEMS_PER_PAGE, totalCategories)} of{" "}
            {totalCategories} categories
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || !prevPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((curr) => Math.max(curr - 1, 1))}
              disabled={currentPage === 1 || !prevPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  const currentPageRange = 2;
                  return (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - currentPageRange &&
                      pageNum <= currentPage + currentPageRange)
                  );
                })
                .map((pageNum, index, array) => (
                  <React.Fragment key={pageNum}>
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button
              onClick={() => setCurrentPage((curr) => curr + 1)}
              disabled={!nextPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={!nextPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Category
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategoryName("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={isProcessing}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {isProcessing ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Category
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setNewCategoryName("");
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isProcessing}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {isProcessing ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reorder Categories
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedCategories.map((cat) => cat.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="max-h-96 overflow-y-auto">
                  {orderedCategories.map((category, index) => (
                    <SortableItem
                      key={category.id}
                      category={category}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={isProcessing}
                className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
              >
                {isProcessing ? "Saving..." : "Save Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

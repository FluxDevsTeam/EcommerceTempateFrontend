import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubCategory[];
}

interface EditForm {
  category: number | "";
  name: string;
}

interface NewSubCategory {
  category: number | "";
  name: string;
}

const AdminSubCategories: React.FC = () => {
  const API_BASE_URL =
    "https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/";

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newSubCategory, setNewSubCategory] = useState<NewSubCategory>({
    category: "",
    name: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState<SubCategory | null>(
    null
  );
  const [editForm, setEditForm] = useState<EditForm>({
    category: "",
    name: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    subCategoryId: 0,
    subCategoryName: "",
  });
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);

  const fetchSubCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}?page=${page}&page_size=${rowsPerPage}&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      setSubCategories(response.data.results);
      setTotalCount(response.data.count);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (err) {
      setError("Failed to fetch subcategories. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "https://ecommercetemplate.pythonanywhere.com/api/v1/product/category/",
          {
            headers: accessToken ? { Authorization: `JWT ${accessToken}` } : {},
          }
        );
        setCategories(response.data.results);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        API_BASE_URL,
        { category: newSubCategory.category, name: newSubCategory.name },
        { headers: { Authorization: `JWT ${accessToken}` } }
      );
      setNewSubCategory({ category: "", name: "" });
      setEditDialogOpen(false);
      fetchSubCategories();
    } catch (err: any) {
      setAddError(err?.response?.data?.name?.[0]);
    } finally {
      setAddLoading(false);
    }
  };

  // Edit Subcategory handlers
  const openEditDialog = (subCat: SubCategory) => {
    setEditSubCategory(subCat);
    setEditForm({ category: subCat.category.id, name: subCat.name });
    setEditDialogOpen(true);
    setEditError(null);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditSubCategory(null);
    setEditForm({ category: "", name: "" });
    setEditError(null);
  };

  const handleEditSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubCategory) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const updatedSubCategory = await axios.patch(
        `${API_BASE_URL}${editSubCategory.id}/`,
        {
          id: editSubCategory.id,
          category: editForm.category,
          name: editForm.name,
        },
        { headers: accessToken ? { Authorization: `JWT ${accessToken}` } : {} }
      );

      // Update the local state immediately
      setSubCategories((prevSubCategories) =>
        prevSubCategories.map((subCat) =>
          subCat.id === editSubCategory.id
            ? {
                ...subCat,
                name: editForm.name,
                category:
                  categories.find((cat) => cat.id === editForm.category) ||
                  subCat.category,
              }
            : subCat
        )
      );

      closeEditDialog();
    } catch (err: any) {
      setEditError(
        err?.response?.data?.name?.[0] || "Failed to edit subcategory."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openPopoverId !== null &&
        !(event.target as Element).closest(".action-popover")
      ) {
        setOpenPopoverId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopoverId]);

  const handleDelete = (subCategoryId: number, subCategoryName: string) => {
    setDeleteModalConfig({
      isOpen: true,
      subCategoryId,
      subCategoryName,
    });
  };

  const confirmDelete = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Authentication error: No access token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${deleteModalConfig.subCategoryId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete subcategory: ${response.statusText}`);
      }

      // Refresh the subcategories list
      const updatedSubCategories = subCategories.filter(
        (subCategory) => subCategory.id !== deleteModalConfig.subCategoryId
      );
      setSubCategories(updatedSubCategories);
      setTotalCount(totalCount - 1);

      // Close the modal
      setDeleteModalConfig({
        isOpen: false,
        subCategoryId: 0,
        subCategoryName: "",
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete subcategory"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // API is 1-based
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
            className="font-bold text-gray-800 mb-3 sm:mb-0"
          >
            Subcategories Management
          </h2>

          <button
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => {
              setEditSubCategory(null);
              setEditForm({ category: "", name: "" });
              setNewSubCategory({ category: "", name: "" });
              setEditDialogOpen(true);
            }}
          >
            <FaPlus style={{ fontSize: "clamp(0.8rem, 3vw, 1rem)" }} />
            <span
              style={{ fontSize: "clamp(0.8rem, 3vw, 0.9rem)" }}
              className="hidden md:inline-block font-medium"
            >
              Add New Subcategory
            </span>
            <span
              style={{ fontSize: "clamp(0.8rem, 3vw, 0.9rem)" }}
              className="inline-block md:hidden font-medium"
            >
              Add New
            </span>
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or category..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {loading && (
            <div className="flex flex-col items-center justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading Subcategories...</p>
            </div>
          )}
          {error && (
            <div className="text-center p-6 bg-red-50 text-red-600 border border-red-200 rounded-lg">
              Error: {error}
            </div>
          )}
          {!loading && !error && (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs text-gray-700 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 font-semibold">No</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subCategory, index) => (
                  <tr
                    key={subCategory.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-5 py-4">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {subCategory.name}
                    </td>
                    <td className="px-5 py-4">{subCategory.category.name}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="relative inline-block">
                        <button
                          className="text-gray-500 hover:text-blue-600 p-1 rounded-full transition-colors action-popover"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenPopoverId(
                              openPopoverId === subCategory.id
                                ? null
                                : subCategory.id
                            );
                          }}
                        >
                          <HiDotsHorizontal size={20} />
                        </button>

                        {openPopoverId === subCategory.id && (
                          <div className="absolute border border-gray-200 right-0 md:right-full md:left-auto md:mr-2 mt-1 w-32 bg-white rounded-md shadow-xl z-50 action-popover overflow-hidden">
                            <button
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 flex items-center transition-colors"
                              onClick={() => {
                                openEditDialog(subCategory);
                                setOpenPopoverId(null);
                              }}
                            >
                              <FaEdit className="mr-2.5 text-blue-500" /> Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-colors"
                              onClick={() => {
                                handleDelete(subCategory.id, subCategory.name);
                                setOpenPopoverId(null);
                              }}
                            >
                              <FaTrash className="mr-2.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {subCategories.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                        <p className="font-semibold">No subcategories found.</p>
                        <p className="text-sm">Try adjusting your search or adding new subcategories.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalCount > 0 && (
           <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-3 sm:mb-0 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium">
                {(page - 1) * rowsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * rowsPerPage, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> results
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1 || !prevPageUrl}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setPage((curr) => Math.max(1, curr - 1))}
                disabled={page === 1 || !prevPageUrl}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1.5">
                {Array.from(
                  { length: Math.ceil(totalCount / rowsPerPage) },
                  (_, i) => i + 1
                )
                  .filter((pageNum) => {
                    const totalPages = Math.ceil(totalCount / rowsPerPage);
                    if (totalPages <= 5) return true; // Show all pages if 5 or less
                    const currentPageRange = 1; // Show 1 page before and after current
                    // Always show first, last, and pages around current
                    return (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - currentPageRange &&
                        pageNum <= page + currentPageRange)
                    );
                  })
                  .reduce((acc, pageNum, index, array) => {
                    if (index > 0 && array[index - 1] !== pageNum - 1) {
                      acc.push(
                        <span key={`ellipsis-start-${pageNum}`} className="px-2 py-1.5 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    acc.push(
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                    return acc;
                  }, [] as React.ReactNode[])}
              </div>

              <button
                onClick={() => setPage((curr) => curr + 1)}
                disabled={!nextPageUrl || page === Math.ceil(totalCount / rowsPerPage)}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setPage(Math.ceil(totalCount / rowsPerPage))}
                disabled={!nextPageUrl || page === Math.ceil(totalCount / rowsPerPage)}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalConfig.isOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 transform transition-all duration-300 ease-in-out scale-100">
              <div className="flex items-center mb-4">
                <div className="mr-3 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
                  <FaTrash className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to delete the subcategory "
                <span className="font-semibold">{deleteModalConfig.subCategoryName}</span>
                "? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setDeleteModalConfig({
                      isOpen: false,
                      subCategoryId: 0,
                      subCategoryName: "",
                    })
                  }
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-150 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Dialog */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out scale-100">
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">
                  {editSubCategory ? "Edit Subcategory" : "Add New Subcategory"}
                </h3>
                <button onClick={closeEditDialog} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <IoClose size={24} />
                </button>
              </div>
              <form
                onSubmit={
                  editSubCategory ? handleEditSubCategory : handleAddSubCategory
                }
                className="p-5 space-y-5"
              >
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Parent Category
                  </label>
                  <select
                    id="category"
                    value={
                      editSubCategory
                        ? editForm.category || ""
                        : newSubCategory.category || ""
                    }
                    onChange={(e) =>
                      editSubCategory
                        ? setEditForm((s) => ({
                            ...s,
                            category: Number(e.target.value),
                          }))
                        : setNewSubCategory((s) => ({
                            ...s,
                            category: Number(e.target.value),
                          }))
                    }
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="subcategoryName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subcategory Name
                  </label>
                  <input
                    id="subcategoryName"
                    type="text"
                    value={
                      editSubCategory ? editForm.name : newSubCategory.name
                    }
                    onChange={(e) =>
                      editSubCategory
                        ? setEditForm((s) => ({ ...s, name: e.target.value }))
                        : setNewSubCategory((s) => ({
                            ...s,
                            name: e.target.value,
                          }))
                    }
                    required
                    placeholder="e.g., T-shirts, Sneakers"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                 {(editSubCategory ? editError : addError) && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-md border border-red-200">
                    {editSubCategory ? editError : addError}
                  </p>
                )}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 mt-2">
                  <button
                    type="button"
                    onClick={closeEditDialog}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    disabled={editSubCategory ? editLoading : addLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                    disabled={
                      editSubCategory
                        ? editLoading ||
                          (editSubCategory.name === editForm.name &&
                            editSubCategory.category.id === editForm.category)
                        : addLoading
                    }
                  >
                    {(editSubCategory ? editLoading : addLoading) && (
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                    )}
                    {editSubCategory
                      ? editLoading
                        ? "Saving..."
                        : "Save Changes"
                      : addLoading
                      ? "Adding..."
                      : "Add Subcategory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubCategories;

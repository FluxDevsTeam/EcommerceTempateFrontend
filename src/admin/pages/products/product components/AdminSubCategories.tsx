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

  useEffect(() => {
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
        { headers: accessToken ? { Authorization: `JWT ${accessToken}` } : {} }
      );
      setNewSubCategory({ category: "", name: "" });
      // Refresh subcategories
      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}?page=${page + 1}&page_size=${rowsPerPage}`
      );
      setSubCategories(response.data.results);
      setTotalCount(response.data.count);
    } catch (err: any) {
      setAddError(
        err?.response?.data?.name?.[0] || "Failed to add subcategory."
      );
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
    <div className="w-full">
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2
            style={{ fontSize: "clamp(14px, 3vw, 22px)" }}
            className="font-semibold text-gray-800"
          >
            Subcategories List
          </h2>

          <button
            className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit"
            onClick={() => setEditDialogOpen(true)}
          >
            <FaPlus style={{ fontSize: "clamp(1px, 3vw, 15px)" }} />
            <span
              style={{ fontSize: "clamp(9px, 3vw, 14px)" }}
              className="hidden md:inline-block"
            >
              Add New Subcategory
            </span>
            <span
              style={{ fontSize: "clamp(9px, 3vw, 14px)" }}
              className="inline-block md:hidden"
            >
              Add Subcategory
            </span>
          </button>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search subcategories..."
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoClose />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {loading && (
            <div>
              <div className="relative flex w-64 animate-pulse gap-2 p-4">
                <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                <div className="flex-1">
                  <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                  <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                </div>
                <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
          )}
          {!loading && !error && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subCategory, index) => (
                  <tr
                    key={subCategory.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                      {subCategory.name}
                    </td>
                    <td className="px-4 py-3">{subCategory.category.name}</td>
                    <td className="px-4 py-3 relative">
                      <button
                        className="text-gray-600 hover:text-black action-popover"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPopoverId(
                            openPopoverId === subCategory.id
                              ? null
                              : subCategory.id
                          );
                        }}
                      >
                        <HiDotsHorizontal />
                      </button>

                      {openPopoverId === subCategory.id && (
                        <div className="absolute border right-full top-0 mt-1 mr-2 w-24 bg-white rounded shadow-lg z-50 action-popover">
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              openEditDialog(subCategory);
                              setOpenPopoverId(null);
                            }}
                          >
                            <FaEdit className="mr-2" /> Edit
                          </button>
                          <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              handleDelete(subCategory.id, subCategory.name);
                              setOpenPopoverId(null);
                            }}
                          >
                            <FaTrash className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {subCategories.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No subcategories found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
            Showing {(page - 1) * rowsPerPage + 1} to{" "}
            {Math.min(page * rowsPerPage, totalCount)} of {totalCount} entries
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || !prevPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => setPage((curr) => curr - 1)}
              disabled={page === 1 || !prevPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from(
                { length: Math.ceil(totalCount / rowsPerPage) },
                (_, i) => i + 1
              )
                .filter((pageNum) => {
                  const currentPageRange = 2;
                  return (
                    pageNum === 1 ||
                    pageNum === Math.ceil(totalCount / rowsPerPage) ||
                    (pageNum >= page - currentPageRange &&
                      pageNum <= page + currentPageRange)
                  );
                })
                .map((pageNum, index, array) => (
                  <React.Fragment key={pageNum}>
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded ${
                        page === pageNum
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
              onClick={() => setPage((curr) => curr + 1)}
              disabled={!nextPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => setPage(Math.ceil(totalCount / rowsPerPage))}
              disabled={!nextPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalConfig.isOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "
                {deleteModalConfig.subCategoryName}
                "? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() =>
                    setDeleteModalConfig({
                      isOpen: false,
                      subCategoryId: 0,
                      subCategoryName: "",
                    })
                  }
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editSubCategory ? "Edit Subcategory" : "Add New Subcategory"}
              </h3>
              <form
                onSubmit={
                  editSubCategory ? handleEditSubCategory : handleAddSubCategory
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
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
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory Name
                  </label>
                  <input
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
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeEditDialog}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    disabled={editSubCategory ? editLoading : addLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={editSubCategory ? editLoading : addLoading}
                  >
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
              {(editSubCategory ? editError : addError) && (
                <p className="mt-4 text-sm text-red-600">
                  {editSubCategory ? editError : addError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubCategories;

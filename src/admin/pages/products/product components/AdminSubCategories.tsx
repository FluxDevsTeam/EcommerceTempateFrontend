import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
}

const AdminSubCategories = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18;
  const [totalSubCategories, setTotalSubCategories] = useState(0);
  const navigate = useNavigate();

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  const fetchCategories = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${baseURL}/api/v1/product/category/`, {
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.results);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/sub-category/?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`, {
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      setSubCategories(data.results);
      setTotalSubCategories(data.count);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, [currentPage]);

  const handleAdd = async () => {
    if (!newSubCategoryName.trim() || !selectedCategory) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/sub-category/`, {
        method: 'POST',
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          name: newSubCategoryName
        }),
      });

      if (!response.ok) throw new Error('Failed to add subcategory');
      await fetchSubCategories();
      setNewSubCategoryName('');
      setSelectedCategory(0);
      setShowAddModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add subcategory');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedSubCategory || !newSubCategoryName.trim() || !selectedCategory) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/sub-category/${selectedSubCategory.id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          name: newSubCategoryName
        }),
      });

      if (!response.ok) throw new Error('Failed to update subcategory');
      await fetchSubCategories();
      setNewSubCategoryName('');
      setSelectedCategory(0);
      setShowEditModal(false);
      setSelectedSubCategory(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update subcategory');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (subCategory: SubCategory) => {
    if (!confirm(`Are you sure you want to delete "${subCategory.name}"?`)) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/sub-category/${subCategory.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete subcategory');
      await fetchSubCategories();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete subcategory');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.ceil(totalSubCategories / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button and header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/admin-categories')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <IoChevronBack className="w-5 h-5 mr-1" />
            Back to Categories
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h1 className="text-2xl font-bold text-gray-900">Subcategories</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
            >
              Add Subcategory
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subCategories.map((subCategory) => (
                  <tr key={subCategory.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subCategory.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subCategory.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedSubCategory(subCategory);
                            setNewSubCategoryName(subCategory.name);
                            setSelectedCategory(subCategory.category.id);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(subCategory)}
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
          </div>
        </div>

        {/* Add Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalSubCategories)} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalSubCategories)} of {totalSubCategories} subcategories
          </div>
          
          <div className="flex border rounded">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 border-r hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border-r hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 border-r">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border-r hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Subcategory
            </h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value={0}>Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSubCategoryName}
              onChange={(e) => setNewSubCategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSubCategoryName('');
                  setSelectedCategory(0);
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
                {isProcessing ? 'Adding...' : 'Add Subcategory'}
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
              Edit Subcategory
            </h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value={0}>Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSubCategoryName}
              onChange={(e) => setNewSubCategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setNewSubCategoryName('');
                  setSelectedCategory(0);
                  setSelectedSubCategory(null);
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
                {isProcessing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubCategories;

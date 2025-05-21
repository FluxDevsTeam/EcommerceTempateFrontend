import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18;
  const [totalCategories, setTotalCategories] = useState(0);

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  const fetchCategories = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/category/?page=${currentPage}&page_size=${ITEMS_PER_PAGE}`, {
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data.results);
      setTotalCategories(data.count);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/category/`, {
        method: 'POST',
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error('Failed to add category');
      
      await fetchCategories();
      setNewCategoryName('');
      setShowAddModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add category');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory || !newCategoryName.trim()) return;
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/category/${selectedCategory.id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      await fetchCategories();
      setNewCategoryName('');
      setShowEditModal(false);
      setSelectedCategory(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update category');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    
    setIsProcessing(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${baseURL}/api/v1/product/category/${category.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      await fetchCategories();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete category');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.max(1, Math.ceil(totalCategories / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button and header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <IoChevronBack className="w-5 h-5 mr-1" />
            Back to Products
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <button
                onClick={() => navigate('/admin/admin-categories/subcategories')}
                className="sm:hidden bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
              >
                Subcategory
              </button>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <button
                onClick={() => navigate('/admin/admin-categories/subcategories')}
                className="hidden sm:block bg-green-600 text-white px-4 py-1.5 text-sm rounded hover:bg-green-700 text-center"
              >
                Subcategory
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto sm:whitespace-nowrap bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 text-center"
              >
                Add Category
              </button>
            </div>
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
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
          </div>
        </div>

        {/* Add Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCategories)} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalCategories)} of {totalCategories} categories
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
                  setNewCategoryName('');
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
                {isProcessing ? 'Adding...' : 'Add Category'}
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
                  setNewCategoryName('');
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
                {isProcessing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

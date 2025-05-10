import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
      const response = await fetch(`${baseURL}/api/v1/product/sub-category/`, {
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data = await response.json();
      setSubCategories(data.results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subcategories</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your product subcategories</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Categories
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Subcategory
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

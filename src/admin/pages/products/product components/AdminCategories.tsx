import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  const fetchCategories = async () => {
    setLoading(true);
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
      setError(error instanceof Error ? error.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
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
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setNewCategoryName(category.name);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

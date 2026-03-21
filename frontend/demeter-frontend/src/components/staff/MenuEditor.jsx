import React, { useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';
import api from '../../utils/api.js';

const MenuEditor = ({ cafeteriaId }) => {
  const { showToast } = useToast();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    basePrice: '',
    preparationTime: '',
    categoryId: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await api.get('/api/menus/cafeteria/' + cafeteriaId);
      setMenuItems(res.data.data || []);
    } catch {
      setMenuItems([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchMenu(), fetchCategories()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafeteriaId]);

  const toggleAvailability = async (item) => {
    try {
      await api.put('/api/menus/' + item.menuId + '/availability');
      setMenuItems((prev) =>
        prev.map((m) =>
          m.menuId === item.menuId ? { ...m, available: !m.available } : m
        )
      );
    } catch (err) {
      showToast('Failed to toggle availability: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const startEdit = (item) => {
    setEditingItem({
      menuId: item.menuId,
      name: item.name,
      description: item.description || '',
      basePrice: item.basePrice,
      preparationTime: item.preparationTime,
      available: item.available,
    });
  };

  const cancelEdit = () => setEditingItem(null);

  const saveEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      await api.put('/api/menus/' + editingItem.menuId, {
        name: editingItem.name,
        description: editingItem.description,
        basePrice: parseFloat(editingItem.basePrice),
        preparationTime: parseInt(editingItem.preparationTime, 10),
        available: editingItem.available,
      });
      await fetchMenu();
      setEditingItem(null);
    } catch (err) {
      showToast('Failed to save: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.basePrice || !newItem.categoryId) {
      showToast('Name, price, and category are required.', 'warning');
      return;
    }
    setSaving(true);
    try {
      await api.post('/api/menus/' + newItem.categoryId, {
        name: newItem.name,
        description: newItem.description,
        basePrice: parseFloat(newItem.basePrice),
        cafeteriaId: cafeteriaId,
        preparationTime: parseInt(newItem.preparationTime, 10) || 10,
        available: true,
      });
      await fetchMenu();
      setNewItem({ name: '', description: '', basePrice: '', preparationTime: '', categoryId: '' });
      setShowAddForm(false);
    } catch (err) {
      showToast('Failed to add item: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await api.delete('/api/menus/' + item.menuId);
      await fetchMenu();
      showToast(`"${item.name}" deleted.`, 'success');
    } catch (err) {
      showToast('Failed to delete: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menu Items</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">New Menu Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-400"
            />
            <select
              value={newItem.categoryId}
              onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price (GK)"
              step="0.01"
              min="0"
              value={newItem.basePrice}
              onChange={(e) => setNewItem({ ...newItem, basePrice: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Prep time (min)"
              min="1"
              value={newItem.preparationTime}
              onChange={(e) => setNewItem({ ...newItem, preparationTime: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="md:col-span-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={addItem}
              disabled={saving}
              className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Edit Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Price (GK)"
              step="0.01"
              min="0"
              value={editingItem.basePrice}
              onChange={(e) => setEditingItem({ ...editingItem, basePrice: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Prep time (min)"
              min="1"
              value={editingItem.preparationTime}
              onChange={(e) => setEditingItem({ ...editingItem, preparationTime: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Description"
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              disabled={saving}
              className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {menuItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No menu items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Category</th>
                <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Price (GK)</th>
                <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Prep (min)</th>
                <th className="text-center py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Available</th>
                <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr
                  key={item.menuId}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-2 text-gray-800 dark:text-white font-medium">{item.name}</td>
                  <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{item.category?.name || '-'}</td>
                  <td className="py-3 px-2 text-right text-gray-800 dark:text-white">{item.basePrice?.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right text-gray-500 dark:text-gray-400">{item.preparationTime}</td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        item.available
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="px-3 py-1 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;

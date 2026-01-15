import { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';
import Charts from './Charts';

function Dashboard({ username, onLogout }) {
  const [allInventory, setAllInventory] = useState([]);
  const [reorderItems, setReorderItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [parts, setParts] = useState([]);
  
  const [selectedStore, setSelectedStore] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, reorderRes, lowStockRes, storesRes, partsRes] = await Promise.all([
        inventoryAPI.getAllInventory(),
        inventoryAPI.getReorderItems(),
        inventoryAPI.getLowStockItems(),
        inventoryAPI.getAllStores(),
        inventoryAPI.getAllParts(),
      ]);

      setAllInventory(inventoryRes.data);
      setReorderItems(reorderRes.data);
      setLowStockItems(lowStockRes.data);
      setStores(storesRes.data);
      setParts(partsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running on port 8080.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter reorder items by store and search term
  const filteredReorderItems = reorderItems.filter(item => {
    const matchesStore = selectedStore === 'all' || item.store.id.toString() === selectedStore;
    const matchesSearch = searchTerm === '' || 
      item.part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.part.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStore && matchesSearch;
  });

  // Filter low stock items by store and search term
  const filteredLowStockItems = lowStockItems.filter(item => {
    const matchesStore = selectedStore === 'all' || item.store.id.toString() === selectedStore;
    const matchesSearch = searchTerm === '' || 
      item.part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.part.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStore && matchesSearch;
  });

  // Handle opening the order modal
  const handleOrderClick = (item) => {
    setSelectedPart(item);
    setOrderQuantity(item.reorderQuantity);
    setShowModal(true);
  };

  // Handle placing an order (simulated)
  const handlePlaceOrder = () => {
    alert(`Order placed!\n\nPart: ${selectedPart.part.name}\nStore: ${selectedPart.store.name}\nQuantity: ${orderQuantity} units\n\nThis would trigger the procurement system in a real application.`);
    setShowModal(false);
    setSelectedPart(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-xl text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - Mobile Responsive */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">AutoZone Inventory Management</h1>
              <p className="text-orange-100 mt-1 text-sm sm:text-base">Intelligent Stock Monitoring & Reorder System</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-orange-100 text-sm sm:text-base truncate">Welcome, {username}!</span>
              <button
                onClick={onLogout}
                className="bg-white text-orange-600 px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition text-sm sm:text-base whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase">Total Stores</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">{stores.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase">Items Needing Reorder</h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-2">{filteredReorderItems.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase">Low Stock Alerts</h3>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-2">{filteredLowStockItems.length}</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 gap-4">
            {/* Store Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Store
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
              >
                <option value="all">All Stores</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.storeNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Parts
              </label>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedStore !== 'all' || searchTerm !== '') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">Active filters:</span>
              {selectedStore !== 'all' && (
                <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm">
                  {stores.find(s => s.id.toString() === selectedStore)?.name}
                  <button
                    onClick={() => setSelectedStore('all')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm !== '' && (
                <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedStore('all');
                  setSearchTerm('');
                }}
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Reorder Alerts Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">🔔 Items Needing Reorder</h2>
          {filteredReorderItems.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-600">
              {searchTerm || selectedStore !== 'all' 
                ? 'No items match your filters.'
                : 'All items are adequately stocked! ✅'}
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Store</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Reorder Point</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Reorder Qty</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReorderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{item.part.name}</div>
                            <div className="text-xs text-gray-500">{item.part.sku}</div>
                            <div className="text-xs text-gray-500 sm:hidden mt-1">{item.store.name}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-900">{item.store.name}</div>
                            <div className="text-xs text-gray-500">{item.store.storeNumber}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <span className="text-xs sm:text-sm font-semibold text-orange-600">{item.quantity}</span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                            {item.reorderPoint}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                            {item.reorderQuantity}
                          </td>
                          <td className="px-3 sm:px-6 py-4">
                            <button
                              onClick={() => handleOrderClick(item)}
                              className="px-2 sm:px-4 py-1 sm:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-xs sm:text-sm font-medium whitespace-nowrap"
                            >
                              Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Low Stock Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">⚠️ Low Stock Alerts</h2>
          {filteredLowStockItems.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-600">
              {searchTerm || selectedStore !== 'all' 
                ? 'No items match your filters.'
                : 'No critical low stock items.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLowStockItems.slice(0, 9).map((item) => (
                <div 
                  key={item.id} 
                  className="border border-red-200 rounded-lg p-4 bg-red-50 hover:shadow-md transition cursor-pointer active:scale-95"
                  onClick={() => handleOrderClick(item)}
                >
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.part.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.store.name}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500">Stock:</span>
                    <span className="text-base sm:text-lg font-bold text-red-600">{item.quantity} units</span>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500">Max:</span>
                    <span className="text-xs sm:text-sm text-gray-700">{item.maxStockLevel} units</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min((item.quantity / item.maxStockLevel) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Store List */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">🏪 Store Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <div 
                key={store.id} 
                className={`border rounded-lg p-4 transition cursor-pointer active:scale-95 ${
                  selectedStore === store.id.toString() 
                    ? 'border-orange-500 bg-orange-50 shadow-md' 
                    : 'border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setSelectedStore(store.id.toString())}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{store.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    store.storeType === 'HUB' ? 'bg-blue-100 text-blue-800' :
                    store.storeType === 'COMMERCIAL' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {store.storeType}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">{store.address}</p>
                <p className="text-xs sm:text-sm text-gray-600">{store.city}, {store.state} {store.zipCode}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">{store.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">📊 Analytics</h2>
          <Charts />
        </div>
      </main>

      {/* Order Modal - Mobile Responsive */}
      {showModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Place Order</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Part Details */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{selectedPart.part.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">SKU: {selectedPart.part.sku}</p>
                <p className="text-xs sm:text-sm text-gray-600">Category: {selectedPart.part.category}</p>
                <p className="text-xs sm:text-sm text-gray-600">Manufacturer: {selectedPart.part.manufacturer}</p>
              </div>

              {/* Store Details */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Delivery Location</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{selectedPart.store.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{selectedPart.store.address}</p>
                <p className="text-xs sm:text-sm text-gray-600">{selectedPart.store.city}, {selectedPart.store.state} {selectedPart.store.zipCode}</p>
              </div>

              {/* Current Stock Info */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-gray-600 uppercase">Current</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">{selectedPart.quantity}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-gray-600 uppercase">Reorder</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600">{selectedPart.reorderPoint}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs text-gray-600 uppercase">Max</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600">{selectedPart.maxStockLevel}</p>
                </div>
              </div>

              {/* Order Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Quantity
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 10))}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-bold text-sm sm:text-base"
                    >
                      -10
                    </button>
                    <input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 sm:w-32 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold text-base sm:text-lg"
                    />
                    <button
                      onClick={() => setOrderQuantity(orderQuantity + 10)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-bold text-sm sm:text-base"
                    >
                      +10
                    </button>
                  </div>
                  <button
                    onClick={() => setOrderQuantity(selectedPart.reorderQuantity)}
                    className="px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Use Recommended ({selectedPart.reorderQuantity})
                  </button>
                </div>
              </div>

              {/* Supplier Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Supplier:</span> {selectedPart.part.supplierName}
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Lead Time:</span> {selectedPart.part.supplierLeadTimeDays} days
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Unit Cost:</span> ${selectedPart.part.cost}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-2">
                  Total Cost: ${(selectedPart.part.cost * orderQuantity).toFixed(2)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold text-sm sm:text-base"
                >
                  Confirm Order
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8 sm:mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm">Built by Jeremiah Tatum | AutoZone Internship Project 2026</p>
          <p className="text-xs text-gray-400 mt-2">Spring Boot + React + PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '../../utils/api';
import { Loader2, DollarSign, ShoppingBag, TrendingUp, Package, Calendar, Trophy, Box } from 'lucide-react';

interface VendorRevenueModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorId: string | null;
}

interface ProductRevenue {
    id: string;
    name: string;
    image: string | null;
    unitsSold: number;
    earnings: number;
}

interface InventoryItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    images: string[];
    category: string;
}

interface VendorRevenueData {
    vendorName: string;
    totalRevenue: number;
    totalSalesVolume: number;
    totalProfit: number;
    avgGain: number;
    totalProducts: number;
    productBreakdown: ProductRevenue[];
    topSelling: ProductRevenue[];      // New
    storeInventory: InventoryItem[];   // New
}

const VendorRevenueModal: React.FC<VendorRevenueModalProps> = ({
    isOpen,
    onClose,
    vendorId,
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<VendorRevenueData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Date filter state
    const [filterType, setFilterType] = useState<'overall' | 'custom'>('overall');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (isOpen && vendorId) {
            if (filterType === 'overall') {
                // Reset dates when switching to overall
                setStartDate('');
                setEndDate('');
                fetchRevenueData(vendorId);
            } else if (filterType === 'custom' && startDate && endDate) {
                fetchRevenueData(vendorId, startDate, endDate);
            }
        }
    }, [isOpen, vendorId, filterType, startDate, endDate]);

    const fetchRevenueData = async (id: string, start?: string, end?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: any = await apiClient.getVendorRevenue(id, start, end);
            if (response.success) {
                setData(response.data);
            } else {
                setError(response.error?.message || 'Failed to fetch revenue data');
            }
        } catch (err) {
            setError('An error occurred while fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                Vendor Revenue & Performance
                            </DialogTitle>
                            {data && <p className="text-sm text-gray-500 mt-1">{data.vendorName}</p>}
                        </div>

                        {/* Filter Controls */}
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0 bg-gray-50 p-1.5 rounded-lg border">
                            <Button
                                variant={filterType === 'overall' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setFilterType('overall')}
                                className="text-xs h-8"
                            >
                                Overall
                            </Button>
                            <Button
                                variant={filterType === 'custom' ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setFilterType('custom')}
                                className="text-xs h-8"
                            >
                                Custom Range
                            </Button>
                        </div>
                    </div>

                    {filterType === 'custom' && (
                        <div className="flex items-center space-x-2 pt-4 pb-2 justify-end">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">From:</span>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-8 w-36 text-xs"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">To:</span>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-8 w-36 text-xs"
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center h-60">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : data ? (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-300">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Revenue</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{formatMoney(data.totalRevenue)}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Gain</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{formatMoney(data.totalProfit)}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg. Gain / Order</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{formatMoney(data.avgGain)}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sales Volume</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{data.totalSalesVolume}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <Package className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Products</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{data.totalProducts}</p>
                                    <p className="text-[10px] text-gray-400">Available in store</p>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Top Selling & Detailed Breakdown */}
                        {/* Middle Section: Conditional View */}
                        {filterType === 'custom' && startDate && endDate ? (
                            /* Custom Range View: Sold Products List (Exclusive View) */
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden mt-6">
                                <div className="px-6 py-4 border-b bg-indigo-50/50 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-800 flex items-center">
                                        <ShoppingBag className="mr-2 h-5 w-5 text-indigo-500" />
                                        Sold Products ({new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()})
                                    </h3>
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                                        {data.productBreakdown ? data.productBreakdown.length : 0} Unique Items Sold
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Product Name</th>
                                                <th className="px-6 py-3 font-medium text-center">Units Sold</th>
                                                <th className="px-6 py-3 font-medium text-right">Revenue Generated</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data?.productBreakdown && data.productBreakdown.length > 0 ? (
                                                data.productBreakdown.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex-shrink-0 border">
                                                                    {product.image ? (
                                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        <div className="h-full w-full flex items-center justify-center">
                                                                            <Package className="h-4 w-4 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-gray-900">{product.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-bold text-gray-700">
                                                                {product.unitsSold}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-bold text-green-600">
                                                            {formatMoney(product.earnings)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                        No products were sold during this specific date range.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* Overall View: Top Selling & Breakdown Charts */
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Left: Top Selling Products */}
                                <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm overflow-hidden h-full flex flex-col">
                                    <div className="px-6 py-4 border-b bg-yellow-50/50 flex items-center">
                                        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                                        <h3 className="font-semibold text-gray-800">Top Selling Products</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                                        {data.topSelling && data.topSelling.length > 0 ? (
                                            <div className="divide-y divide-gray-50">
                                                {data.topSelling.map((product, index) => (
                                                    <div key={product.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex-shrink-0 relative">
                                                            {product.image ? (
                                                                <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded-md border" />
                                                            ) : (
                                                                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                                                    <Package className="h-6 w-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="absolute -top-2 -left-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-yellow-200">
                                                                #{index + 1}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                                            <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-green-600">{formatMoney(product.earnings)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-gray-500 text-sm">No sales data yet to determine top products.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Overall Revenue Breakdown */}
                                <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                                    <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800 flex items-center">
                                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                            Overall Revenue Breakdown
                                        </h3>
                                        {filterType === 'custom' && !startDate && (
                                            <span className="text-xs text-orange-500 animate-pulse">Select dates to view details</span>
                                        )}
                                    </div>

                                    {filterType === 'custom' && (!startDate || !endDate) ? (
                                        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 text-center p-6">
                                            <Calendar className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-gray-900 font-medium">Select a Date Range</p>
                                            <p className="text-sm text-gray-500 mt-1">Choose a start and end date to see specific sold products.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto max-h-[400px]">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0 z-10">
                                                    <tr>
                                                        <th className="px-6 py-3 font-semibold">Product Name</th>
                                                        <th className="px-6 py-3 text-center font-semibold">Units Sold</th>
                                                        <th className="px-6 py-3 text-right font-semibold">Revenue Booked</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {data.productBreakdown && data.productBreakdown.length > 0 ? (
                                                        data.productBreakdown.map((item) => (
                                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-6 py-4 font-medium text-gray-900 border-l-4 border-transparent hover:border-primary">
                                                                    {item.name}
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold">
                                                                        {item.unitsSold}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right font-bold text-green-700">
                                                                    {formatMoney(item.earnings)}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                                No sales data available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bottom Section: Store Inventory */}
                        <div className="bg-white rounded-lg border shadow-sm">
                            <div className="px-6 py-4 border-b bg-gray-50/50">
                                <h3 className="font-semibold text-gray-800 flex items-center">
                                    <Box className="mr-2 h-5 w-5 text-gray-500" />
                                    Full Store Inventory
                                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-normal">
                                        {data.storeInventory ? data.storeInventory.length : 0} Items
                                    </span>
                                </h3>
                            </div>
                            <div className="overflow-x-auto max-h-[400px]">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3">Product</th>
                                            <th className="px-6 py-3 text-center">Category</th>
                                            <th className="px-6 py-3 text-center">Stock</th>
                                            <th className="px-6 py-3 text-right">Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.storeInventory && data.storeInventory.length > 0 ? (
                                            data.storeInventory.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden border">
                                                                {product.images && product.images[0] ? (
                                                                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <div className="h-full w-full flex items-center justify-center">
                                                                        <Package className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-center text-gray-500 capitalize">{product.category || 'N/A'}</td>
                                                    <td className="px-6 py-3 text-center">
                                                        <span className={`px - 2 py - 1 rounded - full text - xs font - medium 
                                                ${product.quantity > 10 ? 'bg-green-100 text-green-700' :
                                                                product.quantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                            } `}>
                                                            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 text-right font-medium text-gray-900">
                                                        {formatMoney(product.price)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                    No products found in this store.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {filterType === 'custom' && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-700 flex items-center">
                                <div className="mr-2 font-bold text-lg">ℹ</div>
                                <div>
                                    <p className="font-semibold">About Custom Range Data</p>
                                    <p>Revenue and unit counts shown here represent strictly confirmed/delivered sales within the selected timeframe. Pending or cancelled orders are excluded.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

export default VendorRevenueModal;
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { apiClient } from '../../utils/api';
import { Loader2, ShoppingCart, Calendar, Package, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string | null;
}

interface OrderItem {
    productName: string;
    storeName: string;
    quantity: number;
    price: number;
    image: string | null;
}

interface Order {
    id: string;
    date: string;
    totalAmount: number;
    status: string;
    items: OrderItem[];
}

interface CustomerHistoryData {
    totalSpent: number;
    orders: Order[];
}

const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({
    isOpen,
    onClose,
    customerId,
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CustomerHistoryData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && customerId) {
            fetchHistoryData(customerId);
        }
    }, [isOpen, customerId]);

    const fetchHistoryData = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: any = await apiClient.getCustomerOrdersAdmin(id);
            if (response.success) {
                setData(response.data);
            } else {
                setError(response.error?.message || 'Failed to fetch customer history');
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

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'PPP');
        } catch {
            return dateString;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Customer Purchase History
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : data ? (
                    <div className="space-y-6">
                        {/* Total Spent Summary */}
                        <div className="bg-primary/5 p-4 rounded-lg flex justify-between items-center border border-primary/10">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Lifetime Spend</p>
                                <h3 className="text-2xl font-bold text-primary">{formatMoney(data.totalSpent)}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-xl font-semibold text-gray-800">{data.orders.length}</p>
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-800">Order History</h3>
                            {data.orders.length > 0 ? (
                                <div className="space-y-4">
                                    {data.orders.map((order) => (
                                        <div key={order.id} className="border rounded-lg overflow-hidden">
                                            <div className="bg-gray-50 p-3 flex flex-wrap justify-between items-center text-sm border-b">
                                                <div className="flex space-x-4">
                                                    <span className="font-medium">Order ID: <span className="text-gray-600 font-normal">#{order.id.slice(0, 8)}</span></span>
                                                    <span className="flex items-center text-gray-500">
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {formatDate(order.date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                ${order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        } `}>
                                                        {order.status}
                                                    </span>
                                                    <span className="font-bold">{formatMoney(Number(order.totalAmount))}</span>
                                                </div>
                                            </div>
                                            <div className="p-0">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50/50 text-gray-500 text-xs">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left font-medium">Product</th>
                                                            <th className="px-4 py-2 text-left font-medium">Store</th>
                                                            <th className="px-4 py-2 text-center font-medium">Qty</th>
                                                            <th className="px-4 py-2 text-right font-medium">Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {order.items.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="px-4 py-2 flex items-center space-x-3">
                                                                    {item.image ? (
                                                                        <img src={item.image} alt="" className="h-8 w-8 object-cover rounded bg-gray-100" />
                                                                    ) : (
                                                                        <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                                                                            <Package className="h-4 w-4 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                    <span className="text-gray-700 line-clamp-1">{item.productName}</span>
                                                                </td>
                                                                <td className="px-4 py-2 text-gray-600 text-xs font-medium">{item.storeName}</td>
                                                                <td className="px-4 py-2 text-center text-gray-600">{item.quantity}</td>
                                                                <td className="px-4 py-2 text-right text-gray-600">{formatMoney(Number(item.price))}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No orders found for this customer.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

export default CustomerHistoryModal;

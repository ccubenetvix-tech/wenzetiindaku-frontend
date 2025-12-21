import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { apiClient } from '../../utils/api';
import { Loader2, MessageSquare, Star, User } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string | null;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    product: {
        id: string;
        name: string;
        images: string[];
    };
    customer: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

const CustomerReviewsModal: React.FC<CustomerReviewsModalProps> = ({
    isOpen,
    onClose,
    customerId,
}) => {
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && customerId) {
            fetchReviews(customerId);
        }
    }, [isOpen, customerId]);

    const fetchReviews = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: any = await apiClient.getCustomerReviewsAdmin(id);
            if (response.success) {
                setReviews(response.data.reviews || []);
            } else {
                setError(response.error?.message || 'Failed to fetch reviews');
            }
        } catch (err) {
            setError('An error occurred while fetching reviews');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'PPP');
        } catch {
            return dateString;
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Customer Reviews & Feedback
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : (
                    <div className="space-y-6">
                        {/* Customer Info Header (from first review if available) */}
                        {reviews.length > 0 && reviews[0].customer && (
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3 border">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                    {reviews[0].customer.first_name?.[0]}{reviews[0].customer.last_name?.[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {reviews[0].customer.first_name} {reviews[0].customer.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">{reviews[0].customer.email}</p>
                                </div>
                                <div className="ml-auto text-sm text-gray-500">
                                    Total Reviews: <span className="font-semibold text-gray-900">{reviews.length}</span>
                                </div>
                            </div>
                        )}

                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex space-x-3">
                                                <div className="h-12 w-12 bg-gray-100 rounded border flex-shrink-0">
                                                    {review.product?.images?.[0] ? (
                                                        <img
                                                            src={review.product.images[0]}
                                                            alt={review.product.name}
                                                            className="h-full w-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{review.product?.name || 'Unknown Product'}</p>
                                                    <div className="mt-1">{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                                        </div>

                                        <div className="bg-gray-50/50 p-3 rounded-md border border-gray-100 text-sm text-gray-700 italic">
                                            "{review.comment}"
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No reviews submitted by this customer.</p>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CustomerReviewsModal;

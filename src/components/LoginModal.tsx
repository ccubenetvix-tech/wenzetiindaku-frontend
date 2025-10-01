/**
 * LoginModal.tsx - Modern Amazon/Flipkart-style Login Modal
 * 
 * A premium login modal with clean design, proper spacing, and modern UI
 * following the design patterns of top e-commerce platforms.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, User, Store, ArrowRight, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleCustomerLogin = () => {
    handleClose();
    navigate('/customer/login');
  };

  const handleVendorLogin = () => {
    handleClose();
    navigate('/vendor/login');
  };

  const handleSignUp = () => {
    handleClose();
    navigate('/customer/signup');
  };

  const handleBecomeVendor = () => {
    handleClose();
    navigate('/vendor/register');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white dark:bg-navy-900 rounded-lg shadow-lg w-full max-w-sm transform transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to WENZE TII NDAKU
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Choose your login type
            </p>
          </div>
        </div>

        {/* Login Options */}
        <div className="px-5 pb-4">
          <div className="space-y-3">
            {/* Customer Login */}
            <button
              onClick={handleCustomerLogin}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-navy-700 hover:border-navy-500 dark:hover:border-navy-400 hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-navy-500 to-navy-600 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-navy-600 dark:group-hover:text-navy-300">
                      Customer Login
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Shop and browse products
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-navy-500 dark:group-hover:text-navy-400 transition-colors duration-200" />
              </div>
            </button>

            {/* Vendor Login */}
            <button
              onClick={handleVendorLogin}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-navy-700 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-800/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Store className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-300">
                      Vendor Login
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Manage your store and products
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-200" />
              </div>
            </button>
          </div>
        </div>

        {/* New User Section */}
        <div className="px-5 pb-5">
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              New to our platform?
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleSignUp}
                variant="outline"
                size="sm"
                className="flex-1 border border-navy-500 text-navy-600 hover:bg-navy-500 hover:text-white transition-all duration-200 text-xs h-8 px-3"
              >
                <ShoppingBag className="h-3 w-3 mr-1" />
                Sign Up
              </Button>
              <Button
                onClick={handleBecomeVendor}
                variant="outline"
                size="sm"
                className="flex-1 border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200 text-xs h-8 px-3"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Become Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

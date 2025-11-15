import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save,
  Edit3,
  Trash2,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { apiClient } from '@/utils/api';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, logout, isLoading: authLoading } = useAuth();
  
  // Debug logging
  console.log('User data in CustomerProfile:', {
    id: user?.id,
    email: user?.email,
    registrationMethod: user?.registrationMethod,
    profilePhoto: user?.profilePhoto,
    verified: user?.verified
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(user?.profilePhoto || '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dobError, setDobError] = useState('');

  // Age validation function
  const validateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return true; // Allow empty DOB
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    
    return actualAge >= 18;
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    profilePhoto: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Wait for auth to load before checking
    if (authLoading) {
      return;
    }
    
    // Only redirect if user is definitely not authenticated
    if (!user || user.role !== 'customer') {
      navigate('/customer/login');
      return;
    }

    // Pre-fill form with existing data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      gender: user.gender || '',
      address: user.address || '',
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      profilePhoto: user.profilePhoto || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setProfileImagePreview(user.profilePhoto || '');
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    
    // Validate DOB for age requirement
    if (name === 'dateOfBirth') {
      if (value && !validateAge(value)) {
        setDobError('You must be at least 18 years old to use this service');
      } else {
        setDobError('');
      }
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
    if (error) setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    // Validate DOB before saving
    if (formData.dateOfBirth && !validateAge(formData.dateOfBirth)) {
      setError('You must be at least 18 years old to use this service');
      setIsLoading(false);
      return;
    }

    try {
      // Validate password change if provided
      if (formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to change password.');
          setIsLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match.');
          setIsLoading(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          setError('New password must be at least 8 characters long.');
          setIsLoading(false);
          return;
        }
        if (user?.registrationMethod === 'google') {
          setError('Password changes must be managed via your Google account.');
          setIsLoading(false);
          return;
        }
      }

      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        profilePhoto: profileImagePreview || formData.profilePhoto
      };

      // Add password change if provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await apiClient.updateCustomerProfile(updateData) as {
        success: boolean;
        message?: string;
        data?: {
          customer?: {
            firstName?: string;
            lastName?: string;
            gender?: string;
            address?: string;
            phoneNumber?: string;
            dateOfBirth?: string;
            profilePhoto?: string;
            profile_completed?: boolean;
          }
        };
        error?: { message?: string };
      };

      if (response.success) {
        const updatedCustomer = response.data?.customer;
        const updatedProfilePhoto = updatedCustomer?.profilePhoto ?? (profileImagePreview || formData.profilePhoto);
        const updatedDateOfBirth = updatedCustomer?.dateOfBirth ?? formData.dateOfBirth;

        toast({
          title: "Profile Updated",
          description: response.message,
        });

        // Update user context
        updateUser({
          firstName: updatedCustomer?.firstName ?? formData.firstName,
          lastName: updatedCustomer?.lastName ?? formData.lastName,
          gender: updatedCustomer?.gender ?? formData.gender,
          address: updatedCustomer?.address ?? formData.address,
          phoneNumber: updatedCustomer?.phoneNumber ?? formData.phoneNumber,
          dateOfBirth: updatedDateOfBirth,
          profilePhoto: updatedProfilePhoto,
          profile_completed: updatedCustomer?.profile_completed ?? user?.profile_completed
        });

        setProfileImagePreview(updatedProfilePhoto);

        setIsEditing(false);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        const errorMessage = response.error?.message || 'Failed to update profile';
        setError(errorMessage);
        toast({
          title: "Update Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const status = (error as { status?: number })?.status;
      if (status === 401) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        logout();
        navigate('/customer/login');
        return;
      }

      const message = error instanceof Error ? error.message : 'Network error. Please try again.';
      setError(message);
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: "Invalid Confirmation",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiClient.deleteCustomerAccount(deleteConfirmation) as { success: boolean; message?: string; error?: { message: string } };

      if (data.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        
        // Logout and redirect
        logout();
        navigate('/');
      } else {
        toast({
          title: "Deletion Failed",
          description: data.error?.message || "Failed to delete account",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
  };

  const handleFixRegistrationMethod = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.fixRegistrationMethod('google') as { success: boolean; message?: string; error?: { message: string } };
      
      if (response.success) {
        toast({
          title: "Registration Method Fixed",
          description: "Your registration method has been updated to Google. Please refresh the page to see the changes.",
        });
        
        // Refresh user data
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: response.error?.message || "Failed to fix registration method. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Fix registration method error:', error);
      toast({
        title: "Error",
        description: "Failed to fix registration method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profileImagePreview || formData.profilePhoto} />
                    <AvatarFallback className="text-lg">
                      {formData.firstName?.[0]}{formData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <CardTitle className="text-xl">
                  {formData.firstName} {formData.lastName}
                </CardTitle>
                <CardDescription>{formData.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profile Status</span>
                  <span className={`text-sm font-medium ${user.profile_completed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.profile_completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mode of Registration</span>
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-2 text-sm font-medium">
                      {user.registrationMethod === 'google' ? (
                        <>
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span className="text-blue-600">Google</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">Manual Email</span>
                        </>
                      )}
                    </span>
                    {user.registrationMethod === 'email' && user.profilePhoto && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleFixRegistrationMethod}
                        disabled={isLoading}
                        className="text-xs h-6 px-2"
                      >
                        Fix
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <span className={`text-sm font-medium ${user.verified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      {isEditing ? 'Edit your profile information' : 'View your profile information'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-muted focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-muted focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={handleSelectChange} disabled={!isEditing}>
                      <SelectTrigger className="border-muted focus:border-primary focus:ring-primary">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 border-muted focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`pl-10 border-muted focus:border-primary focus:ring-primary ${dobError ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {dobError && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {dobError}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 border-muted focus:border-primary focus:ring-primary min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Password Change Section */}
                  {isEditing && (
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.currentPassword}
                              onChange={handleChange}
                              placeholder="Enter current password"
                              className="border-muted focus:border-primary focus:ring-primary"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="border-muted focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="border-muted focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-8 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Warning:</strong> This will delete:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Your profile and personal information</li>
                              <li>All your orders and order history</li>
                              <li>Your wishlist and cart items</li>
                              <li>All associated data across the platform</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <Label htmlFor="deleteConfirmation">
                            Type <strong>DELETE</strong> to confirm:
                          </Label>
                          <Input
                            id="deleteConfirmation"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="border-red-300 focus:border-red-500 focus:ring-red-500"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowDeleteDialog(false);
                            setDeleteConfirmation('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={isLoading || deleteConfirmation !== 'DELETE'}
                        >
                          {isLoading ? 'Deleting...' : 'Delete Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerProfile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Edit3,
  Trash2,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  XCircle,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/api';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";

import { formatDate } from "@/lib/format";
const VendorProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, logout, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessWebsite: '',
    businessAddress: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    businessType: '',
    description: '',
    categories: [] as string[],
    profilePhoto: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const businessTypes = [
    'Retail Store',
    'Online Store',
    'Manufacturer',
    'Wholesaler',
    'Service Provider',
    'Restaurant',
    'Other'
  ];

  const availableCategories = [
    'Electronics',
    'Clothing & Fashion',
    'Home & Garden',
    'Beauty & Health',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Automotive',
    'Food & Beverage',
    'Jewelry & Accessories',
    'Art & Crafts',
    'Office Supplies'
  ];

  useEffect(() => {
    // Wait for auth to load before checking
    if (authLoading) {
      return;
    }

    // Only redirect if user is definitely not authenticated
    if (!user || user.role !== 'vendor') {
      navigate('/vendor/login');
      return;
    }

    // Pre-fill form with existing data
    setFormData({
      businessName: user.businessName || '',
      businessEmail: user.businessEmail || '',
      businessPhone: user.businessPhone || '',
      businessWebsite: user.businessWebsite || '',
      businessAddress: user.businessAddress || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      postalCode: user.postalCode || '',
      businessType: user.businessType || '',
      description: user.description || '',
      categories: user.categories || [],
      profilePhoto: user.profilePhoto || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setProfileImagePreview(user.profilePhoto || '');
  }, [user, navigate, authLoading]);

  // Handle profile image upload - only shows preview, uploads when Save is clicked
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: i18n.t('pages.vendorProfile.invalidFileType'),
          description: i18n.t('pages.vendorProfile.pleaseSelectAnImageFile'),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: i18n.t('pages.vendorProfile.fileTooLarge'),
          description: i18n.t('pages.vendorProfile.pleaseSelectAnImageSmallerThan'),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      businessType: value
    }));
    if (error) setError('');
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    if (error) setError('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate password change if provided
      if (formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          setError(i18n.t('pages.vendorProfile.currentPasswordIsRequiredToChange'));
          setIsLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError(i18n.t('pages.vendorProfile.newPasswordsDoNotMatch'));
          setIsLoading(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          setError(i18n.t('pages.vendorProfile.newPasswordMustBeAtLeast'));
          setIsLoading(false);
          return;
        }
      }

      // Validate required fields
      if (!formData.businessName || !formData.businessEmail || !formData.businessPhone ||
        !formData.businessAddress || !formData.city || !formData.state ||
        !formData.country || !formData.postalCode || !formData.businessType ||
        !formData.description || formData.categories.length === 0) {
        setError(i18n.t('pages.vendorProfile.allFieldsAreRequired'));
        setIsLoading(false);
        return;
      }

      // Upload profile photo first if a new image was selected
      let profilePhotoUrl = formData.profilePhoto;
      if (profileImage) {
        try {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve, reject) => {
            reader.onload = (e) => {
              const result = e.target?.result;
              if (typeof result === 'string') {
                resolve(result);
              } else {
                reject(new Error(i18n.t('pages.vendorProfile.failedToReadFile')));
              }
            };
            reader.onerror = () => reject(new Error(i18n.t('pages.vendorProfile.failedToReadFile')));
            reader.readAsDataURL(profileImage);
          });

          const uploadResponse = await apiClient.uploadVendorProfilePhoto(base64, profileImage.name) as {
            success?: boolean;
            data?: { url?: string };
            error?: { message?: string };
          };

          if (uploadResponse.success && uploadResponse.data?.url) {
            profilePhotoUrl = uploadResponse.data.url;
          } else {
            const errorMsg = uploadResponse.error?.message || 'Failed to upload profile photo. Please try again.';
            setError(errorMsg);
            toast({
              title: i18n.t('pages.vendorProfile.uploadFailed'),
              description: errorMsg,
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
        } catch (uploadError: any) {
          console.error('Profile photo upload error:', uploadError);
          const errorMsg = uploadError?.message || 'Failed to upload profile photo. Please try again.';
          setError(errorMsg);
          toast({
            title: i18n.t('pages.vendorProfile.uploadFailed'),
            description: errorMsg,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const updateData: any = {
        businessName: formData.businessName,
        businessPhone: formData.businessPhone,
        businessWebsite: formData.businessWebsite,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        businessType: formData.businessType,
        description: formData.description,
        categories: formData.categories,
        profilePhoto: profilePhotoUrl
      };

      // Add password change if provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await apiClient.updateVendorProfile(updateData) as {
        success?: boolean;
        message?: string;
        data?: { vendor?: any };
        error?: { message?: string };
      };

      if (response.success) {
        toast({
          title: i18n.t('pages.vendorProfile.profileUpdated'),
          description: response.message || i18n.t('pages.vendorProfile.yourProfileHasBeenUpdatedSuccessfully'),
        });

        // Use profile photo from response or the uploaded URL
        const updatedProfilePhoto = response.data?.vendor?.profilePhoto || profilePhotoUrl || formData.profilePhoto;

        // Update user context
        updateUser({
          ...user,
          businessName: formData.businessName,
          businessPhone: formData.businessPhone,
          businessWebsite: formData.businessWebsite,
          businessAddress: formData.businessAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          businessType: formData.businessType,
          description: formData.description,
          categories: formData.categories,
          profilePhoto: updatedProfilePhoto
        });

        // Clear image preview and file since it's now saved
        setProfileImage(null);
        setProfileImagePreview(updatedProfilePhoto);

        // Update formData with new profile photo
        setFormData(prev => ({
          ...prev,
          profilePhoto: updatedProfilePhoto,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        setIsEditing(false);
      } else {
        setError(response.error?.message || i18n.t('pages.vendorProfile.failedToUpdateProfile'));
        toast({
          title: i18n.t('pages.vendorProfile.updateFailed'),
          description: response.error?.message || i18n.t('pages.vendorProfile.failedToUpdateProfile'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(i18n.t('pages.vendorProfile.networkErrorPleaseTryAgain'));
      toast({
        title: i18n.t('pages.vendorProfile.updateFailed'),
        description: i18n.t('pages.vendorProfile.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: i18n.t('pages.vendorProfile.invalidConfirmation'),
        description: i18n.t('pages.vendorProfile.pleaseTypeDeleteToConfirmAccount'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/vendor/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: i18n.t('pages.vendorProfile.accountDeleted'),
          description: i18n.t('pages.vendorProfile.yourVendorAccountHasBeenPermanently'),
        });

        // Logout and redirect
        logout();
        navigate('/');
      } else {
        toast({
          title: i18n.t('pages.vendorProfile.deletionFailed'),
          description: data.error?.message || i18n.t('pages.vendorProfile.failedToDeleteAccount'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast({
        title: i18n.t('pages.vendorProfile.deletionFailed'),
        description: i18n.t('pages.vendorProfile.networkErrorPleaseTryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    }
  };

  if (!user || user.role !== 'vendor') {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('pages.vendorProfile.vendorProfile')}
              </h1>
              <p className="text-muted-foreground">
                {t('pages.vendorProfile.manageYourBusinessInformationAndAccount')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    {formData.profilePhoto || profileImagePreview ? (
                      <img
                        src={profileImagePreview || formData.profilePhoto}
                        alt={t('pages.vendorProfile.profile')}
                        className="w-20 h-20 rounded-full object-cover border-2 border-orange-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center">
                        <Store className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                      </div>
                    )}
                    {isEditing && (
                      <>
                        <div
                          className="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
                          onClick={() => document.getElementById('profile-photo-upload')?.click()}
                        >
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                        <input
                          id="profile-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                  <CardTitle className="text-lg">{formData.businessName}</CardTitle>
                  <CardDescription>{formData.businessEmail}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.vendorProfile.memberSince')}</span>
                    <span className="text-sm font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.vendorProfile.approvalStatus')}</span>
                    <Badge
                      variant={user.approved ? "default" : "secondary"}
                      className={user.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                    >
                      {user.approved ? (
                        <><CheckCircle className="h-3 w-3 mr-1" />{t('pages.vendorProfile.approved')}</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" />{t('pages.vendorProfile.pending')}</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.vendorProfile.modeOfRegistration')}</span>
                    <span className="flex items-center space-x-2 text-sm font-medium">
                      {user.registrationMethod === 'google' ? (
                        <>
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="text-blue-600">{t('pages.vendorProfile.google')}</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 text-gray-600" />
                          <span className="text-gray-600">{t('pages.vendorProfile.manualEmail')}</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.vendorProfile.accountStatus')}</span>
                    <span className={`text-sm font-medium ${user.verified ? 'text-green-600' : 'text-red-600'}`}>
                      {user.verified ? t('pages.vendorProfile.verified') : t('pages.vendorProfile.unverified')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('pages.vendorProfile.businessType')}</span>
                    <span className="text-sm font-medium">{formData.businessType}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t('pages.vendorProfile.businessInformation')}</CardTitle>
                      <CardDescription>
                        {isEditing ? t('pages.vendorProfile.editYourBusinessInformation') : t('pages.vendorProfile.viewYourBusinessInformation')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                          <Edit3 className="h-4 w-4 mr-2" />
                          {t('pages.vendorProfile.editProfile')}
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={() => setIsEditing(false)} variant="outline">
                            {t('pages.vendorProfile.cancel')}
                          </Button>
                          <Button onClick={handleSave} disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? t('pages.vendorProfile.saving') : t('pages.vendorProfile.saveChanges')}
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
                    {/* Business Name */}
                    <div className="space-y-2">
                      <Label htmlFor="businessName">{t('pages.vendorProfile.businessName')}</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-muted focus:border-primary focus:ring-primary"
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">{t('pages.vendorProfile.businessEmail')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="businessEmail"
                          name="businessEmail"
                          value={formData.businessEmail}
                          disabled
                          className="pl-10 bg-muted/50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('pages.vendorProfile.emailCannotBeChanged')}
                      </p>
                    </div>

                    {/* Phone and Website */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessPhone">{t('pages.vendorProfile.businessPhone')}</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="businessPhone"
                            name="businessPhone"
                            type="tel"
                            value={formData.businessPhone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="pl-10 border-muted focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessWebsite">{t('pages.vendorProfile.businessWebsite')}</Label>
                        <Input
                          id="businessWebsite"
                          name="businessWebsite"
                          type="url"
                          value={formData.businessWebsite}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="https://example.com"
                          className="border-muted focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">{t('pages.vendorProfile.businessAddress')}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="businessAddress"
                          name="businessAddress"
                          value={formData.businessAddress}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="pl-10 border-muted focus:border-primary focus:ring-primary min-h-[100px]"
                        />
                      </div>
                    </div>

                    {/* Location Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t('pages.vendorProfile.city')}</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-muted focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">{t('pages.vendorProfile.state')}</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-muted focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">{t('pages.vendorProfile.country')}</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-muted focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">{t('pages.vendorProfile.postalCode')}</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="border-muted focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Business Type */}
                    <div className="space-y-2">
                      <Label htmlFor="businessType">{t('pages.vendorProfile.businessType2')}</Label>
                      <Select value={formData.businessType} onValueChange={handleSelectChange} disabled={!isEditing}>
                        <SelectTrigger className="border-muted focus:border-primary focus:ring-primary">
                          <SelectValue placeholder={t('pages.vendorProfile.selectBusinessType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <Label>{t('pages.vendorProfile.businessCategories')}</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {availableCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={category}
                              checked={formData.categories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              disabled={!isEditing}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={category} className="text-sm font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {formData.categories.length === 0 && (
                        <p className="text-sm text-red-600">{t('pages.vendorProfile.pleaseSelectAtLeastOneCategory')}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">{t('pages.vendorProfile.businessDescription')}</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={t('pages.vendorProfile.describeYourBusinessProductsAndServices')}
                        className="border-muted focus:border-primary focus:ring-primary min-h-[120px]"
                      />
                    </div>

                    {/* Password Change Section */}
                    {isEditing && (
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-medium">{t('pages.vendorProfile.changePassword')}</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">{t('pages.vendorProfile.currentPassword')}</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder={t('pages.vendorProfile.enterCurrentPassword')}
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
                            <Label htmlFor="newPassword">{t('pages.vendorProfile.newPassword')}</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleChange}
                              placeholder={t('pages.vendorProfile.enterNewPassword')}
                              className="border-muted focus:border-primary focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t('pages.vendorProfile.confirmNewPassword')}</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              placeholder={t('pages.vendorProfile.confirmNewPassword2')}
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
                    {t('pages.vendorProfile.dangerZone')}
                  </CardTitle>
                  <CardDescription>
                    {t('pages.vendorProfile.irreversibleAndDestructiveActions')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{t('pages.vendorProfile.deleteAccount')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('pages.vendorProfile.permanentlyDeleteYourVendorAccountAnd')}
                      </p>
                    </div>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('pages.vendorProfile.deleteAccount')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600">{t('pages.vendorProfile.deleteAccount')}</DialogTitle>
                          <DialogDescription>
                            {t('pages.vendorProfile.thisActionCannotBeUndoneThis')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>{t('pages.vendorProfile.warning')}</strong> {t('pages.vendorProfile.thisWillDelete')}
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>{t('pages.vendorProfile.yourVendorProfileAndBusinessInformation')}</li>
                                <li>{t('pages.vendorProfile.allYourProductsAndProductListings')}</li>
                                <li>{t('pages.vendorProfile.allYourOrdersAndOrderHistory')}</li>
                                <li>{t('pages.vendorProfile.allAssociatedDataAcrossThePlatform')}</li>
                              </ul>
                            </AlertDescription>
                          </Alert>
                          <div className="space-y-2">
                            <Label htmlFor="deleteConfirmation">
                              {t('pages.vendorProfile.type')} <strong>{t('pages.vendorProfile.delete')}</strong> {t('pages.vendorProfile.toConfirm')}
                            </Label>
                            <Input
                              id="deleteConfirmation"
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              placeholder={t('pages.vendorProfile.typeDeleteToConfirm')}
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
                            {t('pages.vendorProfile.cancel')}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isLoading || deleteConfirmation !== 'DELETE'}
                          >
                            {isLoading ? t('pages.vendorProfile.deleting') : t('pages.vendorProfile.deleteAccount')}
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

export default VendorProfile;

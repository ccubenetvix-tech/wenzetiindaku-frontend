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
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/utils/api';
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, clearSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>(user?.profilePhoto || '');
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
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    gender: '',
    address: '',
    phoneNumber: '',
    dateOfBirth: '',
    profilePhoto: user?.profilePhoto || ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/customer/login');
      return;
    }

    // If profile is already completed, redirect to home
    if (user.profile_completed) {
      navigate('/');
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
      profilePhoto: user.profilePhoto || ''
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: i18n.t('pages.updateProfile.invalidFileType'),
          description: i18n.t('pages.updateProfile.pleaseSelectAnImageFile'),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: i18n.t('pages.updateProfile.fileTooLarge'),
          description: i18n.t('pages.updateProfile.pleaseSelectAnImageSmallerThan'),
          variant: "destructive",
        });
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate DOB before saving
    if (formData.dateOfBirth && !validateAge(formData.dateOfBirth)) {
      setError(i18n.t('pages.updateProfile.youMustBeAtLeast18'));
      setIsLoading(false);
      return;
    }

    try {
      // Validate required fields
      if (!formData.gender || !formData.address || !formData.phoneNumber || !formData.dateOfBirth) {
        setError(i18n.t('pages.updateProfile.pleaseFillInAllRequiredFields'));
        setIsLoading(false);
        return;
      }

      // Prepare form data
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        profilePhoto: profileImagePreview || formData.profilePhoto
      };

      // Make API call
      const response = await apiClient.updateCustomerProfile(submitData) as {
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
          title: i18n.t('pages.updateProfile.profileUpdated'),
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
          profile_completed: updatedCustomer?.profile_completed ?? true
        });

        setProfileImagePreview(updatedProfilePhoto);

        // Redirect to home page
        navigate('/');
      } else {
        const errorMessage = response.error?.message || 'Failed to update profile';
        setError(errorMessage);
        toast({
          title: i18n.t('pages.updateProfile.updateFailed'),
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const status = (error as { status?: number })?.status;
      if (status === 401) {
        clearSession();
        navigate('/customer/login');
        toast({
          title: i18n.t('pages.updateProfile.sessionExpired'),
          description: i18n.t('pages.updateProfile.pleaseLogInAgainToContinue'),
          variant: "destructive",
        });
        return;
      }

      const message = error instanceof Error ? error.message : 'Network error. Please try again.';
      setError(message);
      toast({
        title: i18n.t('pages.updateProfile.updateFailed'),
        description: message,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('pages.updateProfile.backToHome')}
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('pages.updateProfile.completeYourProfile')}
            </h1>
            <p className="text-muted-foreground">
              {t('pages.updateProfile.addSomeDetailsToPersonalizeYour')}
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">{t('pages.updateProfile.profileInformation')}</CardTitle>
            <CardDescription>
              {t('pages.updateProfile.pleaseProvideTheFollowingInformationTo')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImagePreview || formData.profilePhoto} />
                    <AvatarFallback className="text-lg">
                      {formData.firstName?.[0]}{formData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
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
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {t('pages.updateProfile.clickTheCameraIconToUpload')}
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('pages.updateProfile.firstName')}</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('pages.updateProfile.enterYourFirstName')}
                    className="border-muted focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('pages.updateProfile.lastName')}</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t('pages.updateProfile.enterYourLastName')}
                    className="border-muted focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('pages.updateProfile.emailAddress')}</Label>
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
                  {t('pages.updateProfile.emailCannotBeChanged')}
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">{t('pages.updateProfile.gender')}</Label>
                <Select value={formData.gender} onValueChange={handleSelectChange}>
                  <SelectTrigger className="border-muted focus:border-primary focus:ring-primary">
                    <SelectValue placeholder={t('pages.updateProfile.selectYourGender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('pages.updateProfile.male')}</SelectItem>
                    <SelectItem value="female">{t('pages.updateProfile.female')}</SelectItem>
                    <SelectItem value="other">{t('pages.updateProfile.other')}</SelectItem>
                    <SelectItem value="prefer-not-to-say">{t('pages.updateProfile.preferNotToSay')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('pages.updateProfile.phoneNumber')}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder={t('pages.updateProfile.enterYourPhoneNumber')}
                    className="pl-10 border-muted focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">{t('pages.updateProfile.dateOfBirth')}</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
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
                <Label htmlFor="address">{t('pages.updateProfile.address')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('pages.updateProfile.enterYourFullAddress')}
                    className="pl-10 border-muted focus:border-primary focus:ring-primary min-h-[100px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.gender || !formData.address || !formData.phoneNumber || !formData.dateOfBirth || !!dobError}
                className="w-full gradient-primary hover:from-blue-700 hover:to-blue-800 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('pages.updateProfile.completingProfile')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('pages.updateProfile.completeProfile')}
                  </div>
                )}
              </Button>
            </form>

            {/* Required Fields Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>{t('pages.updateProfile.note')}</strong> {t('pages.updateProfile.fieldsMarkedWithAreRequiredTo')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateProfile;

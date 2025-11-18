import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/api";

interface CustomerProfileResponse {
  success?: boolean;
  data?: {
    customer?: {
      firstName?: string | null;
      lastName?: string | null;
      email?: string;
      phoneNumber?: string | null;
    };
  };
}

const AddAddress = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [existingLabels, setExistingLabels] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    altPhone: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home" as "Home" | "Work" | "Other",
  });

  // Load user profile data to pre-fill form
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add an address.",
        variant: "destructive",
      });
      navigate("/customer/login", { state: { redirectTo: location.pathname } });
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const [profileResponse, addressesResponse] = await Promise.all([
          apiClient.getCustomerProfile() as Promise<CustomerProfileResponse>,
          apiClient.getCustomerAddresses() as Promise<{
            success?: boolean;
            data?: { addresses?: any[] };
          }>,
        ]);
        
        const customer = profileResponse?.data?.customer;
        if (customer) {
          const nameParts = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
          const fallbackName = nameParts || (user?.email ?? "Customer");
          const phone = customer.phoneNumber || null;
          
          setFormData((prev) => ({
            ...prev,
            fullName: fallbackName,
            phone: phone ?? "",
          }));
        }

        // Get existing address labels to show user what's already taken
        if (addressesResponse?.success && addressesResponse.data?.addresses) {
          const labels = addressesResponse.data.addresses.map((addr) => addr.label || "Home");
          setExistingLabels(labels);
        }

        // Check if we're editing an address
        const locationState = location.state as any;
        if (locationState?.editAddressId && locationState?.addressData) {
          const addressData = locationState.addressData;
          setIsEditing(true);
          setEditAddressId(locationState.editAddressId);
          
          // Pre-fill form with address data
          setFormData({
            fullName: addressData.full_name || "",
            phone: addressData.phone || "",
            altPhone: addressData.alt_phone || "",
            houseNo: addressData.street1 || "",
            street: addressData.street2 || "",
            city: addressData.city || "",
            state: addressData.state || "",
            pincode: addressData.postal_code || "",
            addressType: (addressData.label || "Home") as "Home" | "Work" | "Other",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [isAuthenticated, navigate, toast, location.pathname, user?.email]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: Array<keyof typeof formData> = [
      "fullName",
      "phone",
      "houseNo",
      "street",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        toast({
          title: "Missing information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return false;
    }

    // Validate pincode (should be numeric)
    if (!/^\d+$/.test(formData.pincode)) {
      toast({
        title: "Invalid pincode",
        description: "Pincode should contain only numbers.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Map form fields to API format
      const addressData = {
        fullName: formData.fullName.trim(),
        email: user?.email || "",
        phone: formData.phone.trim(),
        altPhone: formData.altPhone.trim() || undefined, // Optional alternate phone
        street1: formData.houseNo.trim(), // House No / Flat No
        street2: formData.street.trim(), // Street / Area
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.pincode.trim(), // Pincode
        country: "India", // Default country
        label: formData.addressType, // Address Type (Home/Work/Other)
      };

      console.log("Submitting address data:", addressData);
      
      let response;
      if (isEditing && editAddressId) {
        // Update existing address
        response = (await apiClient.updateCustomerAddress(editAddressId, addressData)) as {
          success?: boolean;
          message?: string;
          error?: { message?: string };
          data?: { address?: any };
        };
      } else {
        // Check if this is the first address (will be set as default)
        const addressesResponse = (await apiClient.getCustomerAddresses()) as {
          success?: boolean;
          data?: { addresses?: any[] };
        };
        const existingAddresses = addressesResponse?.data?.addresses || [];
        const isFirstAddress = existingAddresses.length === 0;
        
        // Add isDefault for new addresses
        const newAddressData = {
          ...addressData,
          isDefault: isFirstAddress,
        };
        
        response = (await apiClient.createCustomerAddress(newAddressData)) as {
          success?: boolean;
          message?: string;
          error?: { message?: string };
          data?: { address?: any };
        };
      }

      console.log("Address response:", response);

      if (!response?.success) {
        const errorMsg = response?.error?.message || (isEditing ? "Failed to update address" : "Failed to add address");
        console.error("Address operation failed:", errorMsg);
        throw new Error(errorMsg);
      }

      toast({
        title: isEditing ? "Address updated successfully" : "Address added successfully",
        description: isEditing ? "Your address has been updated." : "Your address has been saved.",
      });

      // Redirect back to the page that sent us here, or to dashboard
      const redirectTo = location.state?.from || "/customer/dashboard";
      navigate(redirectTo);
    } catch (error) {
      console.error("Failed to add address:", error);
      let message = "Something went wrong while adding your address. Please try again.";
      
      if (error instanceof Error) {
        message = error.message;
        // If it's a JSON string error, try to parse it
        if (error.message.includes('{')) {
          try {
            const parsed = JSON.parse(error.message);
            if (parsed.error?.message) {
              message = parsed.error.message;
            }
          } catch {
            // Keep original message if parsing fails
          }
        }
      }
      
      toast({
        title: "Failed to add address",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="bg-card border border-border/60 rounded-lg shadow-sm">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h1 className="text-2xl font-semibold">
                    {isEditing ? "Edit Address" : "Add New Address"}
                  </h1>
                </div>

                {isLoadingProfile ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading profile...
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="John Doe"
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="phone">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="+260 700 000 000"
                          required
                          autoComplete="tel"
                        />
                      </div>
                      <div>
                        <Label htmlFor="altPhone">Alternate Number (Optional)</Label>
                        <Input
                          id="altPhone"
                          value={formData.altPhone}
                          onChange={(e) => updateField("altPhone", e.target.value)}
                          placeholder="+260 700 000 001"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="houseNo">
                        House No / Flat No <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="houseNo"
                        value={formData.houseNo}
                        onChange={(e) => updateField("houseNo", e.target.value)}
                        placeholder="123, Flat 5B"
                        required
                        autoComplete="address-line1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="street">
                        Street / Area <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => updateField("street", e.target.value)}
                        placeholder="Main Street, Downtown"
                        required
                        autoComplete="address-line2"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="city">
                          City <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          placeholder="Lusaka"
                          required
                          autoComplete="address-level2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">
                          State <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          placeholder="Lusaka Province"
                          required
                          autoComplete="address-level1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">
                          Pincode <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => updateField("pincode", e.target.value)}
                          placeholder="10101"
                          required
                          autoComplete="postal-code"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="addressType">
                        Address Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.addressType}
                        onValueChange={(value) => updateField("addressType", value as "Home" | "Work" | "Other")}
                      >
                        <SelectTrigger id="addressType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home">
                            Home
                          </SelectItem>
                          <SelectItem value="Work">
                            Work
                          </SelectItem>
                          <SelectItem value="Other">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? "Update Address" : "Save Address"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddAddress;


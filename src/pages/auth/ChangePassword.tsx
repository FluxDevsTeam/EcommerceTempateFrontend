import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeOff, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Define the schema for form validation
const changePasswordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(30, { message: "Password must not exceed 30 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Infer the type from the schema
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setNewPassword } = useAuth();
  
  // Extract email from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
      // Store email in localStorage in case the page is refreshed
      localStorage.setItem('resetEmail', emailParam);
    } else {
      // If no email in URL, check if it's stored in localStorage
      const storedEmail = localStorage.getItem('resetEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        // No email found, show error
        setErrorMessage("Invalid password reset link. Please request a new one.");
      }
    }
  }, [location]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema)
  });
  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!email) {
      setErrorMessage('Email is missing. Please request a new password reset link.');
      return;
    }
  
    setIsSubmitting(true);
    setErrorMessage(null); // Clear previous errors
  
    try {
      // Use the updated function signature
      await setNewPassword({
        email: email,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword
      });
      
      setSuccess(true);
      toast.success('Password changed successfully!');
      
      // Clear stored email after successful password change
      localStorage.removeItem('resetEmail');
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password changed successfully. Please log in with your new password.' } 
        });
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
 

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-6 text-2xl font-bold">SHOP.CO</div>
          <CardTitle className="text-xl font-medium">New Password</CardTitle>
          {email && (
            <p className="text-sm text-gray-500 mt-2">
              Reset password for: {email}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Password changed successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {email && !success ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      className="h-14 pr-10"
                      {...register("newPassword")}
                      disabled={isSubmitting || success}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isSubmitting || success}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  <div className='h-5'>
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-14 pr-10"
                      {...register("confirmPassword")}
                      disabled={isSubmitting || success}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting || success}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  <div className='h-5'>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 mt-4 cursor-pointer"
                  disabled={isSubmitting || success}
                >
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </Button>
              </div>
            </form>
          ) : !success && errorMessage ? (
            <div className="text-center p-4">
              <Button 
                className="mt-4 text-blue-600 hover:underline"
                variant="link"
                onClick={() => navigate('/forgot-password')}
              >
                Request a new password reset link
              </Button>
            </div>
          ) : null}
         
        </CardContent>
      </div>
    </div>
  );
};

export default ChangePassword;
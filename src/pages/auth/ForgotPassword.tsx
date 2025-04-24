import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import authService from './authservice';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define schema for each step
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const otpSchema = z.object({
  otp: z.string().min(4, { message: "OTP must be at least 4 characters" }),
});

const passwordSchema = z.object({
  new_password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(30, { message: "Password must not exceed 30 characters" }),
  confirm_password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" }),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

// Define types from schemas
type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// Flow steps
enum ForgotPasswordStep {
  EMAIL = 'email',
  OTP = 'otp',
  NEW_PASSWORD = 'new_password',
  SUCCESS = 'success',
}

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.EMAIL);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Email form setup
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });
  
  // OTP form setup
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });
  
  // Password form setup
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  
  // Step 1: Request password reset
  const onSubmitEmail = async (data: EmailFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setEmail(data.email);
      
      await authService.requestForgotPassword(data.email);
      toast.success('OTP sent to your email address');
      setCurrentStep(ForgotPasswordStep.OTP);
    } catch (err: any) {
      console.error('Forgot password request error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Step 2: Verify OTP
  const onSubmitOtp = async (data: OtpFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.verifyForgotPasswordOTP(email, data.otp);
      toast.success('OTP verified successfully');
      setCurrentStep(ForgotPasswordStep.NEW_PASSWORD);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Step 3: Set new password
  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.setNewPassword({
        email: email,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      
      toast.success('Password changed successfully');
      setCurrentStep(ForgotPasswordStep.SUCCESS);
    } catch (err: any) {
      console.error('Set new password error:', err);
      setError(err.response?.data?.message || 'Failed to set new password. Please try again.');
      toast.error('Failed to set new password');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Resend OTP handler
  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.resendForgotPasswordOTP(email);
      toast.success('New OTP sent to your email');
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">SHOP.CO</h1>
          <h2 className="text-xl mt-4">Forgot Password</h2>
        </div>
        
        {/* Email Step */}
        {currentStep === ForgotPasswordStep.EMAIL && (
          <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className="p-5"
                {...registerEmail("email")} 
              />
              <div className="h-5">
                {emailErrors.email && (
                  <p className="text-sm text-red-500">{emailErrors.email.message}</p>
                )}
              </div>
            </div>
            
            {error && (
              <Alert className="bg-red-50 text-red-500 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
        
        {/* OTP Step */}
        {currentStep === ForgotPasswordStep.OTP && (
          <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4">
            <Alert className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
              <AlertDescription>
                We've sent a verification code to {email}. Please check your inbox and enter the code below.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input 
                id="otp" 
                type="text" 
                placeholder="Enter verification code" 
                className="p-5 text-center tracking-widest text-lg"
                {...registerOtp("otp")} 
              />
              <div className="h-5">
                {otpErrors.otp && (
                  <p className="text-sm text-red-500">{otpErrors.otp.message}</p>
                )}
              </div>
            </div>
            
            {error && (
              <Alert className="bg-red-50 text-red-500 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={handleResendOtp}
                className="text-sm text-blue-600 hover:underline mr-4"
                disabled={isLoading}
              >
                Resend Code
              </button>
              <button 
                type="button" 
                onClick={() => setCurrentStep(ForgotPasswordStep.EMAIL)}
                className="text-sm hover:underline"
              >
                Use Different Email
              </button>
            </div>
          </form>
        )}
        
        {/* New Password Step */}
        {currentStep === ForgotPasswordStep.NEW_PASSWORD && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input 
                id="new_password" 
                type="password" 
                placeholder="Enter new password" 
                className="p-5"
                {...registerPassword("new_password")} 
              />
              <div className="h-5">
                {passwordErrors.new_password && (
                  <p className="text-sm text-red-500">{passwordErrors.new_password.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input 
                id="confirm_password" 
                type="password" 
                placeholder="Confirm new password" 
                className="p-5"
                {...registerPassword("confirm_password")} 
              />
              <div className="h-5">
                {passwordErrors.confirm_password && (
                  <p className="text-sm text-red-500">{passwordErrors.confirm_password.message}</p>
                )}
              </div>
            </div>
            
            {error && (
              <Alert className="bg-red-50 text-red-500 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        )}
        
        {/* Success Step */}
        {currentStep === ForgotPasswordStep.SUCCESS && (
          <div className="text-center space-y-6">
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <AlertDescription>
                Your password has been reset successfully! You can now log in with your new password.
              </AlertDescription>
            </Alert>
            
            <Link to="/login" state={{ passwordChanged: true }}>
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
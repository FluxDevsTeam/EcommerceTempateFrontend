import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Define the schema for form validation
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

// Infer the type from the schema
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { requestForgotPassword } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });
  
  const watchedEmail = watch("email", "");

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null); // Clear previous errors
      
      // Call the provided requestForgotPassword function
      await requestForgotPassword(data.email);
      
      setEmailSent(true);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send password reset email. Please try again.';
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
          <CardTitle className="text-xl font-medium">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-800 rounded-md text-center">
                <h3 className="font-medium">Reset Email Sent!</h3>
                <p className="mt-2">
                  We've sent a password reset link to: <br />
                  <span className="font-medium">{watchedEmail}</span>
                </p>
                <p className="mt-2 text-sm">
                  Please check your inbox and click on the link to reset your password.
                </p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button 
                    className="text-blue-600 hover:underline"
                    onClick={() => onSubmit({ email: watchedEmail })}
                    disabled={isSubmitting}
                  >
                    try again
                  </button>
                </p>
              </div>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    className="h-14 px-4"
                    {...register("email")}
                  />
                  <div className='h-5'>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                    {errorMessage}
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 mt-4 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm">
                  Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default ForgotPassword;
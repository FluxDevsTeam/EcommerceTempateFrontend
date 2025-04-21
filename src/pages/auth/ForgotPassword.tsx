import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Local error state
  
  const { requestForgotPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null); // Clear previous errors
      
      await requestForgotPassword(data.email);
      
      toast.success('Password reset email sent. Please check your inbox.');
      navigate('/change-password', { state: { email: data.email, isPasswordReset: true } });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to request password reset. Please try again.';
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
                {isSubmitting ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm">
              Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default ForgotPassword;
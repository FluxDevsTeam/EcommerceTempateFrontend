import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';;

// Define the schema for form validation
const signupSchema = z.object({
  firstName: z.string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must not exceed 50 characters" }),
  lastName: z.string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must not exceed 50 characters" }),
  phoneNumber: z.string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(15, { message: "Phone number must not exceed 15 characters" })
    .regex(/^\+?\d+$/, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(30, { message: "Password must not exceed 30 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Infer the type from the schema
type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Local error state
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null); // Clear previous errors
      
      // Prepare user data
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        email: data.email,
        password: data.password,
        verify_password: data.confirmPassword 
      };
      
      // Call signup service
      await signup(userData);
      
      // If successful, navigate to verification page
      toast.success('Signup successful! Please verify your email.');
      navigate('/verify-email', { state: { email: data.email } });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full my-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
         <Link to="/">
                   <img 
                     src="/images/logo.png" 
                     alt="SHOP.CO Logo" 
                     className="h-10 w-auto mx-auto cursor-pointer"
                   />
                 </Link>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="Enter First Name" 
              className='p-5'
              {...register("firstName")}
            />
            <div className="h-5">
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="Enter Last Name" 
              className='p-5'
              {...register("lastName")}
            />
            <div className="h-5">
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              placeholder="Enter Phone Number" 
              className='p-5'
              {...register("phoneNumber")}
            />
            <div className="h-5">
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter Email" 
              className='p-5'
              {...register("email")}
            />
            <div className="h-5">
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Enter Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password"
                className='p-5'
                {...register("password")}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            <div className="h-5">
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm password" 
                className='p-5'
                {...register("confirmPassword")}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            <div className="h-5">
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
            className="w-full bg-[#0057b7] text-white hover:bg-[#004494]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
          
        <div className="flex w-full items-center gap-4 py-6">
          <div className="w-[50%] h-1 bg-neutral-900" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="w-[50%] h-1 bg-neutral-900" />
        </div>
        
        {/* <Button variant="outline" className="w-full p-5">
          <img 
            src="./images/Symbol.svg.png" 
            alt="Google logo" 
            className="mr-2 h-4 w-4"
          />
          Continue with Google
        </Button> */}

        <p className="text-sm pt-4">Already have an account? <Link to='/login' className='underline'>Login</Link> here</p>
      </div>
    </div>
  );
};

export default Signup;
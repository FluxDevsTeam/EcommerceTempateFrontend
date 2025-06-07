import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import logo from '/images/logo.png'


// Define the schema for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(30, { message: "Password must not exceed 30 characters" })
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  

  useEffect(() => {
    
  }, [location.state]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearError(); // Clear previous errors
      
      
      
      // Call login service
      await login(data.email, data.password);
      
      // Modified toast with blue theme
      toast.success('Login successful!', {
        style: {
          background: '#ffffff', // Brighter blue
          color: '#000000'       
        },
        position: "top-right",
      });
      
      // ADD logic to redirect to intended path or default to /dashboard
      const searchParams = new URLSearchParams(location.search);
      const redirectUrlFromQuery = searchParams.get('redirect');
      const from = location.state?.from?.pathname || redirectUrlFromQuery || '/dashboard';
      navigate(from, { replace: true });

    } catch (err: any) {
      
      toast.error(error || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
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
            <Label htmlFor="password">Password</Label>
            <div className="relative h-auto">
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
          
          <div className="text-sm">
            <Link to='/forgot-password'><p className="hover:underline">Forgot Password?</p></Link>  
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-[#0057b7] text-white hover:bg-[#004494]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
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

        <p className="text-sm pt-4">Is it your first time here? <Link to='/signup' className='underline'>SignUp</Link> here</p>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';



 const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex  items-center justify-center ">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">SHOP.CO</h1>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter Email" className='p-5' />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                className='p-5' 
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
          </div>
          
          <div className="text-sm">
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>
          
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            Login
          </Button>
        </div>
        
        <div className="flex w-full items-center gap-4 py-6">
          <div className="w-[50%] h-1 bg-neutral-900" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="w-[50%] h-1 bg-neutral-900 " />
        </div>
        
        <Button variant="outline" className="w-full p-5">
          <img 
            src="./images/Symbol.svg.png" 
            alt="Google logo" 
            className="mr-2 h-4 w-4" 
          />
          Continue with Google
        </Button>
      </div>
    </div>

  );
};
export default Login
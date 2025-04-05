import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset request
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-6 text-2xl font-bold">SHOP.CO</div>
          <CardTitle className="text-xl font-medium">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 px-4"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 mt-4"
              >
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default ForgotPassword;
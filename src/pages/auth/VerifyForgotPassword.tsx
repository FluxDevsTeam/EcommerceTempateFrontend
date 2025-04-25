import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

type VerifyOtpFormData = {
  otp: string;
};

const VerifyForgotPassword = () => {
  const [timeLeft, setTimeLeft] = useState<number>(178); // Start with initial countdown
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    verifyForgotPasswordOTP,
    resendForgotPasswordOTP,
    error, 
    clearError 
  } = useAuth();
  
  // Get email from location state or localStorage
  const stateEmail = location.state?.email;
  const storedEmail = localStorage.getItem('resetEmail');
  const [email, setEmail] = useState<string>(stateEmail || storedEmail || '');
  const [otpSendFailed] = useState<boolean>(location.state?.otpSendFailed || false);
  
  const inputRefs = Array(6).fill(null).map(() => useRef<HTMLInputElement>(null));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<VerifyOtpFormData>();

  const otpRegister = register("otp", { 
    required: "Verification code is required",
    minLength: { value: 6, message: "Please enter the complete code" }
  });
  const otp = watch("otp", "").split('').concat(Array(6).fill('')).slice(0, 6);

  // Store email in localStorage when it changes
  useEffect(() => {
    if (email) {
      localStorage.setItem('resetEmail', email);
    }
    
    // If OTP send failed on arrival, show message but don't auto-resend
    if (otpSendFailed) {
      toast.error('Failed to send verification code. Please request a new one.');
    }
  }, [email, otpSendFailed]);

  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string): void => {
    if (value.length <= 1) {
      const newCode = [...otp];
      newCode[index] = value;
      const joinedCode = newCode.join('');
      setValue("otp", joinedCode);
      
      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newCode = [...otp];
      newCode[index - 1] = '';
      setValue("otp", newCode.join(''));
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    setValue("otp", pastedData);
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs[lastIndex].current?.focus();
  };

  const onSubmit = async (data: VerifyOtpFormData) => {
    if (!email) {
      toast.error('Email is missing. Please try again.');
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await verifyForgotPasswordOTP(email, data.otp);
      
      setSuccess(true);
      toast.success('Email verification successful!');
      
      // Remove email from localStorage
      localStorage.removeItem('resetEmail');
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            verified: true,
            message: 'Password changed and verified successfully. Please log in with your new password.'
          } 
        });
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Invalid verification code. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      console.error('Cannot resend - email is missing:', email);
      return;
    } 
    clearError();
    setIsResending(true); 

    try {
      console.log('Attempting to resend OTP to:', email);
      await resendForgotPasswordOTP(email);
      toast.success('Verification code sent successfully!');
      setTimeLeft(178); // Reset countdown timer after successful resend
    }
    catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to send verification code.';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-6 text-2xl font-bold">SHOP.CO</div>
          <CardTitle className="text-xl font-medium">Verify Your Email</CardTitle>
          {email && (
            <p className="text-sm text-gray-500 mt-2">
              Complete password reset for: {email}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Email verified successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-6">
              <span>Click "Resend" to receive a verification code at <span className="font-medium">{email}</span></span>
            </div>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  name={`${otpRegister.name}.${index}`}
                  onChange={(e) => {
                    otpRegister.onChange(e);
                    handleChange(index, e.target.value);
                  }}
                  onBlur={otpRegister.onBlur}
                  type="text"
                  inputMode="numeric"
                  className="w-12 h-12 text-center text-2xl"
                  value={digit}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isSubmitting || success}
                />
              ))}
            </div>
            <div className='h-5 text-center'>
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Get Verification Code:{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm font-normal text-blue-600"
                  disabled={isResending || isSubmitting || success}
                  onClick={handleResendCode}
                  type="button"
                >
                  {isResending ? "Sending..." : "Resend"}
                </Button>
                {timeLeft > 0 && (
                  <span className="text-sm text-gray-600">
                    {' '}({formatTime(timeLeft)})
                  </span>
                )}
              </span>
            </div>
            <Button 
              type="submit"
              className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 mt-4 cursor-pointer"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? "Verifying..." : "Verify & Login"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default VerifyForgotPassword;
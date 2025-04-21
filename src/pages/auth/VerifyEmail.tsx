import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the schema for form validation
const verifyEmailSchema = z.object({
  code: z.string().length(6, { message: "Verification code must be 6 digits" })
    .regex(/^\d{6}$/, { message: "Code must contain only numbers" })
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

const VerifyEmail = () => {
  const [timeLeft, setTimeLeft] = useState<number>(178);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    verifySignupOTP,
    resendSignupOTP,
    error, 
    clearError 
  } = useAuth();
  
  // Enhanced email handling with fallbacks
  const email = location.state?.email || localStorage.getItem('signupEmail') || '';
  const [currentEmail, setCurrentEmail] = useState<string>(email);

  // Store email in localStorage and state
  useEffect(() => {
    if (email && email !== currentEmail) {
      localStorage.setItem('signupEmail', email);
      setCurrentEmail(email);
    }
  }, [email, currentEmail]);

  const inputRefs = Array(6).fill(null).map(() => useRef<HTMLInputElement>(null));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema)
  });

  const codeRegister = register("code");
  const code = watch("code", "").split('').concat(Array(6).fill('')).slice(0, 6);

  // Handle input change
  const handleChange = (index: number, value: string): void => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      const joinedCode = newCode.join('');
      setValue("code", joinedCode, { shouldValidate: true });
      
      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setValue("code", newCode.join(''), { shouldValidate: true });
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      setValue("code", pastedData, { shouldValidate: true });
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs[lastIndex].current?.focus();
    }
  };

  // Timer countdown (still keep for informational purposes)
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

  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!currentEmail) {
      console.error('Email is missing. Current email state:', currentEmail);
      console.error('Location state:', location.state);
      console.error('LocalStorage:', localStorage.getItem('signupEmail'));
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      console.log('Attempting verification with:', {
        email: currentEmail,
        code: data.code
      });
      
      const result = await verifySignupOTP(currentEmail, data.code);
      console.log('Verification successful:', result);
      
      setSuccess(true);
      localStorage.removeItem('signupEmail');
      
      setTimeout(() => {
        navigate('/login', { state: { verified: true } });
      }, 1000);
    } catch (err) {
      console.error('Verification failed - Full error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!currentEmail) {
      console.error('Cannot resend - email is missing:', currentEmail);
      return;
    }
    
    // Removed the timeLeft > 0 check to allow resending at any time

    clearError();
    setIsResending(true);
    
    try {
      console.log('Attempting to resend OTP to:', currentEmail);
      const result = await resendSignupOTP(currentEmail);
      console.log('Resend successful:', result);
      
      // Reset timer after successful resend
      setTimeLeft(178);
    } catch (err) {
      console.error('Resend failed - Full error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
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
              Enter the Code sent to{" "}
              <span className="font-medium">{currentEmail}</span>
            </div>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  name={codeRegister.name}
                  onChange={(e) => {
                    codeRegister.onChange(e);
                    handleChange(index, e.target.value);
                  }}
                  onBlur={codeRegister.onBlur}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl"
                  value={digit}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isSubmitting || success}
                />
              ))}
            </div>
            <div className='h-5'>
              {errors.code && (
                <p className="mt-2 text-center text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Didn't Receive the Code?{' '}
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
              disabled={isSubmitting || success || code.join('').length !== 6}
            >
              {isSubmitting ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default VerifyEmail;
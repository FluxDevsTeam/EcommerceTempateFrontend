import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-toastify';

type VerifyEmailFormData = {
  code: string;
};

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
  
  const email = location.state?.email || localStorage.getItem('signupEmail') || '';
  const [currentEmail, setCurrentEmail] = useState<string>(email);

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
  } = useForm<VerifyEmailFormData>();

  const codeRegister = register("code");
  const code = watch("code", "").split('').concat(Array(6).fill('')).slice(0, 6);

  // Timer effect
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
      const newCode = [...code];
      newCode[index] = value;
      const joinedCode = newCode.join('');
      setValue("code", joinedCode);
      
      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setValue("code", newCode.join(''));
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    setValue("code", pastedData);
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs[lastIndex].current?.focus();
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!currentEmail) {
      console.error('Email is missing. Current email state:', currentEmail);
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await verifySignupOTP(currentEmail, data.code);
      setSuccess(true);
      localStorage.removeItem('signupEmail');
      
      setTimeout(() => {
        navigate('/login', { state: { verified: true } });
      }, 1000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!currentEmail || timeLeft > 0) return; // Prevent resend if timer is active
    
    clearError();
    setIsResending(true);
    
    try {
      await resendSignupOTP(currentEmail);
      toast.success('Verification code sent successfully!');
      setTimeLeft(178); // Reset timer
    } catch (err: any) {
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
                  className="w-12 h-12 text-center text-2xl"
                  value={digit}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isSubmitting || success}
                />
              ))}
            </div>
            <div className='h-5'></div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Didn't Receive the Code?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm font-normal text-blue-600"
                  disabled={timeLeft > 0 || isResending || isSubmitting || success}
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
              {isSubmitting ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default VerifyEmail;
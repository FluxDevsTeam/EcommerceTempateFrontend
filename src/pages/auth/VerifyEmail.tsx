

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const VerifyEmail = () =>  {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(178); // 2:58 in seconds
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];
  
  // Handle input change
  const handleChange = (index: number, value: string): void => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto focus next input if value is entered
      if (value && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 4);
    
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 4) {
          newCode[i] = pastedData[i];
        }
      }
      setCode(newCode);
      
      // Focus the next empty input or the last one
      const lastIndex = Math.min(pastedData.length, 3);
      inputRefs[lastIndex].current?.focus();
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-6 text-2xl font-bold">SHOP.CO</div>
          <CardTitle className="text-xl font-medium">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">Enter the Code sent to you</div>
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-16 h-16 text-center text-2xl"
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
              />
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Didn't Receive the Code?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm font-normal text-blue-600"
                disabled={timeLeft > 0}
                onClick={() => setTimeLeft(178)}
              >
                Resend
              </Button>
              {timeLeft > 0 && (
                <span className="text-sm text-gray-600">
                  {' '}({formatTime(timeLeft)})
                </span>
              )}
            </span>
          </div>
        </CardContent>
        <div>
      <Link to='/change-password'>   
       <Button className=" w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 mt-4 cursor-pointer">
            Continue
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
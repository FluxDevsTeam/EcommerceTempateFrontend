import React from 'react';
import { toast } from 'react-toastify';

interface CopyablePhoneProps {
    phoneNumber: string;
    className?: string;
}

const CopyablePhone: React.FC<CopyablePhoneProps> = ({ phoneNumber, className }) => {
    const handleClick = () => {
        navigator.clipboard.writeText(phoneNumber.replace(/\s/g, ''))
            .then(() => {
                toast.success('Phone number copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy phone number');
            });
    };

    return (
        <span 
            className={`cursor-pointer hover:opacity-80 ${className || ''}`}
            onClick={handleClick}
            title="Click to copy"
        >
            {phoneNumber}
        </span>
    );
};

export default CopyablePhone;

import React, { useState, useRef } from 'react';

import UploadComponent from '~/components/UploadComponent';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface RequestRemovalModalProps {
  isOpen: boolean;
  imagePath: string | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    description: string;
    uploadUrl: string;
    imagePath: string;
  }) => void;
}

const RequestRemovalModal: React.FC<RequestRemovalModalProps> = ({
  isOpen,
  imagePath,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [otp, setOtp] = useState('');
  const [otpEntered, setOtpEntered] = useState<string[]>(['', '', '', '']); 
  const [emailVerified, setEmailVerified] = useState(false); 
  const [otpStatus, setOtpStatus] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false); 
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); 

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSubmit = async () => {
    if (!name || !email || !description) {
      toast.error('Please fill all fields.');
      return;
    }

    if (!uploadUrl) {
      toast.error('Please upload an ID card image.');
      return;
    }

    if (!imagePath) {
      toast.error('No image selected for removal.');
      return;
    }

    if (!emailVerified) {
      toast.error('Please verify your email first.');
      return;
    }


    onSubmit({ name, email, description, uploadUrl, imagePath });

    setName('');
    setEmail('');
    setDescription('');
    setUploadUrl('');
    setOtpEntered(['', '', '', '']); 
    setOtpStatus('');
    setOtpSent(false);
    setEmailVerified(false); 

    onClose();
  };

  const handleEmailVerification = async () => {
    const generatedOtp = generateOtp();
    setOtp(generatedOtp); 
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, 
          otp: generatedOtp, 
        }),
      });

      const result = await response.json();
      if (response.status === 200 && result.message === 'OTP sent successfully!') {
        toast.success('OTP sent successfully!');
        setOtpSent(true); 
        setOtpStatus(''); 
      } else {
        toast.error('Failed to send OTP.');
        setOtpSent(false); 
      }
    } catch (error) {
      alert('An error occurred while sending the OTP.');
      setOtpSent(false); 
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; 
    const updatedOtp = [...otpEntered];
    updatedOtp[index] = value;
    setOtpEntered(updatedOtp);

    
    if (value && index < otpEntered.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otpEntered[index] === '') {
      
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpVerification = () => {
    const enteredOtp = otpEntered.join('');
    if (enteredOtp === '') {
      setOtpStatus('Please enter the OTP.');
      return;
    }

    if (enteredOtp === otp) {
      setOtpStatus('OTP Verified!');
      toast.success('OTP Verified Successfully')
      setEmailVerified(true); 
    } else {
      setOtpStatus('Incorrect OTP. Please try again.');
      toast.error('Invaild OTP, Please Enter again!')
      setEmailVerified(false); 
    }
  };
  const handleResendOtp = async () => {
    setOtpStatus(''); 
    await handleEmailVerification();
  };


  const handleModalClose = () => {
    setName('');
    setEmail('');
    setDescription('');
    setUploadUrl('');
    setOtpEntered(['', '', '', '']); 
    setOtpSent(false); 
    setEmailVerified(false);
    setEmailVerified(false); 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-30"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-black p-6 rounded-3xl shadow-lg max-w-xs sm:max-w-md w-full z-50 font-Trap-Regular">
        <h2 className="text-2xl text-white text-center mb-4">Request Removal</h2>
        <button onClick={handleModalClose} className="absolute top-1 right-6 text-2xl text-white p-5">
          &times;
        </button>
        <div className="flex justify-center">
          {/* Transparent overlay */}
          <div
            className="absolute inset-0 bg-transparent z-10"
            style={{ pointerEvents: "none" }} 
          />
          <Image
            src={imagePath || '/images/fallback.jpg'}
            alt="Removal Image"
            width={75}
            height={75}
            className="rounded mb-4"
          />
          {/* Disable right-click globally with Tailwind */}
          <div className="absolute inset-0 pointer-events-none" />
        </div>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          />
          <input
            type="email"
            placeholder="Preferred College Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Please give a brief Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          />
          <UploadComponent onUploadComplete={(url) => setUploadUrl(url)} resetUpload={() => setUploadUrl('')} />

          {/* Send OTP Button */}
          {!emailVerified && !otpSent && (
            <div>
              <button
                type="button"
                onClick={handleEmailVerification}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* OTP Input Fields */}
          {otpSent && !emailVerified && (
            <div className="flex space-x-2 justify-center">
              {otpEntered.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }} // This should not return anything
                  type="text"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl bg-gray-800 text-white rounded"
                />
              ))}
            </div>
          )}
           {/* Resend OTP Button */}
           {otpSent && !emailVerified && (
            <div>
            <div className='flex justify-center'>
              <button
                type="button"
                onClick={handleResendOtp}
                className="w-1/3 hover:text-green-500 text-white px-4 rounded"
              >
                Resend OTP
              </button>
            </div>
            </div>
          )}

          {/* OTP Verification Button */}
          {otpSent && !emailVerified && (
            <div>
              <button
                type="button"
                onClick={handleOtpVerification}
                className="w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Verify OTP
              </button>
              {/* Display OTP Status Message */}
              <div className="text-sm text-gray-400 mt-2 text-center">{otpStatus}</div>
            </div>
          )}

          {/* Submit Request Button */}
          {emailVerified && (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Submit Request
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestRemovalModal;

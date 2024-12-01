import React, { useState, useRef } from 'react';
import Image from 'next/image';
import UploadComponent from '~/components/UploadComponent';
import toast from 'react-hot-toast';

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
  const [otpEntered, setOtpEntered] = useState<string[]>(['', '', '', '']); // Store OTP as array
  const [emailVerified, setEmailVerified] = useState(false); // Track email verification status
  const [otpStatus, setOtpStatus] = useState<string>(''); // Track OTP status message
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent successfully
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Reference array for OTP input boxes

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

    // Pass the form data to the parent component after email is verified
    onSubmit({ name, email, description, uploadUrl, imagePath });

    // Reset the form and close the modal
    setName('');
    setEmail('');
    setDescription('');
    setUploadUrl('');
    setOtpEntered(['', '', '', '']); // Reset OTP entered
    setOtpStatus(''); // Reset OTP status message
    setOtpSent(false); // Reset OTP sent status
    onClose();
  };

  const handleEmailVerification = async () => {
    const generatedOtp = generateOtp();
    setOtp(generatedOtp); // Store the OTP in the state for comparison
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // Send email to API
          otp: generatedOtp, // Send OTP to API
        }),
      });

      const result = await response.json();
      if (response.status === 200 && result.message === 'OTP sent successfully!') {
        toast.success('OTP sent successfully!');
        setOtpSent(true); // Mark OTP as sent successfully
        setOtpStatus(''); // Reset OTP status when sending OTP
      } else {
        toast.error('Failed to send OTP.');
        setOtpSent(false); // Mark OTP as not sent
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('An error occurred while sending the OTP.');
      setOtpSent(false); // Mark OTP as not sent
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only digits
    const updatedOtp = [...otpEntered];
    updatedOtp[index] = value;
    setOtpEntered(updatedOtp);

    // Focus next input box if current box is filled
    if (value && index < otpEntered.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otpEntered[index] === '') {
      // If the current box is empty, focus the previous box
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
      setEmailVerified(true); // Mark the email as verified
    } else {
      setOtpStatus('Incorrect OTP. Please try again.');
      toast.error('Invaild OTP, Please Enter again!')
      setEmailVerified(false); // Keep the email as not verified
    }
  };
  const handleResendOtp = async () => {
    setOtpStatus(''); // Reset OTP status message before resending OTP // Reset OTP sent status
    await handleEmailVerification();// Trigger the OTP sending function again
  };


  const handleModalClose = () => {
    setName('');
    setEmail('');
    setDescription('');
    setUploadUrl('');
    setOtpEntered(['', '', '', '']); // Reset OTP entered
    setOtpStatus(''); // Reset OTP status message
    setOtpSent(false); // Reset OTP sent status
    setEmailVerified(false); // Reset email verification status
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-30"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-black p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full z-50">
        <h2 className="text-2xl text-white font-bold text-center mb-4">Request Removal</h2>
        <button onClick={handleModalClose} className="absolute top-1 right-6 text-2xl text-white p-5">
          &times;
        </button>
        <div className="flex justify-center">
          <Image
            src={imagePath || '/images/fallback.jpg'}
            alt="Removal Image"
            width={75}
            height={75}
            className="rounded mb-4"
          />
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
                className="w-full bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
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

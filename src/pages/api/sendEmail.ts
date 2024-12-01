import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { email, otp } = req.body;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP for Capture Removal Request – Capture Incridea',
        // Note the mail is modified for both light mode and dark mode according to the device
        html: `
            <html>
            <head>
                <style>
                /* Default styles for light mode */
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }

                .container {
                    background-color: #ffffff;
                    padding: 30px 40px;
                    border-radius: 10px;
                    max-width: 600px;
                    margin: 0 auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    text-align: center;
                    color: #333333;
                    font-size: 24px;
                    font-weight: 600;
                }

                p {
                    color: #333;
                    font-size: 16px;
                    line-height: 1.6;
                }

                .otp {
                    color: #ff4081;
                    font-weight: bold;
                }

                .footer {
                    margin-top: 40px;
                    text-align: center;
                    border-top: 1px solid #ccc;
                    padding-top: 20px;
                }

                /* Dark mode styles */
                @media (prefers-color-scheme: dark) {
                    body {
                    background-color: #1c1c1c;
                    color: #ddd;
                    }

                    .container {
                    background-color: #121212;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    }

                    h2 {
                    color: #ffffff;
                    }

                    p {
                    color: #ddd;
                    }

                    .otp {
                    color: #ff4081;
                    }

                    .footer p {
                    color: #888;
                    }
                }
                </style>
            </head>
            <body>
                <div class="container">
                <!-- Centering the logo container -->
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                    <!-- Centering the image -->
                    <img src="https://utfs.io/f/0yks13NtToBirbmdl9IUcBmoP98lMs3ZrOe2aL4VD1dpYAwj" alt="Incridea Logo" style="width: 120px; height: auto; display: block; margin: 0 auto;" />
                </div>
                <h2>Capture Incridea</h2>
                <p>Hello,</p>
                <p>Thank you for reaching out to Capture Incridea regarding the removal of your image from our website. We are sorry to hear that you no longer wish for this capture to be displayed, but we respect your decision and are here to assist you with the process.</p>
                <p>Your OTP: <span class="otp">${otp}</span></p>
                <p>This OTP is valid for a limited time. If you did not request this removal, please disregard this email.</p>
                <p>We truly appreciate your understanding, and we are here to help with any questions or concerns you may have.</p>

                <div class="footer">
                    <p>Thank you,</p>
                    <p>Team Capture Incridea</p>
                </div>
                </div>
            </body>
            </html>

`,
      };
  
      try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent successfully!' });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error sending email:', error.message);
          return res.status(500).json({ error: error.message || 'Failed to send OTP' });
        } else {
          console.error('Unknown error:', error);
          return res.status(500).json({ error: 'An unknown error occurred' });
        }
      }
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  };
  
  
export default sendEmail;

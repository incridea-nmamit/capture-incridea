import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto max-w-6xl p-6 pt-24 mb-20">
      <h1 className="text-3xl md:text-5xl font-Teknaf text-center my-20">Terms and Conditions</h1>
      <p className="mb-4 text-center font-Trap-Regular ">
        Welcome to Capture Incridea, the official media platform of Incridea,
        the techno-cultural fest of NMAM Institute of Technology. By accessing
        or using this website, you agree to comply with the following terms and
        conditions. These terms are designed to ensure the security,
        authenticity, and responsible use of all media hosted on this platform.
        Unauthorized use, modification, or distribution of any media is strictly
        prohibited and subject to legal consequences.
      </p>

      <h2 className="mt-10 text-xl font-semibold">
        Media Ownership & Protection
      </h2>
      <p className="mb-4">
        All media files available on Capture Incridea are the exclusive property
        of the Incridea. The platform employs advanced encryption and
        watermarking technologies to safeguard the content and maintain its
        integrity. Users are granted access for personal viewing and authorized
        use only. Any misuse, unauthorized modification, or attempt to
        circumvent security measures is a violation of these terms.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Watermark Integrity </h2>
      <p className="mb-4">
        All downloaded images and videos contain an encrypted watermark. Any
        attempt to remove, alter, or obscure the watermark is a direct violation
        of these terms and may result in legal action. The watermark can be
        traced even if the media is edited or modified.
      </p>

      <h2 className="mt-10 text-xl font-semibold">
        Encrypted Tracking & Unauthorized Use{" "}
      </h2>
      <p className="mb-4">
        Every media download is tracked and recorded to maintain accountability.
        The encryption applied ensures that if any image or video is illegally
        distributed or altered, the source of the breach can be identified.
        Unauthorized distribution, sharing, or modification of media files
        without explicit written permission from the Incridea Organising
        Committee is strictly prohibited and may result in legal enforcement.
      </p>
 
      <h2 className="mt-10 text-xl font-semibold">
        Digital Security & Access Control
      </h2>
      <p className="mb-4">
        All media hosted on Capture Incridea is securely encrypted to prevent
        unauthorized access or tampering. Any attempt to alter, redistribute, or
        re-upload downloaded content will trigger security alerts, enabling
        identification of the user responsible for the breach. Violation of
        these security measures constitutes a breach of our digital policy and
        will be subject to appropriate legal and administrative actions.
      </p>
      <h2 className="mt-10 text-xl font-semibold">Modification of Terms</h2>
      <p className="mb-4">
        Capture Incridea reserves the right to update, modify, or implement
        additional measures to these terms at any time to enhance security and
        ensure compliance. Continued use of the platform after modifications to
        these terms implies acceptance of the latest version.
      </p>
      <h2 className="mt-10 text-xl font-semibold">
        Contact & Dispute Resolution{" "}
      </h2>
      <p className="mb-4">
        If you have any concerns or inquiries regarding these terms, please
        contact the Incridea Organizing Committee via the details provided on
        the website. Any disputes arising from the use of this platform shall be
        governed by the laws applicable to NMAM Institute of Technology, and
        users agree to resolve disputes through appropriate legal channels. By
        using Capture Incridea, you acknowledge that you have read, understood,
        and agreed to abide by these terms and conditions. Failure to comply
        with these terms may result in restricted access, removal of privileges,
        or legal consequences as determined by the Incridea Organizing
        Committee.
      </p>
      <p className="mb-4 italic">Authorized by NMAM Institute of Technology </p>
    </div>
  );
};

export default TermsAndConditions;

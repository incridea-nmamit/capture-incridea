import { type NextPage } from "next";
import { MdCall, MdLocationOn, MdMail } from "react-icons/md";

const Contact: NextPage = () => {
  return (
    <div className="min-h-screen px-4 pt-32 md:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-4xl font-Teknaf md:text-5xl">
          Contact Us
        </h2>
        <h5 className="mx-auto mt-5 max-w-2xl font-Trap-Regular text-center text-base md:mt-7 md:text-xl">
          Any queries should be directed to the student organizers and college
          staff at the following contact information:
        </h5>

        {/* Contact Info Box */}
        <div className="mx-automt-6 max-w-7xl bg-slate-200 bg-opacity-5 rounded-xl border px-5 py-4 md:mt-8 md:px-10 md:py-7">
          {/* Email */}
          <div className="flex items-center space-x-2 text-2xl">
            <MdMail />
            <span className=" font-Trap-Regular  text-base font-semibold md:text-xl">Mail</span>
          </div>
          <p className="mt-2">
            <a href="mailto:capture.incridea@nmamit.in" className="hover:underline  font-Trap-Regular ">
              capture.incridea@nmamit.in
            </a>
          </p>

          {/* Phone Numbers */}
          <div className="mt-5 flex items-center space-x-2 text-base font-semibold md:text-2xl">
            <MdCall />
            <span className="text-base font-semibold md:text-xl">Phone Numbers</span>
          </div>
          <p className="mt-2">
            Phone: +91{" "}
            {/* <a href="tel:9448815186" className=" font-Trap-Regular hover:underline">
              94488 15186
            </a>{" "}
            or +91{" "} */}
            <a href="tel:8861337830" className=" font-Trap-Regular hover:underline">
              88613 37830
            </a>
          </p>

          {/* Address */}
          <div className="mt-5 flex items-center space-x-2 text-base font-semibold md:text-2xl">
            <MdLocationOn />
            <span className="text-base font-semibold md:text-xl">Address</span>
          </div>
          <div className="mt-2 space-y-3">
            <div className=" font-Trap-Regular ">
              <p>NMAM Institute of Technology,</p>
              <p>Nitte, Karkala Taluk, Udupi,</p>
              <p>Karnataka, India - 574110</p>
            </div>
            <div>
              <p>
                A unit of Nitte (Deemed to be University), Nitte Education Trust
              </p>
              <p>6th Floor, University Enclave,</p>
              <p>Medical Sciences Complex,</p>
              <p>Deralakatte, Mangaluru - 575018</p>
              <p>Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>
      <br/>
    </div>
  );
};

export default Contact;

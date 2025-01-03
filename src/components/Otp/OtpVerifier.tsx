import React, { useState } from "react";
import Modal from "react-modal";
import OtpInput from "react-otp-input";
import { Button } from "../ui/button";

Modal.setAppElement("#root");
interface OtpVerifier {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  modal: boolean;
  dataInput: string;
  cb: (otp: string) => Promise<void>;
}
const OtpVerifier: React.FC<OtpVerifier> = ({
  setModal,
  modal,
  dataInput,
  cb,
}) => {
  const [otp, setOtp] = useState("");
  const handleOtp = () => {
    cb(otp);
    setOtp("");
  };
  return (
    <Modal
      isOpen={modal}
      style={{
        overlay: {
          position: "fixed",
          zIndex: 9999,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#ffffff",
          width: "400px",
        },
      }}
      contentLabel="OTP Verification"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-xl font-semibold mb-4">Xác nhận OTP</h2>
        <p className="text-sm text-gray-600 mb-6">
          Vui lòng kiểm tra {dataInput} của bạn.
        </p>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="mx-1 text-lg">•</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle="h-12 !w-8 border rounded-md outline-none text-center border-blue-600 text-lg mx-1"
          shouldAutoFocus={true}
        />

        <div className="mt-6 flex justify-center gap-4">
          <Button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            onClick={() => handleOtp()}
          >
            Xác nhận
          </Button>
          <Button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
            onClick={() => setOtp("")}
          >
            Xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OtpVerifier;

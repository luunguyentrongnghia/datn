import useAppStore from "@/zustand/useAppStore";
import React from "react";

const CustomModal = () => {
  const { contentModal, setModal } = useAppStore();
  return (
    <div
      onClick={() => setModal(false)}
      className="fixed z-xl top-0 h-full w-full flex items-center justify-center left-0 bg-black bg-opacity-50"
    >
      {contentModal}
    </div>
  );
};

export default CustomModal;

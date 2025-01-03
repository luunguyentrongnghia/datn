import { generateDefaultAvatar } from "@/lib/utils";
import useMeStore from "@/zustand/useMeStore";
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "../layous/Image";
import { Button } from "../ui/button";

interface userData {
  id: string;
  fullname: string;
  email: string;
  avatar: string | null;
}
interface PropInforUser {
  user: userData;
  setIsModalOpen: (isOpen: boolean) => void;
}
const InforUser: React.FC<PropInforUser> = ({ user, setIsModalOpen }) => {
  const { me } = useMeStore();
  const handleGetEmail = () => {
    if (me && me.email && me.status !== "lock") {
      navigator.clipboard.writeText(user.email).then(() => {
        toast.success("Sao chép thành công");
        const subject = "Quan tâm đến tin đăng";
        const body = `Tôi có quan tâm tới tin đăng này: "${window.location.href}"`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
      });
    } else {
      toast.error("Hiện không thể dùng được chức năng này");
    }
  };
  const handleInquiries = () => {
    if (me.status === "lock") {
      toast.error("Hiện không thể dùng được chức năng này");
    } else {
      setIsModalOpen(true);
    }
  };
  return (
    <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-border-color-11">
      <div className="flex flex-col items-center text-center">
        <div className="mb-25px">
          <Image
            fallbackSrc={generateDefaultAvatar(user.fullname)}
            src={user.avatar}
            className="w-140px h-140px rounded-100%"
          />
        </div>
        <h4 className="mb-15px lg:text-lg text-heading-color font-bold">
          <span className="leading-1.3 lg:leading-1.3">{user.fullname}</span>
        </h4>
        <Button
          variant={"button1"}
          onClick={handleGetEmail}
          className="bg-orange-500 mb-3"
        >
          Gửi mail
        </Button>
        <Button
          variant={"button1"}
          onClick={() => handleInquiries()}
          className="bg-orange-500 mb-3"
        >
          Yêu cầu liên hệ lại
        </Button>

        <ul className="text-sm lg:text-base flex gap-18px justify-center items-center text-color-1">
          <li className="leading-1.8 lg:leading-1.8">
            <a href="https://www.facebook.com/">
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
          <li className="leading-1.8 lg:leading-1.8">
            <a href="https://x.com/">
              <i className="fab fa-twitter"></i>
            </a>
          </li>
          <li className="leading-1.8 lg:leading-1.8">
            <a href="https://www.linkedin.com/">
              <i className="fab fa-linkedin"></i>
            </a>
          </li>
          <li className="leading-1.8 lg:leading-1.8">
            <a href="https://www.youtube.com/">
              <i className="fab fa-youtube"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InforUser;

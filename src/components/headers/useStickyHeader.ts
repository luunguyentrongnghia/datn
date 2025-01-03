// useStickyHeader.ts
import { useEffect, useRef } from "react";

const useStickyHeader = () => {
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stickyHeader = stickyHeaderRef.current;

    const handleScroll = () => {
      if (!stickyHeader) return;

      const stickyHeaderHeight = stickyHeader.offsetHeight;
      const scrollCount = window.scrollY;
      if (scrollCount < 300) {
        if (scrollCount > 200) {
          stickyHeader.style.position = "fixed";
          stickyHeader.style.top = `-${stickyHeaderHeight}px`;
          stickyHeader.style.left = "0";
          stickyHeader.style.right = "0";
          stickyHeader.classList.remove("active");
        } else {
          stickyHeader.removeAttribute("style");
          stickyHeader.classList.remove("active");
        }
      }
      if (scrollCount > 300) {
        stickyHeader.style.position = "fixed";
        stickyHeader.style.top = "0px";
        stickyHeader.style.left = "0";
        stickyHeader.style.right = "0";
        stickyHeader.classList.add("active");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return stickyHeaderRef;
};

export default useStickyHeader;

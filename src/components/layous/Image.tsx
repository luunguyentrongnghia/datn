import React, { useState } from "react";

interface ImageProps {
  src: string | null;
  fallbackSrc: string;
  className: string;
}

const Image: React.FC<ImageProps> = ({ src, fallbackSrc, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(src);
  const handleImageError = () => setImageUrl(fallbackSrc);

  return (
    <img
      src={imageUrl || fallbackSrc}
      onError={handleImageError}
      className={className}
      alt="Image"
    />
  );
};

export default Image;

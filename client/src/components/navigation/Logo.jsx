import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      alt="Logo"
      src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiLogoSquareShape.svg"
      width={200}
      height={120}
      className="h-10 w-auto"
    />
  );
};

export default Logo;

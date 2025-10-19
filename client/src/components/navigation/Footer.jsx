import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-neutral-400 px-6 pt-12 md:px-16 lg:px-36">
      <div className="flex flex-col md:flex-row justify-between w-full gap-12 pb-10">
        {/* Left Section */}
        <div className="max-w-md">
          <Image
            alt="Logo"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiLogoSquareShape.svg"
            width={200}
            height={120}
            className="h-10 w-auto"
          />
          <p className="mt-6 text-sm leading-relaxed text-neutral-400">
            Streamline your workflow with powerful, intuitive tools designed for
            efficiency and simplicity.
          </p>

          {/* Store Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Image
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
              alt="Google Play"
              width={130}
              height={40}
              className="h-10 w-auto rounded-md hover:opacity-80 transition"
            />
            <Image
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
              alt="App Store"
              width={130}
              height={40}
              className="h-10 w-auto rounded-md hover:opacity-80 transition"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-wrap md:justify-end gap-16">
          <div>
            <h2 className="text-white font-semibold mb-4">Company</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-4">Get in touch</h2>
            <div className="space-y-2 text-sm">
              <p className="hover:text-white transition cursor-pointer">
                +1-234-567-890
              </p>
              <p className="hover:text-white transition cursor-pointer">
                contact@example.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-6 pb-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://prebuiltui.com"
          className="text-neutral-400 hover:text-white transition"
        >
          PrebuiltUI
        </a>{" "}
        — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import { GetBusinessByUserId } from "@/actions/business";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { MapPin, Mail, Phone } from "lucide-react";

export function BusinessHeader() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessImage, setBusinessImage] = useState("/placeholder.svg");

  // Fetch business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const business = await GetBusinessByUserId();
        setBusinessName(business.name);
        setBusinessEmail(business.email || "contact@business.com");
        setBusinessAddress(business.address || "12, City, Lagos");
        setBusinessPhoneNumber(business.phoneNumber || "0912345678");
        setBusinessImage(business.logoURL || "/placeholder.svg");
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };

    fetchBusinessDetails();
  }, []);

  return (
    <header className="p-4 rounded-lg shadow-lg mb-8 transition-all dark:bg-gray-900/70 backdrop-blur-2xl from-white to-gray-100 w-full md:w-[750px]">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
        {/* Business Info */}
        <div className="flex items-center space-x-4 w-[200px]">
          <Image
            src={businessImage}
            alt="Brand Logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white ">
            {businessName}
          </h1>
        </div>

        {/* Contact Info and Theme Toggle */}
        <div className="flex flex-col lg:flex-row items-start md:items-center w-full lg:space-x-6 text-gray-900 dark:text-gray-300 space-y-4 lg:space-y-0">
          <span className="font-medium">Contact Info:</span>
          {/* Address */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-black dark:text-white" />
            <p className="text-sm">{businessAddress}</p>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-black dark:text-white" />
            <p className="text-sm">{businessEmail}</p>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-black dark:text-white" />
            <p className="text-sm">{businessPhoneNumber}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { GetBusinessByUserId } from "@/actions/business";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin, Mail, Phone } from 'lucide-react';

export function BusinessFooter() {
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessImage, setBusinessImage] = useState("/placeholder.svg");

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
    <footer className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg py-12 mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 gap-0 md:gap-20">
          {/* Business Logo and Name */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-2">
            <Image
              src={businessImage}
              alt={`${businessName} logo`}
              width={80}
              height={80}
              className="rounded-full"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
              {businessName}
            </h2>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-6 text-center md:text-left">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{businessAddress}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <a href={`mailto:${businessEmail}`} className="text-gray-700 dark:text-gray-300 hover:underline">
                {businessEmail}
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <a href={`tel:${businessPhoneNumber}`} className="text-gray-700 dark:text-gray-300 hover:underline">
                {businessPhoneNumber}
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Additional Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Talktrack. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
}


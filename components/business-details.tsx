"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Edit2, Upload, Mail, PhoneCall } from "lucide-react";
import { GetBusinessByUserId, UpdateBusiness } from "@/actions/business";
import { DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "@/hooks/use-toast";

export function BusinessDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");
  const [businessImage, setBusinessImage] = useState("/placeholder.svg");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const business = await GetBusinessByUserId();
        setBusinessName(business.name || "Business Name");
        setBusinessDescription(
          business.description || "Innovative Solutions for Tomorrow"
        );
        setBusinessEmail(business.email || "contact@business.com");
        setBusinessPhoneNumber(business.phoneNumber || "0912345678");
        setBusinessImage(business.logoURL || "/placeholder.svg");
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };

    fetchBusinessDetails();
  }, []);

  const handleEdit = async () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      try {
        await UpdateBusiness({
          name: businessName,
          description: businessDescription,
          email: businessEmail,
          phoneNumber: businessPhoneNumber,
          logoUrl: businessImage,
        });
        toast({
          title: "Change Saved",
          description: "Your business profile has been successfully.",
        });
      } catch (error) {
        console.error("Error saving changes:", error);
        toast({
          title: "Error",
          description:
            "Failed to save your business profile. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bxmkzdav"); // Replace with your actual Cloudinary preset

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvvirefzi/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setBusinessImage(data.secure_url);
      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (error) {
      console.error("Error uploading image:", error);
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <Card className="w-full border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src={businessImage}
                  alt="Business Logo"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-primary shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1 bg-gray-200 rounded-full cursor-pointer">
                    <Upload className="w-5 h-5 text-primary" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-center">
                <h2
                  className="text-2xl font-semibold text-foreground"
                  contentEditable={isEditing}
                  onBlur={(e) =>
                    setBusinessName(e.currentTarget.textContent || "")
                  }
                  suppressContentEditableWarning={true}
                >
                  {businessName}
                </h2>
                <p
                  className="text-sm text-muted-foreground italic"
                  contentEditable={isEditing}
                  onBlur={(e) =>
                    setBusinessDescription(e.currentTarget.textContent || "")
                  }
                  suppressContentEditableWarning={true}
                >
                  {businessDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" />
              <p
                className="text-sm text-muted-foreground italic"
                contentEditable={isEditing}
                onBlur={(e) =>
                  setBusinessEmail(e.currentTarget.textContent || "")
                }
                suppressContentEditableWarning={true}
              >
                {businessEmail}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <PhoneCall className="w-5 h-5" />
              <p
                className="text-sm text-muted-foreground italic"
                contentEditable={isEditing}
                onBlur={(e) =>
                  setBusinessPhoneNumber(e.currentTarget.textContent || "")
                }
                suppressContentEditableWarning={true}
              >
                {businessPhoneNumber}
              </p>
            </div>
            <Button onClick={handleEdit} className="w-full">
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

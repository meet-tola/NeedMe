'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Globe, Edit2 } from 'lucide-react'
import { GetBusinessByUserId } from "@/actions/business";
import { DialogTitle } from '@radix-ui/react-dialog'

export function BusinessDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [businessName, setBusinessName] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [businessWebsite, setBusinessWebsite] = useState("")
  const [businessImage, setBusinessImage] = useState("/placeholder.svg") 

  // Fetch business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const business = await GetBusinessByUserId()
        setBusinessName(business.name || "Acme Corporation")
        setBusinessDescription(business.description || "Innovative Solutions for Tomorrow")
        setBusinessWebsite(business.contactInfo || "www.acmecorp.com")
        setBusinessImage(business.logoURL || "/placeholder.svg")
      } catch (error) {
        console.error("Error fetching business details:", error)
      }
    }

    fetchBusinessDetails()
  }, [])

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      // Save changes here (e.g., send to an API)
      console.log("Saving changes...", { businessName, businessDescription, businessWebsite })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <Card className="w-full border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={businessImage}
                alt="Business Logo"
                width={120}
                height={120}
                className="rounded-full border-4 border-primary shadow-lg"
              />
              <div className="text-center">
                <h2 
                  className="text-2xl font-semibold text-foreground"
                  contentEditable={isEditing}
                  onBlur={(e) => setBusinessName(e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                >
                  {businessName}
                </h2>
                <p 
                  className="text-sm text-muted-foreground italic"
                  contentEditable={isEditing}
                  onBlur={(e) => setBusinessDescription(e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                >
                  {businessDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="w-5 h-5" />
              <a 
                href={`https://${businessWebsite}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm hover:underline"
                contentEditable={isEditing}
                onBlur={(e) => setBusinessWebsite(e.currentTarget.textContent || "")}
                suppressContentEditableWarning={true}
              >
                {businessWebsite}
              </a>
            </div>
            <Button onClick={handleEdit} className="w-full">
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

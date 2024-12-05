'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface LogoUploadProps {
  onLogoChange: (logo: string | null) => void
}

export function LogoUpload({ onLogoChange }: LogoUploadProps) {
  const [logo, setLogo] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', 'bxmkzdav')

          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90))
          }, 200)

          const res = await fetch(
            'https://api.cloudinary.com/v1_1/dvvirefzi/image/upload',
            {
              method: 'POST',
              body: formData,
            }
          )

          clearInterval(progressInterval)
          setUploadProgress(100)

          if (!res.ok) {
            throw new Error('Failed to upload image')
          }

          const fileData = await res.json()
          const secureUrl = fileData.secure_url

          setLogo(secureUrl)
          onLogoChange(secureUrl)
        } catch (error) {
          console.error('Error uploading image:', error)
          setUploadProgress(0)
        }
      }
    },
    [onLogoChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const removeLogo = () => {
    setLogo(null)
    onLogoChange(null)
    setUploadProgress(0)
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ease-in-out ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        {logo ? (
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={logo}
              alt="Uploaded logo"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeLogo()
              }}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-sm text-muted-foreground">
              Drag & drop your logo here, or click to select a file
            </p>
          </div>
        )}
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-2 w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-primary rounded"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      {logo && (
        <p className="mt-2 text-sm text-center text-muted-foreground">
          Click or drag a new image to change the logo
        </p>
      )}
    </div>
  )
}

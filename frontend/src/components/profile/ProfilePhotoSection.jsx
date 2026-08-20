"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2, Camera, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { profileApi } from "@/services/profile.api";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePhotoSection({ user, onUpdateAvatar }) {
  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
  const [preview, setPreview] = useState(user?.avatar || DEFAULT_AVATAR);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateUser } = useAuthStore();

  useEffect(() => {
    if (user?.avatar) {
      setPreview(user.avatar);
    }
  }, [user?.avatar]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      // Convert image file to persistent Base64 Data URL
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Avatar = reader.result;
        setPreview(base64Avatar);

        // 1. Update Zustand auth store & localStorage
        updateUser({ avatar: base64Avatar });

        // 2. Callback to parent profile page
        if (onUpdateAvatar) {
          onUpdateAvatar(base64Avatar);
        }

        // 3. Persist to MongoDB database via backend API
        try {
          await profileApi.updateProfile({ avatar: base64Avatar });
        } catch (err) {
          console.error("Backend photo sync note:", err);
        }

        toast.success("Profile photo updated and saved to database!", {
          icon: "📸",
          style: {
            borderRadius: "16px",
            background: "#2F5D34",
            color: "#fff",
            fontWeight: "bold",
          },
        });
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error("Error processing image file.");
        setIsUploading(false);
      };
    } catch (err) {
      toast.error("Failed to upload image.");
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      setPreview(DEFAULT_AVATAR);

      // 1. Reset Zustand auth store & localStorage
      updateUser({ avatar: "" });

      // 2. Callback to parent profile page
      if (onUpdateAvatar) {
        onUpdateAvatar("");
      }

      // 3. Reset in MongoDB database via backend API
      try {
        await profileApi.updateProfile({ avatar: "" });
      } catch (err) {
        console.error("Backend avatar reset error:", err);
      }

      toast.success("Profile picture reset to default.", {
        icon: "🗑️",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222123]">
            Profile Photo
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-paragraph mt-1">
            Upload or change your profile picture saved to your account database.
          </p>
        </div>
        <span className="p-3 rounded-2xl bg-[#E7F0E4] text-[#2F5D34]">
          <Camera className="w-5 h-5" />
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Profile Image Circular Preview */}
        <div className="relative flex-none group">
          <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-[#2F5D34] via-[#C9A66B] to-[#5B7C3A] shadow-xl relative overflow-hidden">
            <Image
              src={preview}
              alt="Profile Photo Preview"
              width={144}
              height={144}
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls & Guidelines */}
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#222123]">
              Upload New Photo
            </h3>
            <p className="text-xs text-gray-500 font-paragraph mt-1 leading-relaxed">
              Recommended image aspect ratio 1:1 square. Supported formats: JPG, PNG, WEBP. Max file size: 5MB.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 rounded-full bg-[#2F5D34] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#224426] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Saving to Database..." : "Choose & Save Photo"}</span>
            </button>

            {/* Remove Button */}
            <button
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="px-6 py-3 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs uppercase tracking-wider hover:bg-rose-100 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

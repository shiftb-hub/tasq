"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";
import { avatarBucket } from "@/app/_configs/app-config";

export const useAvatarUrl = (imageKey: string | null | undefined) => {
  const defaultAvatarUrl = "/public/default-avatar.png";
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatarUrl);

  useEffect(() => {
    if (!imageKey) return;

    const fetchAvatarUrl = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.storage
        .from(avatarBucket)
        .createSignedUrl(imageKey, 60 * 60);

      if (error) {
        console.error("Error fetching avatar URL:", error);
        setAvatarUrl(defaultAvatarUrl);
        return;
      }

      setAvatarUrl(data.signedUrl);
    };

    fetchAvatarUrl();
  }, [imageKey]);

  return avatarUrl;
};

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { FaCopy } from "react-icons/fa";

type Props = {
  text: string;
};

export const CopyButton: React.FC<Props> = (props) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy text: ", e);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleCopy}>
      <div className="mx-1 flex items-center gap-x-1 text-xs">
        <FaCopy />
        <span>{copied ? "コピー済み" : "コピー"}</span>
      </div>
    </Button>
  );
};

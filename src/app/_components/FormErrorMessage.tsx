import React from "react";
import { BiSolidErrorAlt } from "react-icons/bi";

interface Props {
  msg: string | null | undefined;
}

export const FormErrorMessage: React.FC<Props> = ({ msg }) => {
  if (!msg) return null;
  return (
    <div className="flex items-start gap-1 text-sm leading-snug text-red-400">
      <BiSolidErrorAlt
        className="mt-1 shrink-0"
        style={{
          fontSize: "1em",
          lineHeight: "1",
        }}
      />
      <span className="break-all">{msg}</span>
    </div>
  );
};

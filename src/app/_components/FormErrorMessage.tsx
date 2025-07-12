import React from "react";
import { BiSolidErrorAlt } from "react-icons/bi";

interface Props {
  msg: string | null | undefined;
}

export const FormErrorMessage: React.FC<Props> = ({ msg }) => {
  if (!msg) return null;
  return (
    <div className="flex items-center text-sm text-red-400">
      <BiSolidErrorAlt className="mr-0.5" />
      {msg}
    </div>
  );
};

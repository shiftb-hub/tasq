import { cn } from "../_libs/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PageSubTitle: React.FC<Props> = ({ children, className }) => {
  return <p className={cn("text-lg text-gray-600", className)}>{children}</p>;
};

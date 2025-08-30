import { cn } from "../_libs/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<Props> = ({ children, className }) => {
  return <h1 className={cn("mb-8 text-center text-3xl font-bold", className)}>{children}</h1>;
};

interface Props {
  children: React.ReactNode;
}

export const PageTitle: React.FC<Props> = ({ children }) => {
  return <h1 className="mb-8 text-center text-3xl font-bold">{children}</h1>;
};

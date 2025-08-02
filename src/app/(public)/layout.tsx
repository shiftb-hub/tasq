interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <main className="mx-auto pt-12">{children}</main>;
};

export default Layout;

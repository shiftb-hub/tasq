type Props = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<Props> = async (props) => {
  return (
    <main className="mx-4 mt-2 max-w-3xl md:mx-auto">{props.children}</main>
  );
};

export default PublicLayout;
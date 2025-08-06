type Props = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<Props> = (props) => {
  return <main className="mx-auto w-full px-4 py-8">{props.children}</main>;
};

export default PublicLayout;

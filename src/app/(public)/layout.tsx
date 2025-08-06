type Props = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<Props> = (props) => {
  return <main className="mx-auto max-w-3xl px-4 pt-12">{props.children}</main>;
};

export default PublicLayout;

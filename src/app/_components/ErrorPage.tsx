type Props = {
  message: string;
};

export const ErrorPage: React.FC<Props> = (props) => {
  const { message } = props;
  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">Error</h1>
        <div>
          <p className="mt-3 text-sm break-all text-red-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

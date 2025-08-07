import { FaGhost } from "react-icons/fa";
import { PageTitle } from "./PageTitle";

type Props = {
  message: string;
};

export const ErrorPage: React.FC<Props> = (props) => {
  const { message } = props;
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <PageTitle>
          <FaGhost className="mr-2 inline-block" />
          ERROR
          <FaGhost className="ml-2 inline-block" />
        </PageTitle>
        <div>
          <p className="mt-3 text-sm break-all text-red-500">{message}</p>
        </div>
      </div>
    </div>
  );
};

import { ErrorPage } from "@/app/_components/ErrorPage";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// AppErrorCodesの定義
const getErrorMessage = (errorType: string | string[] | undefined): string => {
  if (typeof errorType !== "string") return "問題が発生しました。";
  switch (errorType) {
    case AppErrorCodes.SUPABASE_CONNECTION_ERROR:
      return "DB接続に失敗しました。しばらく時間をおいてから再度お試しください。";
    default:
      return "問題が発生しました。";
  }
};

const Page: React.FC<Props> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const errorType = resolvedSearchParams.type;
  const message = getErrorMessage(errorType);
  return <ErrorPage message={message} />;
};

export default Page;

import NextLink from "next/link";
import { AuthButton } from "@/app/_components/AuthButton";
const Page: React.FC = () => {
  return (
    <div>
      <div className="text-2xl font-bold">Main</div>
      <div className="mt-4 ml-2 flex flex-col gap-y-2">
        <NextLink href="/signup" className="">
          サインアップ
        </NextLink>
        <NextLink href="/login" className="">
          ログイン
        </NextLink>
        <NextLink href="/api/playground/hoge" className="">
          APIテスト（public）
        </NextLink>
        <NextLink href="/api/playground/fuga" className="">
          APIテスト（private）
        </NextLink>

        <NextLink href="/settings" className="">
          設定
        </NextLink>
      </div>
      <AuthButton />
    </div>
  );
};

export default Page;

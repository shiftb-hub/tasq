import NextLink from "next/link";
import { DevAuthButton } from "@/app/_components/DevAuthButton";
const Page: React.FC = () => {
  return (
    <div>
      <div className="text-2xl font-bold">Main</div>
      <div className="mt-4 ml-2 flex flex-col gap-y-2">
        <NextLink href="/signup">サインアップ</NextLink>
        <NextLink href="/login">ログイン</NextLink>
        <NextLink href="/api/playground/tasks">APIテスト（public）</NextLink>
        <NextLink href="/api/playground/users">APIテスト（private）</NextLink>
        <NextLink href="/settings">設定（private）</NextLink>
        <div className="mt-4">
          <DevAuthButton />
        </div>
      </div>
    </div>
  );
};

export default Page;

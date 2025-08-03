import Link from "next/link";
import { DevAuthButton } from "@/app/_components/DevAuthButton";

const Page: React.FC = () => {
  return (
    <div className="mx-4 mt-2 max-w-3xl md:mx-auto">
      <div className="text-2xl font-bold">Main</div>
      <div className="mt-4 ml-2 flex flex-col gap-y-2">
        <Link href="/signup">サインアップ</Link>
        <Link href="/login">ログイン</Link>
        <Link href="/api/playground/tasks">APIテスト（public）</Link>
        <Link href="/api/playground/users">APIテスト（private）</Link>
        <Link href="/settings">設定（private）</Link>
        <div className="mt-4">
          <DevAuthButton />
        </div>
      </div>
    </div>
  );
};

export default Page;

import NextLink from "next/link";

const Page: React.FC = () => {
  return (
    <div>
      <div className="text-2xl font-bold">Main</div>
      <div className="mt-4 ml-2 flex flex-col gap-y-2">
        <NextLink href="/signup" className="">
          サインアップ
        </NextLink>
        <NextLink href="/api/playground/hoge" className="">
          APIテスト
        </NextLink>
      </div>
    </div>
  );
};

export default Page;

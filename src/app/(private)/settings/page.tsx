import { AuthButton } from "@/app/_components/AuthButton";
import { getAppUser } from "@/app/_libs/getSupabaseUser";

const Page: React.FC = async () => {
  const user = await getAppUser();

  return (
    <div>
      <div className="text-2xl font-bold">セッティング</div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <AuthButton />
    </div>
  );
};

export default Page;

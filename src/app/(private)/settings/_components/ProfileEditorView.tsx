"use client";

import { Button } from "@/app/_components/ui/button";

type Props = {
  email: string;
};

const ProfileEditorView: React.FC<Props> = (props) => {
  const { email } = props;
  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">
          プロフィール設定
        </h1>
        <div>
          <p>プロフィール設定</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditorView;

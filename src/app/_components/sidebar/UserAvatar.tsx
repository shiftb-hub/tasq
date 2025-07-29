import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import type { User } from "@prisma/client";

interface Props {
  user: User;
}

export const UserAvatar: React.FC<Props> = ({ user }) => {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
        // TODO: ユーザーのプロフィール画像を表示する
        // src={user.avatar || "/placeholder.svg"}
        src="https://picsum.photos/400/300"
        alt={user.name}
      />
      <AvatarFallback className="rounded-lg">
        {user.name?.charAt(0) || "?"}
      </AvatarFallback>
    </Avatar>
  );
};

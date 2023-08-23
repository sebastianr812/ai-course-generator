import { User } from "next-auth"
import { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar"
import Image from "next/image";

interface UserAvatarProps {
    user: User;
}

const UserAvatar: FC<UserAvatarProps> = ({
    user
}) => {
    return (
        <Avatar>
            {user?.image ? (
                <div className="relative w-full h-full aspect-square">
                    <Image
                        fill
                        src={user.image}
                        alt='User Profile'
                        referrerPolicy="no-referrer" />
                </div>
            ) : (
                <AvatarFallback >
                    <span className="sr-only">
                        {user.name}
                    </span>
                </AvatarFallback>
            )}
        </Avatar>
    )
}

export default UserAvatar;
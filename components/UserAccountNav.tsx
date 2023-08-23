'use client';

import { FC } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import UserAvatar from './UserAvatar';

interface UserAccountNavProps {
    user: User;
}

const UserAccountNav: FC<UserAccountNavProps> = ({
    user
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <div className='flex items-center justify-start gap-2 p-2'>
                    <div className='flex flex-col space-y-1 leading-none'>
                        {user?.name && (
                            <p className='font-medium'>{user.name}</p>
                        )}
                        {user.email && (
                            <p className='w-[200px] truncate text-sm text-secondary-foreground'>{user.email}</p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='cursor-pointer text-red-600'
                    onSelect={() => signOut()}>
                    Sign Out
                    <LogOut className='w-4 h-4 ml-2' />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav
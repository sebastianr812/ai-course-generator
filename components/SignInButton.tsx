'use client';

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const SignInButton = () => {
    return (
        <Button
            variant='ghost'
            onClick={() => signIn('google')}>
            Sign In
        </Button>
    )
}

export default SignInButton
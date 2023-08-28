'use client';

import { useSession } from 'next-auth/react';
import { FC, useState } from 'react'
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import axios from 'axios';

interface SubscriptionActionProps {

}

const SubscriptionAction: FC<SubscriptionActionProps> = ({ }) => {

    const { data } = useSession();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubscribe = async () => {
        setLoading(true);

        try {
            const { data } = await axios.get('/api/stripe');
            window.location.href = data.url;
        } catch (e) {
            console.log('error', e);
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className='flex flex-col p-4 items-center w-1/2 mx-auto mt-4 rounded-md bg-secondary'>
            {data?.user.credits} / 10 Free Generations
            <Progress
                className='mt-2'
                value={data?.user.credits ? (
                    (data.user.credits / 10) * 100
                ) : 0} />
            <Button
                disabled={loading}
                onClick={handleSubscribe}
                className='mt-3 font-bold text-white transition bg-gradient-to-tr from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
            >
                Upgrade
                <Zap className='fill-white ml-2' />
            </Button>
        </div>
    )
}

export default SubscriptionAction
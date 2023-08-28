'use client';

import { FC, useState } from 'react'
import { Button } from './ui/button';
import axios from 'axios';

interface SubscriptionButtonProps {
    isPro: boolean;
}

const SubscriptionButton: FC<SubscriptionButtonProps> = ({
    isPro
}) => {

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubscribe = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get('/api/stripe');
            window.location.href = data.url
        } catch (e) {
            console.log('billing error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            className='mt-4'
            disabled={loading}
            onClick={handleSubscribe}>
            {isPro ? 'Manage Subscription' : 'Upgrade'}
        </Button>
    )
}

export default SubscriptionButton;
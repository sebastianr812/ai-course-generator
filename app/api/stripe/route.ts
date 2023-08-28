import { metadata } from "@/app/layout";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const settingsUrl = process.env.NEXTAPP_URL + '/settings';

export async function GET(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new NextResponse('unauthorized', { status: 401 });
        }
        const userSubscription = await db.userSubscription.findUnique({
            where: {
                userId: session.user.id
            }
        });
        // cancel at the billing portal
        if (userSubscription && userSubscription.stripeCustomerId) {
            const billingPortalSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl
            })
            return NextResponse.json({ url: billingPortalSession.url })
        }
        // user first time subscribing

        const checkoutSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: session.user.email ?? '',
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: 'Scholar AI Pro',
                            description: 'Unlimited course generations'
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1
                },
            ],
            metadata: {
                userId: session.user.id
            }
        });
        return NextResponse.json({ url: checkoutSession.url });

    } catch (e) {
        console.log('[STRIPE ERROR]', e);
        return new NextResponse('internal server error', { status: 500 });
    }
}
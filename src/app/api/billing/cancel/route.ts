import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'pro') {
      return NextResponse.json({ error: 'You do not have an active subscription.' }, { status: 400 });
    }

    const isMock = !user.stripeSubscriptionId || user.stripeSubscriptionId.startsWith('sub_mock_') || STRIPE_SECRET_KEY === 'sk_test_mock';

    if (!isMock && user.stripeSubscriptionId) {
      try {
        // Try to cancel subscription in Stripe
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (stripeErr) {
        console.error('Stripe cancel error (ignored to downgrade local record):', stripeErr);
      }
    }

    // Downgrade the user's role in our database
    await db.user.update({
      where: { id: user.id },
      data: {
        role: 'free',
        stripeSubscriptionId: null,
      },
    });

    console.log(`Successfully downgraded user ${user.id} to Free via billing/cancel`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

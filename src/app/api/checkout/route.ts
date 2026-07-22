import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSessionUser } from '@/lib/auth';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Mock stripe flow if keys are not configured or are placeholder
    if (STRIPE_SECRET_KEY === 'sk_test_mock') {
      console.log('Using mock Stripe checkout session flow');
      // In mock mode, we generate a mock URL that leads to a local checkout success mock page
      const mockSuccessUrl = `${appUrl}/api/checkout/mock-success?userId=${user.id}`;
      return NextResponse.json({ url: mockSuccessUrl });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ResumeAces Pro Plan',
              description: 'Unlimited scans, ATS keyword matching, and detailed suggestions',
            },
            unit_amount: 1900, // $19.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?tab=billing&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?tab=billing`,
      client_reference_id: user.id,
      customer_email: user.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

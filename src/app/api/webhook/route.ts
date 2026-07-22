import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock';
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // If webhook secret is the default/mock key, bypass verification for local testing purposes
    if (STRIPE_WEBHOOK_SECRET === 'whsec_mock') {
      console.log('Bypassing webhook signature verification for test/mock webhook secret');
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Received stripe event type: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (userId) {
          await db.user.update({
            where: { id: userId },
            data: {
              role: 'pro',
              stripeCustomerId,
              stripeSubscriptionId,
            },
          });
          console.log(`Successfully upgraded user ${userId} to Pro via checkout.session.completed`);
        } else if (session.customer_details?.email) {
          // Fallback lookup by email
          await db.user.update({
            where: { email: session.customer_details.email },
            data: {
              role: 'pro',
              stripeCustomerId,
              stripeSubscriptionId,
            },
          });
          console.log(`Successfully upgraded user with email ${session.customer_details.email} to Pro via checkout.session.completed`);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        if (subscriptionId) {
          const user = await db.user.findFirst({
            where: {
              OR: [
                { stripeSubscriptionId: subscriptionId },
                { stripeCustomerId: customerId },
              ],
            },
          });

          if (user) {
            await db.user.update({
              where: { id: user.id },
              data: {
                role: 'pro',
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
              },
            });
            console.log(`Confirmed user ${user.id} is Pro via invoice.paid`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;

        const user = await db.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              role: 'free',
              stripeSubscriptionId: null,
            },
          });
          console.log(`Downgraded user ${user.id} to Free via customer.subscription.deleted`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook event handling error:', error);
    return NextResponse.json(
      { error: 'Webhook event handling failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

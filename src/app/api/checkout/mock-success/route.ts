import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Simulate webhook database upgrade
    await db.user.update({
      where: { id: userId },
      data: {
        role: 'pro',
        stripeCustomerId: `cus_mock_${Math.random().toString(36).substring(7)}`,
        stripeSubscriptionId: `sub_mock_${Math.random().toString(36).substring(7)}`,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/dashboard?tab=billing`);
  } catch (error: any) {
    console.error('Mock success error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch count of reviews in last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const usageCount = await db.usageLog.count({
    where: {
      userId: user.id,
      action: 'resume_review',
      createdAt: {
        gte: twentyFourHoursAgo,
      },
    },
  });

  // Fetch past reviews
  const rawReviews = await db.resumeReview.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Parse JSON feedback before sending to Client Component
  const pastReviews = rawReviews.map(r => {
    let parsedFeedback = {};
    try {
      parsedFeedback = JSON.parse(r.feedback);
    } catch (e) {
      console.error('Failed to parse feedback for review ID:', r.id);
    }

    return {
      id: r.id,
      matchScore: r.matchScore,
      createdAt: r.createdAt.toISOString(),
      resumeText: r.resumeText,
      jobDescription: r.jobDescription,
      feedback: parsedFeedback,
    };
  });

  return (
    <DashboardClient 
      user={{
        id: user.id,
        email: user.email,
        role: user.role,
      }} 
      usageCount={usageCount} 
      initialReviews={pastReviews} 
    />
  );
}

export const dynamic = 'force-dynamic';

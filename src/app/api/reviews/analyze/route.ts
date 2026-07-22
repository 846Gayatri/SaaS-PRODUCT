import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'mock_gemini_api_key';

// Local heuristic fallback generator
function generateFallbackReview(resumeText: string, jobDescription: string) {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Find some common technical keywords present in JD
  const commonKeywords = [
    'react', 'next.js', 'typescript', 'javascript', 'node.js', 'python', 'java',
    'docker', 'aws', 'kubernetes', 'sql', 'postgresql', 'mongodb', 'graphql',
    'rest api', 'tailwind', 'git', 'ci/cd', 'agile', 'scrum', 'testing', 'jest'
  ];

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  commonKeywords.forEach(word => {
    const inJD = jdLower.includes(word);
    const inResume = resumeLower.includes(word);

    if (inJD && inResume) {
      matchingKeywords.push(word.toUpperCase());
    } else if (inJD && !inResume) {
      missingKeywords.push(word.toUpperCase());
    }
  });

  // Default values if no matching keywords found
  if (matchingKeywords.length === 0) matchingKeywords.push('COMMUNICATION', 'PROBLEM SOLVING');
  if (missingKeywords.length === 0) missingKeywords.push('UNIT TESTING', 'SYSTEM DESIGN');

  // Simple heuristic score calculation
  const totalKeywordsInJD = matchingKeywords.length + missingKeywords.length;
  let baseScore = 65; // average resume score
  if (totalKeywordsInJD > 0) {
    baseScore = Math.round((matchingKeywords.length / totalKeywordsInJD) * 40 + 50); // scales 50-90
  }
  const matchScore = Math.min(Math.max(baseScore, 30), 98); // cap between 30 and 98

  // Generate lists based on inputs
  const strengths = [
    `Strong core technical keywords matching (${matchingKeywords.slice(0, 3).join(', ')})`,
    'Good layout structure and section breakdown',
    'Clear alignment of career history with the general target role outline'
  ];

  const gaps = [
    `Missing target keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
    'Could benefit from more quantitative results (metrics, percentages) in job summaries',
    'Missing details on automated CI/CD deployment configurations'
  ];

  const improvements = [
    `Integrate keywords like ${missingKeywords.slice(0, 2).join(', ')} directly into your experience bullet points.`,
    'Rephrase bullet points using the XYZ formula (e.g. Accomplished [X], as measured by [Y], by doing [Z]).',
    'Keep your formatting consistent with bulleted lists rather than dense narrative paragraphs.'
  ];

  const summary = `Your resume matches ${matchScore}% of the target job description. You have demonstrated strong competency in ${matchingKeywords.slice(0, 3).join(', ')}, but critical gaps remain in areas like ${missingKeywords.slice(0, 2).join(', ')}. Actionable revisions are recommended below to improve ATS screening pass rates.`;

  return {
    matchScore,
    summary,
    strengths,
    gaps,
    keywords: {
      matching: matchingKeywords,
      missing: missingKeywords
    },
    improvements
  };
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required' },
        { status: 400 }
      );
    }

    // Limit checks for Free tier
    if (user.role === 'free') {
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

      if (usageCount >= 3) {
        return NextResponse.json(
          { error: 'Daily review limit reached (3 per day for Free). Please upgrade to Pro for unlimited reviews.' },
          { status: 403 }
        );
      }
    }

    let feedbackData;

    // Use Gemini if API key is not the default mock key
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'mock_gemini_api_key') {
      try {
        const systemPrompt = `You are an expert technical recruiter and ATS resume optimization engine.
Analyze the following Resume against the target Job Description.
Your output must be a valid JSON object matching this schema:
{
  "matchScore": number (0-100),
  "summary": "a detailed 2-3 sentence overview of compatibility",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["critical gap 1", "critical gap 2"],
  "keywords": {
    "matching": ["keyword 1", "keyword 2"],
    "missing": ["keyword 3", "keyword 4"]
  },
  "improvements": ["actionable improvement 1", "actionable improvement 2"]
}`;

        const promptContent = `Resume Content:
${resumeText}

Job Description Content:
${jobDescription}`;

        const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${promptContent}` }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API error: ${errText}`);
        }

        const resData = await response.json();
        const rawJsonText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (rawJsonText) {
          feedbackData = JSON.parse(rawJsonText.trim());
        } else {
          throw new Error('Empty response from Gemini API');
        }
      } catch (geminiError) {
        console.error('Failed to query Gemini API, falling back to heuristics:', geminiError);
        feedbackData = generateFallbackReview(resumeText, jobDescription);
      }
    } else {
      // Direct heuristic analysis fallback
      feedbackData = generateFallbackReview(resumeText, jobDescription);
    }

    // Save review to DB
    const review = await db.resumeReview.create({
      data: {
        userId: user.id,
        resumeText,
        jobDescription,
        matchScore: feedbackData.matchScore,
        feedback: JSON.stringify(feedbackData),
      },
    });

    // Log the usage
    await db.usageLog.create({
      data: {
        userId: user.id,
        action: 'resume_review',
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        matchScore: review.matchScore,
        feedback: feedbackData,
        createdAt: review.createdAt,
      },
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

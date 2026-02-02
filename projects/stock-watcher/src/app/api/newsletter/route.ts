import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

// Supabase client (if configured)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Fallback: local JSON storage
const LOCAL_STORAGE_PATH = path.join(process.cwd(), 'data', 'newsletter-signups.json');

interface Signup {
  email: string;
  source: string;
  timestamp: string;
  ip?: string;
}

async function getLocalSignups(): Promise<Signup[]> {
  try {
    const data = await fs.readFile(LOCAL_STORAGE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLocalSignup(signup: Signup): Promise<void> {
  const signups = await getLocalSignups();
  
  // Check for duplicate
  if (signups.some(s => s.email.toLowerCase() === signup.email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  
  signups.push(signup);
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(LOCAL_STORAGE_PATH), { recursive: true });
  await fs.writeFile(LOCAL_STORAGE_PATH, JSON.stringify(signups, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'unknown' } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Try Supabase first
    if (supabase) {
      const { data, error } = await supabase
        .from('newsletter_signups')
        .insert({
          email: normalizedEmail,
          source,
          ip_address: ip,
        })
        .select()
        .single();

      if (error) {
        // Duplicate email (unique constraint)
        if (error.code === '23505') {
          return NextResponse.json(
            { error: 'You\'re already on the list!' },
            { status: 409 }
          );
        }
        throw error;
      }

      return NextResponse.json({
        success: true,
        message: "You're on the list! We'll be in touch.",
      });
    }

    // Fallback to local storage
    try {
      await saveLocalSignup({
        email: normalizedEmail,
        source,
        timestamp: new Date().toISOString(),
        ip,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Email already registered') {
        return NextResponse.json(
          { error: 'You\'re already on the list!' },
          { status: 409 }
        );
      }
      throw err;
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll be in touch.",
    });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// GET: List signups (admin only - add auth in production)
export async function GET(request: NextRequest) {
  // Simple auth check via query param (replace with proper auth)
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get('key');
  
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (supabase) {
    const { data, error } = await supabase
      .from('newsletter_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signups: data, count: data?.length || 0 });
  }

  // Fallback to local
  const signups = await getLocalSignups();
  return NextResponse.json({ 
    signups: signups.reverse(), 
    count: signups.length 
  });
}

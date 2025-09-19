import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Button } from './platform';
import { PlayCircleIcon, LockIcon, BookOpenIcon, VideoIcon, FileTextIcon } from '../constants/platform';

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'quiz' | 'download';
  duration: string;
  content_url?: string;
  is_free: boolean;
  order: number;
}

interface UserProgress {
  module_id: string;
  completed: boolean;
  completed_at?: string;
  progress_percentage: number;
}

const FREE_COURSE_MODULES: CourseModule[] = [
  // Module 1: The Professional First Impression System
  {
    id: 'professional-email-formula',
    title: 'The Professional First Impression System',
    description: 'Why 90% of DJs never get past the email. Learn the 3-part formula that gets responses.',
    type: 'article',
    duration: '25 min',
    content_url: '/course-content/professional-first-impression.html',
    is_free: true,
    order: 1
  },
  {
    id: 'email-templates-system',
    title: 'Email Templates That Get Opened',
    description: 'The exact templates and follow-up strategies that generate $500,000+ in bookings.',
    type: 'article',
    duration: '20 min',
    content_url: '/course-content/email-templates.html',
    is_free: true,
    order: 2
  },
  // Module 2: The Promo Pack That Gets Opened
  {
    id: 'promo-pack-system',
    title: 'The Promo Pack That Gets Opened',
    description: 'What promoters actually look for (it\'s not what you think). The 5-component system.',
    type: 'article',
    duration: '30 min',
    content_url: '/course-content/promo-pack-system.html',
    is_free: true,
    order: 3
  },
  {
    id: 'power-bio-formula',
    title: 'The Power Bio Formula',
    description: 'Transform your DJ bio from generic story to booking-winning business case.',
    type: 'article',
    duration: '15 min',
    content_url: '/course-content/power-bio.html',
    is_free: true,
    order: 4
  },
  {
    id: 'peak-hour-proof-mix',
    title: 'The Peak Hour Proof Mix',
    description: 'Create the 10-15 minute mix that proves you can pack dance floors.',
    type: 'article',
    duration: '20 min',
    content_url: '/course-content/peak-hour-mix.html',
    is_free: true,
    order: 5
  },
  // Module 3: The Venue Research Method
  {
    id: 'venue-research-method',
    title: 'The Venue Research Method',
    description: 'How to find the right gigs and avoid wasting time. Strategic venue hierarchy system.',
    type: 'article',
    duration: '35 min',
    content_url: '/course-content/venue-research.html',
    is_free: true,
    order: 6
  },
  {
    id: 'venue-opportunity-scorecard',
    title: 'Venue Opportunity Scorecard',
    description: 'Rate venues on 12 factors to prioritize your outreach and maximize success.',
    type: 'article',
    duration: '15 min',
    content_url: '/course-content/opportunity-scorecard.html',
    is_free: true,
    order: 7
  },
  // Module 4: The Networking Multiplication Effect
  {
    id: 'networking-multiplication',
    title: 'The Networking Multiplication Effect',
    description: 'How one connection leads to 10 gigs. The strategic networking hierarchy.',
    type: 'article',
    duration: '30 min',
    content_url: '/course-content/networking-system.html',
    is_free: true,
    order: 8
  },
  // Advanced Modules (Now Open)
  {
    id: 'rate-negotiation-mastery',
    title: 'Rate Negotiation Mastery',
    description: 'Advanced pricing strategies and negotiation tactics for premium rates.',
    type: 'article',
    duration: '25 min',
    is_free: true,
    order: 9
  },
  {
    id: 'club-scene-domination',
    title: 'Club Scene Domination',
    description: 'Break into elite venues and play with headliners. Industry insider secrets.',
    type: 'article',
    duration: '40 min',
    is_free: true,
    order: 10
  },
  {
    id: 'social-media-booking-machine',
    title: 'Social Media Booking Machine',
    description: 'Build a massive following that books you. Content strategy and growth hacking.',
    type: 'article',
    duration: '35 min',
    is_free: true,
    order: 11
  },
  {
    id: 'dj-business-empire',
    title: 'Build Your DJ Business Empire',
    description: 'Multiple revenue streams, financial planning, and scaling strategies.',
    type: 'article',
    duration: '45 min',
    is_free: true,
    order: 12
  }
];

export const FreeCourseAccess: React.FC<{ preview?: boolean }> = ({ preview = false }) => {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadUserProgress();
      checkCourseAccess();
    }
    // Auto-select first module on load
    if (!selectedModule && FREE_COURSE_MODULES.length > 0) {
      setSelectedModule(FREE_COURSE_MODULES[0]);
    }
  }, [currentUser]);

  const loadUserProgress = async () => {
    if (!currentUser) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.email) // Using email as identifier
        .single();

      if (profile) {
        const { data: progress } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', profile.id);

        setUserProgress(progress || []);
      }
    } catch (error) {
      console.error('Failed to load course progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCourseAccess = async () => {
    if (!currentUser) return;

    try {
      // Check if user has premium subscription or course access
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.email)
        .eq('status', 'active')
        .single();

      // Free users get access to free modules, premium users get all modules
      setHasAccess(true); // Everyone gets access to free content
    } catch (error) {
      console.error('Failed to check course access:', error);
      setHasAccess(true); // Default to allowing free access
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!currentUser) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.email)
        .single();

      if (profile) {
        await supabase
          .from('course_progress')
          .upsert({
            user_id: profile.id,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString(),
            progress_percentage: 100
          }, { onConflict: 'user_id,module_id' });

        // Reload progress
        loadUserProgress();
      }
    } catch (error) {
      console.error('Failed to mark module complete:', error);
    }
  };

  const getModuleProgress = (moduleId: string): UserProgress | undefined => {
    return userProgress.find(p => p.module_id === moduleId);
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    const progress = getModuleProgress(moduleId);
    return progress?.completed || false;
  };

  const canAccessModule = (module: CourseModule): boolean => {
    // All modules are now accessible (open course)
    return true;
  };

  const getCompletionPercentage = (): number => {
    const completedCount = FREE_COURSE_MODULES.filter(m => isModuleCompleted(m.id)).length;
    return Math.round((completedCount / FREE_COURSE_MODULES.length) * 100);
  };

  const renderModuleArticleContent = (moduleId: string) => {
    const content = {
      'professional-email-formula': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/1.jpg" 
              alt="Professional DJ at work" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-red-400 mb-2">⚠️ Why 90% of DJs Never Get Past the Email</h4>
            <p className="text-gray-300">If you're reading this, you're already ahead of 90% of DJs who think talent alone will get them booked. The difference? Professional communication.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">The Email That Changed Everything</h4>
            <p className="mb-4">Marcus, a house DJ from Miami, sent emails like this for two years:</p>
            <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
              <p className="italic text-red-300">"Hey, I'm a really good DJ and I play house music. I've been DJing for 5 years and have all my own equipment. Can I play at your club?"</p>
              <p className="text-sm text-red-400 mt-2">Response rate: Zero.</p>
            </div>
            <p>Then he learned this system. His first email got him a callback within 6 hours. Within 3 months, he was a regular at three South Beach venues.</p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">Why Most DJ Emails Get Deleted</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Generic messaging - Shows you didn't research their venue</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Focused on you, not them - They don't care about your passion</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> No proof you can pack a floor - They need butts in seats</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Unprofessional presentation - Looks like amateur hour</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> No clear next step - They don't know how to respond</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-500 mb-4">🎯 The 3-Part Professional Email Formula</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-green-500 mb-2">PART 1: The Research Hook</h5>
                <p className="mb-2">Subject Line Formula: "Available [SPECIFIC DATE] - [YOUR DJ NAME] - [THEIR GENRE] Specialist"</p>
                <div className="bg-green-900/20 border-l-4 border-green-500 p-3">
                  <p className="text-green-300 font-mono text-sm">"Available March 15th - DJ Sarah K - Tech House Specialist"</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-green-500 mb-2">PART 2: The Value Proposition</h5>
                <p>Focus on solving their problems, not talking about yourself.</p>
              </div>
              <div>
                <h5 className="font-semibold text-green-500 mb-2">PART 3: The Easy Yes</h5>
                <p>Make it simple for them to say yes with a clear call to action.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      'email-templates-system': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/2.jpg" 
              alt="Email communication" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-3">The Complete Email Template</h4>
            <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
              <div className="space-y-3 font-mono text-sm">
                <div><strong>Subject:</strong> Available March 15th - DJ Sarah K - Tech House Specialist</div>
                <div className="border-t border-gray-700 pt-3">
                  <p className="mb-3">Hi Marcus,</p>
                  <p className="mb-3">I was at LIV last Saturday during Steve's 1-3am set and loved how the crowd responded when he transitioned from progressive to tech house around 1:30am. The energy in that room was electric.</p>
                  <p className="mb-3">I specialize in building energy during those crucial 10pm-11pm hours when most DJs struggle to get people dancing. My track selection and mixing style consistently gets crowds moving before the headliner takes over.</p>
                  <p className="mb-3">I've attached a 15-minute mix that matches your venue's vibe from last Saturday night. Would you be open to a 5-minute call this week to discuss your upcoming March dates?</p>
                  <p>Best regards,<br/>Sarah K<br/>[Phone number]<br/>[Instagram handle]</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">Follow-Up Strategy</h4>
            <p className="mb-3">If you don't hear back in 5-7 days, send this follow-up:</p>
            <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
              <div className="font-mono text-sm">
                <div><strong>Subject:</strong> Re: March 15th Availability - DJ Sarah K</div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <p className="mb-3">Hi Marcus,</p>
                  <p className="mb-3">I know you're swamped with bookings, so just wanted to bump this to the top of your inbox. Still have March 15th available and would love to contribute to another incredible Saturday at LIV.</p>
                  <p className="mb-3">Quick question - what's your preferred method for receiving DJ submissions? Email, phone, or in-person?</p>
                  <p>Thanks for your time,<br/>Sarah</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-blue-400 mb-3">📈 Pro Tips for Email Success</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">✅</span> Send Tuesday-Thursday, 10am-2pm - Best response rates</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">✅</span> Research the person's name - Never use "To Whom It May Concern"</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">✅</span> Keep it under 150 words - They're busy people</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">✅</span> Always attach something - Mix, press kit, or photos</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">✅</span> Use professional email address - yourname@gmail.com</li>
            </ul>
          </div>
        </div>
      ),
      'promo-pack-system': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/3.jpg" 
              alt="DJ promo materials" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-yellow-400 mb-2">💰 The $10,000 Promo Pack Mistake</h4>
            <p className="text-gray-300 mb-3">Alex spent $10,000 on professional photos, studio time, and graphic design. Result? Zero bookings in 6 weeks.</p>
            <p className="text-gray-300">Meanwhile, Jessica used her iPhone and free Canva templates. She booked 8 gigs in the same period.</p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">What Promoters Actually Want to See</h4>
            <p className="mb-3">Promoters aren't art critics. They're business people with one question: "Will this DJ help me make money?"</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Can you pack the floor?</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Will people stay and buy drinks?</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Are you reliable and professional?</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> Do you bring your own audience?</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-500 mb-4">🎯 The Booking-Winning Promo Pack System</h4>
            <p className="mb-4">Your promo pack needs exactly 5 components. No more, no less:</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <h5 className="font-semibold">The Power Bio (2-3 sentences max)</h5>
                  <p className="text-sm text-gray-300">Business case for why they should book you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <h5 className="font-semibold">The Strategic Mix (10-15 minutes)</h5>
                  <p className="text-sm text-gray-300">Peak hour proof with crowd noise</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <h5 className="font-semibold">Social Proof Package</h5>
                  <p className="text-sm text-gray-300">Photos, testimonials, metrics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <h5 className="font-semibold">Professional Photo</h5>
                  <p className="text-sm text-gray-300">Behind decks with crowd visible</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-green-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <h5 className="font-semibold">Contact Package</h5>
                  <p className="text-sm text-gray-300">Make it easy to book you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      'power-bio-formula': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/4.jpg" 
              alt="Professional DJ profile" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-3">Power Bio Formula</h4>
            <div className="bg-gray-700 border border-gray-700 rounded-lg p-4 mb-4">
              <p className="font-mono text-sm">[DJ NAME] has [SPECIFIC ACHIEVEMENT] across [LOCATION] for [TIME PERIOD], specializing in [GENRE/STYLE]. Known for [SPECIFIC SKILL], [he/she] has [CREDIBILITY MARKERS] and regularly [AUDIENCE/REACH PROOF].</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">Examples of Effective Power Bios</h4>
            <div className="space-y-4">
              <div className="bg-green-900/20 border-l-4 border-green-500 p-4">
                <h5 className="font-semibold text-green-400 mb-2">Tech House DJ:</h5>
                <p className="text-green-300 italic">"DJ Sarah has packed dance floors across Miami's club scene for 3 years, specializing in tech house and progressive. Known for reading crowds and maintaining peak energy, she's held residencies at LIV and Story, and regularly draws 2,000+ followers to her monthly events."</p>
              </div>
              <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4">
                <h5 className="font-semibold text-blue-400 mb-2">Wedding DJ:</h5>
                <p className="text-blue-300 italic">"DJ Michael has created unforgettable experiences for 200+ weddings across California, specializing in multi-generational crowd reading. Known for seamless transitions between genres, he maintains a 100% client satisfaction rate and books 18 months in advance."</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-red-400 mb-3">❌ Power Bio Mistakes to Avoid</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> "Passionate about music since childhood"</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> "Loves bringing people together"</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> "Started DJing in my bedroom"</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> "Influenced by [famous DJ names]"</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Long paragraphs about musical journey</li>
            </ul>
          </div>
        </div>
      ),
      'peak-hour-proof-mix': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/5.jpg" 
              alt="DJ mixing at peak hour" 
              className="w-full h-48 object-cover object-center rounded-lg mb-4"
            />
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-red-400 mb-2">⚠️ What NOT to Send</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> 60+ minute bedroom recordings</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Warm-up or chill sets</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Experimental or artistic mixes</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Low-energy progressive builds</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> Mixes without crowd noise</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-500 mb-4">🎯 The "Peak Hour Proof" Mix</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-semibold mb-2">Duration:</h5>
                <p className="text-sm">10-15 minutes maximum</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Energy Level:</h5>
                <p className="text-sm">Peak hour only (no warm-up tracks)</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Recording:</h5>
                <p className="text-sm">Live with crowd noise when possible</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Content:</h5>
                <p className="text-sm">Matches their venue's exact vibe</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">The Peak Hour Proof Formula</h4>
            <div className="space-y-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Minutes 1-3: Hook them immediately</h5>
                <ul className="text-sm space-y-1">
                  <li>• Open with a track that matches their venue</li>
                  <li>• Show your mixing skills right away</li>
                  <li>• Build energy from second one</li>
                </ul>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Minutes 4-8: Prove your crowd control</h5>
                <ul className="text-sm space-y-1">
                  <li>• Include crowd-pleasing moments</li>
                  <li>• Show genre versatility within their style</li>
                  <li>• Demonstrate seamless transitions</li>
                </ul>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Minutes 9-12: Peak energy showcase</h5>
                <ul className="text-sm space-y-1">
                  <li>• Your biggest crowd reaction moment</li>
                  <li>• Technical skill highlight</li>
                  <li>• Memorable finale that leaves them wanting more</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      'venue-research-method': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/6.jpg" 
              alt="Nightclub venue research" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-yellow-400 mb-2">💸 The $5,000 Mistake Most DJs Make</h4>
            <p className="text-gray-300 mb-3">Ryan spent $5,000 on Facebook ads promoting his "versatile DJ services" to "all event types in the city." Result? 3 low-paying gigs and a drained bank account.</p>
            <p className="text-gray-300">Meanwhile, Lisa spent $200 on targeted research tools and booked 15 high-paying gigs by focusing on exactly the right venues for her style.</p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">The Strategic Venue Hierarchy</h4>
            <p className="mb-4">Think of your DJ career like climbing a ladder. Each rung requires different skills and offers different rewards:</p>
            
            <div className="space-y-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 1: Foundation Building (Months 1-6)</h5>
                <p className="text-sm mb-2"><strong>Goal:</strong> Gain experience and create content</p>
                <p className="text-sm mb-2"><strong>Venues:</strong> House parties, small bars, restaurant gigs</p>
                <p className="text-sm"><strong>Pay Range:</strong> $0-$200</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 2: Credibility Building (Months 6-18)</h5>
                <p className="text-sm mb-2"><strong>Goal:</strong> Establish professional reputation</p>
                <p className="text-sm mb-2"><strong>Venues:</strong> Cocktail lounges, weddings, corporate events</p>
                <p className="text-sm"><strong>Pay Range:</strong> $200-$600</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 3: Market Positioning (Months 18-36)</h5>
                <p className="text-sm mb-2"><strong>Goal:</strong> Establish yourself in specific market segment</p>
                <p className="text-sm mb-2"><strong>Venues:</strong> Mid-sized nightclubs, music festivals</p>
                <p className="text-sm"><strong>Pay Range:</strong> $600-$2000</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 4: Elite Positioning (3+ Years)</h5>
                <p className="text-sm mb-2"><strong>Goal:</strong> Premium rates and exclusive opportunities</p>
                <p className="text-sm mb-2"><strong>Venues:</strong> Premium nightclubs, major festivals, celebrity events</p>
                <p className="text-sm"><strong>Pay Range:</strong> $2000-$15,000+</p>
              </div>
            </div>
          </div>
        </div>
      ),
      'opportunity-scorecard': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/7.jpg" 
              alt="Venue evaluation scorecard" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-500 mb-4">🎯 The Venue Opportunity Scorecard</h4>
            <p className="mb-4">Rate each potential venue on these factors (1-10 scale):</p>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold mb-2">Alignment Factors:</h5>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Genre Match</strong> - How well does their music match your style?</li>
                  <li>• <strong>Crowd Fit</strong> - Does their demographic match your target audience?</li>
                  <li>• <strong>Brand Alignment</strong> - Does their venue image match your DJ persona?</li>
                  <li>• <strong>Time Slots</strong> - Do they have openings during your preferred times?</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">Business Factors:</h5>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Pay Range</strong> - Do they offer rates that meet your current tier?</li>
                  <li>• <strong>Professionalism</strong> - Do they treat DJs well and pay on time?</li>
                  <li>• <strong>Growth Potential</strong> - Could this lead to better opportunities?</li>
                  <li>• <strong>Network Value</strong> - Will this connect you with other industry contacts?</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-bold mb-3">Scoring Guidelines</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-green-400 mt-1">✅</span> <strong>65-80:</strong> Priority target, pursue aggressively</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">ℹ️</span> <strong>50-64:</strong> Good opportunity, include in regular outreach</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">⚠️</span> <strong>35-49:</strong> Low priority, contact only if time allows</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-1">❌</span> <strong>Below 35:</strong> Skip entirely</li>
            </ul>
          </div>
        </div>
      ),
      'networking-multiplication': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/8.jpg" 
              alt="DJ networking at events" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-green-400 mb-2">🔗 The Connection That Changed Everything</h4>
            <p className="text-gray-300 mb-3">DJ Marcus met Sarah, a nightlife photographer, at a random Tuesday night event. He didn't pitch her or ask for favors. He simply complimented her work and asked about her favorite venues to shoot.</p>
            <p className="text-gray-300">That conversation led to 3 club introductions, professional photos, 2 promoter referrals, a monthly residency, and over $15,000 in bookings in year one.</p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">The Networking Hierarchy That Multiplies Opportunities</h4>
            <p className="mb-4">Most DJs think networking means talking to other DJs. That's level 1 thinking. Here's the strategic hierarchy:</p>
            
            <div className="space-y-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Level 1: Other DJs (Your Referral Network)</h5>
                <p className="text-sm mb-2"><strong>Value:</strong> Direct gig referrals, collaboration opportunities, industry knowledge</p>
                <ul className="text-sm space-y-1">
                  <li>• Sub opportunities when they can't make gigs</li>
                  <li>• Collaboration on events and parties</li>
                  <li>• Knowledge about venue preferences and booking contacts</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Level 2: Photographers & Videographers (Your Content Creators)</h5>
                <p className="text-sm mb-2"><strong>Value:</strong> Professional content, venue connections, promotional opportunities</p>
                <ul className="text-sm space-y-1">
                  <li>• They work at different venues every weekend</li>
                  <li>• They know all the promoters, managers, and other DJs</li>
                  <li>• They create the content you need for marketing</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Level 3: Promoters & Event Organizers (Your Opportunity Multipliers)</h5>
                <p className="text-sm mb-2"><strong>Value:</strong> Multiple booking opportunities, industry connections, event insights</p>
                <ul className="text-sm space-y-1">
                  <li>• They book multiple DJs for different types of events</li>
                  <li>• They have relationships with venue owners across the city</li>
                  <li>• They're always seeking fresh, reliable talent</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Level 4: Venue Owners & Managers (Your Decision Makers)</h5>
                <p className="text-sm mb-2"><strong>Value:</strong> Direct booking authority, industry influence, long-term partnerships</p>
                <ul className="text-sm space-y-1">
                  <li>• They have final authority on bookings and rates</li>
                  <li>• They can offer regular residencies and partnerships</li>
                  <li>• They influence the local scene's direction and trends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      'rate-negotiation-mastery': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/9.jpg" 
              alt="DJ rate negotiation" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-green-400 mb-2">💰 Rate Negotiation Mastery</h4>
            <p className="text-gray-300">Learn advanced pricing strategies that command premium rates and position you as a high-value DJ in the market.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">The Psychology of Premium Pricing</h4>
            <p className="mb-4">Most DJs undervalue themselves because they don't understand the psychology behind premium pricing. Here's how to position yourself for higher rates:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Scarcity Principle:</strong> Limited availability increases perceived value</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Social Proof:</strong> High-profile gigs justify higher rates</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Expertise Positioning:</strong> Specialization commands premium pricing</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Value Stacking:</strong> Bundle services to increase total package value</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-500 mb-4">🎯 The Rate Negotiation Framework</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-green-500 mb-2">Step 1: Anchor High</h5>
                <p className="text-sm">Start negotiations 20-30% above your target rate to create room for negotiation.</p>
              </div>
              <div>
                <h5 className="font-semibold text-green-500 mb-2">Step 2: Justify Value</h5>
                <p className="text-sm">Present specific benefits and outcomes you deliver, not just your services.</p>
              </div>
              <div>
                <h5 className="font-semibold text-green-500 mb-2">Step 3: Create Win-Win</h5>
                <p className="text-sm">Offer alternatives that maintain your rate while providing client flexibility.</p>
              </div>
            </div>
          </div>
        </div>
      ),
      'club-scene-domination': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/10.jpg" 
              alt="Elite nightclub scene" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-purple-400 mb-2">🏆 Club Scene Domination</h4>
            <p className="text-gray-300">Break into elite venues and play alongside headliners. Industry insider secrets for climbing the club hierarchy.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">The Club Hierarchy System</h4>
            <p className="mb-4">Understanding the club ecosystem is crucial for strategic career advancement:</p>
            <div className="space-y-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 1: Local Clubs</h5>
                <p className="text-sm mb-2"><strong>Strategy:</strong> Build reputation and create content</p>
                <p className="text-sm"><strong>Focus:</strong> Consistency, professionalism, crowd building</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 2: Regional Venues</h5>
                <p className="text-sm mb-2"><strong>Strategy:</strong> Leverage local success for bigger opportunities</p>
                <p className="text-sm"><strong>Focus:</strong> Brand building, industry connections, technical excellence</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Tier 3: Elite Venues</h5>
                <p className="text-sm mb-2"><strong>Strategy:</strong> Position as premium talent with proven track record</p>
                <p className="text-sm"><strong>Focus:</strong> Exclusivity, premium rates, headliner support</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">Insider Networking Strategies</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> <strong>Promoter Relationships:</strong> Build long-term partnerships with key promoters</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> <strong>Artist Connections:</strong> Network with touring DJs and their management</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> <strong>Industry Events:</strong> Attend conferences, showcases, and industry parties</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-1">•</span> <strong>Label Relationships:</strong> Connect with record labels and A&Rs</li>
            </ul>
          </div>
        </div>
      ),
      'social-media-booking-machine': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/11.jpg" 
              alt="Social media for DJs" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-blue-400 mb-2">📱 Social Media Booking Machine</h4>
            <p className="text-gray-300">Build a massive following that books you automatically. Content strategy and growth hacking for DJs.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">The Content Pyramid Strategy</h4>
            <p className="mb-4">Create a systematic approach to content that builds your brand and attracts bookings:</p>
            <div className="space-y-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-blue-400 mb-2">Foundation: Performance Content (60%)</h5>
                <ul className="text-sm space-y-1">
                  <li>• Live mixing videos from gigs</li>
                  <li>• Behind-the-scenes venue content</li>
                  <li>• Crowd reaction highlights</li>
                  <li>• Technical skill demonstrations</li>
                </ul>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-blue-400 mb-2">Engagement: Educational Content (25%)</h5>
                <ul className="text-sm space-y-1">
                  <li>• DJ tips and tutorials</li>
                  <li>• Music production insights</li>
                  <li>• Industry knowledge sharing</li>
                  <li>• Equipment reviews and recommendations</li>
                </ul>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-blue-400 mb-2">Personal: Lifestyle Content (15%)</h5>
                <ul className="text-sm space-y-1">
                  <li>• Studio sessions and creative process</li>
                  <li>• Travel and tour experiences</li>
                  <li>• Personal stories and journey</li>
                  <li>• Collaborations with other artists</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <h4 className="text-lg font-bold text-green-500 mb-4">🚀 Growth Hacking Tactics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Hashtag Strategy:</strong> Use location and genre-specific hashtags</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Collaboration Posts:</strong> Tag venues, promoters, and other DJs</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Story Engagement:</strong> Use polls, questions, and interactive features</li>
              <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span> <strong>Cross-Platform:</strong> Repurpose content across all social channels</li>
            </ul>
          </div>
        </div>
      ),
      'dj-business-empire': (
        <div className="space-y-6">
          <div className="mb-6">
            <img 
              src="/DJ Elite Free Course/12.jpg" 
              alt="DJ business empire" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          </div>
          <div className="bg-gold-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-lg font-bold text-yellow-400 mb-2">🏢 Build Your DJ Business Empire</h4>
            <p className="text-gray-300">Multiple revenue streams, financial planning, and scaling strategies to build a sustainable DJ business.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-3">The 7 Revenue Stream Model</h4>
            <p className="mb-4">Diversify your income beyond just DJ gigs to build a sustainable music business:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">1. Live Performances</h5>
                <p className="text-sm">Clubs, festivals, private events, weddings</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">2. Music Production</h5>
                <p className="text-sm">Original tracks, remixes, ghost production</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">3. Online Content</h5>
                <p className="text-sm">Courses, tutorials, sample packs, presets</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">4. Brand Partnerships</h5>
                <p className="text-sm">Equipment endorsements, sponsored content</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">5. Event Production</h5>
                <p className="text-sm">Your own events, venue partnerships</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">6. Coaching/Consulting</h5>
                <p className="text-sm">Teaching other DJs, business consulting</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-400 mb-2">7. Licensing/Royalties</h5>
                <p className="text-sm">Sync licensing, streaming royalties, publishing</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3">Business Scaling Framework</h4>
            <div className="space-y-4">
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Phase 1: Solo Operator ($0-50K/year)</h5>
                <p className="text-sm">Focus on perfecting your craft and building initial revenue streams</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Phase 2: Brand Builder ($50K-150K/year)</h5>
                <p className="text-sm">Develop your brand, expand revenue streams, build team</p>
              </div>
              <div className="bg-gray-700 border border-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-green-500 mb-2">Phase 3: Business Owner ($150K+/year)</h5>
                <p className="text-sm">Scale operations, passive income, industry influence</p>
              </div>
            </div>
          </div>
        </div>
      )
    };
    
    return content[moduleId] || (
      <div className="text-center py-8">
        <p className="text-gray-300">Content for this module is being prepared. Check back soon!</p>
      </div>
    );
  };

  const renderModuleIcon = (type: CourseModule['type']) => {
    switch (type) {
      case 'video':
        return <VideoIcon className="w-5 h-5 text-red-500" />;
      case 'article':
        return <FileTextIcon className="w-5 h-5 text-blue-500" />;
      case 'quiz':
        return <BookOpenIcon className="w-5 h-5 text-green-500" />;
      case 'download':
        return <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>;
      default:
        return <BookOpenIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderModuleContent = (module: CourseModule) => {
    if (!canAccessModule(module)) {
      return (
        <div className="text-center py-12">
          <LockIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Premium Content</h3>
          <p className="text-gray-300 mb-6">
            Upgrade to access advanced DJ techniques and business strategies.
          </p>
          <Button>Upgrade to Premium</Button>
        </div>
      );
    }

    switch (module.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {module.content_url ? (
                <iframe
                  src={module.content_url}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title={module.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PlayCircleIcon className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                <p className="text-gray-300">{module.description}</p>
              </div>
              <Button
                onClick={() => markModuleComplete(module.id)}
                disabled={isModuleCompleted(module.id)}
                className={isModuleCompleted(module.id) ? 'bg-green-500' : ''}
              >
                {isModuleCompleted(module.id) ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  'Mark Complete'
                )}
              </Button>
            </div>
          </div>
        );

      case 'article':
        return (
          <div className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-bold text-white">{module.title}</h3>
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="space-y-6 text-white">
                  {renderModuleArticleContent(module.id)}
                </div>
              </div>
            </div>
            <Button
              onClick={() => markModuleComplete(module.id)}
              disabled={isModuleCompleted(module.id)}
              className={isModuleCompleted(module.id) ? 'bg-green-500' : ''}
            >
              {isModuleCompleted(module.id) ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{module.title}</h3>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-6">{module.description}</p>
              {/* Quiz questions would go here */}
              <div className="space-y-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="font-medium text-white mb-3">
                    1. What is the primary purpose of beatmatching?
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="q1" className="mr-2" />
                      <span className="text-gray-300">To make songs louder</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="q1" className="mr-2" />
                      <span className="text-gray-300">To synchronize the tempo of two tracks</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="q1" className="mr-2" />
                      <span className="text-gray-300">To change the key of a song</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={() => markModuleComplete(module.id)}
              disabled={isModuleCompleted(module.id)}
              className={isModuleCompleted(module.id) ? 'bg-green-500' : ''}
            >
              {isModuleCompleted(module.id) ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          </div>
        );

      case 'download':
        return (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">{module.title}</h3>
            <p className="text-gray-300">{module.description}</p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  // Simulate download
                  markModuleComplete(module.id);
                  alert('Download started! Check your downloads folder.');
                }}
                disabled={isModuleCompleted(module.id)}
              >
                {isModuleCompleted(module.id) ? 'Downloaded' : 'Download Now'}
              </Button>
              {isModuleCompleted(module.id) && (
                <p className="text-green-400 text-sm">
                  <CheckIcon className="w-4 h-4 inline mr-1" />
                  Download completed
                </p>
              )}
            </div>
          </div>
        );

      default:
        return <div>Content type not supported</div>;
    }
  };

  if (loading && !preview) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!currentUser && !preview) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            DJ Bookings Blueprint - Complete Course
          </h1>
          <p className="text-gray-300 mb-4">
            The complete system for landing high-paying DJ gigs. Master professional communication, promo pack creation, venue research, networking strategies, rate negotiation, and business building that generate consistent bookings and build your DJ empire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Course Modules</h2>
            <div className="space-y-2">
              {FREE_COURSE_MODULES.map((module) => (
                <div
                  key={module.id}
                  className="w-full text-left p-4 rounded-lg border border-gray-700 bg-gray-800 opacity-60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {renderModuleIcon(module.type)}
                      <span className="font-medium text-white">
                        {module.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-1 line-clamp-2">{module.description}</p>
                  <span className="text-xs text-gray-400">{module.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <LockIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Register to Access Free Course
              </h3>
              <p className="text-gray-300 mb-6">
                Create a free account to unlock all 12 modules of the DJ Bookings Blueprint course and start landing high-paying gigs.
              </p>
              <Button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}>Create Free Account</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess && !preview) {
    return (
      <div className="text-center py-12">
        <LockIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Course Access Required</h2>
        <p className="text-gray-300 mb-6">
          Sign up for a free account to access our DJ fundamentals course.
        </p>
        <Button>Create Free Account</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      {/* Course Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          DJ Bookings Blueprint - Complete Course
        </h1>
        <p className="text-gray-300 mb-4">
          The complete system for landing high-paying DJ gigs. Master professional communication, promo pack creation, venue research, networking strategies, rate negotiation, and business building that generate consistent bookings and build your DJ empire.
        </p>
        
        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-white">Course Progress</span>
            <span className="text-sm text-gray-300">{getCompletionPercentage()}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4">Course Modules</h2>
          <div className="space-y-2">
            {FREE_COURSE_MODULES.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedModule?.id === module.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-green-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {renderModuleIcon(module.type)}
                    <span className="font-medium text-white">
                      {module.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isModuleCompleted(module.id) && <CheckIcon className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-1 line-clamp-2">{module.description}</p>
                <span className="text-xs text-gray-400">{module.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Module Content */}
        <div className="lg:col-span-2">
          {selectedModule ? (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {renderModuleContent(selectedModule)}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <BookOpenIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Module to Begin
              </h3>
              <p className="text-gray-300">
                Choose a module from the list to start learning DJ fundamentals.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Course Completion Certificate */}
      {getCompletionPercentage() === 100 && (
        <div className="mt-8 bg-gradient-to-r from-[color:var(--accent)]/20 to-purple-500/20 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Congratulations!
          </h3>
          <p className="text-gray-300 mb-4">
            You've completed the DJ Fundamentals course. You're ready to start your DJ journey!
          </p>
          <Button>Download Certificate</Button>
        </div>
      )}
    </div>
  );
};
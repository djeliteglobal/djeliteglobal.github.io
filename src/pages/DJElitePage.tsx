import React, { useState } from 'react';
import { Button, AccordionItem, TestimonialCard, CountdownTimer } from '../components';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { 
    Logo, 
    SOCIAL_PROOF_STATS, 
    VENUE_LOGOS,
    PAIN_POINTS,
    METHOD_STEPS,
    TESTIMONIALS,
    INSTRUCTOR_CREDENTIALS,
    CURRICULUM_MODULES,
    VALUE_STACK_ITEMS,
    BONUSES,
    FAQS,
} from '../constants';
import '../animations.css';
import { useScrollAnimation } from '../useScrollAnimation';
import { useSelection } from '../useSelection';
import { useTranslation } from '../i18n/useTranslation';

const Section: React.FC<{id: string, className?: string, children: React.ReactNode, animationType?: string} & React.HTMLAttributes<HTMLElement>> = ({ id, className, children, animationType = 'animate-fade-in-up', ...props}) => {
    const ref = useScrollAnimation(animationType);
    return (
        <section 
            ref={ref} 
            id={id} 
            className={`py-20 sm:py-28 ${className}`} 
            style={{opacity: 0}}
            {...props}
        >
            <div className="container mx-auto px-4">
                {children}
            </div>
        </section>
    );
};

const SelectableCard: React.FC<{id: string, children: React.ReactNode, className?: string, isRedVariant?: boolean}> = ({ id, children, className = '', isRedVariant = false }) => {
    const { toggleSelection, isSelected } = useSelection();
    
    return (
        <div 
            className={`${className} cursor-pointer transition-all duration-500 relative ${
                isSelected(id) 
                    ? isRedVariant
                        ? 'bg-[color:var(--surface)] border border-red-500 shadow-[0_0_60px_-15px_rgba(239,68,68,0.3)] scale-105'
                        : 'bg-[color:var(--surface)] border border-[color:var(--accent)] shadow-[0_0_60px_-15px_rgba(0,245,122,0.3)] scale-105'
                    : 'hover:scale-102 hover:shadow-lg'
            }`}
            onClick={() => toggleSelection(id)}
        >
            {isSelected(id) && (
                <div className={`absolute top-1 right-1 w-4 h-4 rounded-sm flex items-center justify-center z-10 ${
                    isRedVariant ? 'bg-red-500/90' : 'bg-[color:var(--accent)]/90'
                }`}>
                    <span className="text-white text-xs">✓</span>
                </div>
            )}
            {children}
        </div>
    );
};

const SectionHeadline: React.FC<{children: React.ReactNode, subheadline?: string}> = ({ children, subheadline }) => (
    <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter animate-fade-in-up">{children}</h2>
        {subheadline && <p className="mt-4 max-w-2xl mx-auto text-lg text-[color:var(--text-secondary)] animate-fade-in-up animate-delay-200">{subheadline}</p>}
    </div>
);


export const DJElitePage: React.FC = () => {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const { toggleSelection, isSelected } = useSelection();
    const { t, language } = useTranslation();
    const leadMagnetPoints = [
        "How I went from busking in the street to playing at the best clubs",
        "The networking secrets I learned from 10 countries that actually work",
        "Club owner psychology - what they really want (not what you think)",
        "The 'value-first' approach that gets you in ANY door",
        "5 proven conversation starters that make promoters remember you"
    ];

    return (
        <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased animate-fade-in">
            
            {/* Hero Section */}
            <header className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1517814761483-6769dab4e9c0" alt="DJ performing at a club" className="absolute z-0 top-0 left-0 w-full h-full object-cover opacity-20"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg)] via-transparent to-transparent"></div>

                <div className="relative z-10">
                    <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter max-w-4xl mx-auto animate-fade-in-up animate-delay-200">
                        {t('heroTitle').split(':')[0]}: <span className="text-[color:var(--accent)]">{t('heroTitle').split(':')[1]}</span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-[color:var(--text-secondary)] max-w-2xl mx-auto animate-fade-in-up animate-delay-300">
                        {t('heroSubtitle')}
                    </p>
                    <div className="mt-10 max-w-lg mx-auto animate-fade-in-up animate-delay-400">
                        <div className="bg-[color:var(--surface)]/50 backdrop-blur-md border border-[color:var(--border)] rounded-xl p-6">
                           <div className="text-left mb-4">
                                <h3 className="font-bold text-lg text-[color:var(--accent)]">🎁 {t('freeTraining')}</h3>
                                <ul className="mt-2 space-y-2 text-sm text-[color:var(--text-secondary)]">
                                    {leadMagnetPoints.map(point => (
                                        <li key={point} className="flex items-start">
                                            <span className="text-[color:var(--accent)] mr-2 mt-1">✓</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                           </div>
                           <form onSubmit={async (e) => {
                               console.log('🚀 VITALIK: Form submitted!');
                               e.preventDefault();
                               
                               const form = e.target as HTMLFormElement;
                               const formData = new FormData(form);
                               const firstName = formData.get('first_name') as string;
                               const email = formData.get('email') as string;
                               
                               console.log('📧 VITALIK: Form data:', { email, firstName });
                               
                               if (!email || !firstName) {
                                   console.error('❌ VITALIK: Missing form data');
                                   alert('Please fill in all fields');
                                   return;
                               }
                               
                               try {
                                   console.log('⚡ VITALIK: Importing service...');
                                   const { subscribeToCareerAccelerator } = await import('../services/profileService');
                                   console.log('✅ VITALIK: Service imported');
                                   
                                   console.log('📤 VITALIK: Calling subscribeToCareerAccelerator...');
                                   await subscribeToCareerAccelerator(email, firstName);
                                   console.log('🎉 VITALIK: Newsletter subscription SUCCESS!');
                                   
                                   alert('🎉 Success! Check your email for the free training preview.');
                                   form.reset();
                               } catch (error: any) {
                                   console.error('💥 VITALIK: Newsletter error:', error);
                                   console.error('💥 VITALIK: Error message:', error?.message);
                                   console.error('💥 VITALIK: Error stack:', error?.stack);
                                   alert(`❌ Error: ${error?.message || 'Unknown error'}`);
                               }
                           }} className="flex flex-col gap-4">
                               <input type="text" name="first_name" placeholder={t('enterName')} required className="w-full px-4 py-3 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)] focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none transition-all" />
                               <input type="email" name="email" placeholder={t('enterEmail')} required className="w-full px-4 py-3 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)] focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none transition-all" />
                               <Button type="submit" className="w-full py-3 btn-animate">{t('getPreview')}</Button>
                           </form>
                        </div>
                        <p className="mt-4 text-xs text-[color:var(--muted)]">{t('secureInfo')}</p>
                    </div>
                </div>
            </header>

            {/* Social Proof Band */}
            <section className="bg-[color:var(--surface)] py-12 animate-fade-in-up">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {SOCIAL_PROOF_STATS.map(stat => (
                            <div key={stat.label}>
                                <p className="font-display text-4xl font-bold text-[color:var(--accent)]">{stat.number}</p>
                                <p className="text-sm text-[color:var(--muted)] uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 relative w-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[color:var(--surface)] to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[color:var(--surface)] to-transparent z-10"></div>
                        <div className="flex animate-marquee" style={{width: `${VENUE_LOGOS.length * 2 * 120}px`}}>
                            {[...VENUE_LOGOS, ...VENUE_LOGOS].map((logo, i) => (
                               <img key={i} src={logo.src} alt={logo.name} className="h-8 mx-12 object-contain flex-shrink-0" style={{filter: 'brightness(0) invert(0.8)', width: '96px'}} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <main>
                {/* Problem/Agitation Section */}
                <Section id="problem" animationType="animate-fade-in-left">
                    <div>
                        <SectionHeadline>{t('problemTitle')}</SectionHeadline>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-fade-in-up animate-delay-200">
                            {PAIN_POINTS.map((point, index) => (
                                <SelectableCard key={point.title} id={`pain-${index}`} className="bg-[color:var(--surface)]/80 backdrop-blur-sm border border-[color:var(--border)] rounded-lg p-6 flex items-start gap-4">
                                    <span className="text-4xl mt-1">{point.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-lg">{point.title}</h3>
                                        <p className="text-[color:var(--text-secondary)] mt-1">{point.description}</p>
                                    </div>
                                </SelectableCard>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Solution/Method Section */}
                <Section id="solution" className="bg-[color:var(--surface-alt)]" animationType="animate-fade-in-right">
                    <SectionHeadline subheadline={language === 'es' ? 'El marco exacto que me llevó de mezclar en el dormitorio a encabezar festivales' : 'The exact framework that took me from bedroom mixing to headlining festivals'}>{t('solutionTitle')}</SectionHeadline>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {METHOD_STEPS.slice(0, 3).map(step => (
                            <SelectableCard key={step.number} id={`method-${step.number}`} className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{step.icon}</span>
                                    <span className="text-sm font-bold text-[color:var(--accent)]">STEP {step.number}</span>
                                </div>
                                <h3 className="font-bold text-xl mt-2">{step.title}</h3>
                                <p className="text-[color:var(--text-secondary)] mt-2">{step.description}</p>
                            </SelectableCard>
                        ))}
                         <SelectableCard id="method-4" className="bg-gradient-to-br from-[color:var(--accent-muted)]/20 to-transparent border border-[color:var(--accent-muted)]/50 rounded-lg p-6 sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">⚡</span>
                                    <span className="text-sm font-bold text-white">STEP 4</span>
                                </div>
                                <h3 className="font-bold text-xl mt-2 text-white">Performance Psychology</h3>
                                <p className="text-green-200/80 mt-2">Develop stage presence, crowd control techniques, and energy management skills.</p>
                            </SelectableCard>
                        {METHOD_STEPS.slice(4).map(step => (
                            <SelectableCard key={step.number} id={`method-${step.number}`} className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{step.icon}</span>
                                    <span className="text-sm font-bold text-[color:var(--accent)]">STEP {step.number}</span>
                                </div>
                                <h3 className="font-bold text-xl mt-2">{step.title}</h3>
                                <p className="text-[color:var(--text-secondary)] mt-2">{step.description}</p>
                            </SelectableCard>
                        ))}
                    </div>
                </Section>
                
                 {/* Transformation Section */}
                <Section id="transformation" animationType="animate-fade-in-up">
                    <SectionHeadline>{t('transformationTitle')}</SectionHeadline>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_auto_1fr] items-center gap-8">
                        <SelectableCard id="before-card" className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl p-6 text-center" isRedVariant={true}>
                            <h3 className="font-bold text-2xl text-[color:var(--danger)]">{t('before')}</h3>
                            <img src="/Funnel Images/Before.png" alt="Bedroom DJ" className="my-4 rounded-lg aspect-square object-cover w-full h-48"/>
                            <ul className="text-left space-y-2 text-[color:var(--text-secondary)]">
                                {["Playing for empty rooms", "No industry connections", "Frustrated and stuck", "No income from DJing"].map(item => <li key={item} className="flex items-start"><span className="mr-2 text-red-500">×</span> {item}</li>)}
                            </ul>
                        </SelectableCard>
                        <div className="text-center">
                             <div className="text-5xl text-[color:var(--accent)] animate-pulse-slow">→</div>
                             <div className="mt-2 text-sm font-bold bg-[color:var(--accent)] text-black rounded-full px-3 py-1">90 DAYS</div>
                        </div>
                        <SelectableCard id="after-card" className="bg-[color:var(--surface)] border border-[color:var(--accent)] shadow-[0_0_40px_-10px_rgba(0,245,122,0.2)] rounded-xl p-6 text-center">
                             <h3 className="font-bold text-2xl text-[color:var(--accent)]">{t('after')}</h3>
                             <img src="/Funnel Images/Party success.jpg" alt="Professional DJ" className="my-4 rounded-lg aspect-square object-cover w-full h-48"/>
                             <ul className="text-left space-y-2 text-[color:var(--text-secondary)]">
                                {["Regular club bookings", "Strong industry network", "Confident and skilled", "Consistent DJ income"].map(item => <li key={item} className="flex items-start"><span className="mr-2 text-green-500">✓</span> {item}</li>)}
                            </ul>
                        </SelectableCard>
                    </div>
                </Section>

                {/* Testimonials Showcase */}
                <Section id="testimonials" className="bg-[color:var(--surface-alt)]" animationType="animate-fade-in-left">
                    <SectionHeadline>Real Students, Real Results</SectionHeadline>
                    <div className="max-w-5xl mx-auto text-center">
                        <SelectableCard id={`testimonial-${activeTestimonial}`} className="">
                            <TestimonialCard testimonial={TESTIMONIALS[activeTestimonial]} />
                        </SelectableCard>
                        <div className="mt-8 flex justify-center gap-3">
                            {TESTIMONIALS.map((_, index) => (
                                <button key={index} onClick={() => setActiveTestimonial(index)} className={`w-3 h-3 rounded-full transition-colors ${activeTestimonial === index ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--border)] hover:bg-[color:var(--muted)]'}`}></button>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Instructor Section */}
                <Section id="instructor" animationType="animate-fade-in-right">
                    <SectionHeadline>Meet Your Mentor</SectionHeadline>
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <img src="/Funnel Images/Meet your mentor.jpg" alt="DJ Elite Mentor" className="rounded-lg shadow-2xl w-full"/>
                        <div>
                            <h3 className="font-display text-3xl font-bold">From Bedroom to Headliner</h3>
                            <p className="mt-4 text-[color:var(--text-secondary)]">Just 3 years ago, I was exactly where you are now. Mixing in my bedroom, dreaming of playing for real crowds, but having no idea how to make it happen.</p>
                            <div className="mt-6 grid grid-cols-2 gap-6">
                                {INSTRUCTOR_CREDENTIALS.map((cred, index) => (
                                    <SelectableCard key={cred.title} id={`credential-${index}`} className="p-4 bg-[color:var(--surface)] rounded-lg border border-[color:var(--border)]">
                                        <h4 className="font-bold">{cred.title}</h4>
                                        <p className="text-sm text-[color:var(--muted)]">{cred.description}</p>
                                    </SelectableCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>
                
                {/* Curriculum Breakdown */}
                <Section id="curriculum" className="bg-[color:var(--surface-alt)]" animationType="animate-fade-in-up">
                    <SectionHeadline>What You'll Master Inside DJ Elite</SectionHeadline>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {CURRICULUM_MODULES.map((module, i) => (
                            <AccordionItem key={module.title} title={module.title} defaultOpen={i === 0}>
                                <ul className="space-y-3">
                                    {module.lessons.map(lesson => <li key={lesson} className="flex items-start"><span className="text-[color:var(--accent)] mr-3 mt-1">✓</span>{lesson}</li>)}
                                </ul>
                            </AccordionItem>
                        ))}
                    </div>
                </Section>

                {/* Value Stack & Bonuses Section */}
                <Section id="value-stack" animationType="animate-fade-in-left">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <SectionHeadline>Everything You Get Today</SectionHeadline>
                            <div className="space-y-4">
                                {VALUE_STACK_ITEMS.map((item, index) => (
                                    <SelectableCard key={item.title} id={`value-${index}`} className="flex items-start gap-4 bg-[color:var(--surface)] p-4 rounded-lg border border-[color:var(--border)]">
                                        <div className="text-4xl">{item.icon}</div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold">{item.title}</h3>
                                            <p className="text-sm text-[color:var(--text-secondary)]">{item.description}</p>
                                        </div>
                                        <div className="font-bold text-[color:var(--text-secondary)]">{item.value}</div>
                                    </SelectableCard>
                                ))}
                            </div>
                            <div className="mt-8 bg-[color:var(--surface)] border border-[color:var(--accent)] rounded-lg p-6 text-center">
                                <p className="text-lg text-[color:var(--muted)]">Total Value: <span className="line-through">$3,364</span></p>
                                <p className="font-display text-4xl font-bold mt-2">Your Investment Today: <span className="text-[color:var(--accent)]">$497</span></p>
                            </div>
                        </div>
                        <div className="mt-20 lg:mt-0">
                             <SectionHeadline>Plus, These Exclusive Bonuses</SectionHeadline>
                             <div className="space-y-4">
                                {BONUSES.map((bonus, index) => (
                                    <SelectableCard key={bonus.title} id={`bonus-${index}`} className="bg-gradient-to-br from-[color:var(--surface-alt)] to-transparent border border-[color:var(--border)] p-6 rounded-lg">
                                        <h3 className="font-bold text-lg text-[color:var(--accent)]">{bonus.title}</h3>
                                        <p className="mt-2 text-[color:var(--text-secondary)]">{bonus.description}</p>
                                        <div className="mt-4 text-sm font-bold bg-[color:var(--surface)] text-[color:var(--accent)] inline-block px-3 py-1 rounded-full">{bonus.value}</div>
                                    </SelectableCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>
                
                {/* Guarantee Section */}
                <Section id="guarantee" className="bg-[color:var(--surface-alt)]" animationType="animate-fade-in-right">
                    <div className="max-w-4xl mx-auto bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl shadow-2xl overflow-hidden md:flex">
                        <div className="p-8 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black md:w-64">
                             <img src="/Funnel Images/guarantee.png" alt="100% Guarantee Seal" className="w-40 h-40" />
                        </div>
                        <div className="p-8">
                             <h2 className="font-display text-3xl font-bold">Your Success is 100% Guaranteed</h2>
                             <h3 className="text-xl text-[color:var(--accent)] mt-1">Land your first professional gig or get every penny back.</h3>
                             <p className="mt-4 text-[color:var(--text-secondary)]">I'm so confident that DJ Elite will transform your career that I'm willing to put my money where my mouth is. Follow the system for 90 days, and if you don't land your first professional gig, I'll refund every penny.</p>
                             <p className="mt-2 font-bold text-[color:var(--text-primary)]">No questions asked. No hassles. No hoops to jump through.</p>
                        </div>
                    </div>
                </Section>
                
                 {/* Urgency/Scarcity Section */}
                <Section id="urgency" animationType="animate-fade-in-up">
                    <SectionHeadline>⚠️ This Offer Won't Last Forever</SectionHeadline>
                    <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                        <SelectableCard id="countdown-card" className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg p-8 text-center">
                            <h3 className="text-xl font-bold">This special price expires in:</h3>
                            <div className="my-6">
                                <CountdownTimer />
                            </div>
                            <p className="text-sm text-[color:var(--muted)]">The price will be increasing to $997 soon. Lock in your discount now.</p>
                        </SelectableCard>
                        <SelectableCard id="scarcity-card" className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg p-8 text-center">
                            <h3 className="text-xl font-bold">🔥 Only 50 spots available in this cohort</h3>
                            <p className="text-6xl font-display font-bold my-4 text-[color:var(--accent)]">23</p>
                            <p className="text-lg font-bold">spots remaining</p>
                            <p className="mt-2 text-sm text-[color:var(--muted)]">To ensure quality mentorship, I'm limiting this enrollment. Once these spots are filled, the doors close.</p>
                        </SelectableCard>
                    </div>
                </Section>
                
                {/* FAQ Section */}
                <Section id="faq" className="bg-[color:var(--surface-alt)]" animationType="animate-fade-in-left">
                    <SectionHeadline>Frequently Asked Questions</SectionHeadline>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {FAQS.map((faq, index) => (
                            <SelectableCard key={faq.question} id={`faq-${index}`} className="">
                                <AccordionItem title={faq.question}>
                                    <p>{faq.answer}</p>
                                </AccordionItem>
                            </SelectableCard>
                        ))}
                    </div>
                </Section>
                
                {/* Final CTA Section */}
                <Section id="final-cta" className="text-center" animationType="animate-fade-in-up">
                    <h2 className="font-display text-5xl font-bold">Your Moment is NOW</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-[color:var(--text-secondary)]">Every day you wait is another day someone else takes the gig you deserve. The DJ industry is waiting for you - but only if you take action today.</p>
                    <div className="mt-12 max-w-2xl mx-auto bg-[color:var(--surface)] border border-[color:var(--accent)] rounded-2xl p-8 shadow-[0_0_60px_-15px_rgba(0,245,122,0.3)]">
                        <img src="/Funnel Images/DJ Elite Logo.png" alt="DJ Elite" className="h-12 mx-auto mb-4"/>
                        <div className="my-6">
                             <span className="text-lg text-[color:var(--muted)] line-through">$3,364</span>
                             <p className="font-display text-6xl font-bold text-[color:var(--accent)]">$497</p>
                             <p className="font-bold bg-[color:var(--accent)] text-black inline-block px-4 py-1 rounded-full mt-2">Save $2,867 Today!</p>
                        </div>
                        <Button variant="purchase" className="w-full text-xl py-5 btn-animate hover-lift" onClick={() => window.location.href = '/checkout'}>
                            <div className="flex flex-col">
                                <span>{t('enrollNow')}</span>
                                <span className="text-xs font-normal mt-1 opacity-80">{language === 'es' ? 'Garantía de 90 Días' : '90-Day Money-Back Guarantee'}</span>
                            </div>
                        </Button>
                        <p className="text-xs text-[color:var(--muted)] mt-4">This is a one-time payment. Prices will go up after the timer hits zero.</p>
                    </div>
                </Section>
            </main>

            <footer className="bg-[color:var(--surface)] border-t border-[color:var(--border)] mt-20">
                <div className="container mx-auto px-4 py-16 text-center">
                    <img src="/Funnel Images/DJ Elite Logo.png" alt="DJ Elite" className="h-8 mx-auto" />
                    <p className="mt-4 max-w-md mx-auto text-[color:var(--text-secondary)]">Get weekly DJ tips, industry insights, and exclusive opportunities.</p>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const email = formData.get('email') as string;
                        try {
                            const { subscribeToNewsletter } = await import('../services/profileService');
                            await subscribeToNewsletter(email, 'Newsletter Subscriber');
                            alert('📧 Subscribed! You\'ll get weekly DJ tips and insights.');
                            (e.target as HTMLFormElement).reset();
                        } catch (error) {
                            console.error('Newsletter signup error:', error);
                            alert('Something went wrong. Please try again.');
                        }
                    }} className="mt-6 max-w-sm mx-auto flex gap-2">
                        <input type="email" name="email" placeholder="Your email address" required className="flex-grow px-4 py-3 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)] focus:ring-2 focus:ring-[color:var(--accent)] focus:border-[color:var(--accent)] outline-none transition-all" />
                        <Button type="submit" className="px-6 btn-animate">Subscribe</Button>
                    </form>
                    <div className="mt-8 flex justify-center gap-6 text-[color:var(--muted)]">
                        <a href="#" className="hover:text-[color:var(--text-primary)] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[color:var(--text-primary)] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[color:var(--text-primary)] transition-colors">Contact</a>
                        <a href="https://buymeacoffee.com/elitedjs" target="_blank" rel="noopener noreferrer" className="hover:text-[color:var(--text-primary)] transition-colors">Buy Me a Coffee</a>
                    </div>
                    <p className="mt-8 text-sm text-[color:var(--muted)]">&copy; {new Date().getFullYear()} DJ Elite. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

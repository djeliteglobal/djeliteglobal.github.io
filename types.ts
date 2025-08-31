export interface Testimonial {
    quote: string;
    name: string;
    description: string;
    avatarUrl: string;
    videoPosterUrl: string;
    videoSrcUrl: string;
}

export interface CurriculumModule {
    title: string;
    lessons: string[];
}

export interface ValueStackItem {
    icon: string;
    title: string;
    description: string;
    value: string;
}

export interface BonusItem {
    icon: string;
    title: string;
    description: string;
    value: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

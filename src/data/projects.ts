export type ProjectCategory = "Graphic Design" | "Illustration" | "Photography" | "Video Editing" | "Animation";

export interface Project {
    id: number;
    title: string;
    category: ProjectCategory;
    image: string | null;
    gradient: string;
    tools: string[];
    story: string;
    media: string[];
    date?: string; // Added date field as requested
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Happy Biscuit — Packaging Design",
        category: "Graphic Design",
        image: "/images/portfolio/happy-biscuit/chocolate-packaging.png",
        gradient: "linear-gradient(135deg, #8B6914, #D4A843)",
        tools: ["Illustrator", "Photoshop"],
        story: "A university project to design food packaging. Created the 'Happy Biscuit' brand featuring 2 flavors — Chocolate and White Chocolate — with a unique reverse-color scheme to differentiate each flavor. Designed a dieline for a box that elegantly represents both flavors in a single package.",
        media: [
            "/images/portfolio/happy-biscuit/chocolate-packaging.png",
            "/images/portfolio/happy-biscuit/white-chocolate-packaging.png",
            "/images/portfolio/happy-biscuit/dieline.png",
        ],
        date: "2023",
    },

    {
        id: 3,
        title: "The Disguise — Visual Character",
        category: "Illustration",
        image: "/images/portfolio/the-disguise/cover.jpg",
        gradient: "linear-gradient(135deg, #2d4a1e, #4a6741)",
        tools: ["Illustrator", "Photoshop"],
        story: "A university visual character project. Created 'Lesley', a woman spy operating in the underground world — exterminating terrorists and fighting an alien race called 'The Unseen' that invades Earth without notice. The title 'The Disguise' reflects her double life. Character poses showcase standing, running, and falling action sequences, with a full cover illustration set in a dark alleyway.",
        media: [
            "/images/portfolio/the-disguise/cover.jpg",
            "/images/portfolio/the-disguise/lesley-1.png",
            "/images/portfolio/the-disguise/lesley-2.png",
            "/images/portfolio/the-disguise/lesley-3.png",
            "/images/portfolio/the-disguise/alien-1.png",
            "/images/portfolio/the-disguise/alien-2.png",
            "/images/portfolio/the-disguise/alien-3.png",
        ],
        date: "2023",
    },
    {
        id: 4,
        title: "Graduation Photography — B&W Series",
        category: "Photography",
        image: "/images/portfolio/graduation-bw/photo-1.jpg",
        gradient: "linear-gradient(135deg, #1a1a1a, #4a4a4a)",
        tools: ["Camera", "Photoshop"],
        story: "A freelance college graduation photography project shot entirely in black & white. The concept focuses on highlighting the client looking toward the future — capturing ambition, confidence, and self-identity. Each frame uses dramatic lighting and contrast to draw attention to the subject, evoking a sense of personal achievement and forward vision.",
        media: [
            "/images/portfolio/graduation-bw/photo-1.jpg",
            "/images/portfolio/graduation-bw/photo-2.jpg",
            "/images/portfolio/graduation-bw/photo-4.jpg",
            "/images/portfolio/graduation-bw/photo-5.jpg",
            "/images/portfolio/graduation-bw/photo-3.jpg",
            "/images/portfolio/graduation-bw/photo-6.jpg",
        ],
        date: "2024",
    },

    {
        id: 7,
        title: "Book Cover — Revolusi Umat Manusia",
        category: "Graphic Design",
        image: "/images/portfolio/revolusi-book-cover/cover.jpg",
        gradient: "linear-gradient(135deg, #4A3B2A, #8B5A2B)",
        tools: ["Photoshop", "Illustrator"],
        story: "A university project redesigning the book cover for 'Revolusi Umat Manusia' (Sapiens). The design features an image of the history of humankind in the background with bold, striking text in the title to convey a powerful message about humanity's struggle and resilience in shaping evolution.",
        media: ["/images/portfolio/revolusi-book-cover/cover.jpg"],
        date: "2023",
    },
    {
        id: 8,
        title: "UMKM Design Flyer — Fitria Fashion",
        category: "Graphic Design",
        image: "/images/portfolio/fitria-fashion-flyer/1.png",
        gradient: "linear-gradient(135deg, #FF9A9E, #FECFEF)",
        tools: ["Photoshop", "Illustrator"],
        story: "A university project creating a commercial flyer for 'Fitria Fashion', a local MSME (UMKM). The design goal was to produce an attractive and professional promotional material to showcase their latest fashion collection and boost brand visibility.",
        media: [
            "/images/portfolio/fitria-fashion-flyer/1.png",
            "/images/portfolio/fitria-fashion-flyer/2.png",
            "/images/portfolio/fitria-fashion-flyer/3.png",
            "/images/portfolio/fitria-fashion-flyer/4.png",
        ],
        date: "2023",
    },
    {
        id: 9,
        title: "Comic Panel — Secret Service Betrayal",
        category: "Illustration",
        image: "/images/portfolio/comic-panel/cover.jpg",
        gradient: "linear-gradient(135deg, #1E3A8A, #991B1B)",
        tools: ["Photoshop", "Illustrator"],
        story: "A university project creating a short comic story about a secret service betrayal. The narrative follows the dramatic turn of events within a covert operation, visualized through dynamic panels and expressive character art.",
        media: ["/images/portfolio/comic-panel/cover.jpg"],
        date: "2023",
    },
    {
        id: 10,
        title: "Typography — DayaXIND",
        category: "Graphic Design",
        image: "/images/portfolio/dayaxind-typography/color-cover.png",
        gradient: "linear-gradient(135deg, #F59E0B, #DC2626)",
        tools: ["Illustrator", "Photoshop"],
        story: "A university typography project exploring Indonesian culture. 'DayaXIND' integrates Dayak culture references, specifically traditional clothing patterns, into the letterforms. The design uses Dayak's unique color palette and symbolic representations to create a typography that authentically embodies Indonesian heritage.",
        media: [
            "/images/portfolio/dayaxind-typography/color-cover.png",
            "/images/portfolio/dayaxind-typography/bw.png",
        ],
        date: "2023",
    },
    {
        id: 11,
        title: "Poster — Stop Sexual Violence",
        category: "Graphic Design",
        image: "/images/portfolio/sexual-violence-poster/cover.jpg",
        gradient: "linear-gradient(135deg, #000000, #EF4444)",
        tools: ["Photoshop", "Procreate"],
        story: "A university project dedicated to raising awareness about sexual violence. The poster conveys a powerful message that sexual violence can happen to anyone—regardless of gender—and emphasizes that no one deserves such treatment. The design aims to evoke empathy and calls for collective action to support victims and prevent future trauma.",
        media: ["/images/portfolio/sexual-violence-poster/cover.jpg"],
        date: "2023",
    },
    {
        id: 12,
        title: "Frame Animation — Jerry Run Cycle",
        category: "Animation",
        image: "/images/portfolio/jerry-animation/video.mp4",
        gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
        tools: ["Hand Drawn", "Digital"],
        story: "A university project focusing on the principles of frame-by-frame animation. This sequence depicts a character named 'Jerry' in a running loop, created by individually drawing each frame to capture fluid motion, weight, and timing.",
        media: ["/images/portfolio/jerry-animation/video.mp4"],
        date: "2023",
    },
    {
        id: 13,
        title: "Illustration — Stop Sexual Harassment",
        category: "Illustration",
        image: "/images/portfolio/sexual-harassment-awareness/cover.jpg",
        gradient: "linear-gradient(135deg, #7F1D1D, #000000)",
        tools: ["Digital Illustration", "Photoshop"],
        story: "A personal project raising awareness about the brutal reality of sexual harassment, which can lead to fatal consequences. This piece serves as a stark reminder that every woman has the right to be treated with dignity and humanity, not as an object to be discarded. The artwork aims to provoke thought and demand respect for human life.",
        media: ["/images/portfolio/sexual-harassment-awareness/cover.jpg"],
        date: "2024",
    },
    {
        id: 14,
        title: "Logo — Taya Snack",
        category: "Graphic Design",
        image: "/images/portfolio/taya-snack-logo/logo.png",
        gradient: "linear-gradient(135deg, #EF4444, #F59E0B)",
        tools: ["Illustrator", "Vector Art"],
        story: "A freelance branding project for 'Taya Snack', a home-based snack business. The logo uses a vibrant red and yellow color palette to evoke feelings of happiness, appetite, and satisfaction, perfectly representing the joy of sharing delicious snacks.",
        media: ["/images/portfolio/taya-snack-logo/logo.png"],
        date: "2024",
    },
];

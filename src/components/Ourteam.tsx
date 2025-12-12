import  type {  JSX } from "react";
import { motion } from "framer-motion";

const SPEAKERS = [
  {
    id: 1,
    name: "John Anderson",
    title: "Head of Community Design",
    color: "bg-[#8CC8FF]", // pastel blue
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Carlos Mendes",
    title: "Senior DevOps Engineer",
    color: "bg-[#FFD1D8]", // pastel pink
    image: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Ethan Zhao",
    title: "AI Ethics Researcher",
    color: "bg-[#FFD98A]", // pastel yellow
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Tomislav Petrovic",
    title: "Blockchain Solutions Architect",
    color: "bg-[#F6B7FF]", // pastel lilac
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Placeholder",
    title: "Speaker Slot",
    color: "bg-[#C9A8FF]",
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 1) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: 0.1 * i,
      duration: 0.6,
      ease: "easeOut" as const
    } 
  }),
};

export default function SpeakersPage(): JSX.Element {
  return (
    <div className="min-h-screen  rounded-t-[64px] rounded-b-[64px] overflow-hidden bg-linear-to-br from-purple-600 to-purple-500 text-white">
      {/* HERO */}
      <header className="relative overflow-hidden pb-20">
        {/* purple rounded background + subtlwave svg */}
        <div className="relative z-0">
          <div className="absolute "></div>
          {/* decorative translucent waves using SVG */}
          <svg
            viewBox="0 0 1200 300"
            className="absolute inset-x-0 -bottom-10 w-full h-[220px] opacity-20"
            preserveAspectRatio="none"
          >
            <path
              d="M0,200 C200,260 400,120 600,140 C800,160 1000,260 1200,200 L1200,300 L0,300 Z"
              fill="#7C3AED"
            />
          </svg>

          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32">
            <motion.h1
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center text-[44px] md:text-[86px] leading-tight font-extrabold tracking-tight text-yellow-200"
            >
              Meet All The Top <br className="hidden md:inline" /> IT Minds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.4 }}
              className="mt-6 text-center max-w-2xl mx-auto text-gray-200/80 text-base md:text-lg"
            >
              Explore our lineup of keynote speakers and industry leaders who
              will inspire and enlighten at the conference.
            </motion.p>
          </div>
        </div>
      </header>

      {/* SPEAKERS GRID */}
      <main className="max-w-7xl mx-auto px-6 pb-28">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* map speakers into cards */}
          {SPEAKERS.map((s, idx) => (
            <motion.article
              key={s.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              className="rounded-2xl overflow-hidden bg-transparent"
            >
              {/* image panel with colored background */}
              <div
                className={`rounded-2xl overflow-hidden ${s.color} aspect-4/5 md:aspect-3/4 flex items-start justify-center`}
              >
                {/* center-cropped image */}
                <img
                  src={s.image}
                  alt={s.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* card footer with name/title (purple background extension) */}
              <div className="mt-4  rounded-b-2xl px-6 py-6">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {s.name}
                </h3>
                <p className="text-sm text-white/80 mt-2">{s.title}</p>
              </div>
            </motion.article>
          ))}

          {/* BUY TICKET CTA card - visually matches your reference */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden"
          >
            <div className=" rounded-2xl bg-[#8a46e6]/80 flex items-center justify-center aspect-4/5 md:aspect-auto md:min-h-[420px]">
              <div className="text-center px-6">
                <h3 className="text-3xl md:text-4xl font-semibold text-white">
                  Buy Ticket
                </h3>
                <p className="mt-3 text-sm text-white/80">Reserve your seat now</p>
                <button
                  className="mt-6 inline-block rounded-full bg-white text-purple-600 font-semibold px-7 py-3 shadow-lg hover:scale-[1.02] transition-transform"
                  onClick={() => alert("Open checkout flow")}
                >
                  Buy now
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

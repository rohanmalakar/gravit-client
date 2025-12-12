import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  { id: 1, question: "Will the talks be recorded?", answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters." },
  { id: 2, question: "What is the conference about?", answer: "Depending on the level of your ticket, you may receive early access, reserved seating, or bonus gifts. Benefits are designed to enhance your experience and are clearly listed when you book." },
  { id: 3, question: "Is this event just for designers?", answer: "With your ticket, you'll receive entry to the event and access to all included features. These may range from general admission to VIP perks. Every tier offers something a little different." },
  { id: 4, question: "Are there any perks with my ticket?", answer: "Ticket packages vary but often include entry, merchandise, and access to special areas or experiences. Premium packages may also feature food, drink, or exclusive meet-and-greets." },
  { id: 5, question: "Does my ticket cover everything?", answer: "Most tickets include access to the main attractions, but some areas, services, or merchandise might require an upgrade. It's important to verify what's included to avoid surprises on event day." },
  { id: 6, question: "What does my ticket include?", answer: "Of course! Each ticket includes a specific set of features like entry, activities, and sometimes extras. Your confirmation email or event page has all the details you need." },
  { id: 7, question: "Can I refund or transfer my ticket?", answer: "Yes! Every ticket includes base-level access to the event. Higher-tier tickets may also include special perks like lounge access, priority entry, or complimentary items." },
  { id: 8, question: "How to become a speaker?", answer: "Speaker applications are typically open 6 months prior to the event. Please check our 'Get Involved' page for submission guidelines and deadlines." },
];

interface FAQCardProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: (id: number) => void;
}

const FAQCard: React.FC<FAQCardProps> = ({ item, isOpen, onToggle }) => {
  const handleToggle = () => onToggle(item.id);

  return (
    // add `self-start` so each card aligns to the top of the row and won't be vertically centered
    <div
      className="bg-[#0a0a0a] w-full h-fit border max-w-3xl border-white/5 rounded-lg overflow-hidden transition-colors hover:border-white/10 self-start"
    >
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-xl font-medium text-white pr-4">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 text-white"
        >
          <Plus size={24} strokeWidth={1.5} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`answer-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const handleToggle = (id: number) => {
    setOpenIds(prevOpenIds => {
      const newOpenIds = new Set(prevOpenIds);
      if (newOpenIds.has(id)) newOpenIds.delete(id);
      else newOpenIds.add(id);
      return newOpenIds;
    });
  };

  return (
    <section className="min-h-screen bg-black px-3 py-20 text-white">
      <div className="mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4">
            Frequently Asked <br className="hidden md:block" /> Questions
          </h2>
        </div>

        {/* key change: align items to the top so expanding one card doesn't re-center the row */}
        <div className="flex flex-wrap justify-center items-start gap-6">
          {faqData.map((item) => (
            <FAQCard
              key={item.id}
              item={item}
              isOpen={openIds.has(item.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

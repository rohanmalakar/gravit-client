import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  { id: 1, question: "How do I book tickets for an event?", answer: "Simply browse our events page, select your desired event, choose the number of tickets you need, and complete the secure checkout process. You'll receive instant confirmation via email with your booking details and ticket information." },
  { id: 2, question: "Can I get a refund if I cancel my booking?", answer: "Refund policies vary by event. Most events offer full refunds if cancelled 7 days before the event date. Please check the specific event's cancellation policy on the event details page before booking." },
  { id: 3, question: "How does real-time seat availability work?", answer: "Our system updates seat availability in real-time as bookings are made. When you book tickets, seats are automatically assigned and reserved for you instantly. You'll see the exact number of available seats before completing your purchase." },
  { id: 4, question: "Will I receive my tickets immediately?", answer: "Yes! Upon successful payment, you'll receive an instant email confirmation with your booking details. Your tickets will be available in your dashboard and can be downloaded as PDF or accessed via QR code for easy check-in at the event." },
  { id: 5, question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards, UPI payments, net banking, and digital wallets. All transactions are processed through secure, encrypted payment gateways to ensure your financial information is protected." },
  { id: 6, question: "Can I book multiple tickets at once?", answer: "Absolutely! You can book multiple tickets in a single transaction. Just select the quantity you need during checkout. All tickets from the same booking will be linked to your account for easy management." },
  { id: 7, question: "How do I find upcoming events?", answer: "Visit our Events page to browse all upcoming events. You can filter by date, location, category, and price range. Each event listing shows real-time availability, pricing, and detailed information to help you make your choice." },
  { id: 8, question: "What if an event gets cancelled?", answer: "In the rare case of event cancellation, you'll be notified immediately via email and SMS. Full refunds are automatically processed within 5-7 business days. You can track your refund status in your account dashboard." },
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

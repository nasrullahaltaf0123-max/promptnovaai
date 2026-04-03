import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is PromptNova AI really free to use?",
    a: "Yes! Our free plan gives you 5 AI credits per day across all tools. No credit card required to sign up.",
  },
  {
    q: "What do I get with the Pro plan?",
    a: "Pro users get 999 credits per day, priority generation speed, no watermarks, premium support, and early access to new tools — all for ৳299/month.",
  },
  {
    q: "How does the referral program work?",
    a: "Share your unique referral link. When someone signs up using it, you both earn 20 bonus credits. There's no limit to how many people you can refer!",
  },
  {
    q: "What AI tools are included?",
    a: "We offer 10+ tools: AI Chat, Image Generator, Blog Writer, Logo Generator, Script Generator, Prompt Generator, Video Script Writer, Thumbnail Creator, Viral Captions, and TikTok Scripts.",
  },
  {
    q: "How do I pay for Pro?",
    a: "We accept bKash payments. Click 'Upgrade to Pro', send the payment, and enter your transaction ID. Verification is instant and fully automated.",
  },
  {
    q: "Can I cancel my Pro subscription?",
    a: "Yes, you can cancel anytime. Your Pro benefits remain active until the end of your billing period.",
  },
];

const FAQSection = () => (
  <section id="faq" className="py-24 sm:py-32 px-6 section-glow">
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-micro font-semibold tracking-widest uppercase text-primary mb-3 block">FAQ</span>
        <h2 className="text-heading sm:text-display leading-tight">
          <span className="gradient-text">Common Questions</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="glass-card-highlight rounded-xl border-none px-5 hover-lift"
            >
              <AccordionTrigger className="text-caption font-medium text-foreground hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-caption text-muted-foreground pb-4 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
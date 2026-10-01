export const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
});

export const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
};

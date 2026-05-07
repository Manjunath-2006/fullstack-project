export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: (i = 0) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
}

export const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
}

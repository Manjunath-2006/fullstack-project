import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ visible = true, text = '' }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" height="110px" width="110px" viewBox="0 0 200 200" className="pencil">
            <defs>
              <clipPath id="pencil-eraser"><rect height="30" width="30" ry="5" rx="5" /></clipPath>
            </defs>
            <circle transform="rotate(-113,100,100)" strokeLinecap="round" strokeDashoffset="439.82"
              strokeDasharray="439.82 439.82" strokeWidth="2" stroke="#111111" fill="none" r="70" className="pencil__stroke" />
            <g transform="translate(100,100)" className="pencil__rotate">
              <g fill="none">
                <circle transform="rotate(-90)" strokeDashoffset="402" strokeDasharray="402.12 402.12" strokeWidth="30" stroke="#111111" r="64" className="pencil__body1" />
                <circle transform="rotate(-90)" strokeDashoffset="465" strokeDasharray="464.96 464.96" strokeWidth="10" stroke="#374151" r="74" className="pencil__body2" />
                <circle transform="rotate(-90)" strokeDashoffset="339" strokeDasharray="339.29 339.29" strokeWidth="10" stroke="#6b7280" r="54" className="pencil__body3" />
              </g>
              <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
                <g className="pencil__eraser-skew">
                  <rect height="30" width="30" ry="5" rx="5" fill="#9ca3af" />
                  <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="#6b7280" />
                  <rect height="20" width="30" fill="#f3f4f6" />
                  <rect height="20" width="15" fill="#e5e7eb" />
                  <rect height="20" width="5" fill="#d1d5db" />
                  <rect height="2" width="30" y="6" fill="rgba(0,0,0,0.1)" />
                  <rect height="2" width="30" y="13" fill="rgba(0,0,0,0.1)" />
                </g>
              </g>
              <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
                <polygon points="15 0,30 30,0 30" fill="#d1d5db" />
                <polygon points="15 0,6 30,0 30" fill="#9ca3af" />
                <polygon points="15 0,20 10,10 10" fill="#111111" />
              </g>
            </g>
          </svg>
          {text && <p className="mt-3 text-xs font-semibold text-gray-500 tracking-widest uppercase">{text}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

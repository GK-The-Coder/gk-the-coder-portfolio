import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

function isValidImageSource(value) {
  return !value || value.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(value)
}

export default function CertificationCard({ id, title, issuer, date, image, credentialId, description }) {
  const hasValidImage = isValidImageSource(image)

  return (
    <motion.div variants={itemVariants} className="group relative">
      <Link href={`/certifications/${id}`} className="block">
        <div className="overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.05)] bg-slate-900/80 transition hover:border-cyan-400">
          {hasValidImage && image && (
            <div className="relative h-48 overflow-hidden bg-slate-950">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                unoptimized
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold leading-tight group-hover:text-cyan-300 transition">
                {title}
              </h3>
              {date && (
                <span className="text-slate-500 text-sm whitespace-nowrap">
                  {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
            <p className="text-cyan-400 font-medium mb-3">{issuer}</p>
            {description && (
              <p className="text-slate-400 text-sm line-clamp-2 mb-3">{description}</p>
            )}
            {credentialId && (
              <div className="rounded-lg bg-slate-950/50 px-3 py-2 mb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">ID</p>
                <p className="text-xs text-slate-300 font-mono truncate">{credentialId}</p>
              </div>
            )}
            <div className="inline-flex items-center gap-2 text-cyan-300 group-hover:text-white font-semibold transition text-sm">
              View Certificate
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

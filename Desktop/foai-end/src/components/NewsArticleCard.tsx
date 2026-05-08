import { ExternalLink, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import type { NewsArticle } from '../services/newsService'

export function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <motion.article
      className="mc-panel-glass group overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      <div className="aspect-[16/9] w-full overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--panel-2))]/60">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mc-chip">{article.source}</div>
          <div className="mc-chip">{format(new Date(article.publishedAt), 'PP')}</div>
          {article.author ? (
            <div className="mc-chip">
              <User className="h-3.5 w-3.5 text-[rgb(var(--muted))]" />
              <span className="max-w-[16ch] truncate">{article.author}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-3 line-clamp-2 text-base font-semibold tracking-tight">
          {article.title}
        </div>
        {article.description ? (
          <div className="mt-2 line-clamp-3 text-sm text-[rgb(var(--muted))]">
            {article.description}
          </div>
        ) : null}

        <div className="mt-4">
          <a
            className="mc-button"
            href={article.url}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Read more
          </a>
        </div>
      </div>
    </motion.article>
  )
}


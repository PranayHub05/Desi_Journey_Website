import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import authRouter from './routes/auth.routes.js'
import searchRouter from './routes/search.routes.js'
import toursRouter from './routes/tours.routes.js'
import postsRouter from './routes/posts.routes.js'
import popupsRouter from './routes/popups.routes.js'
import achievementsRouter from './routes/achievements.routes.js'

import { errorHandler, notFound } from './middleware/error.middleware.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 2000, standardHeaders: 'draft-7', legacyHeaders: false }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'desi-journey-api' }))

app.use('/api/auth', authRouter)
app.use('/api/search', searchRouter)
app.use('/api/tours', toursRouter)
app.use('/api/posts', postsRouter)
app.use('/api/popups', popupsRouter)
app.use('/api/achievements', achievementsRouter)

app.use(notFound)
app.use(errorHandler)

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Desi Journey API listening on ${port}`))
}

export default app

import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollExperience from './components/ScrollExperience'
import LoadingScreen from './components/LoadingScreen'
import PopupModal from './components/PopupModal'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './components/AdminRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const DestinationsPage = lazy(() => import('./pages/DestinationsPage'))
const TourDetailPage = lazy(() => import('./pages/TourDetailPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminToursPage = lazy(() => import('./pages/AdminToursPage'))
const AdminPostsPage = lazy(() => import('./pages/AdminPostsPage'))
const AdminAchievementsPage = lazy(() => import('./pages/AdminAchievementsPage'))
const AdminTourEditor = lazy(() => import('./pages/AdminTourEditor'))
const AdminPostEditor = lazy(() => import('./pages/AdminPostEditor'))
const AdminAchievementEditor = lazy(() => import('./pages/AdminAchievementEditor'))
const AdminPopupEditor = lazy(() => import('./pages/AdminPopupEditor'))

function ScrollToHash() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80)
    else window.scrollTo({ top: 0, behavior: pathname === '/' ? 'smooth' : 'auto' })
  }, [hash, pathname])
  return null
}

function AnimatedRoute({ children }) {
  return <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .45, ease: 'easeOut' }}>{children}</motion.main>
}

function PublicLayout({ children }) {
  return (
    <>
      <Navigation />
      <Suspense fallback={<LoadingScreen />}>
        {children}
      </Suspense>
      <Footer />
      <ScrollExperience />
      <PopupModal />
    </>
  )
}

export default function App() {
  const location = useLocation()
  
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  return (
    <AuthProvider>
      <div className="min-h-screen overflow-x-clip bg-sand text-ink">
        <ScrollToHash />
        
        {isAdminRoute ? (
          <Suspense fallback={<LoadingScreen />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="tours" element={<AdminToursPage />} />
                <Route path="tours/new" element={<AdminTourEditor />} />
                <Route path="tours/:id" element={<AdminTourEditor />} />
                <Route path="posts" element={<AdminPostsPage />} />
                <Route path="posts/new" element={<AdminPostEditor />} />
                <Route path="posts/:id" element={<AdminPostEditor />} />
                <Route path="achievements" element={<AdminAchievementsPage />} />
                <Route path="achievements/new" element={<AdminAchievementEditor />} />
                <Route path="achievements/:id" element={<AdminAchievementEditor />} />
                <Route path="popups" element={<AdminPopupEditor />} />
              </Route>
            </Routes>
          </Suspense>
        ) : (
          <PublicLayout>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
                <Route path="/destinations" element={<AnimatedRoute><DestinationsPage /></AnimatedRoute>} />
                <Route path="/tours/:id" element={<AnimatedRoute><TourDetailPage /></AnimatedRoute>} />
                <Route path="/about" element={<AnimatedRoute><AboutPage /></AnimatedRoute>} />
                <Route path="/achievements" element={<AnimatedRoute><AchievementsPage /></AnimatedRoute>} />
                <Route path="/gallery" element={<AnimatedRoute><GalleryPage /></AnimatedRoute>} />
                <Route path="/blog" element={<AnimatedRoute><BlogPage /></AnimatedRoute>} />
                <Route path="/blog/:id" element={<AnimatedRoute><BlogDetailPage /></AnimatedRoute>} />
                <Route path="/contact" element={<AnimatedRoute><ContactPage /></AnimatedRoute>} />
                <Route path="*" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
              </Routes>
            </AnimatePresence>
          </PublicLayout>
        )}
      </div>
    </AuthProvider>
  )
}

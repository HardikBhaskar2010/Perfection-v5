import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimationProvider } from "@/contexts/AnimationContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { PerfProvider } from "@/contexts/PerfContext";
import { PageLoading } from "@/components/ui/loading";
import ErrorBoundary from "@/components/ui/error-boundary";
import { preloadAnimations } from "@/lib/animation";
import WelcomeTour from "@/components/tutorial/WelcomeTour";
import { PerfPromptBanner } from "@/components/ui/perf-prompt-banner";

// Lazy load page components
const Home = React.lazy(() => import("./pages/Home"));
const Generator = React.lazy(() => import("./pages/Generator"));
const Components = React.lazy(() => import("./pages/Components"));
const Library = React.lazy(() => import("./pages/Library"));
const Learn = React.lazy(() => import("./pages/Learn"));
const Profile = React.lazy(() => import("./pages/Profile"));
const About = React.lazy(() => import("./pages/About"));
const Login = React.lazy(() => import("./pages/Login"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const ProjectDetail = React.lazy(() => import("./pages/ProjectDetail"));
const ComponentComparison = React.lazy(() => import("./pages/ComponentComparison"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Preload animations on app initialization
if (typeof window !== 'undefined') {
  preloadAnimations();
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <PerfProvider>
            <AnimationProvider>
              <TutorialProvider>
                <TooltipProvider>
                  {/* 🔥 Vercel magic */}
                  <SpeedInsights />
                  <Analytics />

                  <Toaster />
                  <Sonner />

                  <BrowserRouter>
                    <PerfPromptBanner />
                    <Suspense fallback={<PageLoading />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/project/:id" element={<ProjectDetail />} />
                        <Route path="/generator" element={<Generator />} />
                        <Route path="/components" element={<Components />} />
                        <Route path="/components/compare" element={<ComponentComparison />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    <WelcomeTour />
                  </BrowserRouter>
                </TooltipProvider>
              </TutorialProvider>
            </AnimationProvider>
          </PerfProvider>
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);


export default App;

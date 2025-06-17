"use client"

import { useState, useEffect } from "react"
import { FigmaConnectionProvider } from "@/components/figma-connection-provider"
import { FigmaStatusToast } from "@/components/figma-status-toast"
import EnhancedFingMAI from "@/components/enhanced-figma-converter"
import { PerformanceMonitorPanel } from "@/components/performance-monitor"
import { OnboardingTour } from "@/components/advanced-ux/onboarding-tour"
import { SmartNotifications, useSmartNotifications } from "@/components/advanced-ux/smart-notifications"
import { EnhancedErrorBoundary } from "@/components/bug-fixes/error-boundary"
import { ErrorTrigger } from "@/components/test/error-trigger"
import { Button } from "@/components/ui/button"
import { Bug, Settings } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showErrorTesting, setShowErrorTesting] = useState(false)
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false)
  const notifications = useSmartNotifications()

  // Check if user is new (first visit)
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("hasVisited", "true")
    }

    // Welcome notification for returning users
    if (hasVisited) {
      notifications.info("Welcome back to FingMAI!", "Ready to convert more Figma designs to React components?", {
        label: "Start Converting",
        onClick: () => {
          const input = document.querySelector('[data-tour="figma-url-input"]') as HTMLInputElement
          input?.focus()
        },
      })
    }

    // Check for environment variables and show warnings
    if (typeof window !== 'undefined') {
      const missingEnvVars = []
      
      // Check if tokens are available
      const figmaToken = localStorage.getItem('figma-token')
      if (!figmaToken) {
        missingEnvVars.push('Figma Access Token')
      }

      if (missingEnvVars.length > 0) {
        notifications.warning(
          "Setup Required", 
          `Missing: ${missingEnvVars.join(', ')}. Some features may be limited.`,
          {
            label: "Setup Guide",
            onClick: () => setShowOnboarding(true)
          }
        )
      }
    }
  }, [])

  const handleOnboardingComplete = () => {
    notifications.success(
      "Setup Complete!",
      "You're all set to start converting your Figma designs. The enhanced interface is ready to use.",
      {
        label: "Start Converting",
        onClick: () => {
          const input = document.querySelector('[data-tour="figma-url-input"]') as HTMLInputElement
          input?.focus()
        },
      },
    )
  }

  const handleError = (error: Error) => {
    notifications.error("Application Error", error.message, {
      label: "Reload Page",
      onClick: () => window.location.reload(),
    })
  }

  const handleAsyncError = (error: Error) => {
    notifications.error("Async Error Caught", error.message, {
      label: "Retry",
      onClick: () => {
        notifications.info("Retrying...", "Attempting to recover from the error")
      },
    })
  }

  return (
    <EnhancedErrorBoundary onError={handleError}>
      <FigmaConnectionProvider>
        {/* Main Enhanced Application */}
        <EnhancedFingMAI />

        {/* Advanced Features Toggle (Developer Mode) */}
        {showAdvancedFeatures && (
          <div className="fixed bottom-6 left-6 z-50 space-y-4">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-sm">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Developer Tools</span>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant={showErrorTesting ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setShowErrorTesting(!showErrorTesting)}
                  className="w-full justify-start"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  {showErrorTesting ? "Hide" : "Test"} Error Boundary
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOnboarding(true)}
                  className="w-full justify-start"
                >
                  Restart Onboarding
                </Button>
              </div>
            </div>

            {/* Error Testing Component */}
            {showErrorTesting && (
              <div className="bg-black/80 backdrop-blur-md border border-red-500/30 rounded-xl p-4 max-w-sm">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Error Boundary Testing</h3>
                <EnhancedErrorBoundary
                  onError={(error) => {
                    console.log("Error caught by test boundary:", error)
                    notifications.error("Test Error Caught", error.message)
                  }}
                  fallback={
                    <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <h4 className="text-sm font-semibold text-red-400 mb-2">🎯 Test Successful!</h4>
                      <p className="text-xs text-red-300 mb-3">
                        Error boundary working correctly.
                      </p>
                      <Button
                        onClick={() => setShowErrorTesting(false)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Close Test
                      </Button>
                    </div>
                  }
                >
                  <ErrorTrigger onError={handleAsyncError} />
                </EnhancedErrorBoundary>
              </div>
            )}
          </div>
        )}

        {/* Developer Mode Toggle */}
        <button
          onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
          className="fixed bottom-6 left-6 z-40 p-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white/60 hover:text-white hover:bg-black/80 transition-all duration-300"
          title="Toggle Developer Tools"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Advanced UX Features */}
        <OnboardingTour
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />

        <SmartNotifications
          notifications={notifications.notifications}
          onDismiss={notifications.dismissNotification}
          onDismissAll={notifications.dismissAll}
          position="top-right"
          maxVisible={3}
        />

        {/* Performance Monitor (only in dev mode) */}
        {showAdvancedFeatures && <PerformanceMonitorPanel />}

        {/* Figma Status Toast */}
        <FigmaStatusToast />

        {/* Enhanced Toast System */}
        <Toaster />
      </FigmaConnectionProvider>
    </EnhancedErrorBoundary>
  )
}

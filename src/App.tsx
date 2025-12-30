import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Layout } from "@/components/layout"
import { AnimatedPage } from "@/components/animated-page"
import { DashboardPage } from "@/pages/dashboard"
import { DispatchReportPage } from "@/pages/dispatch-report"
import { DispatchMonitoringPage } from "@/pages/dispatch-monitoring"
import { PrealertPage } from "@/pages/prealert"

// Placeholder pages for other routes
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">{title}</h1>
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          This page is under development. Content will be added soon.
        </p>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={
          <AnimatedPage>
            <DashboardPage />
          </AnimatedPage>
        } />

        {/* Outbound routes */}
        <Route path="outbound/dispatch-monitoring" element={
          <AnimatedPage>
            <DispatchMonitoringPage />
          </AnimatedPage>
        } />
        <Route path="outbound/dispatch-report" element={
          <AnimatedPage>
            <DispatchReportPage />
          </AnimatedPage>
        } />
        <Route path="outbound/prealert" element={
          <AnimatedPage>
            <PrealertPage />
          </AnimatedPage>
        } />
        <Route path="outbound/bay-allocation" element={
          <AnimatedPage>
            <PlaceholderPage title="Per Bay Allocation" />
          </AnimatedPage>
        } />

        {/* Outbound Admin routes */}
        <Route path="outbound/admin/attendance" element={
          <AnimatedPage>
            <PlaceholderPage title="Attendance" />
          </AnimatedPage>
        } />
        <Route path="outbound/admin/masterfile" element={
          <AnimatedPage>
            <PlaceholderPage title="Masterfile" />
          </AnimatedPage>
        } />
        <Route path="outbound/admin/attendance-history" element={
          <AnimatedPage>
            <PlaceholderPage title="Attendance History" />
          </AnimatedPage>
        } />
        <Route path="outbound/admin/breaktime" element={
          <AnimatedPage>
            <PlaceholderPage title="Breaktime Management" />
          </AnimatedPage>
        } />
        <Route path="outbound/admin/leave" element={
          <AnimatedPage>
            <PlaceholderPage title="Leave Management" />
          </AnimatedPage>
        } />
        <Route path="outbound/admin/workstation" element={
          <AnimatedPage>
            <PlaceholderPage title="Workstation" />
          </AnimatedPage>
        } />

        {/* KPI & Compliance routes */}
        <Route path="kpi/mdt" element={
          <AnimatedPage>
            <PlaceholderPage title="MDT" />
          </AnimatedPage>
        } />
        <Route path="kpi/workstation" element={
          <AnimatedPage>
            <PlaceholderPage title="Workstation" />
          </AnimatedPage>
        } />
        <Route path="kpi/productivity" element={
          <AnimatedPage>
            <PlaceholderPage title="Productivity" />
          </AnimatedPage>
        } />
        <Route path="kpi/intraday" element={
          <AnimatedPage>
            <PlaceholderPage title="Intraday" />
          </AnimatedPage>
        } />

        {/* Midmile routes */}
        <Route path="midmile/truck-request" element={
          <AnimatedPage>
            <PlaceholderPage title="Truck Request" />
          </AnimatedPage>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="outbound-theme">
          <AppRoutes />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

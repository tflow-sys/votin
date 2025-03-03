import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import VerifyToken from '@/pages/VerifyToken';
import Instructions from '@/pages/Instructions';
import Dashboard from '@/pages/Dashboard';
import OngoingElection from '@/pages/OngoingElection';
import ElectionDetails from '@/pages/ElectionDetails';
import ArchivedElection from '@/pages/ArchivedElection';
import { AuthProvider } from '@/contexts/AuthContext';
import { ElectionProvider } from '@/contexts/ElectionContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="nkumba-theme">
      <AuthProvider>
        <ElectionProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/verify" element={<VerifyToken />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/ongoing-election/:id" element={
                <ProtectedRoute>
                  <OngoingElection />
                </ProtectedRoute>
              } />
              <Route path="/election/:id" element={
                <ProtectedRoute>
                  <ElectionDetails />
                </ProtectedRoute>
              } />
              <Route path="/archived-election/:id" element={
                <ProtectedRoute>
                  <ArchivedElection />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <Toaster />
        </ElectionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
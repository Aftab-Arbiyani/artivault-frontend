import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ArtworkDetailPage from "@/pages/ArtworkDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import UploadPage from "@/pages/UploadPage";
import NotificationsPage from "@/pages/NotificationsPage";
import CollectionsPage from "@/pages/CollectionsPage";
import FolderDetailPage from "@/pages/FolderDetailPage";
import SearchPage from "@/pages/SearchPage";
import TagPage from "@/pages/TagPage";
import SubscriptionPage from "@/pages/SubscriptionPage";
import AiGeneratePage from "@/pages/AiGeneratePage";
import SettingsPage from "@/pages/SettingsPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/gallery/:folderId" element={<FolderDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/tag/:tagName" element={<TagPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/ai-generate" element={<AiGeneratePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

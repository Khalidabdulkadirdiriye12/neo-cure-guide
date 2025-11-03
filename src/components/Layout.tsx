import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-medical">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        Neural Nexus
                      </h1>
                      <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                        AI-Powered Cancer Treatment Platform
                      </p>
                    </div>
                  </motion.div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="border-t bg-card/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <motion.p
                className="text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-semibold text-primary">Moringa School Group 4 Project</span>
              </motion.p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

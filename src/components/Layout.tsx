import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Stethoscope, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Layout() {
  const { user, logout, isAdmin } = useAuth();

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
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.name || user?.email}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                          <Badge variant={isAdmin ? "default" : "secondary"} className="w-fit mt-1">
                            {isAdmin ? "Admin" : "Doctor"}
                          </Badge>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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

"use client";  
  
import React, { useState } from "react";  
import { Sidebar } from "@/components/sidebar";  
import { AuthProvider } from "@/contexts/auth-context";  
  
export default function AppLayout({  
  children,  
}: {  
  children: React.ReactNode;  
}) {  
  const [isCollapsed, setIsCollapsed] = useState(false);  
  
  const handleToggle = () => {  
    setIsCollapsed((prev) => !prev);  
  };  
  
  return (  
    <AuthProvider>  
      <div className="flex min-h-screen">  
        <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />  
        <main className="flex-1 bg-background text-foreground p-4">  
          {children}  
        </main>  
      </div>  
    </AuthProvider>  
  );  
}
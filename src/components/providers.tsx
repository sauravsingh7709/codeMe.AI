'use client'

import { 
    Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
  
} from "convex/react";
import { ClerkProvider, SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "./ui/button";
import { UnauthenticatedView } from "@/features/auth/components/unauthenticated-view";
import { AuthLoadingView } from "@/features/auth/components/auth-loading-view";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: React.ReactNode }) => {
    
    return (
        <ClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
                <TooltipProvider>
                    <Authenticated>
                        <UserButton/>
                        {children}
                    </Authenticated>
                    <Unauthenticated>
                        <UnauthenticatedView />
                    </Unauthenticated>
                    <AuthLoading>
                        <AuthLoadingView />
                    </AuthLoading>
                </TooltipProvider>
                
            </ThemeProvider>
            
        </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
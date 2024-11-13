import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  );
}

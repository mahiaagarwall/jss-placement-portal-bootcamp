import { cn } from "@/lib/utils";

export const COLLEGE_NAME = "JSS University, Noida";
export const COLLEGE_SHORT = "JSS NOIDA";

/** JSS University, Noida emblem (public/jss-university-logo.png). Transparent PNG, works on light and dark. */
export const CollegeLogo = ({ className }: { className?: string }) => (
  <img
    src="/jss-university-logo.png"
    alt={`${COLLEGE_NAME} logo`}
    width={256}
    height={252}
    decoding="async"
    className={cn("shrink-0 object-contain", className ?? "h-12 w-12")}
  />
);

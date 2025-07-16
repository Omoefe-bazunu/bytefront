import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.HTMLAttributes<SVGElement>) => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
      {...props}
    >
      <path
        d="M13.2 3.31C12.48 2.87 11.52 2.87 10.8 3.31L4.8 6.69C4.08 7.13 3.6 7.97 3.6 8.89V15.11C3.6 16.03 4.08 16.87 4.8 17.31L10.8 20.69C11.52 21.13 12.48 21.13 13.2 20.69L19.2 17.31C19.92 16.87 20.4 16.03 20.4 15.11V8.89C20.4 7.97 19.92 7.13 19.2 6.69L13.2 3.31Z"
        className="text-primary fill-current"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        className="text-primary-foreground fill-current"
      />
    </svg>
  );

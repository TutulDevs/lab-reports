import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[92vh] flex flex-col gap-4 justify-center items-center text-center ">
      <h2 className="text-lg md:text-5xl font-bold ">Page Not Found</h2>

      <p>Could not find requested resource</p>

      <Link href="/" className={cn(buttonVariants())}>
        Return Home
      </Link>
    </div>
  );
}

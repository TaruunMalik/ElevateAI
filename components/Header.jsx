import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  StarsIcon,
  BookOpenCheck,
  BookOpenText,
  SquareDashedBottom,
} from "lucide-react";

import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
async function Header() {
  await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className=" container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={"/"}>
          <Image src={"/elev-1.png"} width={125} height={50} alt="logo" />
        </Link>
        <div className=" flex items-center justify-center gap-4">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button>
                <LayoutDashboard className="h-4 w-4" />
                <span className=" hidden md:block">Industry</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <StarsIcon />
                  <span>Tools</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    <div className=" flex flex-row gap-3 items-center justify-start ">
                      <StarsIcon />
                      <span>Tools</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className=" flex flex-col gap-2 p-4">
                  <Link href={"/resume"} className=" flex gap-2 items-center">
                    <FileText />
                    <span>Build Resume</span>
                  </Link>
                  <Link
                    href={"/cover-letter"}
                    className=" flex gap-2 items-center"
                  >
                    <BookOpenText />
                    <span>Cover Letter</span>
                  </Link>
                  <Link
                    href={"/dashboard"}
                    className=" flex gap-2 items-center"
                  >
                    <SquareDashedBottom />
                    <span>Industry Insights</span>
                  </Link>
                  <Link
                    href={"/interview"}
                    className=" flex gap-2 items-center"
                  >
                    <BookOpenCheck />
                    <span>Interview</span>
                  </Link>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </SignedIn>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header;

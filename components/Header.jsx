import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">
                  <StarsIcon />
                  <span>Tools</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={"/resume"} className=" flex gap-2 items-center">
                    <FileText />
                    <span>Build Resume</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/resume"} className=" flex gap-2 items-center">
                    <FileText />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {" "}
                  <Link href={"/resume"} className=" flex gap-2 items-center">
                    <FileText />
                    <span>Interview</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

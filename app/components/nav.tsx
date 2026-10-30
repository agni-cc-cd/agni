"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authErrorMessage, signOut } from "@/lib/firebase-client";
import { useAuth } from "./authed";
import { ArrowUpRightIcon, CloseIcon, LogoutIcon, MenuIcon, UserIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export function Logo({ size = 18 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
        <path
          d="M8 16.5V7.5h3.2c1.9 0 3.1 1.1 3.1 2.7 0 1.2-.7 2.1-1.8 2.5l2.2 3.8h-2.3l-1.9-3.4h-.9v3.4H8zm2.6-5.2h.7c.7 0 1.2-.4 1.2-1.1s-.5-1.1-1.2-1.1h-.7v2.2z"
          fill="var(--surface)"
        />
      </svg>
      <span className="text-[14px] font-semibold tracking-tight">agni</span>
    </span>
  );
}

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const { user, loading, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isGuest = user?.isAnonymous ?? true;
  const displayName = user?.displayName || user?.email || (isGuest ? "Guest" : "Account");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="container-x flex h-13 items-center justify-between py-2">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-ink" aria-label="agni home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors ${
                  pathname?.startsWith(l.href)
                    ? "font-medium text-ink"
                    : "text-ink2 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com/agni-cc-cd/handbook"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12.5px] text-ink2 transition-colors hover:text-ink"
            >
              Docs
              <ArrowUpRightIcon width={12} height={12} />
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <div className="shimmer h-8 w-20" />
          ) : user && !isGuest ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="btn btn-ghost max-w-[160px]"
                onClick={() => setUserMenu((v) => !v)}
              >
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-4.5 w-4.5 rounded-full"
                    width={18}
                    height={18}
                  />
                ) : (
                  <UserIcon width={14} height={14} />
                )}
                <span className="truncate">{displayName}</span>
              </button>
              {userMenu && (
                <div className="card absolute right-0 mt-2 w-56 overflow-hidden p-1 shadow-lg fade-in">
                  <div className="px-3 py-2">
                    <p className="truncate text-[12px] font-medium">{displayName}</p>
                    <p className="truncate text-[11px] faint">{user.email ?? "Signed in"}</p>
                  </div>
                  <hr className="divider my-1" />
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-[12.5px] text-ink2 hover:bg-surface3 hover:text-ink"
                  >
                    <UserIcon width={14} height={14} /> Dashboard
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[12.5px] text-ink2 hover:bg-surface3 hover:text-ink"
                    onClick={async () => {
                      setUserMenu(false);
                      try {
                        await signOut();
                        setUser(null);
                      } catch (err) {
                        console.error(authErrorMessage(err));
                      }
                    }}
                  >
                    <LogoutIcon width={14} height={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link href="/#shorten" className="btn btn-primary">
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-icon md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-surface md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-[13px] text-ink2 hover:bg-surface3 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-2 text-[13px] text-ink2 hover:bg-surface3 hover:text-ink"
            >
              Dashboard
            </Link>
            <a
              href="https://github.com/agni-cc-cd/handbook"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-2 text-[13px] text-ink2 hover:bg-surface3 hover:text-ink"
            >
              Docs
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

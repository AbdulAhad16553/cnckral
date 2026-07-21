"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import MachineInstallationGuide from "@/components/MachineInstallationGuide";
import RouterFittingGuide from "@/components/RouterFittingGuide";
import { MACHINE_INSTALLATION_TITLE } from "@/lib/machineInstallationGuide";
import { ROUTER_FITTING_TITLE } from "@/lib/routerFittingGuide";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Anchor, Settings2, X } from "lucide-react";

type GuideTab = "install" | "router";

const TABS: { id: GuideTab; label: string; icon: typeof Anchor }[] = [
  { id: "install", label: "Install", icon: Anchor },
  { id: "router", label: "Router", icon: Settings2 },
];

/** Floating button on mobile home — opens installation + router fitting guides */
export default function MobileGuidesFab() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<GuideTab>("install");

  if (pathname !== "/") return null;

  const title = tab === "install" ? MACHINE_INSTALLATION_TITLE : ROUTER_FITTING_TITLE;
  const fullPageHref = tab === "install" ? "/machine-installation" : "/router-fitting";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden fixed z-[55] left-4",
          "bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))]",
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-[var(--primary-color)] text-white",
          "shadow-lg shadow-red-600/40 ring-4 ring-[var(--primary-color)]/25",
          "active:scale-95 transition-transform",
          "animate-in fade-in slide-in-from-bottom-4 duration-300"
        )}
        aria-label="Machine installation and router fitting guides"
      >
        <Anchor className="h-6 w-6 fill-white/20" strokeWidth={2.5} aria-hidden />
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              "md:hidden fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[6px]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            )}
          />
          <DialogPrimitive.Content
            className={cn(
              "md:hidden fixed z-[101] inset-x-0 bottom-0 flex flex-col",
              "max-h-[min(92dvh,820px)] rounded-t-2xl bg-white shadow-2xl outline-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
              "duration-300"
            )}
          >
            <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-red-50/40">
              <div className="min-w-0">
                <DialogPrimitive.Title className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {title}
                </DialogPrimitive.Title>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tab === "install" ? "Anchor · bolts · weld · floor" : "Spindle · collet · bit · cooling"}
                </p>
              </div>
              <DialogPrimitive.Close className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            <div className="shrink-0 flex gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/50">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors",
                    tab === id
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 pb-6">
              {tab === "install" ? (
                <MachineInstallationGuide compact />
              ) : (
                <RouterFittingGuide compact />
              )}
              <Link
                href={fullPageHref}
                onClick={() => setOpen(false)}
                className="mt-4 block text-center text-sm font-medium text-[var(--primary-color)] underline underline-offset-2"
              >
                Poori guide page kholen
              </Link>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

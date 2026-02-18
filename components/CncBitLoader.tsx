import Image from "next/image";
import React from "react";

type CncBitLoaderProps = {
  /** If true, takes full viewport height (for root loading). */
  fullScreen?: boolean;
};

export function CncBitLoader({ fullScreen = false }: CncBitLoaderProps) {
  return (
    <div
      className={`${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      } flex items-center justify-center bg-white`}
    >
      <div className="flex items-center justify-center">
        <div
          className="relative animate-spin"
          style={{ width: 40, height: 40 }}
        >
          <Image
            src="/cnc_kral.png"
            alt="CNC loader"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}


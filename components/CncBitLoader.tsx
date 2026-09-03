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
        <div className="animate-spin" style={{ width: 40, height: 40 }}>
          <Image
            src="/cnc_kral-48.png"
            alt="CNC loader"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

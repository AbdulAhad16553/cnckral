import React from "react";
import Link from "next/link";

export default function AboutUsContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-700">
      <p className="text-lg leading-relaxed">
        <strong>Kral Laser</strong> is a leading provider of advanced fiber laser
        cutting, marking, and industrial machinery, with a strong presence in the
        Pakistani industrial market, particularly in Lahore. We specialize in
        high-precision, high-speed machines designed for 24/7 industrial
        production, including metal fabrication and sheet metal processing.
      </p>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-10">
          Key Products & Services
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Fiber Laser Cutting Machines:</strong> Known for the &quot;Laser Y
            Series&quot; and &quot;Laser Max 3015,&quot; offering 3KW sources for
            heavy-duty, precise, and fast metal cutting.
          </li>
          <li>
            <strong>Laser Consumables:</strong> High-precision single and
            double-layer nozzle series designed for cleaner, faster, and dross-free
            cuts.
          </li>
          <li>
            <strong>Industrial Components:</strong> Supplies NEMA 34 Reducers for
            high-torque and smooth motor control in CNC applications.
          </li>
          <li>
            <strong>Services:</strong> Industrial laser cutting services for metal
            fabrication.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-10">
          Company Highlights
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Location:</strong> Based in Lahore, Pakistan — 76 C Gulshan e
            Rehman Sultan Ahmad Road, Ichra.
          </li>
          <li>
            <strong>Market Focus:</strong> Primarily targets industrial metal
            fabrication, aiming to improve production speed and efficiency for
            workshops.
          </li>
          <li>
            <strong>Performance:</strong> 24/7 heavy-duty operation, high-speed
            performance, and high-precision, reliable results.
          </li>
          <li>
            <strong>Presence:</strong> Active on Instagram and Facebook,
            showcasing machinery such as the Laser Max 3015. We also participate in
            industrial trade shows and exhibitions.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-10">
          Contact Us
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Phone / WhatsApp:</strong>{" "}
            <Link
              href="tel:+923214198406"
              className="text-primary hover:underline"
            >
              +92 321 4198406
            </Link>
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <Link
              href="https://krallaser.com"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              krallaser.com
            </Link>
          </li>
          <li>
            <strong>Facebook:</strong>{" "}
            <Link
              href="https://facebook.com/krallaser"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kral Laser
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

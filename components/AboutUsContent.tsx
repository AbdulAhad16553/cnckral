import React from "react";
import Link from "next/link";

export default function AboutUsContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-700">
      <p className="text-lg leading-relaxed">
        <strong>CNC KRAL</strong> is a prominent industrial machinery and
        hardware distributor based in Lahore, Pakistan, specializing in CNC
        (Computer Numerical Control) solutions and high-precision cutting tools.
        We provide a wide range of machines and accessories tailored for both
        industrial and commercial applications, particularly in woodworking,
        metalworking, and stone carving.
      </p>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-10">
          Key Products and Services
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>CNC Machinery:</strong> We distribute various types of CNC
            equipment, including:
            <ul className="list-[circle] pl-6 mt-2 space-y-2">
              <li>
                <strong>Wood Routers:</strong> Machines like the CKW 222 and
                CKW-2225 are popular for furniture making and wooden decor.
              </li>
              <li>
                <strong>Laser Cutters:</strong> High-precision machines for
                processing metals, plastics, and hardwoods.
              </li>
              <li>
                <strong>Plasma Cutters:</strong> Used primarily for heavy metal
                cutting.
              </li>
              <li>
                <strong>Multi-Axis Machines:</strong> Advanced 4-axis and 5-axis
                systems for complex manufacturing.
              </li>
            </ul>
          </li>
          <li>
            <strong>Precision Tooling (CNC Bits):</strong> We offer an extensive
            catalog of cutting bits, often marketed under our own brand or
            through partners like Craly and Tideway. Notable tools include:
            <ul className="list-[circle] pl-6 mt-2 space-y-2">
              <li>
                F-16 Bits and 3-Flute Aluminum Endmills for high-speed
                performance.
              </li>
              <li>
                V-Carving, Roundover, and Ball Nose bits for intricate detailing
                in MDF and wood.
              </li>
              <li>
                Vacuum Diamond Routers specifically designed for stone carving.
              </li>
            </ul>
          </li>
          <li>
            <strong>Spare Parts:</strong> We supply critical components such as
            HBB high-speed bearings to ensure smooth machine movement and
            durability.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 mt-10">
          Operational Details
        </h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Locations:</strong> We operate a display center in Ichra,
            Lahore, and a warehouse near the Saggia Bypass Road.
          </li>
          <li>
            <strong>Industry Focus:</strong> Our tools and machines serve
            industries ranging from automotive and aerospace to signage,
            jewelry, and interior design.
          </li>
          <li>
            <strong>Reputation:</strong> We emphasize &quot;Zero vibration&quot; and
            &quot;Long-term accuracy,&quot; with over 10 years of experience in the
            Pakistani market.
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
              CNC KRAL
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

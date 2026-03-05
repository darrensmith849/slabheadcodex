import Image from "next/image";
import { getHeroBackgroundForPath } from "@/lib/visual/hero-background";

type NeonAuroraBackgroundProps = {
  pathname: string;
};

export async function NeonAuroraBackground({ pathname }: NeonAuroraBackgroundProps) {
  const selected = await getHeroBackgroundForPath(pathname);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(84,99,255,0.34),transparent_40%),radial-gradient(circle_at_88%_8%,rgba(236,109,255,0.24),transparent_35%),radial-gradient(circle_at_76%_68%,rgba(37,201,255,0.22),transparent_30%),linear-gradient(180deg,#060a14_0%,#070d1a_45%,#081126_100%)]" />

      <div className="absolute -left-[10%] top-[12%] h-[44vh] w-[56vw] rounded-full bg-[#ec6dff]/18 blur-3xl" />
      <div className="absolute right-[-12%] top-[6%] h-[40vh] w-[54vw] rounded-full bg-[#20c8ff]/18 blur-3xl" />
      <div className="absolute left-[28%] top-[54%] h-[34vh] w-[42vw] rounded-full bg-[#6e66ff]/15 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0.7px, transparent 0.8px), radial-gradient(circle at 75% 30%, rgba(255,255,255,0.09) 0.6px, transparent 0.8px)",
          backgroundSize: "3px 3px, 4px 4px",
          mixBlendMode: "soft-light",
        }}
      />

      <div
        className="absolute -left-[6%] top-[-8%] h-[68vh] w-[58vw] overflow-hidden opacity-[0.15] mix-blend-screen"
        style={{ maskImage: "linear-gradient(130deg, rgba(0,0,0,1), rgba(0,0,0,0.08))" }}
      >
        <Image src={selected.primary} alt="" fill sizes="(max-width: 1024px) 100vw, 58vw" priority className="object-cover" />
      </div>

      <div
        className="absolute bottom-[-8%] right-[-4%] h-[62vh] w-[52vw] overflow-hidden opacity-[0.11] mix-blend-screen"
        style={{ maskImage: "linear-gradient(330deg, rgba(0,0,0,1), rgba(0,0,0,0.07))" }}
      >
        <Image src={selected.secondary} alt="" fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,9,20,0.58)_0%,rgba(6,12,24,0.42)_45%,rgba(6,12,24,0.7)_100%)]" />
    </div>
  );
}

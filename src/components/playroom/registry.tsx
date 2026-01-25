import { Stage } from "@/components/playroom/Stage";

import ArcMenuPlayground from "@/components/playroom/ArcMenuPlayground";
import { MagneticCtaDemo } from "@/components/playroom/MagneticCtaDemo";
import { SpotlightGridDemo } from "@/components/playroom/SpotlightGridDemo";
import  PillDockDemo  from "@/components/playroom/PillDockDemo";
import  VoiceHoldTypeDemo  from "@/components/playroom/VoiceHoldTypeDemo";
import OrbitingIconField from "@/components/playroom/OrbitingIconField";
import { ThemeToggleDemo } from "@/components/playroom/ThemeToggleDemo";
import NeonLikePlayground from "./NeonLikePlayground";

export const playroomMdxComponents = {
  Stage,

  ArcMenuPlayground,
  MagneticCtaDemo,
  SpotlightGridDemo,
  PillDockDemo,
  VoiceHoldTypeDemo,
  OrbitingIconField,
  ThemeToggleDemo,
  NeonLikePlayground,
} as const;

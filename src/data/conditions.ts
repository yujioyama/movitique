import type { Condition } from "../types/condition";

const conditions: Condition[] = [
  {
    name: "上映中",
    en: "now_playing",
  },
  {
    name: "トレンディング",
    en: "popular",
  },
  {
    name: "評価が高い",
    en: "top_rated",
  },
  {
    name: "近日公開",
    en: "upcoming",
  },
] as const;

export default conditions;

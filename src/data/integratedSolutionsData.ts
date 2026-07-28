import {
  Briefcase,
  Factory,
  Scissors,
  Truck,
  Warehouse,
  HardHat,
  Wallet,
  Layers,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────

export interface IntegratedSolution {
  /** Unique identifier */
  id: string;
  /** URL-safe slug */
  slug: string;
  /** Official branded product name (never translated) */
  officialName: string;
  /** Short display name for compact UI */
  shortName: string;
  /** Product category */
  category: "erp";
  /** Path to the official logo stored in /public/solutions/ */
  logo: string;
  /** Fallback Lucide icon when logo fails to load */
  icon: LucideIcon;
  /** i18n key suffix for the short card description */
  descKey: string;
  /** External detail page URL on the official website */
  detailUrl: string;
  /** Availability status */
  status: "active";
  /** Whether to visually highlight this solution */
  featured: boolean;
}

// ── Data ──────────────────────────────────────────────────

export const integratedSolutions: IntegratedSolution[] = [
  {
    id: "integraltech-business",
    slug: "integraltech-business",
    officialName: "IntegralTech Business",
    shortName: "Business",
    category: "erp",
    logo: "/solutions/logo-business-850x480.webp",
    icon: Briefcase,
    descKey: "businessDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-business",
    status: "active",
    featured: true,
  },
  {
    id: "integraltech-factory",
    slug: "integraltech-factory",
    officialName: "IntegralTech Factory",
    shortName: "Factory",
    category: "erp",
    logo: "/solutions/logo-factory-850x480.webp",
    icon: Factory,
    descKey: "factoryDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-factory",
    status: "active",
    featured: true,
  },
  {
    id: "integraltech-materio",
    slug: "integraltech-materio",
    officialName: "IntegralTech Matério",
    shortName: "Matério",
    category: "erp",
    logo: "/solutions/logo-materio-850x480.webp",
    icon: Scissors,
    descKey: "materioDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-materio",
    status: "active",
    featured: false,
  },
  {
    id: "integraltech-tms",
    slug: "integraltech-tms",
    officialName: "IntegralTech TMS",
    shortName: "TMS",
    category: "erp",
    logo: "/solutions/logo-tms-850x480.webp",
    icon: Truck,
    descKey: "tmsDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-tms",
    status: "active",
    featured: true,
  },
  {
    id: "integraltech-marche",
    slug: "integraltech-marche",
    officialName: "IntegralTech Marché",
    shortName: "Marché",
    category: "erp",
    logo: "/solutions/logo-marche-850x480.webp",
    icon: Warehouse,
    descKey: "marcheDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-marche",
    status: "active",
    featured: false,
  },
  {
    id: "integraltech-zbtp",
    slug: "integraltech-zbtp",
    officialName: "IntegralTech ZBTP",
    shortName: "ZBTP",
    category: "erp",
    logo: "/solutions/logo-zbtp-850x480.webp",
    icon: HardHat,
    descKey: "zbtpDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-zbtp",
    status: "active",
    featured: false,
  },
  {
    id: "integraltech-finance",
    slug: "integraltech-finance",
    officialName: "IntegralTech Finance",
    shortName: "Finance",
    category: "erp",
    logo: "/solutions/logo-finance-850x480.webp",
    icon: Wallet,
    descKey: "financeDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-finance",
    status: "active",
    featured: true,
  },
  {
    id: "integraltech-finance-plus",
    slug: "integraltech-finance-plus",
    officialName: "IntegralTech Finance+",
    shortName: "Finance+",
    category: "erp",
    logo: "/solutions/logo-finance-1-850x480.webp",
    icon: Layers,
    descKey: "financePlusDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-finance-plus",
    status: "active",
    featured: false,
  },
  {
    id: "integraltech-edu",
    slug: "integraltech-edu",
    officialName: "IntegralTech Edu",
    shortName: "Edu",
    category: "erp",
    logo: "/solutions/edu-1-850x480.webp",
    icon: GraduationCap,
    descKey: "eduDesc",
    detailUrl: "https://integraltech.ma/services/integraltech-edu",
    status: "active",
    featured: false,
  },
];

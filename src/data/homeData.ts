import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Smartphone,
  Cloud,
  ShieldCheck,
  Wrench,
  Headphones,
  RefreshCw,
  Lightbulb,
  Building2,
  Server,
  Lock,
  ShoppingCart,
  Network,
  Layers,
  BarChart3,
  Settings,
  Award,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Shield,
  Heart,
  Rocket,
  Handshake,
  Eye,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────

export interface ServiceItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  href: string;
}

export interface SolutionItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

export interface TrustItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
  icon: LucideIcon;
}

export interface TestimonialItem {
  name: string;
  role: string;
  textKey: string;
}

export interface ClientItem {
  name: string;
  sector: string;
}

// ── Services (8 cards) ────────────────────────────────────

export const servicesData: ServiceItem[] = [
  { icon: Globe, titleKey: "webDev", descKey: "webDevDesc", href: "/services" },
  { icon: Smartphone, titleKey: "mobileApps", descKey: "mobileAppsDesc", href: "/services" },
  { icon: Cloud, titleKey: "cloudInfra", descKey: "cloudInfraDesc", href: "/services" },
  { icon: ShieldCheck, titleKey: "cybersecurity", descKey: "cybersecurityDesc", href: "/services" },
  { icon: Wrench, titleKey: "maintenanceIT", descKey: "maintenanceITDesc", href: "/services" },
  { icon: Headphones, titleKey: "techSupport", descKey: "techSupportDesc", href: "/services" },
  { icon: RefreshCw, titleKey: "digitalTransform", descKey: "digitalTransformDesc", href: "/services" },
  { icon: Lightbulb, titleKey: "itConsulting", descKey: "itConsultingDesc", href: "/services" },
];

// ── Solutions (8 cards) ───────────────────────────────────

export const solutionsData: SolutionItem[] = [
  { icon: Building2, titleKey: "enterprise", descKey: "enterpriseDesc" },
  { icon: Cloud, titleKey: "cloud", descKey: "cloudDesc" },
  { icon: Lock, titleKey: "security", descKey: "securityDesc" },
  { icon: ShoppingCart, titleKey: "ecommerce", descKey: "ecommerceDesc" },
  { icon: Network, titleKey: "network", descKey: "networkDesc" },
  { icon: Layers, titleKey: "saas", descKey: "saasDesc" },
  { icon: BarChart3, titleKey: "management", descKey: "managementDesc" },
  { icon: Settings, titleKey: "custom", descKey: "customDesc" },
];

// ── Trust / Why Choose Us (6 items) ──────────────────────

export const trustData: TrustItem[] = [
  { icon: Award, titleKey: "expertise", descKey: "expertiseDesc" },
  { icon: Shield, titleKey: "integratedSecurity", descKey: "integratedSecurityDesc" },
  { icon: Heart, titleKey: "humanSupport", descKey: "humanSupportDesc" },
  { icon: Rocket, titleKey: "scalable", descKey: "scalableDesc" },
  { icon: Handshake, titleKey: "strategic", descKey: "strategicDesc" },
  { icon: Eye, titleKey: "transparency", descKey: "transparencyDesc" },
];

// ── Stats (4 items) ──────────────────────────────────────

export const statsData: StatItem[] = [
  { value: 500, suffix: "+", labelKey: "projects", icon: TrendingUp },
  { value: 10, suffix: "+", labelKey: "experience", icon: Award },
  { value: 24, suffix: "/7", labelKey: "support", icon: Clock },
  { value: 98, suffix: "%", labelKey: "satisfaction", icon: CheckCircle },
];

// ── Testimonials (3 items) ───────────────────────────────

export const testimonialsData: TestimonialItem[] = [
  {
    name: "Ahmed Benali",
    role: "Directeur IT, CMA CGM Maroc",
    textKey: "testimonial1",
  },
  {
    name: "Fatima Zahra",
    role: "DG, Cabinet Conseil",
    textKey: "testimonial2",
  },
  {
    name: "Karim Mansouri",
    role: "CEO, StartupMA",
    textKey: "testimonial3",
  },
];

// ── Trusted-By Clients (12 items) ────────────────────────

export const clientsData: ClientItem[] = [
  { name: "Maroc Telecom", sector: "Télécoms" },
  { name: "Attijariwafa Bank", sector: "Finance" },
  { name: "OCP Group", sector: "Industrie" },
  { name: "Lydec", sector: "Services publics" },
  { name: "BMCE Bank", sector: "Finance" },
  { name: "Centrale Danone", sector: "Agroalimentaire" },
  { name: "Inwi", sector: "Télécoms" },
  { name: "CIH Bank", sector: "Finance" },
  { name: "Samir", sector: "Énergie" },
  { name: "Managem", sector: "Mines" },
  { name: "Al Barid Bank", sector: "Finance" },
  { name: "ONCF", sector: "Transport" },
];

// ── Mega-Menu Items (for Navbar dropdown) ─────────────────

export interface MegaMenuItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  href: string;
}

export const megaMenuServices: MegaMenuItem[] = [
  { icon: Globe, titleKey: "webDev", descKey: "webDevShort", href: "/services" },
  { icon: Smartphone, titleKey: "mobileApps", descKey: "mobileAppsShort", href: "/services" },
  { icon: Cloud, titleKey: "cloudInfra", descKey: "cloudInfraShort", href: "/services" },
  { icon: ShieldCheck, titleKey: "cybersecurity", descKey: "cybersecurityShort", href: "/services" },
  { icon: Wrench, titleKey: "maintenanceIT", descKey: "maintenanceITShort", href: "/services" },
  { icon: Headphones, titleKey: "techSupport", descKey: "techSupportShort", href: "/services" },
  { icon: RefreshCw, titleKey: "digitalTransform", descKey: "digitalTransformShort", href: "/services" },
  { icon: Lightbulb, titleKey: "itConsulting", descKey: "itConsultingShort", href: "/services" },
];

export const megaMenuSolutions: MegaMenuItem[] = [
  { icon: Building2, titleKey: "enterprise", descKey: "enterpriseShort", href: "/solutions" },
  { icon: Cloud, titleKey: "cloud", descKey: "cloudShort", href: "/solutions" },
  { icon: Lock, titleKey: "security", descKey: "securityShort", href: "/solutions" },
  { icon: ShoppingCart, titleKey: "ecommerce", descKey: "ecommerceShort", href: "/solutions" },
  { icon: Network, titleKey: "network", descKey: "networkShort", href: "/solutions" },
  { icon: Layers, titleKey: "saas", descKey: "saasShort", href: "/solutions" },
  { icon: BarChart3, titleKey: "management", descKey: "managementShort", href: "/solutions" },
  { icon: Settings, titleKey: "custom", descKey: "customShort", href: "/solutions" },
];

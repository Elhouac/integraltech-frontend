import type { LucideIcon } from "lucide-react";
import { Code2, Smartphone, Layers, Cloud } from "lucide-react";

export interface ServiceItem {
  id: string;
  slug: string;
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  href: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "web-development",
    slug: "developpement-web",
    titleKey: "webDev",
    descKey: "webDevDesc",
    icon: Code2,
    href: "/services#developpement-web",
  },
  {
    id: "mobile-development",
    slug: "developpement-mobile",
    titleKey: "mobileDev",
    descKey: "mobileDevDesc",
    icon: Smartphone,
    href: "/services#developpement-mobile",
  },
  {
    id: "erp-solutions",
    slug: "solutions-erp",
    titleKey: "erp",
    descKey: "erpDesc",
    icon: Layers,
    href: "/services#solutions-erp",
  },
  {
    id: "cloud-hosting",
    slug: "solutions-cloud-et-hebergement",
    titleKey: "cloudHosting",
    descKey: "cloudHostingDesc",
    icon: Cloud,
    href: "/services#solutions-cloud-et-hebergement",
  },
];

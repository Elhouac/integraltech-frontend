import {
  Users,
  Inbox,
  FileText,
  Eye,
  Mail,
  Settings,
  FilePlus,
  Upload,
  BarChart3,
  Send,
} from "lucide-react";
import type {
  KpiData,
  ActivityData,
  QuickActionData,
  LeadStatus,
  Lead,
  LeadNote,
  Subscriber,
  PostStatus,
  Category,
  Post,
  SystemUser,
} from "../types/admin";

// ──────────────────────────────────────────────
// All admin mock data centralized here.
// Replaced by adminService layer in Phase 4.
// ──────────────────────────────────────────────

export const MOCK_KPI_DATA: KpiData[] = [
  {
    icon: Inbox,
    iconColor: "#F97316",
    iconBg: "rgba(249,115,22,0.08)",
    label: "Leads ce mois",
    value: "128",
    trend: { value: "+12% vs mois dernier", direction: "up" },
  },
  {
    icon: Users,
    iconColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.08)",
    label: "Abonnés newsletter",
    value: "2,340",
    trend: { value: "+5.2% vs mois dernier", direction: "up" },
  },
  {
    icon: FileText,
    iconColor: "#22C55E",
    iconBg: "rgba(34,197,94,0.08)",
    label: "Articles publiés",
    value: "47",
    trend: { value: "3 cette semaine", direction: "neutral" },
  },
  {
    icon: Eye,
    iconColor: "#8B5CF6",
    iconBg: "rgba(139,92,246,0.08)",
    label: "Visiteurs (30j)",
    value: "12.4K",
    trend: { value: "-2.1% vs mois dernier", direction: "down" },
  },
];

export const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: 1,
    icon: Inbox,
    iconColor: "#F97316",
    iconBg: "rgba(249,115,22,0.08)",
    title: "Nouveau lead",
    description: "Ahmed Benali a soumis une demande de contact",
    time: "Il y a 12 min",
  },
  {
    id: 2,
    icon: FileText,
    iconColor: "#22C55E",
    iconBg: "rgba(34,197,94,0.08)",
    title: "Article publié",
    description: '"Sécurité cloud en 2026" est maintenant en ligne',
    time: "Il y a 1h",
  },
  {
    id: 3,
    icon: Users,
    iconColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.08)",
    title: "Nouvel utilisateur",
    description: "Karim Idrissi a été ajouté comme éditeur",
    time: "Il y a 3h",
  },
  {
    id: 4,
    icon: Mail,
    iconColor: "#8B5CF6",
    iconBg: "rgba(139,92,246,0.08)",
    title: "Newsletter envoyée",
    description: 'Campagne "Offre été 2026" envoyée à 1,240 abonnés',
    time: "Hier, 16:30",
  },
  {
    id: 5,
    icon: Settings,
    iconColor: "#64748B",
    iconBg: "rgba(100,116,139,0.08)",
    title: "Configuration mise à jour",
    description: "Les paramètres SEO ont été modifiés",
    time: "Hier, 09:15",
  },
];

export const MOCK_QUICK_ACTIONS: QuickActionData[] = [
  {
    icon: FilePlus,
    label: "Nouvel article",
    description: "Créer un article de blog",
    to: "/admin/posts/create",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
  },
  {
    icon: Inbox,
    label: "Voir les leads",
    description: "Consulter les demandes",
    to: "/admin/leads",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
  },
  {
    icon: Upload,
    label: "Uploader un média",
    description: "Ajouter images ou fichiers",
    to: "/admin/media",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: BarChart3,
    label: "Statistiques",
    description: "Voir les performances",
    to: "/admin/dashboard",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
  },
  {
    icon: Send,
    label: "Newsletter",
    description: "Gérer les abonnés",
    to: "/admin/subscribers",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
  },
  {
    icon: Settings,
    label: "Paramètres",
    description: "Configuration du site",
    to: "/admin/settings/general",
    color: "#64748B",
    bg: "rgba(100,116,139,0.08)",
  },
];

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: "Nouveau", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  in_progress: { label: "En cours", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  resolved: { label: "Résolu", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  archived: { label: "Archivé", color: "#64748B", bg: "rgba(100,116,139,0.1)" },
};


export const MOCK_LEADS: Lead[] = [
  { id: 1, name: "Ahmed Benali", email: "ahmed@company.ma", phone: "+212 6 12 34 56 78", subject: "Demande de devis ERP", message: "Nous cherchons à implémenter un ERP pour notre entreprise de 50 employés. Pouvez-vous nous envoyer une proposition ?", status: "new", is_read: false, created_at: "2026-07-14T10:30:00Z" },
  { id: 2, name: "Fatima Zahra", email: "fatima.z@startup.ma", phone: "+212 6 98 76 54 32", subject: "Migration cloud", message: "Nous souhaitons migrer notre infrastructure vers le cloud. Quelles solutions proposez-vous ?", status: "new", is_read: false, created_at: "2026-07-14T08:15:00Z" },
  { id: 3, name: "Karim Idrissi", email: "k.idrissi@bank.ma", phone: "+212 5 22 33 44 55", subject: "Audit de sécurité", message: "Notre banque a besoin d'un audit de sécurité complet. Merci de nous contacter.", status: "in_progress", is_read: true, created_at: "2026-07-13T14:00:00Z" },
  { id: 4, name: "Sara Bennani", email: "sara@ecommerce.ma", phone: null, subject: "Site e-commerce", message: "Je souhaite créer un site e-commerce pour vendre des produits artisanaux marocains.", status: "in_progress", is_read: true, created_at: "2026-07-12T16:45:00Z" },
  { id: 5, name: "Omar Tazi", email: "omar.tazi@gov.ma", phone: "+212 5 37 20 10 00", subject: "Digitalisation administrative", message: "Nous cherchons un partenaire pour digitaliser nos processus administratifs.", status: "resolved", is_read: true, created_at: "2026-07-11T09:00:00Z" },
  { id: 6, name: "Nadia Amrani", email: "n.amrani@clinic.ma", phone: "+212 6 55 44 33 22", subject: "Logiciel médical", message: "Clinique de 20 médecins cherche un logiciel de gestion des patients.", status: "new", is_read: false, created_at: "2026-07-10T11:20:00Z" },
  { id: 7, name: "Youssef El Mansouri", email: "y.elmansouri@tech.ma", phone: null, subject: "Développement mobile", message: "Application mobile React Native pour notre startup fintech.", status: "in_progress", is_read: true, created_at: "2026-07-09T15:30:00Z" },
  { id: 8, name: "Amal Chakir", email: "amal@school.ma", phone: "+212 6 11 22 33 44", subject: "Plateforme e-learning", message: "École privée cherche une plateforme de cours en ligne pour 500 élèves.", status: "resolved", is_read: true, created_at: "2026-07-08T13:00:00Z" },
  { id: 9, name: "Hassan Boujemaa", email: "hassan.b@factory.ma", phone: "+212 5 23 45 67 89", subject: "IoT usine", message: "Intégration de capteurs IoT dans notre chaîne de production.", status: "archived", is_read: true, created_at: "2026-07-05T10:00:00Z" },
  { id: 10, name: "Leila Fassi", email: "leila@agency.ma", phone: null, subject: "Refonte site web", message: "Notre agence immobilière a besoin d'un site web moderne et performant.", status: "new", is_read: true, created_at: "2026-07-04T17:00:00Z" },
  { id: 11, name: "Rachid Alaoui", email: "rachid@logistics.ma", phone: "+212 6 77 88 99 00", subject: "Suivi de flotte", message: "Système de tracking GPS pour notre flotte de 80 véhicules.", status: "resolved", is_read: true, created_at: "2026-07-03T08:30:00Z" },
  { id: 12, name: "Imane Berrada", email: "imane@hotel.ma", phone: "+212 5 24 11 22 33", subject: "Système de réservation", message: "Hôtel 4 étoiles cherche un système de réservation en ligne intégré.", status: "in_progress", is_read: true, created_at: "2026-07-02T12:00:00Z" },
  { id: 13, name: "Mohamed Senhaji", email: "m.senhaji@law.ma", phone: "+212 5 22 55 66 77", subject: "GED juridique", message: "Cabinet d'avocats cherche une solution de gestion documentaire.", status: "archived", is_read: true, created_at: "2026-06-28T09:45:00Z" },
  { id: 14, name: "Zineb Ouazzani", email: "zineb@ngo.ma", phone: null, subject: "Site vitrine ONG", message: "ONG environnementale cherche un site vitrine avec blog et newsletter.", status: "resolved", is_read: true, created_at: "2026-06-25T14:30:00Z" },
  { id: 15, name: "Driss Kettani", email: "driss@retail.ma", phone: "+212 6 33 44 55 66", subject: "Caisse connectée", message: "Chaîne de magasins cherche un système de point de vente moderne.", status: "new", is_read: false, created_at: "2026-06-20T16:00:00Z" },
];

export const MOCK_LEAD_NOTES: LeadNote[] = [
  { id: 1, lead_id: 3, author: "Super Admin", content: "J'ai contacté M. Idrissi par téléphone. Il souhaite un audit complet de leur système bancaire. Rendez-vous prévu le 15 juillet.", created_at: "2026-07-13T15:30:00Z" },
  { id: 2, lead_id: 3, author: "Super Admin", content: "Proposition commerciale envoyée par email. En attente de validation par le directeur IT.", created_at: "2026-07-14T09:00:00Z" },
  { id: 3, lead_id: 4, author: "Éditeur", content: "Mme Bennani a précisé qu'elle vend des tapis et de la poterie. Budget estimé : 15,000 MAD.", created_at: "2026-07-12T17:00:00Z" },
  { id: 4, lead_id: 5, author: "Super Admin", content: "Projet terminé avec succès. Le client est satisfait. Facture envoyée.", created_at: "2026-07-11T16:00:00Z" },
  { id: 5, lead_id: 7, author: "Éditeur", content: "Spécifications reçues : app iOS + Android, paiement mobile, KYC intégré.", created_at: "2026-07-10T10:00:00Z" },
];

// ── Newsletter Subscribers ──

export const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: 1, email: "ahmed.b@company.ma", is_active: true, subscribed_at: "2026-07-14T09:00:00Z" },
  { id: 2, email: "fatima.zahra@gmail.com", is_active: true, subscribed_at: "2026-07-13T14:20:00Z" },
  { id: 3, email: "karim.idrissi@bank.ma", is_active: true, subscribed_at: "2026-07-12T08:45:00Z" },
  { id: 4, email: "sara.bennani@outlook.com", is_active: false, subscribed_at: "2026-07-10T16:30:00Z" },
  { id: 5, email: "omar.tazi@gov.ma", is_active: true, subscribed_at: "2026-07-09T10:15:00Z" },
  { id: 6, email: "nadia.amrani@clinic.ma", is_active: true, subscribed_at: "2026-07-08T11:00:00Z" },
  { id: 7, email: "youssef.mansouri@tech.ma", is_active: true, subscribed_at: "2026-07-07T15:45:00Z" },
  { id: 8, email: "amal.chakir@school.ma", is_active: false, subscribed_at: "2026-07-05T09:30:00Z" },
  { id: 9, email: "hassan.boujemaa@factory.ma", is_active: true, subscribed_at: "2026-07-03T12:00:00Z" },
  { id: 10, email: "leila.fassi@agency.ma", is_active: true, subscribed_at: "2026-07-01T17:20:00Z" },
  { id: 11, email: "rachid.alaoui@logistics.ma", is_active: true, subscribed_at: "2026-06-28T08:00:00Z" },
  { id: 12, email: "imane.berrada@hotel.ma", is_active: false, subscribed_at: "2026-06-25T14:30:00Z" },
  { id: 13, email: "zineb.ouazzani@ngo.ma", is_active: true, subscribed_at: "2026-06-22T10:45:00Z" },
  { id: 14, email: "driss.kettani@retail.ma", is_active: true, subscribed_at: "2026-06-18T16:00:00Z" },
  { id: 15, email: "meryem.elharrak@design.ma", is_active: true, subscribed_at: "2026-06-15T09:15:00Z" },
  { id: 16, email: "soufiane.bouazza@dev.ma", is_active: false, subscribed_at: "2026-06-10T11:30:00Z" },
  { id: 17, email: "hanae.lemniai@media.ma", is_active: true, subscribed_at: "2026-06-05T13:00:00Z" },
  { id: 18, email: "badr.regragui@sport.ma", is_active: true, subscribed_at: "2026-05-28T15:45:00Z" },
];

// ── Blog CMS (Categories, Tags, Posts) ──

export const POST_STATUS_CONFIG: Record<PostStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Brouillon", color: "#64748B", bg: "rgba(100,116,139,0.1)" },
  published: { label: "Publié", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  archived: { label: "Archivé", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: { fr: "Transformation Numérique", en: "Digital Transformation", ar: "التحول الرقمي" }, slug: "transformation-numerique", order: 1 },
  { id: 2, name: { fr: "Cybersécurité", en: "Cybersecurity", ar: "الأمن السيبراني" }, slug: "cybersecurite", order: 2 },
  { id: 3, name: { fr: "Cloud Computing", en: "Cloud Computing", ar: "الحوسبة السحابية" }, slug: "cloud-computing", order: 3 },
  { id: 4, name: { fr: "Développement Sur Mesure", en: "Custom Development", ar: "تطوير البرمجيات المخصصة" }, slug: "developpement-sur-mesure", order: 4 },
  { id: 5, name: { fr: "Intelligence Artificielle", en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" }, slug: "intelligence-artificielle", order: 5 },
];

export const MOCK_TAGS: string[] = [
  "React", "Laravel", "AWS", "Sécurité", "DevOps", "Fintech", "IoT", "IA", "ERP"
];

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    slug: "reussir-sa-transformation-digitale-en-2026",
    title: {
      fr: "Comment réussir sa transformation digitale en 2026",
      en: "How to succeed in your digital transformation in 2026",
      ar: "كيفية النجاح في التحول الرقمي في عام 2026"
    },
    excerpt: {
      fr: "Découvrez les étapes indispensables pour digitaliser vos processus d'entreprise avec succès.",
      en: "Discover the essential steps to successfully digitize your business processes.",
      ar: "اكتشف الخطوات الأساسية لرقمنة عمليات عملك بنجاح."
    },
    content: {
      fr: "La transformation digitale n'est plus une option mais une nécessité. En 2026, l'adoption de l'IA et du cloud hybride redéfinit la compétitivité des entreprises marocaines...",
      en: "Digital transformation is no longer an option but a necessity. In 2026, the adoption of AI and hybrid cloud is redefining the competitiveness of Moroccan companies...",
      ar: "لم يعد التحول الرقمي خيارًا بل ضرورة. في عام 2026، يعيد اعتماد الذكاء الاصطناعي والسحابة الهجينة تحديد القدرة التنافسية للشركات المغربية..."
    },
    category_id: 1,
    author: "Super Admin",
    cover_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60",
    seo_title: "Transformation Digitale 2026 | Guide complet",
    seo_description: "Guide pratique pour piloter la transformation digitale de votre PME.",
    status: "published",
    published_at: "2026-07-14T08:00:00Z",
    created_at: "2026-07-14T08:00:00Z",
    tags: ["DevOps", "Fintech"]
  },
  {
    id: 2,
    slug: "cybersecurite-pme-marocaines-menaces-solutions",
    title: {
      fr: "Cybersécurité : menaces et solutions pour les PME marocaines",
      en: "Cybersecurity: threats and solutions for Moroccan SMEs",
      ar: "الأمن السيبراني: التهديدات والحلول للمقاولات الصغرى والمتوسطة بالمغرب"
    },
    excerpt: {
      fr: "Face à la hausse des cyberattaques, voici comment protéger vos données sensibles efficacement.",
      en: "Faced with the rise in cyberattacks, here is how to protect your sensitive data effectively.",
      ar: "في مواجهة ارتفاع الهجمات السيبرانية، إليك كيفية حماية بياناتك الحساسة بفعالية."
    },
    content: {
      fr: "Les PME marocaines sont de plus en plus ciblées par les ransomwares. Mettre en place une politique de sécurité rigoureuse et former ses collaborateurs est le premier rempart...",
      en: "Moroccan SMEs are increasingly targeted by ransomware. Implementing a rigorous security policy and training employees is the first line of defense...",
      ar: "تتعرض الشركات المغربية الصغيرة والمتوسطة بشكل متزايد للاستهداف من قبل برامج الفدية. يعد تطبيق سياسة أمنية صارمة وتدريب الموظفين خط الدفاع الأول..."
    },
    category_id: 2,
    author: "Éditeur",
    cover_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=60",
    seo_title: "Cybersécurité PME Maroc | Solutions Sécurité",
    seo_description: "Protégez vos serveurs et réseaux des cyberattaques courantes au Maroc.",
    status: "published",
    published_at: "2026-07-12T10:30:00Z",
    created_at: "2026-07-12T10:30:00Z",
    tags: ["Sécurité"]
  },
  {
    id: 3,
    slug: "pourquoi-migrer-vers-le-cloud-hybride",
    title: {
      fr: "Pourquoi migrer vers le cloud hybride en tant que grande entreprise",
      en: "Why migrate to hybrid cloud as a large enterprise",
      ar: "لماذا الانتقال إلى السحابة الهجينة كشركة كبرى"
    },
    excerpt: {
      fr: "Alliez la flexibilité du cloud public et la sécurité du cloud privé pour vos applications critiques.",
      en: "Combine the flexibility of public cloud and the security of private cloud for your critical applications.",
      ar: "اجمع بين مرونة السحابة العامة وأمان السحابة الخاصة لتطبيقاتك الحيوية."
    },
    content: {
      fr: "Le cloud hybride offre un équilibre parfait pour les structures gérant des données hautement confidentielles tout en nécessitant une forte puissance de calcul à la demande...",
      en: "The hybrid cloud offers a perfect balance for structures managing highly confidential data while requiring high computing power on demand...",
      ar: "توفر السحابة الهجينة توازنًا مثاليًا للهياكل التي تدير بيانات سرية للغاية مع تطلبها قوة حوسبة عالية عند الطلب..."
    },
    category_id: 3,
    author: "Super Admin",
    cover_image: "https://images.unsplash.com/photo-1484417894907-623942c8ea29?w=500&auto=format&fit=crop&q=60",
    seo_title: "Avantages Cloud Hybride Entreprise",
    seo_description: "Découvrez pourquoi le cloud hybride est le choix privilégié des grandes entreprises.",
    status: "draft",
    published_at: null,
    created_at: "2026-07-11T16:00:00Z",
    tags: ["AWS", "DevOps"]
  }
];

// ── System Users ──

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: 1, name: "Super Admin", email: "admin@integraltech.ma", role: "super_admin", is_active: true, last_login: "2026-07-15T00:10:00Z" },
  { id: 2, name: "Éditeur Principal", email: "editor@integraltech.ma", role: "editor", is_active: true, last_login: "2026-07-14T18:30:00Z" },
  { id: 3, name: "Support Technique", email: "support@integraltech.ma", role: "support", is_active: true, last_login: "2026-07-13T11:20:00Z" },
  { id: 4, name: "Observateur Public", email: "viewer@integraltech.ma", role: "viewer", is_active: true, last_login: "2026-07-12T09:45:00Z" },
  { id: 5, name: "Stagiaire IT", email: "intern@integraltech.ma", role: "viewer", is_active: false, last_login: null },
  { id: 6, name: "Rédacteur Externe", email: "writer@integraltech.ma", role: "editor", is_active: true, last_login: "2026-07-10T14:15:00Z" },
];


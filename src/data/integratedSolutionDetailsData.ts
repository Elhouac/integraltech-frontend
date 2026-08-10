import type { Language } from "../i18n";
import type { IntegratedSolutionSlug } from "./integratedSolutionsData";

export type LocalizedSolutionText = Record<Language, string>;

export interface IntegratedSolutionCapability {
  title: LocalizedSolutionText;
  description: LocalizedSolutionText;
}

export interface IntegratedSolutionDetail {
  heroSummary: LocalizedSolutionText;
  capabilities: IntegratedSolutionCapability[];
  benefits: LocalizedSolutionText[];
}

const text = (fr: string, en: string, ar: string): LocalizedSolutionText => ({ fr, en, ar });

export const integratedSolutionDetails = {
  "integraltech-business": {
    heroSummary: text(
      "Centralisez ventes, achats, stocks et points de vente dans un espace de gestion unique.",
      "Centralize sales, purchasing, inventory and point-of-sale operations in one management workspace.",
      "وحّد المبيعات والمشتريات والمخزون ونقاط البيع في مساحة إدارة واحدة.",
    ),
    capabilities: [
      {
        title: text("Module Vente", "Sales module", "وحدة المبيعات"),
        description: text(
          "Gérez efficacement vos ventes, commandes, clients et paiements.",
          "Manage sales, orders, customers and payments efficiently.",
          "أدر المبيعات والطلبات والعملاء والمدفوعات بكفاءة.",
        ),
      },
      {
        title: text("Module Achat", "Purchasing module", "وحدة المشتريات"),
        description: text(
          "Automatisez vos achats, vos commandes et le suivi de vos fournisseurs.",
          "Automate purchasing, orders and supplier monitoring.",
          "أتمت المشتريات والطلبات ومتابعة الموردين.",
        ),
      },
      {
        title: text("Module Stock", "Inventory module", "وحدة المخزون"),
        description: text(
          "Suivez en temps réel les stocks, les mouvements et les approvisionnements.",
          "Track inventory, movements and replenishment in real time.",
          "تابع المخزون والحركات وعمليات التزويد في الوقت الفعلي.",
        ),
      },
      {
        title: text("Point de vente", "Point of sale", "نقطة البيع"),
        description: text(
          "Pilotez vos ventes en magasin depuis une interface claire et connectée.",
          "Run in-store sales from a clear, connected interface.",
          "أدر مبيعات المتجر من واجهة واضحة ومترابطة.",
        ),
      },
    ],
    benefits: [
      text("Optimiser votre cycle de vente", "Optimize your sales cycle", "تحسين دورة المبيعات"),
      text("Mieux gérer vos approvisionnements et vos stocks", "Improve purchasing and inventory control", "تحسين إدارة المشتريات والمخزون"),
      text("Centraliser vos opérations sur une seule plateforme", "Centralize operations on one platform", "توحيد العمليات في منصة واحدة"),
    ],
  },
  "integraltech-factory": {
    heroSummary: text(
      "Pilotez production, planification, maintenance et stocks depuis une plateforme industrielle connectée.",
      "Manage production, planning, maintenance and inventory from one connected industrial platform.",
      "أدر الإنتاج والتخطيط والصيانة والمخزون من منصة صناعية مترابطة.",
    ),
    capabilities: [
      {
        title: text("Module Production", "Production module", "وحدة الإنتاج"),
        description: text(
          "Planifiez les ordres de fabrication et suivez les performances de production.",
          "Plan manufacturing orders and monitor production performance.",
          "خطط أوامر التصنيع وتابع أداء الإنتاج.",
        ),
      },
      {
        title: text("Module Ordonnancement", "Scheduling module", "وحدة الجدولة"),
        description: text(
          "Affectez efficacement équipes et machines pour limiter les retards.",
          "Assign teams and machines efficiently to reduce delays.",
          "وزّع الفرق والآلات بكفاءة للحد من التأخير.",
        ),
      },
      {
        title: text("Module Maintenance", "Maintenance module", "وحدة الصيانة"),
        description: text(
          "Automatisez la maintenance préventive et corrective de vos équipements.",
          "Automate preventive and corrective equipment maintenance.",
          "أتمت الصيانة الوقائية والتصحيحية للمعدات.",
        ),
      },
      {
        title: text("Module Stock", "Inventory module", "وحدة المخزون"),
        description: text(
          "Suivez les stocks, les mouvements et les approvisionnements en temps réel.",
          "Track inventory, movements and replenishment in real time.",
          "تابع المخزون والحركات وعمليات التزويد في الوقت الفعلي.",
        ),
      },
    ],
    benefits: [
      text("Améliorer la production en temps réel", "Improve production in real time", "تحسين الإنتاج في الوقت الفعلي"),
      text("Anticiper et réduire les pannes", "Anticipate and reduce equipment failures", "توقّع الأعطال والحد منها"),
      text("Simplifier la planification des commandes", "Simplify order and resource planning", "تبسيط تخطيط الطلبات والموارد"),
    ],
  },
  "integraltech-materio": {
    heroSummary: text(
      "Maîtrisez variantes, dimensions et découpes pour une production de matériaux plus précise.",
      "Control variants, dimensions and cutting operations for more precise materials production.",
      "تحكّم في المتغيرات والأبعاد وعمليات القطع لإنتاج مواد أكثر دقة.",
    ),
    capabilities: [
      {
        title: text("Gestion des variantes", "Variant management", "إدارة المتغيرات"),
        description: text(
          "Gérez les tailles, couleurs et finitions selon les demandes de vos clients.",
          "Manage sizes, colors and finishes based on customer requirements.",
          "أدر المقاسات والألوان والتشطيبات حسب متطلبات العملاء.",
        ),
      },
      {
        title: text("Gestion des dimensions", "Dimension management", "إدارة الأبعاد"),
        description: text(
          "Suivez les dimensions exactes et réduisez les erreurs de production.",
          "Track exact dimensions and reduce production errors.",
          "تابع الأبعاد الدقيقة وقلل أخطاء الإنتاج.",
        ),
      },
      {
        title: text("Gestion de la coupe", "Cutting management", "إدارة القطع"),
        description: text(
          "Planifiez les découpes pour limiter le gaspillage et améliorer le rendement.",
          "Plan cutting operations to reduce waste and improve yield.",
          "خطط عمليات القطع لتقليل الهدر وتحسين المردودية.",
        ),
      },
    ],
    benefits: [
      text("Adapter la gestion à chaque matériau", "Adapt management to each material", "تكييف الإدارة مع كل مادة"),
      text("Suivre les stocks et produits à chaque étape", "Track inventory and products at every stage", "متابعة المخزون والمنتجات في كل مرحلة"),
      text("Simplifier les dimensions et les coupes", "Simplify dimension and cutting workflows", "تبسيط إدارة الأبعاد والقطع"),
    ],
  },
  "integraltech-tms": {
    heroSummary: text(
      "Coordonnez véhicules, chauffeurs, livraisons et dépenses avec une traçabilité en temps réel.",
      "Coordinate vehicles, drivers, deliveries and expenses with real-time traceability.",
      "نسّق المركبات والسائقين والتسليمات والمصاريف مع تتبع فوري.",
    ),
    capabilities: [
      {
        title: text("Gestion des véhicules", "Vehicle management", "إدارة المركبات"),
        description: text(
          "Suivez l’état des véhicules, planifiez leur entretien et maximisez leur disponibilité.",
          "Monitor vehicle condition, schedule maintenance and maximize availability.",
          "تابع حالة المركبات وجدول صيانتها وعزّز جاهزيتها.",
        ),
      },
      {
        title: text("Gestion des chauffeurs", "Driver management", "إدارة السائقين"),
        description: text(
          "Centralisez les plannings, les itinéraires et le suivi de vos chauffeurs.",
          "Centralize schedules, routes and driver monitoring.",
          "وحّد الجداول والمسارات ومتابعة السائقين.",
        ),
      },
      {
        title: text("Gestion du transport", "Transport management", "إدارة النقل"),
        description: text(
          "Optimisez les itinéraires, les livraisons et les délais de transport.",
          "Optimize routes, deliveries and transport lead times.",
          "حسّن المسارات والتسليمات ومواعيد النقل.",
        ),
      },
      {
        title: text("Gestion des dépenses", "Expense management", "إدارة المصاريف"),
        description: text(
          "Contrôlez carburant, entretien, péages et frais liés aux chauffeurs.",
          "Control fuel, maintenance, tolls and driver-related expenses.",
          "راقب الوقود والصيانة ورسوم الطرق ومصاريف السائقين.",
        ),
      },
    ],
    benefits: [
      text("Réduire les coûts grâce à une meilleure planification", "Reduce costs through better planning", "خفض التكاليف عبر تخطيط أفضل"),
      text("Suivre véhicules et colis en temps réel", "Track vehicles and parcels in real time", "تتبع المركبات والطرود في الوقت الفعلي"),
      text("Centraliser tous les aspects logistiques", "Centralize every logistics workflow", "توحيد جميع العمليات اللوجستية"),
    ],
  },
  "integraltech-marche": {
    heroSummary: text(
      "Suivez appels d’offres, engagements, budgets et attachements avec une conformité maîtrisée.",
      "Track tenders, commitments, budgets and progress statements with controlled compliance.",
      "تابع طلبات العروض والالتزامات والميزانيات والكشوفات مع امتثال محكم.",
    ),
    capabilities: [
      {
        title: text("Gestion des appels d’offres", "Tender management", "إدارة طلبات العروض"),
        description: text(
          "Créez et suivez vos appels d’offres avec plus de transparence.",
          "Create and track tenders with greater transparency.",
          "أنشئ طلبات العروض وتابعها بمزيد من الشفافية.",
        ),
      },
      {
        title: text("Retenues de garantie", "Guarantee retentions", "اقتطاعات الضمان"),
        description: text(
          "Automatisez le suivi des retenues, des échéances et des libérations.",
          "Automate retention, deadline and release tracking.",
          "أتمت متابعة الاقتطاعات والآجال وعمليات الإفراج.",
        ),
      },
      {
        title: text("Comptabilité budgétaire", "Budget accounting", "المحاسبة الميزانياتية"),
        description: text(
          "Suivez les engagements, les dépenses et la répartition budgétaire.",
          "Monitor commitments, expenses and budget allocation.",
          "تابع الالتزامات والمصاريف وتوزيع الميزانية.",
        ),
      },
      {
        title: text("Gestion des attachements", "Progress statement management", "إدارة الكشوفات"),
        description: text(
          "Générez, validez et archivez les attachements pour une facturation précise.",
          "Generate, validate and archive progress statements for accurate billing.",
          "أنشئ الكشوفات واعتمدها وأرشفها لضمان فوترة دقيقة.",
        ),
      },
    ],
    benefits: [
      text("Optimiser le pilotage des projets", "Improve project oversight", "تحسين قيادة المشاريع"),
      text("Assurer un suivi précis des engagements", "Ensure precise commitment tracking", "ضمان متابعة دقيقة للالتزامات"),
      text("Gagner en agilité face aux opportunités", "Respond faster to business opportunities", "تعزيز المرونة أمام الفرص التجارية"),
    ],
  },
  "integraltech-zbtp": {
    heroSummary: text(
      "Planifiez vos chantiers, approvisionnements, prix et décomptes depuis une plateforme BTP centralisée.",
      "Plan sites, supplies, pricing and statements from one centralized construction platform.",
      "خطط الأوراش والتوريدات والأسعار والكشوفات من منصة بناء مركزية.",
    ),
    capabilities: [
      {
        title: text("Gestion de chantier", "Site management", "إدارة الورش"),
        description: text(
          "Suivez l’avancement, les ressources, les coûts et la conformité des travaux.",
          "Track progress, resources, costs and work compliance.",
          "تابع التقدم والموارد والتكاليف ومطابقة الأشغال.",
        ),
      },
      {
        title: text("Plan d’approvisionnement", "Supply planning", "خطة التوريد"),
        description: text(
          "Anticipez les besoins en matériaux et équipements pour éviter les interruptions.",
          "Anticipate material and equipment needs to prevent disruption.",
          "توقّع احتياجات المواد والمعدات لتفادي التوقفات.",
        ),
      },
      {
        title: text("Bibliothèque des prix", "Price library", "مكتبة الأسعار"),
        description: text(
          "Centralisez prix unitaires, prestations et matériaux pour harmoniser vos offres.",
          "Centralize unit prices, services and materials to standardize proposals.",
          "وحّد الأسعار الوحدوية والخدمات والمواد لتنسيق العروض.",
        ),
      },
      {
        title: text("Gestion des décomptes", "Statement management", "إدارة الكشوفات"),
        description: text(
          "Automatisez les décomptes, retenues et paiements selon les marchés.",
          "Automate statements, retentions and payments for each contract.",
          "أتمت الكشوفات والاقتطاعات والمدفوعات حسب الصفقات.",
        ),
      },
    ],
    benefits: [
      text("Superviser les chantiers avec simplicité", "Oversee sites with clarity", "الإشراف على الأوراش بوضوح"),
      text("Maîtriser les coûts et optimiser les dépenses", "Control costs and optimize spending", "التحكم في التكاليف وتحسين الإنفاق"),
      text("Assurer la conformité des marchés", "Maintain contract compliance", "ضمان الامتثال لمتطلبات الصفقات"),
    ],
  },
  "integraltech-finance": {
    heroSummary: text(
      "Centralisez comptabilité, flux financiers et opérations spécifiques dans une gestion claire et fiable.",
      "Centralize accounting, financial flows and specific operations in one clear, reliable workspace.",
      "وحّد المحاسبة والتدفقات المالية والعمليات الخاصة في مساحة واضحة وموثوقة.",
    ),
    capabilities: [
      {
        title: text("Module Finance", "Finance module", "وحدة المالية"),
        description: text(
          "Suivez budgets, flux financiers et indicateurs clés pour mieux décider.",
          "Monitor budgets, financial flows and key indicators for better decisions.",
          "تابع الميزانيات والتدفقات المالية والمؤشرات الرئيسية لاتخاذ قرارات أفضل.",
        ),
      },
      {
        title: text("Comptabilité générale", "General accounting", "المحاسبة العامة"),
        description: text(
          "Automatisez les écritures et assurez la conformité de vos comptes.",
          "Automate entries and maintain account compliance.",
          "أتمت القيود وحافظ على امتثال الحسابات.",
        ),
      },
      {
        title: text("Opérations diverses", "Specific operations", "العمليات المتنوعة"),
        description: text(
          "Gérez les écritures exceptionnelles et les opérations comptables spécifiques.",
          "Manage exceptional entries and specific accounting operations.",
          "أدر القيود الاستثنائية والعمليات المحاسبية الخاصة.",
        ),
      },
    ],
    benefits: [
      text("Automatiser les opérations financières", "Automate financial operations", "أتمتة العمليات المالية"),
      text("Obtenir une vue d’ensemble claire", "Gain a clear financial overview", "الحصول على رؤية مالية واضحة"),
      text("Adapter la solution à votre entreprise", "Adapt the solution to your organization", "تكييف الحل مع مؤسستك"),
    ],
  },
  "integraltech-finance-plus": {
    heroSummary: text(
      "Analysez coûts, budgets et rentabilité pour piloter vos décisions financières avec précision.",
      "Analyze costs, budgets and profitability to guide financial decisions with precision.",
      "حلّل التكاليف والميزانيات والربحية لتوجيه قراراتك المالية بدقة.",
    ),
    capabilities: [
      {
        title: text("Comptabilité analytique", "Analytical accounting", "المحاسبة التحليلية"),
        description: text(
          "Analysez les coûts par centre, projet ou activité pour mesurer la rentabilité.",
          "Analyze costs by center, project or activity to measure profitability.",
          "حلّل التكاليف حسب المركز أو المشروع أو النشاط لقياس الربحية.",
        ),
      },
      {
        title: text("Contrôle des coûts", "Cost control", "مراقبة التكاليف"),
        description: text(
          "Surveillez les dépenses et identifiez rapidement les écarts.",
          "Monitor spending and identify variances quickly.",
          "راقب المصاريف وحدد الانحرافات بسرعة.",
        ),
      },
      {
        title: text("Gestion budgétaire", "Budget management", "إدارة الميزانية"),
        description: text(
          "Créez, suivez et ajustez vos budgets avec précision.",
          "Create, monitor and adjust budgets precisely.",
          "أنشئ الميزانيات وتابعها وعدّلها بدقة.",
        ),
      },
    ],
    benefits: [
      text("Obtenir des analyses financières détaillées", "Access detailed financial analysis", "الحصول على تحليلات مالية مفصلة"),
      text("Maîtriser budgets et coûts", "Control budgets and costs", "التحكم في الميزانيات والتكاليف"),
      text("Anticiper la croissance avec des prévisions fiables", "Plan growth with reliable forecasts", "استباق النمو بتوقعات موثوقة"),
    ],
  },
  "integraltech-edu": {
    heroSummary: text(
      "Centralisez gestion académique, finances, évaluations et utilisateurs pour une école mieux connectée.",
      "Centralize academics, finance, assessments and users for a better-connected school.",
      "وحّد الإدارة الأكاديمية والمالية والتقييمات والمستخدمين لمدرسة أكثر ترابطاً.",
    ),
    capabilities: [
      {
        title: text("Gestion académique", "Academic management", "الإدارة الأكاديمية"),
        description: text(
          "Centralisez admissions, classes, matières, emplois du temps et présences.",
          "Centralize admissions, classes, subjects, schedules and attendance.",
          "وحّد التسجيلات والفصول والمواد والجداول والحضور.",
        ),
      },
      {
        title: text("Gestion financière", "Financial management", "الإدارة المالية"),
        description: text(
          "Automatisez la facturation, les paiements et le suivi comptable.",
          "Automate billing, payments and accounting monitoring.",
          "أتمت الفوترة والمدفوعات والمتابعة المحاسبية.",
        ),
      },
      {
        title: text("Examens et évaluations", "Exams and assessments", "الامتحانات والتقييمات"),
        description: text(
          "Planifiez les examens, saisissez les notes et générez les bulletins.",
          "Plan exams, record grades and generate report cards.",
          "خطط الامتحانات وسجل الدرجات وأنشئ كشوف النتائج.",
        ),
      },
      {
        title: text("Utilisateurs et personnel", "Users and staff", "المستخدمون والموظفون"),
        description: text(
          "Gérez les profils et autorisations des équipes, élèves et parents.",
          "Manage profiles and permissions for staff, students and parents.",
          "أدر الملفات والصلاحيات للموظفين والطلاب وأولياء الأمور.",
        ),
      },
    ],
    benefits: [
      text("Une interface intuitive pour tous", "An intuitive interface for every user", "واجهة سهلة لجميع المستخدمين"),
      text("Un gain de temps grâce à l’automatisation", "Save time through automation", "توفير الوقت عبر الأتمتة"),
      text("Une gestion centralisée pour mieux décider", "Centralized management for better decisions", "إدارة مركزية لاتخاذ قرارات أفضل"),
    ],
  },
} satisfies Record<IntegratedSolutionSlug, IntegratedSolutionDetail>;

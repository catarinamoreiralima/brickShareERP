import { type ChangeEvent, type FormEvent, useRef, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  FolderKanban,
  Home,
  LayoutDashboard,
  MessageSquarePlus,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Input } from "./components/ui/input";
import { Progress } from "./components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

type View =
  | "dashboard"
  | "projects"
  | "documents"
  | "monitoring"
  | "reports"
  | "users"
  | "settings";

type ProjectStatus =
  | "Em análise"
  | "Documentação"
  | "Aprovado"
  | "Captação"
  | "Monitoramento"
  | "Atrasado"
  | "Jurídico";

type DocumentStatus = "Pendente" | "Em análise" | "Aprovado" | "Rejeitado";

type Project = {
  id: number;
  name: string;
  company: string;
  category: string;
  requestedValue: number;
  status: ProjectStatus;
  owner: string;
  updatedAt: string;
  location: string;
  enterpriseType: string;
  stage: string;
  completion: number;
  nextInspection: string;
  lastWorkUpdate: string;
  approvalDays: number;
  raised: number;
};

type EvidenceImage = {
  title: string;
  category: string;
  date: string;
  status: string;
  src: string;
};

const workflow = [
  "Recebido",
  "Documentação",
  "Análise Financeira",
  "Jurídico",
  "Aprovado",
  "Captação",
  "Monitoramento",
];

const projects: Project[] = [
  {
    id: 1,
    name: "Residencial Aurora",
    company: "Aurora SPE Ltda.",
    category: "Residencial",
    requestedValue: 7200000,
    status: "Monitoramento",
    owner: "Marina Costa",
    updatedAt: "02/07/2026",
    location: "Campinas, SP",
    enterpriseType: "Condomínio vertical",
    stage: "Monitoramento",
    completion: 68,
    nextInspection: "18/07/2026",
    lastWorkUpdate: "29/06/2026",
    approvalDays: 21,
    raised: 6900000,
  },
  {
    id: 2,
    name: "Vista Jardins",
    company: "Jardins Urbanismo S.A.",
    category: "Misto",
    requestedValue: 11400000,
    status: "Captação",
    owner: "Rafael Lima",
    updatedAt: "01/07/2026",
    location: "Curitiba, PR",
    enterpriseType: "Uso misto",
    stage: "Captação",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 28,
    raised: 7600000,
  },
  {
    id: 3,
    name: "Hub Vila Madalena",
    company: "HMV Incorporadora",
    category: "Comercial",
    requestedValue: 5800000,
    status: "Jurídico",
    owner: "Bianca Nunes",
    updatedAt: "30/06/2026",
    location: "São Paulo, SP",
    enterpriseType: "Salas comerciais",
    stage: "Jurídico",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 16,
    raised: 0,
  },
  {
    id: 4,
    name: "Parque das Acácias",
    company: "Acácias Desenvolvimento",
    category: "Residencial",
    requestedValue: 9200000,
    status: "Atrasado",
    owner: "Marina Costa",
    updatedAt: "20/05/2026",
    location: "Goiânia, GO",
    enterpriseType: "Loteamento",
    stage: "Monitoramento",
    completion: 43,
    nextInspection: "08/07/2026",
    lastWorkUpdate: "19/05/2026",
    approvalDays: 34,
    raised: 9200000,
  },
  {
    id: 5,
    name: "Edifício Atlântico",
    company: "Atlântico Real Estate",
    category: "Residencial",
    requestedValue: 13600000,
    status: "Em análise",
    owner: "João Ferreira",
    updatedAt: "28/06/2026",
    location: "Niterói, RJ",
    enterpriseType: "Residencial alto padrão",
    stage: "Análise Financeira",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 12,
    raised: 0,
  },
  {
    id: 6,
    name: "Log Center Ribeirão",
    company: "RBR Logística",
    category: "Logístico",
    requestedValue: 18400000,
    status: "Aprovado",
    owner: "Camila Torres",
    updatedAt: "27/06/2026",
    location: "Ribeirão Preto, SP",
    enterpriseType: "Galpão logístico",
    stage: "Aprovado",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 19,
    raised: 0,
  },
  {
    id: 7,
    name: "Life Station Norte",
    company: "LSN Participações",
    category: "Misto",
    requestedValue: 8300000,
    status: "Monitoramento",
    owner: "Rafael Lima",
    updatedAt: "26/06/2026",
    location: "Brasília, DF",
    enterpriseType: "Retail + residencial",
    stage: "Monitoramento",
    completion: 81,
    nextInspection: "12/07/2026",
    lastWorkUpdate: "25/06/2026",
    approvalDays: 24,
    raised: 8300000,
  },
  {
    id: 8,
    name: "Reserva Ipê",
    company: "Ipê Urbanismo",
    category: "Residencial",
    requestedValue: 6100000,
    status: "Documentação",
    owner: "Bianca Nunes",
    updatedAt: "25/06/2026",
    location: "Sorocaba, SP",
    enterpriseType: "Casas em condomínio",
    stage: "Documentação",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 9,
    raised: 0,
  },
  {
    id: 9,
    name: "Mall Open Sul",
    company: "Open Mall Sul SPE",
    category: "Comercial",
    requestedValue: 9900000,
    status: "Captação",
    owner: "Camila Torres",
    updatedAt: "24/06/2026",
    location: "Porto Alegre, RS",
    enterpriseType: "Strip mall",
    stage: "Captação",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 31,
    raised: 4100000,
  },
  {
    id: 10,
    name: "Smart Living Recife",
    company: "SLR Incorporações",
    category: "Residencial",
    requestedValue: 7400000,
    status: "Em análise",
    owner: "João Ferreira",
    updatedAt: "23/06/2026",
    location: "Recife, PE",
    enterpriseType: "Studios residenciais",
    stage: "Análise Financeira",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 14,
    raised: 0,
  },
  {
    id: 11,
    name: "Green Offices",
    company: "Green Offices Ltda.",
    category: "Comercial",
    requestedValue: 12500000,
    status: "Aprovado",
    owner: "Marina Costa",
    updatedAt: "22/06/2026",
    location: "Belo Horizonte, MG",
    enterpriseType: "Corporate boutique",
    stage: "Aprovado",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 25,
    raised: 0,
  },
  {
    id: 12,
    name: "Solar da Serra",
    company: "Serra Norte SPE",
    category: "Residencial",
    requestedValue: 6700000,
    status: "Atrasado",
    owner: "Rafael Lima",
    updatedAt: "18/05/2026",
    location: "Gramado, RS",
    enterpriseType: "Apart-hotel",
    stage: "Monitoramento",
    completion: 57,
    nextInspection: "10/07/2026",
    lastWorkUpdate: "17/05/2026",
    approvalDays: 37,
    raised: 6700000,
  },
  {
    id: 13,
    name: "Vila Maré",
    company: "VM Desenvolvimento",
    category: "Residencial",
    requestedValue: 5300000,
    status: "Jurídico",
    owner: "Bianca Nunes",
    updatedAt: "20/06/2026",
    location: "Salvador, BA",
    enterpriseType: "Residencial compacto",
    stage: "Jurídico",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 17,
    raised: 0,
  },
  {
    id: 14,
    name: "Centro Médico Prime",
    company: "CMP Saúde Imobiliária",
    category: "Saúde",
    requestedValue: 16200000,
    status: "Captação",
    owner: "Camila Torres",
    updatedAt: "19/06/2026",
    location: "Florianópolis, SC",
    enterpriseType: "Clínicas modulares",
    stage: "Captação",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 29,
    raised: 9800000,
  },
  {
    id: 15,
    name: "Conecta Warehouse",
    company: "Conecta Galpões",
    category: "Logístico",
    requestedValue: 14800000,
    status: "Monitoramento",
    owner: "João Ferreira",
    updatedAt: "18/06/2026",
    location: "Extrema, MG",
    enterpriseType: "Condomínio logístico",
    stage: "Monitoramento",
    completion: 74,
    nextInspection: "16/07/2026",
    lastWorkUpdate: "17/06/2026",
    approvalDays: 23,
    raised: 14800000,
  },
  {
    id: 16,
    name: "Prime Studios",
    company: "Prime Studios SPE",
    category: "Residencial",
    requestedValue: 6900000,
    status: "Em análise",
    owner: "Marina Costa",
    updatedAt: "17/06/2026",
    location: "São Paulo, SP",
    enterpriseType: "Studios para locação",
    stage: "Análise Financeira",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 11,
    raised: 0,
  },
  {
    id: 17,
    name: "Praça das Artes",
    company: "PDA Incorporadora",
    category: "Misto",
    requestedValue: 10100000,
    status: "Aprovado",
    owner: "Rafael Lima",
    updatedAt: "16/06/2026",
    location: "Joinville, SC",
    enterpriseType: "Residencial + lojas",
    stage: "Aprovado",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 22,
    raised: 0,
  },
  {
    id: 18,
    name: "Distrito Tech",
    company: "Distrito Tech Real Estate",
    category: "Comercial",
    requestedValue: 17800000,
    status: "Monitoramento",
    owner: "Camila Torres",
    updatedAt: "15/06/2026",
    location: "São José dos Campos, SP",
    enterpriseType: "Campus corporativo",
    stage: "Monitoramento",
    completion: 52,
    nextInspection: "21/07/2026",
    lastWorkUpdate: "14/06/2026",
    approvalDays: 32,
    raised: 17800000,
  },
  {
    id: 19,
    name: "Morada Bela Vista",
    company: "Bela Vista Urbanismo",
    category: "Residencial",
    requestedValue: 4800000,
    status: "Atrasado",
    owner: "Bianca Nunes",
    updatedAt: "12/05/2026",
    location: "Londrina, PR",
    enterpriseType: "Minha casa média renda",
    stage: "Monitoramento",
    completion: 39,
    nextInspection: "11/07/2026",
    lastWorkUpdate: "11/05/2026",
    approvalDays: 35,
    raised: 4800000,
  },
  {
    id: 20,
    name: "Blue Coast Hotel",
    company: "Blue Coast Hospitality",
    category: "Hotelaria",
    requestedValue: 22100000,
    status: "Em análise",
    owner: "João Ferreira",
    updatedAt: "14/06/2026",
    location: "Fortaleza, CE",
    enterpriseType: "Hotel executivo",
    stage: "Documentação",
    completion: 0,
    nextInspection: "A definir",
    lastWorkUpdate: "Sem obra",
    approvalDays: 13,
    raised: 0,
  },
];

const documents = [
  { name: "Contrato social", category: "Societário", date: "12/06/2026", status: "Aprovado" },
  { name: "Matrícula do imóvel", category: "Imobiliário", date: "14/06/2026", status: "Em análise" },
  { name: "Alvará de construção", category: "Regulatório", date: "18/06/2026", status: "Pendente" },
  { name: "Demonstrações financeiras", category: "Financeiro", date: "20/06/2026", status: "Aprovado" },
  { name: "Laudo ambiental", category: "Técnico", date: "24/06/2026", status: "Rejeitado" },
  { name: "Cronograma físico-financeiro", category: "Obra", date: "28/06/2026", status: "Em análise" },
] as const;

const users = [
  { name: "Marina Costa", role: "Head de Operações", email: "marina.costa@brickshare.com", profile: "Administrador" },
  { name: "Rafael Lima", role: "Analista de Crédito", email: "rafael.lima@brickshare.com", profile: "Analista" },
  { name: "Bianca Nunes", role: "Jurídico Imobiliário", email: "bianca.nunes@brickshare.com", profile: "Analista" },
  { name: "Camila Torres", role: "Gestora de Projetos", email: "camila.torres@brickshare.com", profile: "Gestor" },
  { name: "João Ferreira", role: "Analista Financeiro", email: "joao.ferreira@brickshare.com", profile: "Analista" },
  { name: "Helena Martins", role: "Diretora de Risco", email: "helena.martins@brickshare.com", profile: "Administrador" },
];

const monitoringEvents = [
  { date: "29/06/2026", type: "Fotos da obra", note: "Concretagem do 8o pavimento concluída com evidências anexadas." },
  { date: "21/06/2026", type: "Relatório", note: "Execução dentro do orçamento previsto para a etapa estrutural." },
  { date: "10/06/2026", type: "Observação", note: "Fornecedor de esquadrias solicitou reprogramação de entrega." },
  { date: "28/05/2026", type: "Fotos da obra", note: "Registro de avanço em fundações e contenções." },
];

const projectEvidence: Record<
  number,
  {
    images: EvidenceImage[];
  }
> = {
  1: {
    images: [
      {
        title: "Fachada em andamento",
        category: "Fachada",
        date: "29/06/2026",
        status: "Validada",
        src: "/mock/residencial-aurora/fachada.png",
      },
      {
        title: "Estrutura dos pavimentos",
        category: "Estrutura",
        date: "29/06/2026",
        status: "Validada",
        src: "/mock/residencial-aurora/estrutura.jpg",
      },
      {
        title: "Áreas comuns",
        category: "Áreas comuns",
        date: "21/06/2026",
        status: "Pendente de revisão",
        src: "/mock/residencial-aurora/areas-comuns.jpeg",
      },
      {
        title: "Canteiro de obras",
        category: "Canteiro",
        date: "10/06/2026",
        status: "Validada",
        src: "/mock/residencial-aurora/canteiro.png",
      },
      {
        title: "Vistoria técnica",
        category: "Vistoria",
        date: "28/05/2026",
        status: "Validada",
        src: "/mock/residencial-aurora/vistoria.png",
      },
    ],
  },
};

const captureEvolution = [
  { month: "Jan", value: 18 },
  { month: "Fev", value: 22 },
  { month: "Mar", value: 31 },
  { month: "Abr", value: 28 },
  { month: "Mai", value: 42 },
  { month: "Jun", value: 54 },
  { month: "Jul", value: 49 },
];

const approvalEvolution = [
  { month: "Jan", aprovados: 3 },
  { month: "Fev", aprovados: 4 },
  { month: "Mar", aprovados: 5 },
  { month: "Abr", aprovados: 4 },
  { month: "Mai", aprovados: 7 },
  { month: "Jun", aprovados: 6 },
];

const constructionProgress = [
  { month: "Fev", realizado: 8, estimado: 10 },
  { month: "Mar", realizado: 21, estimado: 24 },
  { month: "Abr", realizado: 36, estimado: 38 },
  { month: "Mai", realizado: 51, estimado: 52 },
  { month: "Jun", realizado: 68, estimado: 66 },
  { month: "Jul", realizado: 74, estimado: 78 },
];

const navItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "projects" as const, label: "Projetos", icon: FolderKanban },
  { id: "documents" as const, label: "Documentos", icon: FileText },
  { id: "monitoring" as const, label: "Monitoramento", icon: Building2 },
  { id: "reports" as const, label: "Relatórios", icon: BarChart3 },
  { id: "users" as const, label: "Usuários", icon: Users },
  { id: "settings" as const, label: "Configurações", icon: Settings },
];

const statusColors: Record<string, string> = {
  "Em análise": "bg-blue-50 text-blue-700 border-blue-200",
  Aprovado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Captação: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Monitoramento: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Atrasado: "bg-red-50 text-red-700 border-red-200",
  Jurídico: "bg-amber-50 text-amber-700 border-amber-200",
  Documentação: "bg-slate-50 text-slate-700 border-slate-200",
  Pendente: "bg-amber-50 text-amber-700 border-amber-200",
  Rejeitado: "bg-red-50 text-red-700 border-red-200",
  "Em atenção": "bg-amber-50 text-amber-700 border-amber-200",
  "No prazo": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Validada: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pendente de revisão": "bg-amber-50 text-amber-700 border-amber-200",
};

const chartColors = ["#2563eb", "#14b8a6", "#f59e0b", "#ef4444", "#6366f1", "#64748b"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function getEstimatedProgress(project: Project) {
  const baseEstimateByStage: Record<string, number> = {
    Recebido: 0,
    Documentação: 0,
    "Análise Financeira": 0,
    Jurídico: 0,
    Aprovado: 0,
    Captação: 8,
    Monitoramento: 0,
  };

  const estimated =
    project.status === "Atrasado"
      ? Math.min(project.completion + 18, 100)
      : project.stage === "Monitoramento"
        ? Math.min(project.completion + 7, 100)
        : baseEstimateByStage[project.stage] || project.completion;
  const variance = project.completion - estimated;
  const status = variance < -10 ? "Atrasado" : variance < 0 ? "Em atenção" : "No prazo";
  const forecast =
    project.completion === 0
      ? "A definir"
      : project.status === "Atrasado"
        ? "Dez/2026"
        : project.completion >= 75
          ? "Set/2026"
          : "Nov/2026";

  return { estimated, variance, status, forecast };
}

function getCaptureProgress(project: Project) {
  const capturedPercent = project.requestedValue === 0 ? 0 : Math.round((project.raised / project.requestedValue) * 100);
  const remainingValue = Math.max(0, project.requestedValue - project.raised);
  const remainingPercent = Math.max(0, 100 - capturedPercent);
  const status = capturedPercent >= 100 ? "No prazo" : capturedPercent >= 60 ? "Em atenção" : "Em análise";
  const forecast = capturedPercent >= 100 ? "Concluída" : project.status === "Captação" ? "Ago/2026" : "Aguardando aprovação";

  return { capturedPercent, remainingPercent, remainingValue, status, forecast };
}

function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={statusColors[status] || "bg-slate-50 text-slate-700 border-slate-200"}>
      {status}
    </Badge>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: string;
  icon: typeof LayoutDashboard;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-md bg-blue-50 text-blue-700">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
    </button>
  );
}

function App() {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [uploadedEvidence, setUploadedEvidence] = useState<Record<number, EvidenceImage[]>>({});
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [ownerFilter, setOwnerFilter] = useState("Todos");

  const categories = useMemo(() => Array.from(new Set(projectList.map((project) => project.category))), [projectList]);
  const owners = useMemo(() => Array.from(new Set(projectList.map((project) => project.owner))), [projectList]);
  const projectStatuses = useMemo(() => Array.from(new Set(projectList.map((project) => project.status))), [projectList]);

  const filteredProjects = useMemo(() => {
    return projectList.filter((project) => {
      const matchesQuery = `${project.name} ${project.company} ${project.location}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "Todos" || project.status === statusFilter;
      const matchesCategory = categoryFilter === "Todas" || project.category === categoryFilter;
      const matchesOwner = ownerFilter === "Todos" || project.owner === ownerFilter;
      return matchesQuery && matchesStatus && matchesCategory && matchesOwner;
    });
  }, [categoryFilter, ownerFilter, projectList, query, statusFilter]);

  const statusData = useMemo(
    () =>
      Object.entries(countBy(projectList.map((project) => project.status))).map(([name, value]) => ({
        name,
        value,
      })),
    [projectList],
  );

  const categoryData = useMemo(
    () =>
      Object.entries(countBy(projectList.map((project) => project.category))).map(([name, value]) => ({
        name,
        value,
      })),
    [projectList],
  );

  const avgApproval = Math.round(projectList.reduce((sum, project) => sum + project.approvalDays, 0) / projectList.length);
  const pendingDocuments = documents.filter((document) => document.status === "Pendente").length;

  function openProject(project: Project, view: View = "projects") {
    setSelectedProject(project);
    setActiveView(view);
  }

  function openProjectsWithFilters(filters: { status?: string; category?: string } = {}) {
    setQuery("");
    setStatusFilter(filters.status ?? "Todos");
    setCategoryFilter(filters.category ?? "Todas");
    setOwnerFilter("Todos");
    setActiveView("projects");
  }

  function createProject(project: Omit<Project, "id">) {
    const newProject = {
      ...project,
      id: Math.max(...projectList.map((item) => item.id)) + 1,
    };

    setProjectList((currentProjects) => [newProject, ...currentProjects]);
    setSelectedProject(newProject);
    setQuery("");
    setStatusFilter("Todos");
    setCategoryFilter("Todas");
    setOwnerFilter("Todos");
  }

  function uploadEvidence(projectId: number, file: File, title: string) {
    const image: EvidenceImage = {
      title: title.trim() || file.name.replace(/\.[^/.]+$/, "") || "Nova evidência",
      category: "Atualização",
      date: "03/07/2026",
      status: "Pendente de revisão",
      src: URL.createObjectURL(file),
    };

    setUploadedEvidence((currentEvidence) => ({
      ...currentEvidence,
      [projectId]: [image, ...(currentEvidence[projectId] || [])],
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="font-semibold">BrickShare ERP</div>
            <div className="text-xs text-slate-500">Crowdfunding imobiliário</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition ${
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-sm font-medium">Fila jurídica</div>
            <div className="mt-1 text-xs text-slate-500">3 projetos aguardando parecer</div>
            <Progress value={62} className="mt-3 h-1.5" />
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Home className="size-3.5" />
                <ChevronRight className="size-3.5" />
                <span>{navItems.find((item) => item.id === activeView)?.label}</span>
              </div>
              <h1 className="truncate text-lg font-semibold text-slate-950">
                {activeView === "projects" ? "Gestão de Projetos" : navItems.find((item) => item.id === activeView)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" aria-label="Alertas">
                <Bell className="size-4" />
              </Button>
              <div className="hidden items-center gap-3 rounded-md border bg-white px-3 py-2 md:flex">
                <div className="size-7 rounded-full bg-blue-100" />
                <div>
                  <div className="text-xs font-medium">Catarina Lima</div>
                  <div className="text-[11px] text-slate-500">Administrador</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView(item.id)}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </header>

        <div className="p-5 lg:p-8">
          {activeView === "dashboard" && (
            <Dashboard
              avgApproval={avgApproval}
              projects={projectList}
              statusData={statusData}
              onOpenProjects={(status) => {
                openProjectsWithFilters({ status });
              }}
            />
          )}
          {activeView === "projects" && (
            <ProjectsView
              categories={categories}
              filteredProjects={filteredProjects}
              owners={owners}
              projectStatuses={projectStatuses}
              query={query}
              setCategoryFilter={setCategoryFilter}
              setOwnerFilter={setOwnerFilter}
              setQuery={setQuery}
              setStatusFilter={setStatusFilter}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              ownerFilter={ownerFilter}
              openProject={openProject}
              onCreateProject={createProject}
              selectedProject={selectedProject}
            />
          )}
          {activeView === "documents" && <DocumentsView selectedProject={selectedProject} pendingDocuments={pendingDocuments} />}
          {activeView === "monitoring" && (
            <MonitoringView
              selectedProject={selectedProject}
              uploadedEvidence={uploadedEvidence[selectedProject.id] || []}
              onUploadEvidence={uploadEvidence}
            />
          )}
          {activeView === "reports" && (
            <ReportsView
              avgApproval={avgApproval}
              categoryData={categoryData}
              pendingDocuments={pendingDocuments}
              projects={projectList}
              statusData={statusData}
              onOpenAllProjects={() => openProjectsWithFilters()}
              onOpenCategory={(category) => openProjectsWithFilters({ category })}
              onOpenStatus={(status) => openProjectsWithFilters({ status })}
            />
          )}
          {activeView === "users" && <UsersView />}
          {activeView === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

function Dashboard({
  avgApproval,
  projects,
  statusData,
  onOpenProjects,
}: {
  avgApproval: number;
  projects: Project[];
  statusData: { name: string; value: number }[];
  onOpenProjects: (status: string) => void;
}) {
  const inAnalysis = projects.filter((project) => project.status === "Em análise").length;
  const approved = projects.filter((project) => project.status === "Aprovado").length;
  const monitoring = projects.filter((project) => project.status === "Monitoramento").length;
  const delayed = projects.filter((project) => project.status === "Atrasado").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MiniMetric label="Projetos em análise" value={String(inAnalysis)} icon={Clock3} onClick={() => onOpenProjects("Em análise")} />
        <MiniMetric label="Projetos aprovados" value={String(approved)} icon={CheckCircle2} onClick={() => onOpenProjects("Aprovado")} />
        <MiniMetric label="Obras em andamento" value={String(monitoring)} icon={Building2} onClick={() => onOpenProjects("Monitoramento")} />
        <MiniMetric label="Projetos com atraso" value={String(delayed)} icon={AlertTriangle} onClick={() => onOpenProjects("Atrasado")} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-lg xl:col-span-1">
          <CardHeader>
            <CardTitle>Projetos por status</CardTitle>
            <CardDescription>Distribuição da carteira operacional</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} projeto(s)`, "Total"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Tempo médio de aprovação</CardTitle>
            <CardDescription>Meta interna: até 25 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className="text-5xl font-semibold text-slate-950">{avgApproval}</div>
              <div className="pb-2 text-sm text-slate-500">dias corridos</div>
            </div>
            <Progress value={Math.min((avgApproval / 35) * 100, 100)} className="mt-6" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <div className="text-slate-500">Financeiro</div>
                <div className="font-medium">8 dias</div>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <div className="text-slate-500">Jurídico</div>
                <div className="font-medium">10 dias</div>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <div className="text-slate-500">Comitê</div>
                <div className="font-medium">5 dias</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Evolução das captações</CardTitle>
            <CardDescription>Volume mensal em milhões de reais</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={captureEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Alertas operacionais</CardTitle>
          <CardDescription>Pendências que precisam de atenção dos analistas</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {[
            ["Documento vencendo", "Alvará de construção vence em 7 dias", "Documentos"],
            ["Obra sem atualização há mais de 30 dias", "Parque das Acácias está sem evidências recentes", "Monitoramento"],
            ["Projeto aguardando aprovação jurídica", "Hub Vila Madalena depende de parecer final", "Jurídico"],
          ].map(([title, description, area]) => (
            <button key={title} type="button" className="rounded-lg border bg-white p-4 text-left transition hover:border-blue-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="mt-1 text-sm text-slate-500">{description}</div>
                </div>
                <Badge variant="outline">{area}</Badge>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectsView({
  categories,
  filteredProjects,
  owners,
  projectStatuses,
  query,
  setCategoryFilter,
  setOwnerFilter,
  setQuery,
  setStatusFilter,
  statusFilter,
  categoryFilter,
  ownerFilter,
  openProject,
  onCreateProject,
  selectedProject,
}: {
  categories: string[];
  filteredProjects: Project[];
  owners: string[];
  projectStatuses: string[];
  query: string;
  setCategoryFilter: (value: string) => void;
  setOwnerFilter: (value: string) => void;
  setQuery: (value: string) => void;
  setStatusFilter: (value: string) => void;
  statusFilter: string;
  categoryFilter: string;
  ownerFilter: string;
  openProject: (project: Project, view?: View) => void;
  onCreateProject: (project: Omit<Project, "id">) => void;
  selectedProject: Project;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.65fr)]">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold">Lista de projetos</h2>
              <p className="text-sm text-slate-500">{filteredProjects.length} projetos encontrados na carteira</p>
            </div>
            <NewProjectDialog categories={categories} owners={owners} onCreateProject={onCreateProject} />
          </div>

          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar projeto, empresa ou cidade" className="pl-9" />
            </div>
            <FilterSelect value={statusFilter} onValueChange={setStatusFilter} placeholder="Status" items={["Todos", ...projectStatuses]} />
            <FilterSelect value={categoryFilter} onValueChange={setCategoryFilter} placeholder="Categoria" items={["Todas", ...categories]} />
            <FilterSelect value={ownerFilter} onValueChange={setOwnerFilter} placeholder="Responsável" items={["Todos", ...owners]} />
          </div>
        </div>

        <Card className="rounded-lg">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Nome do projeto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor solicitado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Última atualização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className={`cursor-pointer ${selectedProject.id === project.id ? "bg-blue-50/70 hover:bg-blue-50" : ""}`}
                    onClick={() => openProject(project)}
                  >
                    <TableCell className="pl-4 font-medium">{project.name}</TableCell>
                    <TableCell>{project.company}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{formatCurrency(project.requestedValue)}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell>{project.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <ProjectDetails project={selectedProject} onOpenMonitoring={() => openProject(selectedProject, "monitoring")} />
    </div>
  );
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  items,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  items: string[];
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <Filter className="size-4 text-slate-400" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function NewProjectDialog({
  categories,
  owners,
  onCreateProject,
}: {
  categories: string[];
  owners: string[];
  onCreateProject: (project: Omit<Project, "id">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState(categories[0] || "Residencial");
  const [requestedValue, setRequestedValue] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Em análise");
  const [owner, setOwner] = useState(owners[0] || "Marina Costa");
  const [location, setLocation] = useState("");
  const [enterpriseType, setEnterpriseType] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedValue = Number(requestedValue.replace(/\D/g, ""));

    onCreateProject({
      name,
      company,
      category,
      requestedValue: parsedValue || 0,
      status,
      owner,
      updatedAt: "02/07/2026",
      location,
      enterpriseType,
      stage: status === "Documentação" ? "Documentação" : status === "Jurídico" ? "Jurídico" : status === "Aprovado" ? "Aprovado" : status === "Captação" ? "Captação" : status === "Monitoramento" || status === "Atrasado" ? "Monitoramento" : "Análise Financeira",
      completion: status === "Monitoramento" || status === "Atrasado" ? 18 : 0,
      nextInspection: status === "Monitoramento" || status === "Atrasado" ? "30/07/2026" : "A definir",
      lastWorkUpdate: status === "Monitoramento" || status === "Atrasado" ? "02/07/2026" : "Sem obra",
      approvalDays: 1,
      raised: 0,
    });

    setName("");
    setCompany("");
    setRequestedValue("");
    setLocation("");
    setEnterpriseType("");
    setStatus("Em análise");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Novo Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>Cadastre um projeto mockado para análise no ERP.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm">Nome do projeto</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Ex: Residencial Horizonte" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Empresa</label>
              <Input value={company} onChange={(event) => setCompany(event.target.value)} required placeholder="Ex: Horizonte SPE Ltda." />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Categoria</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set([...categories, "Residencial", "Comercial", "Misto", "Logístico"])).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Valor solicitado</label>
              <Input value={requestedValue} onChange={(event) => setRequestedValue(event.target.value)} required placeholder="Ex: 8500000" inputMode="numeric" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Status</label>
              <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Em análise", "Documentação", "Jurídico", "Aprovado", "Captação", "Monitoramento", "Atrasado"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Responsável</label>
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Localização</label>
              <Input value={location} onChange={(event) => setLocation(event.target.value)} required placeholder="Ex: São Paulo, SP" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Tipo do empreendimento</label>
              <Input value={enterpriseType} onChange={(event) => setEnterpriseType(event.target.value)} required placeholder="Ex: Condomínio vertical" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Plus className="size-4" />
              Criar projeto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProjectDetails({ project, onOpenMonitoring }: { project: Project; onOpenMonitoring: () => void }) {
  const currentIndex = workflow.indexOf(project.stage);

  return (
    <aside className="space-y-4">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Valor" value={formatCurrency(project.requestedValue)} />
            <Info label="Localização" value={project.location} />
            <Info label="Tipo do empreendimento" value={project.enterpriseType} />
            <Info label="Responsável" value={project.owner} />
          </div>

          <div>
            <div className="mb-3 text-sm font-medium">Workflow</div>
            <div className="space-y-3">
              {workflow.map((step, index) => {
                const done = index < currentIndex;
                const current = index === currentIndex;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex size-7 items-center justify-center rounded-full border text-xs ${
                        current
                          ? "border-blue-700 bg-blue-700 text-white"
                          : done
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {done ? <CheckCircle2 className="size-4" /> : index + 1}
                    </div>
                    <div className={current ? "font-medium text-blue-700" : "text-sm text-slate-600"}>{step}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button className="w-full" onClick={onOpenMonitoring}>
            <Building2 className="size-4" />
            Ver monitoramento
          </Button>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button size="sm">
              <CheckCircle2 className="size-4" />
              Aprovar etapa
            </Button>
            <Button size="sm" variant="outline">
              <AlertTriangle className="size-4" />
              Solicitar ajustes
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquarePlus className="size-4" />
              Comentário
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}

function DocumentsView({ selectedProject, pendingDocuments }: { selectedProject: Project; pendingDocuments: number }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Gestão de documentos</h2>
          <p className="text-sm text-slate-500">Projeto selecionado: {selectedProject.name}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            {pendingDocuments} pendência
          </Badge>
          <Button>
            <Upload className="size-4" />
            Upload
          </Button>
        </div>
      </div>

      <Card className="rounded-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data de envio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.name}>
                  <TableCell className="pl-4 font-medium">{document.name}</TableCell>
                  <TableCell>{document.category}</TableCell>
                  <TableCell>{document.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={document.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="size-4" />
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MonitoringView({
  selectedProject,
  uploadedEvidence,
  onUploadEvidence,
}: {
  selectedProject: Project;
  uploadedEvidence: EvidenceImage[];
  onUploadEvidence: (projectId: number, file: File, title: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingTitle, setPendingTitle] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const hasConstructionStarted = selectedProject.status === "Monitoramento" || selectedProject.status === "Atrasado";
  const showCaptureProgress = !hasConstructionStarted;
  const estimatedProgress = getEstimatedProgress(selectedProject);
  const captureProgress = getCaptureProgress(selectedProject);
  const evidence = [...uploadedEvidence, ...(projectEvidence[selectedProject.id]?.images || [])];
  const progressChart = showCaptureProgress
    ? captureEvolution.map((point) => ({
        month: point.month,
        captado: Math.min(selectedProject.raised, Math.round((point.value / 54) * selectedProject.raised)),
        meta: Math.min(selectedProject.requestedValue, Math.round((point.value / 54) * selectedProject.requestedValue)),
      }))
    : constructionProgress.map((point) => ({
        ...point,
        realizado:
          selectedProject.completion === 0
            ? 0
            : Math.max(0, Math.round(point.realizado * (selectedProject.completion / 74))),
        estimado:
          estimatedProgress.estimated === 0
            ? 0
            : Math.max(0, Math.round(point.estimado * (estimatedProgress.estimated / 78))),
      }));

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setPendingFile(file);
    setPendingTitle(file.name.replace(/\.[^/.]+$/, ""));
    setIsUploadDialogOpen(true);
    event.target.value = "";
  }

  function handleConfirmUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pendingFile) return;

    onUploadEvidence(selectedProject.id, pendingFile, pendingTitle);
    setPendingFile(null);
    setPendingTitle("");
    setIsUploadDialogOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Monitoramento da obra</h2>
          <p className="text-sm text-slate-500">{selectedProject.name} - {selectedProject.location}</p>
        </div>
        {!showCaptureProgress && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Plus className="size-4" />
              Adicionar atualização
            </Button>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nomear atualização</DialogTitle>
                  <DialogDescription>
                    Defina como essa imagem aparecerá nas evidências da obra.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleConfirmUpload}>
                  <div className="space-y-2">
                    <label className="text-sm">Nome da atualização</label>
                    <Input
                      value={pendingTitle}
                      onChange={(event) => setPendingTitle(event.target.value)}
                      placeholder="Ex: Vistoria da fachada - Julho"
                      autoFocus
                    />
                  </div>
                  {pendingFile && (
                    <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">
                      Arquivo selecionado: <span className="font-medium text-slate-700">{pendingFile.name}</span>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPendingFile(null);
                        setPendingTitle("");
                        setIsUploadDialogOpen(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Adicionar</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>{showCaptureProgress ? "Valor captado" : "Percentual concluído"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{showCaptureProgress ? formatCurrency(selectedProject.raised) : `${selectedProject.completion}%`}</div>
            <Progress value={showCaptureProgress ? captureProgress.capturedPercent : selectedProject.completion} className="mt-4" />
            {showCaptureProgress && <div className="mt-2 text-xs text-slate-500">{captureProgress.capturedPercent}% da meta captado</div>}
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>{showCaptureProgress ? "Meta de captação" : "Progresso estimado"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{showCaptureProgress ? formatCurrency(selectedProject.requestedValue) : `${estimatedProgress.estimated}%`}</div>
            <Progress value={showCaptureProgress ? 100 : estimatedProgress.estimated} className="mt-4 bg-slate-200" />
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>{showCaptureProgress ? "Falta captar" : "Desvio do cronograma"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={showCaptureProgress ? "text-4xl font-semibold text-blue-700" : estimatedProgress.variance < 0 ? "text-4xl font-semibold text-red-600" : "text-4xl font-semibold text-emerald-600"}>
              {showCaptureProgress ? formatCurrency(captureProgress.remainingValue) : `${estimatedProgress.variance > 0 ? "+" : ""}${estimatedProgress.variance} p.p.`}
            </div>
            <StatusBadge status={showCaptureProgress ? captureProgress.status : estimatedProgress.status} />
            {showCaptureProgress && <div className="mt-2 text-xs text-slate-500">{captureProgress.remainingPercent}% restante</div>}
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>{showCaptureProgress ? "Encerramento previsto" : "Conclusão estimada"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <CalendarDays className="size-5 text-blue-700" />
            <span className="font-medium">{showCaptureProgress ? captureProgress.forecast : estimatedProgress.forecast}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Última atualização</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <CalendarDays className="size-5 text-blue-700" />
            <span className="font-medium">{selectedProject.lastWorkUpdate}</span>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Próxima vistoria</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <ClipboardCheck className="size-5 text-blue-700" />
            <span className="font-medium">{selectedProject.nextInspection}</span>
          </CardContent>
        </Card>
      </div>

      {hasConstructionStarted && (
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Evidências da obra</CardTitle>
            <CardDescription>
              {evidence.length > 0
                ? "Imagens do projeto selecionado"
                : "Nenhuma imagem cadastrada para este projeto"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evidence.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {evidence.map((image) => (
                  <Dialog key={image.src}>
                    <DialogTrigger asChild>
                      <button type="button" className="overflow-hidden rounded-lg border bg-white text-left transition hover:border-blue-300 hover:shadow-sm">
                        <div className="aspect-[4/3] bg-slate-100">
                          <ImageWithFallback src={image.src} alt={image.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-2 p-3">
                          <div className="font-medium">{image.title}</div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{image.category}</Badge>
                            <StatusBadge status={image.status} />
                          </div>
                          <div className="text-xs text-slate-500">{image.date}</div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl">
                      <DialogHeader>
                        <DialogTitle>{image.title}</DialogTitle>
                        <DialogDescription>
                          {image.category} - {image.date} - {image.status}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-hidden rounded-lg border bg-slate-100">
                        <ImageWithFallback src={image.src} alt={image.title} className="max-h-[70vh] w-full object-contain" />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed bg-slate-50 p-6 text-sm text-slate-500">
                Para exibir imagens aqui, cadastre evidências em <span className="font-medium text-slate-700">projectEvidence</span> e coloque os arquivos em <span className="font-medium text-slate-700">public/mock/</span>.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>{showCaptureProgress ? "Progresso da captação" : "Progresso da construção"}</CardTitle>
            <CardDescription>{showCaptureProgress ? "Comparativo entre valor captado e meta" : "Comparativo entre avanço realizado e estimado"}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => (showCaptureProgress ? `R$ ${Math.round(Number(value) / 1000000)} mi` : String(value))} />
                <Tooltip />
                {showCaptureProgress ? (
                  <>
                    <Line type="monotone" dataKey="captado" name="Captado" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="meta" name="Meta" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4 }} />
                  </>
                ) : (
                  <>
                    <Line type="monotone" dataKey="realizado" name="Realizado" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="estimado" name="Estimado" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4 }} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {hasConstructionStarted ? (
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Linha do tempo</CardTitle>
              <CardDescription>Fotos, relatórios, observações e datas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {monitoringEvents.map((event) => (
                <div key={`${event.date}-${event.type}`} className="flex gap-3 rounded-lg border p-4">
                  <div className="mt-1 flex size-9 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{event.type}</span>
                      <Badge variant="outline">{event.date}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{event.note}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Linha do tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed bg-slate-50 p-6 text-sm text-slate-500">
                A obra ainda não foi iniciada para este projeto.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ReportsView({
  avgApproval,
  categoryData,
  onOpenAllProjects,
  onOpenCategory,
  onOpenStatus,
  pendingDocuments,
  projects,
  statusData,
}: {
  avgApproval: number;
  categoryData: { name: string; value: number }[];
  onOpenAllProjects: () => void;
  onOpenCategory: (category: string) => void;
  onOpenStatus: (status: string) => void;
  pendingDocuments: number;
  projects: Project[];
  statusData: { name: string; value: number }[];
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Relatórios</h2>
          <p className="text-sm text-slate-500">Período analisado: janeiro a julho de 2026</p>
        </div>
        <div className="flex gap-2">
          <FilterSelect value="Últimos 6 meses" onValueChange={() => undefined} placeholder="Período" items={["Últimos 6 meses", "Este trimestre", "Este mês"]} />
          <Button>
            <Download className="size-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MiniMetric label="Tempo médio de análise" value={`${avgApproval} dias`} icon={Clock3} />
        <MiniMetric label="Projetos ativos" value={String(projects.length)} icon={FolderKanban} onClick={onOpenAllProjects} />
        <MiniMetric label="Projetos atrasados" value={String(projects.filter((project) => project.status === "Atrasado").length)} icon={AlertTriangle} onClick={() => onOpenStatus("Atrasado")} />
        <MiniMetric label="Documentos pendentes" value={String(pendingDocuments)} icon={FileText} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ReportChart title="Projetos por categoria" data={categoryData} onBarClick={onOpenCategory} />
        <ReportChart title="Projetos por status" data={statusData} onBarClick={onOpenStatus} />
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Evolução mensal de aprovações</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={approvalEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="aprovados" stroke="#14b8a6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportChart({
  title,
  data,
  onBarClick,
}: {
  title: string;
  data: { name: string; value: number }[];
  onBarClick?: (name: string) => void;
}) {
  function handleBarClick(entry: unknown) {
    const name = (entry as { payload?: { name?: string } }).payload?.name;

    if (name) {
      onBarClick?.(name);
    }
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-22} textAnchor="end" height={70} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              className={onBarClick ? "cursor-pointer" : undefined}
              onClick={handleBarClick}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function UsersView() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Usuários</h2>
          <p className="text-sm text-slate-500">Perfis de acesso para operação diária</p>
        </div>
        <Button>
          <Plus className="size-4" />
          Adicionar usuário
        </Button>
      </div>

      <Card className="rounded-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="pl-4 font-medium">{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.profile === "Administrador" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-700"}>
                      {user.profile}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                    <Button variant="ghost" size="sm">Desativar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsView() {
  const settingsCards = [
    ["Fluxos de aprovação", "Defina responsáveis, SLA e regras por categoria de projeto.", ShieldCheck],
    ["Notificações", "Configure alertas de documentos, obras e etapas jurídicas.", Bell],
    ["Preferências do workspace", "Ajuste identidade, permissões e integrações do ERP.", Settings],
  ] as const;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {settingsCards.map(([title, description, IconComponent]) => {
        return (
          <Card key={String(title)} className="rounded-lg">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <IconComponent className="size-5" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <MoreHorizontal className="size-4" />
                Gerenciar
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default App;

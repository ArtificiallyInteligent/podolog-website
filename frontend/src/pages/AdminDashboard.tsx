import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Layers,
  List,
  Menu,
  PenLine,
  Plus,
  RefreshCcw,
  Settings,
  Tag,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

interface ServiceCategory {
  id: number;
  name: string;
  description?: string | null;
}

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  category_id: number;
  category?: ServiceCategory | null;
  created_at?: string;
  updated_at?: string;
}

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  appointment_date: string;
  message?: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at?: string;
}

interface AdminSummary {
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    upcoming: number;
    today: number;
  };
  services: {
    total: number;
    active: number;
    averagePrice: number;
  };
  financials: {
    potentialRevenue: number;
  };
}

type ServiceFormState = {
  name: string;
  description: string;
  price: string;
  durationMinutes: string;
  categoryId: string;
  isActive: boolean;
};

type CategoryFormState = {
  name: string;
  description: string;
};

const initialServiceForm: ServiceFormState = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "60",
  categoryId: "",
  isActive: true,
};

const initialCategoryForm: CategoryFormState = {
  name: "",
  description: "",
};

const statusLabels: Record<Appointment["status"], string> = {
  pending: "W oczekiwaniu",
  confirmed: "Potwierdzona",
  cancelled: "Anulowana",
};

const statusChipClasses: Record<Appointment["status"], string> = {
  pending: "bg-amber-200/80 text-amber-800",
  confirmed: "bg-emerald-200/90 text-emerald-900",
  cancelled: "bg-rose-200/80 text-rose-900",
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2,
});

const AdminDashboard: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(initialServiceForm);
  const [categoryForm, setCategoryForm] =
    useState<CategoryFormState>(initialCategoryForm);
  const [editedServiceId, setEditedServiceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingService, setIsSavingService] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | Appointment["status"]
  >("all");
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    const response = await fetch("/api/services");
    if (!response.ok) {
      throw new Error("Nie udało się pobrać listy usług");
    }
    const data: Service[] = await response.json();
    setServices(data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const response = await fetch("/api/service-categories");
    if (!response.ok) {
      throw new Error("Nie udało się pobrać kategorii usług");
    }
    const data: ServiceCategory[] = await response.json();
    setCategories(data);
  }, []);

  const fetchAppointments = useCallback(async () => {
    const response = await fetch("/api/appointments");
    if (!response.ok) {
      throw new Error("Nie udało się pobrać rezerwacji");
    }
    const data: Appointment[] = await response.json();
    setAppointments(data);
  }, []);

  const fetchSummary = useCallback(async () => {
    const response = await fetch("/api/admin/summary");
    if (!response.ok) {
      throw new Error("Nie udało się pobrać danych podsumowania");
    }
    const data: AdminSummary = await response.json();
    setSummary(data);
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      await Promise.all([
        fetchServices(),
        fetchCategories(),
        fetchAppointments(),
        fetchSummary(),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił nieoczekiwany błąd podczas pobierania danych");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments, fetchCategories, fetchServices, fetchSummary]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const handleServiceFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setServiceForm((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
      return;
    }

    setServiceForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const resetServiceForm = () => {
    setServiceForm(initialServiceForm);
    setEditedServiceId(null);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceForm.name || !serviceForm.categoryId) {
      setApiError("Uzupełnij nazwę usługi oraz wybierz kategorię");
      return;
    }

    setIsSavingService(true);
    setApiError(null);

    const payload = {
      name: serviceForm.name,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price || "0"),
      duration_minutes: parseInt(serviceForm.durationMinutes || "0", 10),
      category_id: Number(serviceForm.categoryId),
      is_active: serviceForm.isActive,
    };

    try {
      const url = editedServiceId
        ? `/api/services/${editedServiceId}`
        : "/api/services";
      const method = editedServiceId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Nie udało się zapisać usługi");
      }

      resetServiceForm();
      await Promise.all([fetchServices(), fetchSummary()]);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił błąd podczas zapisu usługi");
      }
    } finally {
      setIsSavingService(false);
    }
  };

  const handleServiceEdit = (service: Service) => {
    setEditedServiceId(service.id);
    setServiceForm({
      name: service.name,
      description: service.description ?? "",
      price:
        service.price !== null && service.price !== undefined
          ? String(Number(service.price).toFixed(2))
          : "",
      durationMinutes:
        service.duration_minutes !== null &&
        service.duration_minutes !== undefined
          ? String(service.duration_minutes)
          : "60",
      categoryId: String(service.category_id),
      isActive: service.is_active,
    });
  };

  const handleServiceDelete = async (serviceId: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę usługę?")) {
      return;
    }

    setApiError(null);

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Nie udało się usunąć usługi");
      }
      await Promise.all([fetchServices(), fetchSummary()]);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił błąd podczas usuwania usługi");
      }
    }
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      setApiError("Nazwa kategorii jest wymagana");
      return;
    }

    setIsSavingCategory(true);
    setApiError(null);

    try {
      const response = await fetch("/api/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Nie udało się utworzyć kategorii");
      }

      setCategoryForm(initialCategoryForm);
      await fetchCategories();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił błąd podczas tworzenia kategorii");
      }
    } finally {
      setIsSavingCategory(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: number,
    status: Appointment["status"]
  ) => {
    setApiError(null);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Nie udało się zaktualizować statusu rezerwacji"
        );
      }

      await Promise.all([fetchAppointments(), fetchSummary()]);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił błąd podczas aktualizacji rezerwacji");
      }
    }
  };

  const deleteAppointment = async (appointmentId: number) => {
    if (!window.confirm("Czy chcesz usunąć tę rezerwację?")) {
      return;
    }
    setApiError(null);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Nie udało się usunąć rezerwacji");
      }
      await fetchAppointments();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił błąd podczas usuwania rezerwacji");
      }
    }
  };

  const filteredAppointments = useMemo(() => {
    if (filterStatus === "all") {
      return appointments;
    }
    return appointments.filter(
      (appointment) => appointment.status === filterStatus
    );
  }, [appointments, filterStatus]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((appointment) => new Date(appointment.appointment_date) >= now)
      .sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime()
      )
      .slice(0, 5);
  }, [appointments]);

  const servicesByCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      services: services
        .filter((service) => service.category_id === category.id)
        .sort((a, b) => a.price - b.price),
    }));
  }, [categories, services]);

  const totalActiveServices =
    summary?.services.active ??
    services.filter((service) => service.is_active).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside className="lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="px-6 py-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Panel administracyjny
              </p>
              <h1 className="text-lg font-semibold text-white">
                Gabinet Podologiczny
              </h1>
            </div>
          </div>

          <nav className="px-4 pb-6 text-sm">
            <span className="px-4 text-xs uppercase tracking-wider text-slate-500">
              Sekcje
            </span>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#overview"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-800/80"
                >
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Podsumowanie
                </a>
              </li>
              <li>
                <a
                  href="#reservations"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-800/80"
                >
                  <CalendarCheck2 className="h-4 w-4 text-teal-400" />
                  Rezerwacje
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-800/80"
                >
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Usługi
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-800/80"
                >
                  <Tag className="h-4 w-4 text-amber-400" />
                  Cennik
                </a>
              </li>
            </ul>
          </nav>

          <div className="border-t border-slate-800 px-6 py-6 text-xs text-slate-500">
            <p className="font-medium text-slate-300">Szybkie wskazówki</p>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-2">
                <span className="mt-1 block h-2 w-2 rounded-full bg-emerald-400"></span>{" "}
                Potwierdzaj rezerwacje, aby automatycznie wysyłać komunikaty do
                pacjentów.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 block h-2 w-2 rounded-full bg-sky-400"></span>{" "}
                Aktualizuj ceny w sekcji usług, by cennik na stronie był zawsze
                aktualny.
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div
            className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10"
            id="overview"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Zarządzaj jak profesjonalista
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                  Panel sterowania gabinetem
                </h2>
                <p className="mt-3 max-w-xl text-sm text-slate-400">
                  Monitoruj rezerwacje, aktualizuj ofertę usług, zarządzaj
                  cennikiem i utrzymuj najwyższy poziom obsługi pacjenta w
                  jednym miejscu.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="bg-slate-800 hover:bg-slate-700"
                  onClick={() => void fetchAll()}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Odśwież dane
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-500"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Przejdź do strony głównej
                </Button>
              </div>
            </div>

            {apiError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">
                {apiError}
              </div>
            )}

            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.05 }}
              >
                <Card className="border-0 bg-slate-900/80 backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Wszystkie rezerwacje
                    </CardTitle>
                    <ClipboardList className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold text-white">
                      {summary?.appointments.total ?? appointments.length}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Łącznie w systemie
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 bg-slate-900/80 backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Potwierdzone wizyty
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold text-white">
                      {summary?.appointments.confirmed ??
                        appointments.filter((a) => a.status === "confirmed")
                          .length}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Gotowe do realizacji
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15 }}
              >
                <Card className="border-0 bg-slate-900/80 backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Aktywne usługi
                    </CardTitle>
                    <Layers className="h-4 w-4 text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold text-white">
                      {totalActiveServices}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Widoczne na stronie
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 bg-slate-900/80 backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      Potencjał przychodów
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold text-white">
                      {currencyFormatter.format(
                        summary?.financials.potentialRevenue ?? 0
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      na podstawie potwierdzonych wizyt
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </section>

            <section
              className="grid gap-6 xl:grid-cols-[2fr_1fr]"
              id="reservations"
            >
              <Card className="border border-slate-800/70 bg-slate-900/60 shadow-xl shadow-black/20">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-white">
                      Zarządzanie rezerwacjami
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-400">
                      Monitoruj status wizyt i planuj harmonogram gabinetu
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="status-filter"
                      className="text-xs font-medium uppercase tracking-wide text-slate-500"
                    >
                      Filtruj status
                    </label>
                    <select
                      id="status-filter"
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as typeof filterStatus)
                      }
                    >
                      <option value="all">Wszystkie</option>
                      <option value="pending">W oczekiwaniu</option>
                      <option value="confirmed">Potwierdzone</option>
                      <option value="cancelled">Anulowane</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm text-slate-200">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="py-3">Pacjent</th>
                        <th className="py-3">Usługa</th>
                        <th className="py-3">Termin</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredAppointments.map((appointment) => {
                        const appointmentDate = new Date(
                          appointment.appointment_date
                        );
                        return (
                          <tr
                            key={appointment.id}
                            className="transition-colors hover:bg-slate-900/60"
                          >
                            <td className="py-3">
                              <div className="font-medium text-white">
                                {appointment.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {appointment.email}
                              </div>
                              {appointment.phone && (
                                <div className="text-xs text-slate-500">
                                  {appointment.phone}
                                </div>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="font-medium text-slate-200">
                                {appointment.service}
                              </div>
                              {appointment.message && (
                                <div className="text-xs text-slate-500">
                                  Notatka: {appointment.message}
                                </div>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="font-medium text-white">
                                {appointmentDate.toLocaleDateString("pl-PL", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="text-xs text-slate-500">
                                {appointmentDate.toLocaleTimeString("pl-PL", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                  statusChipClasses[appointment.status]
                                }`}
                              >
                                {statusLabels[appointment.status]}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                  onClick={() =>
                                    void updateAppointmentStatus(
                                      appointment.id,
                                      "confirmed"
                                    )
                                  }
                                >
                                  <CheckCircle2 className="mr-1 h-4 w-4" />{" "}
                                  Potwierdź
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                  onClick={() =>
                                    void updateAppointmentStatus(
                                      appointment.id,
                                      "pending"
                                    )
                                  }
                                >
                                  <Clock3 className="mr-1 h-4 w-4" /> Oczekuje
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                                  onClick={() =>
                                    void updateAppointmentStatus(
                                      appointment.id,
                                      "cancelled"
                                    )
                                  }
                                >
                                  <XCircle className="mr-1 h-4 w-4" /> Anuluj
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                                  onClick={() =>
                                    void deleteAppointment(appointment.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {!isLoading && filteredAppointments.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-10 text-center text-sm text-slate-500"
                          >
                            Brak rezerwacji w wybranym filtrze.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card className="border border-slate-800/70 bg-slate-900/70">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Nadchodzące wizyty
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    Top 5 najbliższych terminów
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const appointmentDate = new Date(
                      appointment.appointment_date
                    );
                    return (
                      <div
                        key={appointment.id}
                        className="rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {appointment.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {appointment.service}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                              statusChipClasses[appointment.status]
                            }`}
                          >
                            {statusLabels[appointment.status]}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                          <CalendarCheck2 className="h-4 w-4 text-blue-400" />
                          {appointmentDate.toLocaleDateString("pl-PL", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                          <Clock3 className="h-4 w-4 text-emerald-400" />
                          {appointmentDate.toLocaleTimeString("pl-PL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {upcomingAppointments.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-6 text-center text-sm text-slate-500">
                      Brak zaplanowanych wizyt.
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section
              className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"
              id="services"
            >
              <Card className="border border-slate-800/70 bg-slate-900/70">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-white">
                      Usługi gabinetu
                    </CardTitle>
                    <p className="text-sm text-slate-400">
                      Aktualizuj listę usług, by oferta na stronie była zawsze
                      aktualna.
                    </p>
                  </div>
                  <div className="hidden rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 text-xs text-slate-400 md:flex md:items-center md:gap-2">
                    <Menu className="h-4 w-4" /> {services.length} pozycji w
                    ofercie
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-slate-800/70">
                    <table className="w-full text-left text-sm text-slate-200">
                      <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Nazwa</th>
                          <th className="px-4 py-3">Kategoria</th>
                          <th className="px-4 py-3">Cena</th>
                          <th className="px-4 py-3">Czas</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Akcje</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {services.map((service) => (
                          <tr
                            key={service.id}
                            className="transition hover:bg-slate-900/50"
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium text-white">
                                {service.name}
                              </p>
                              {service.description && (
                                <p className="text-xs text-slate-500">
                                  {service.description}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-400">
                              {service.category?.name}
                            </td>
                            <td className="px-4 py-3 font-semibold text-white">
                              {currencyFormatter.format(service.price || 0)}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-400">
                              {service.duration_minutes} min
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {service.is_active ? (
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                                  Aktywna
                                </span>
                              ) : (
                                <span className="rounded-full bg-slate-700/40 px-3 py-1 text-slate-400">
                                  Ukryta
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                                  onClick={() => handleServiceEdit(service)}
                                >
                                  <PenLine className="mr-1 h-4 w-4" /> Edytuj
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                                  onClick={() =>
                                    void handleServiceDelete(service.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {!isLoading && services.length === 0 && (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-4 py-8 text-center text-sm text-slate-500"
                            >
                              Brak usług w bazie. Dodaj pierwszą ofertę, aby
                              rozpocząć.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border border-slate-800/70 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {editedServiceId ? "Edytuj usługę" : "Dodaj nową usługę"}
                    </CardTitle>
                    <p className="text-sm text-slate-400">
                      Uzupełnij informacje, aby oferta natychmiast pojawiła się
                      na stronie.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleServiceSubmit}>
                      <div>
                        <label
                          htmlFor="service-name"
                          className="text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                          Nazwa usługi
                        </label>
                        <Input
                          id="service-name"
                          name="name"
                          placeholder="np. Konsultacja podologiczna"
                          value={serviceForm.name}
                          onChange={handleServiceFormChange}
                          className="mt-1 border-slate-700 bg-slate-950/80 text-slate-100"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="service-description"
                          className="text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                          Opis (dla klientów)
                        </label>
                        <Textarea
                          id="service-description"
                          name="description"
                          rows={3}
                          placeholder="Krótko opisz na czym polega zabieg i jakie przynosi korzyści."
                          value={serviceForm.description}
                          onChange={handleServiceFormChange}
                          className="mt-1 border-slate-700 bg-slate-950/80 text-slate-100"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="service-price"
                            className="text-xs font-medium uppercase tracking-wide text-slate-400"
                          >
                            Cena (PLN)
                          </label>
                          <Input
                            id="service-price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={serviceForm.price}
                            onChange={handleServiceFormChange}
                            placeholder="0.00"
                            className="mt-1 border-slate-700 bg-slate-950/80 text-slate-100"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="service-duration"
                            className="text-xs font-medium uppercase tracking-wide text-slate-400"
                          >
                            Czas trwania (min)
                          </label>
                          <Input
                            id="service-duration"
                            name="durationMinutes"
                            type="number"
                            min="15"
                            step="5"
                            value={serviceForm.durationMinutes}
                            onChange={handleServiceFormChange}
                            className="mt-1 border-slate-700 bg-slate-950/80 text-slate-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
                        <div>
                          <label
                            htmlFor="service-category"
                            className="text-xs font-medium uppercase tracking-wide text-slate-400"
                          >
                            Kategoria
                          </label>
                          <select
                            id="service-category"
                            name="categoryId"
                            value={serviceForm.categoryId}
                            onChange={handleServiceFormChange}
                            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                            required
                          >
                            <option value="">Wybierz kategorię</option>
                            {categories.map((category) => (
                              <option value={category.id} key={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                          <input
                            id="service-active"
                            type="checkbox"
                            name="isActive"
                            checked={serviceForm.isActive}
                            onChange={handleServiceFormChange}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="service-active"
                            className="text-sm text-slate-300"
                          >
                            Widoczna na stronie
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-500"
                          disabled={isSavingService}
                        >
                          <Plus className="mr-2 h-4 w-4" />{" "}
                          {editedServiceId ? "Zapisz zmiany" : "Dodaj usługę"}
                        </Button>
                        {editedServiceId && (
                          <Button
                            type="button"
                            variant="secondary"
                            className="bg-slate-800 hover:bg-slate-700"
                            onClick={resetServiceForm}
                          >
                            Anuluj edycję
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border border-slate-800/70 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Nowa kategoria usług
                    </CardTitle>
                    <p className="text-sm text-slate-400">
                      Grupuj zabiegi, aby pacjentom łatwiej było znaleźć
                      interesujące ich usługi.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleCategorySubmit}>
                      <div>
                        <label
                          htmlFor="category-name"
                          className="text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                          Nazwa kategorii
                        </label>
                        <Input
                          id="category-name"
                          name="name"
                          value={categoryForm.name}
                          onChange={handleCategoryChange}
                          placeholder="np. Zabiegi specjalistyczne"
                          className="mt-1 border-slate-700 bg-slate-950/80 text-slate-100"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="category-description"
                          className="text-xs font-medium uppercase tracking-wide text-slate-400"
                        >
                          Opis (opcjonalnie)
                        </label>
                        <Textarea
                          id="category-description"
                          name="description"
                          rows={2}
                          value={categoryForm.description}
                          onChange={handleCategoryChange}
                          placeholder="Krótki opis kategorii"
                          className="mt-1 border-slate-700 bg-slate-950/80 text-slate-100"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500"
                        disabled={isSavingCategory}
                      >
                        <Layers className="mr-2 h-4 w-4" /> Dodaj kategorię
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-6" id="pricing">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Cennik prezentowany klientom
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Zmiany w panelu są od razu widoczne na stronie – sprawdź jak
                    prezentuje się oferta.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <List className="h-4 w-4" /> {services.length} pozycji •
                  Średnia cena:{" "}
                  {currencyFormatter.format(
                    summary?.services.averagePrice ?? 0
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {servicesByCategory.map(
                  ({ category, services: categoryServices }) => (
                    <motion.div
                      key={category.id}
                      variants={fadeInVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35 }}
                      className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-6 shadow-xl shadow-black/10"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="mt-1 text-xs text-slate-500">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                          {categoryServices.length} usług
                        </span>
                      </div>
                      <ul className="mt-5 space-y-3 text-sm">
                        {categoryServices.length === 0 && (
                          <li className="rounded-lg border border-dashed border-slate-700/60 px-4 py-3 text-center text-slate-500">
                            Brak usług w tej kategorii.
                          </li>
                        )}
                        {categoryServices.map((service) => (
                          <li
                            key={service.id}
                            className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900/60 px-4 py-3"
                          >
                            <div>
                              <p className="font-medium text-white">
                                {service.name}
                              </p>
                              {service.duration_minutes && (
                                <p className="text-xs text-slate-500">
                                  Czas trwania: {service.duration_minutes} min
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-emerald-300">
                                {currencyFormatter.format(service.price || 0)}
                              </p>
                              {!service.is_active && (
                                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                                  Ukryta
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                )}
              </div>
            </section>

            <footer className="border-t border-slate-900/60 pt-6 text-xs text-slate-500">
              <p>
                &copy; {new Date().getFullYear()} Gabinet Podologiczny. Panel
                administracyjny – wersja beta.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

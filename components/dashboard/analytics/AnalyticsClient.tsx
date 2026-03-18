"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart,
    Line, Legend,
} from "recharts";
import { type ProjectStats, type MilestoneStats, type MonthlyProject, type RoleDistribution } from "@/lib/db/analytics";
import { ROLE_LABELS } from "@/types/index";
import { type Role } from "@/types/index";

type Props = {
    projects: ProjectStats;
    milestones: MilestoneStats;
    monthly: MonthlyProject[];
    roles: RoleDistribution[];
    revenue: { total_budget: number; total_paid: number; total_pending: number };
};

const COLORS = ["hsl(0 0% 15%)", "hsl(0 0% 35%)", "hsl(0 0% 55%)", "hsl(0 0% 75%)"];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border rounded-xl px-3 py-2 shadow-sm text-xs">
            {label && <p className="text-muted-foreground mb-1">{label}</p>}
            {payload.map((entry: any, i: number) => (
                <p key={i} className="font-semibold text-foreground">
                    {entry.name}:{" "}
                    {typeof entry.value === "number" && entry.name === "Amount"
                        ? `$${entry.value.toLocaleString()}`
                        : entry.value
                    }
                </p>
            ))}
        </div>
    );
};

export default function AnalyticsClient({ projects, milestones, monthly, roles, revenue }: Props) {

    const projectPieData = [
        { name: "Active", value: projects.active },
        { name: "Completed", value: projects.completed },
        { name: "Draft", value: projects.draft },
        { name: "Other", value: projects.total - projects.active - projects.completed - projects.draft },
    ].filter((d) => d.value > 0);

    const milestonePieData = [
        { name: "Completed", value: milestones.completed },
        { name: "In Progress", value: milestones.in_progress },
        { name: "Pending", value: milestones.pending },
    ].filter((d) => d.value > 0);

    const rolesData = roles.map((r) => ({
        name: ROLE_LABELS[r.role as Role]?.en ?? r.role,
        count: r.count,
    }));

    const revenueData = [
        { name: "Budget", value: revenue.total_budget },
        { name: "Paid", value: revenue.total_paid },
        { name: "Pending", value: revenue.total_pending },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-full">

            {/* Header */}
            <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
                    Analytics
                </p>
                <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
                    Overview
                </h1>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Total Projects", value: projects.total },
                    { label: "Active", value: projects.active },
                    { label: "Total Milestones", value: milestones.total },
                    { label: "Completed", value: milestones.completed },
                ].map((kpi) => (
                    <div key={kpi.label} className="flex flex-col gap-1 p-5 rounded-2xl border bg-card">
                        <span className="text-2xl font-extrabold tracking-tighter text-foreground">
                            {kpi.value}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            {kpi.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Revenue cards */}
            <div className="grid grid-cols-3 gap-3">
                {revenueData.map((r) => (
                    <div key={r.name} className="flex flex-col gap-1 p-5 rounded-2xl border bg-card">
                        <span className="text-2xl font-extrabold tracking-tighter text-foreground">
                            ${r.value.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            {r.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Monthly projects bar chart */}
                <div className="p-5 rounded-2xl border bg-card">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                        Projects — Last 6 Months
                    </p>
                    {monthly.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                            No data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={monthly} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Projects" fill="hsl(0 0% 15%)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Project status pie */}
                <div className="p-5 rounded-2xl border bg-card">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                        Project Status
                    </p>
                    {projectPieData.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                            No data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={projectPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {projectPieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: "10px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Milestone status pie */}
                <div className="p-5 rounded-2xl border bg-card">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                        Milestone Progress
                    </p>
                    {milestonePieData.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                            No data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={milestonePieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {milestonePieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: "10px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Team role distribution */}
                <div className="p-5 rounded-2xl border bg-card">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                        Team Roles
                    </p>
                    {rolesData.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                            No data yet
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart
                                data={rolesData}
                                layout="vertical"
                                margin={{ top: 0, right: 0, bottom: 0, left: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={60} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Members" fill="hsl(0 0% 15%)" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Revenue bar */}
            <div className="p-5 rounded-2xl border bg-card">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
                    Revenue Overview
                </p>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 90%)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            content={<CustomTooltip />}
                        />
                        <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]}>
                            {revenueData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
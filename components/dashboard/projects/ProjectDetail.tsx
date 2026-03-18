"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Plus, Settings, CheckCircle2,
    Circle, Clock, PauseCircle, ChevronDown,
    ChevronUp, Pencil, Trash2, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type DBProjectWithMeta } from "@/lib/db/projects";
import { type DBMilestone } from "@/lib/db/milestones";

const STATUS_CONFIG = {
    draft: { label: "Draft", color: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
    pending_approval: { label: "Pending Approval", color: "bg-yellow-500/10 text-yellow-600", dot: "bg-yellow-500" },
    active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600", dot: "bg-emerald-500" },
    paused: { label: "Paused", color: "bg-orange-500/10 text-orange-600", dot: "bg-orange-500" },
    completed: { label: "Completed", color: "bg-blue-500/10 text-blue-600", dot: "bg-blue-500" },
    cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-500", dot: "bg-red-500" },
} as const;

const MILESTONE_STATUS = {
    pending: { label: "Pending", icon: Circle, color: "text-muted-foreground" },
    in_progress: { label: "In Progress", icon: Clock, color: "text-blue-500" },
    pending_approval: { label: "Needs Approval", icon: PauseCircle, color: "text-yellow-500" },
    approved: { label: "Approved", icon: CheckCircle2, color: "text-emerald-500" },
    completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-600" },
} as const;

const canEdit = ["founder", "ceo", "cto", "coo", "lead-engineer", "product-manager"];

type Props = {
    project: DBProjectWithMeta;
    milestones: DBMilestone[];
    role: string;
    userId: string;
};

export default function ProjectDetail({ project, milestones: initial, role, userId }: Props) {
    const router = useRouter();
    const [milestones, setMilestones] = useState<DBMilestone[]>(initial);
    const [showAddMilestone, setShowAddMilestone] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [newApproval, setNewApproval] = useState(false);
    const [addingMilestone, setAddingMilestone] = useState(false);
    const [activeTab, setActiveTab] = useState<"roadmap" | "settings">("roadmap");

    const editable = canEdit.includes(role);
    const status = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];
    const progress = milestones.length > 0
        ? Math.round((milestones.filter((m) => m.status === "completed").length / milestones.length) * 100)
        : 0;

    const handleAddMilestone = async () => {
        if (!newTitle.trim()) return;
        setAddingMilestone(true);

        const res = await fetch(`/api/projects/${project.id}/milestones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription || undefined,
                requires_approval: newApproval,
                order_index: milestones.length,
                due_date: newDueDate || undefined,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            setMilestones((prev) => [...prev, data.milestone]);
            setNewTitle("");
            setNewDescription("");
            setNewDueDate("");
            setNewApproval(false);
            setShowAddMilestone(false);
        }
        setAddingMilestone(false);
    };

    const handleUpdateMilestone = async (id: string, status: string) => {
        const res = await fetch(`/api/projects/${project.id}/milestones/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (res.ok) {
            setMilestones((prev) => prev.map((m) => m.id === id ? data.milestone : m));
        }
    };

    const handleDeleteMilestone = async (id: string) => {
        const res = await fetch(`/api/projects/${project.id}/milestones/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setMilestones((prev) => prev.filter((m) => m.id !== id));
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-full">

            {/* Header */}
            <div className="flex items-start gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 shrink-0 mt-0.5"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={14} />
                </Button>
                {project.client_id && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-2 ms-auto"
                        onClick={() => router.push(`/dashboard/client/${project.id}`)}
                    >
                        Client View
                    </Button>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
                            {project.name}
                        </h1>
                        <Badge className={`text-[10px] px-2 py-0 rounded-full border-0 ${status?.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full inline-block me-1.5 ${status?.dot}`} />
                            {status?.label}
                        </Badge>
                    </div>
                    {project.description && (
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                    )}
                </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Budget", value: project.price ? `$${project.price.toLocaleString()}` : "—" },
                    { label: "Progress", value: `${progress}%` },
                    { label: "Milestones", value: `${milestones.filter((m) => m.status === "completed").length}/${milestones.length}` },
                    { label: "Members", value: String(project.members_count) },
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1 p-4 rounded-2xl border bg-card">
                        <span className="text-lg font-extrabold tracking-tighter text-foreground">
                            {stat.value}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono uppercase tracking-widest">Overall Progress</span>
                    <span className="font-semibold text-foreground">{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="h-full bg-foreground rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b">
                {(["roadmap", "settings"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors duration-150 border-b-2 -mb-px capitalize ${activeTab === tab
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Roadmap tab */}
            {activeTab === "roadmap" && (
                <div className="flex flex-col gap-3">

                    {/* Milestones */}
                    {milestones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border bg-card">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">🗺️</div>
                            <p className="text-sm text-muted-foreground">No milestones yet</p>
                            {editable && (
                                <Button
                                    size="sm"
                                    className="rounded-full gap-2 mt-1"
                                    onClick={() => setShowAddMilestone(true)}
                                >
                                    <Plus size={12} />
                                    Add Milestone
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {milestones.map((milestone, i) => {
                                const ms = MILESTONE_STATUS[milestone.status as keyof typeof MILESTONE_STATUS];
                                const Icon = ms?.icon ?? Circle;
                                const isLast = i === milestones.length - 1;

                                return (
                                    <motion.div
                                        key={milestone.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: i * 0.05 }}
                                        className="relative flex gap-4"
                                    >
                                        {/* Timeline line */}
                                        {!isLast && (
                                            <div className="absolute left-[1.1rem] top-10 bottom-0 w-px bg-border" />
                                        )}

                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 bg-background ${milestone.status === "completed" ? "border-emerald-500" :
                                            milestone.status === "in_progress" ? "border-blue-500" :
                                                milestone.status === "pending_approval" ? "border-yellow-500" :
                                                    "border-border"
                                            }`}>
                                            <Icon size={14} className={ms?.color} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pb-4">
                                            <div className="flex items-start justify-between gap-2 p-3 rounded-2xl border bg-card hover:bg-muted/30 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className={`text-sm font-semibold ${milestone.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                                                            }`}>
                                                            {milestone.title}
                                                        </span>
                                                        {milestone.requires_approval && (
                                                            <Badge className="text-[9px] px-1.5 py-0 rounded-full border-0 bg-yellow-500/10 text-yellow-600">
                                                                Approval needed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {milestone.description && (
                                                        <p className="text-xs text-muted-foreground mb-2">
                                                            {milestone.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                                                        <span className={ms?.color}>{ms?.label}</span>
                                                        {milestone.due_date && (
                                                            <span>Due {new Date(milestone.due_date).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                {editable && (
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <select
                                                            value={milestone.status}
                                                            onChange={(e) => handleUpdateMilestone(milestone.id, e.target.value)}
                                                            className="text-[10px] font-mono bg-muted border-0 rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="in_progress">In Progress</option>
                                                            <option value="pending_approval">Needs Approval</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="completed">Completed</option>
                                                        </select>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-7 h-7 rounded-full text-muted-foreground hover:text-red-500"
                                                            onClick={() => handleDeleteMilestone(milestone.id)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Add milestone form */}
                    <AnimatePresence>
                        {showAddMilestone && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-col gap-3 p-4 rounded-2xl border bg-card">
                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                        New Milestone
                                    </p>
                                    <input
                                        type="text"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Milestone title"
                                        className="h-9 px-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="Description (optional)"
                                        rows={2}
                                        className="px-3 py-2 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                                    />
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="date"
                                            value={newDueDate}
                                            onChange={(e) => setNewDueDate(e.target.value)}
                                            className="h-9 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring flex-1"
                                        />
                                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newApproval}
                                                onChange={(e) => setNewApproval(e.target.checked)}
                                                className="rounded"
                                            />
                                            Requires approval
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="rounded-full gap-2"
                                            onClick={handleAddMilestone}
                                            disabled={addingMilestone || !newTitle.trim()}
                                        >
                                            {addingMilestone ? (
                                                <span className="w-3 h-3 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                                            ) : (
                                                <Plus size={12} />
                                            )}
                                            Add
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => setShowAddMilestone(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {editable && !showAddMilestone && (
                        <Button
                            variant="outline"
                            className="rounded-full gap-2 self-start"
                            onClick={() => setShowAddMilestone(true)}
                        >
                            <Plus size={13} />
                            Add Milestone
                        </Button>
                    )}
                </div>
            )}

            {/* Settings tab */}
            {activeTab === "settings" && (
                <ProjectSettings project={project} editable={editable} />
            )}
        </div>
    );
}

function ProjectSettings({
    project,
    editable,
}: {
    project: DBProjectWithMeta;
    editable: boolean;
}) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(project.status);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const form = new FormData(e.currentTarget);

        await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.get("name"),
                description: form.get("description"),
                price: form.get("price") ? Number(form.get("price")) : undefined,
                status,
                start_date: form.get("start_date") || undefined,
                end_date: form.get("end_date") || undefined,
            }),
        });

        setSaving(false);
        router.refresh();
    };

    return (
        <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-lg">
            {[
                { name: "name", label: "Project Name", type: "text", defaultValue: project.name, required: true },
                { name: "price", label: "Budget (USD)", type: "number", defaultValue: project.price ?? "", required: false },
                {
                    name: "start_date", label: "Start Date", type: "date",
                    defaultValue: project.start_date
                        ? new Date(project.start_date).toISOString().slice(0, 10)
                        : "",
                    required: false
                },
                {
                    name: "end_date", label: "End Date", type: "date",
                    defaultValue: project.end_date
                        ? new Date(project.end_date).toISOString().slice(0, 10)
                        : "",
                    required: false
                },
            ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {field.label}
                    </label>
                    <input
                        name={field.name}
                        type={field.type}
                        defaultValue={String(field.defaultValue)}
                        required={field.required}
                        disabled={!editable}
                        className="h-9 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                    />
                </div>
            ))}

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Description
                </label>
                <textarea
                    name="description"
                    defaultValue={project.description ?? ""}
                    disabled={!editable}
                    rows={3}
                    className="px-3 py-2 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none disabled:opacity-50"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={!editable}
                    className="h-9 px-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                >
                    <option value="draft">Draft</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {editable && (
                <Button type="submit" className="rounded-full gap-2 self-start" disabled={saving}>
                    {saving ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                    ) : "Save Changes"}
                </Button>
            )}
        </form>
    );
}
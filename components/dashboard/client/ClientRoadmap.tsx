"use client";

import { useState }               from "react";
import { useRouter }              from "next/navigation";
import { motion }                 from "framer-motion";
import {
  CheckCircle2, Circle, Clock,
  PauseCircle, ArrowLeft,
  ThumbsUp, ThumbsDown, DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button }                 from "@/components/ui/button";
import { Badge }                  from "@/components/ui/badge";
import { type DBProjectWithMeta } from "@/lib/db/projects";
import { type DBMilestone }       from "@/lib/db/milestones";
import { type DBApprovalWithMeta } from "@/lib/db/approvals";
import { type DBPayment }         from "@/lib/db/payments";

const MILESTONE_STATUS = {
  pending:          { label: "Pending",        icon: Circle,       color: "text-muted-foreground", border: "border-border"          },
  in_progress:      { label: "In Progress",    icon: Clock,        color: "text-blue-500",         border: "border-blue-400"        },
  pending_approval: { label: "Needs Approval", icon: PauseCircle,  color: "text-yellow-500",       border: "border-yellow-400"      },
  approved:         { label: "Approved",       icon: CheckCircle2, color: "text-emerald-500",      border: "border-emerald-400"     },
  completed:        { label: "Completed",      icon: CheckCircle2, color: "text-emerald-600",      border: "border-emerald-500"     },
} as const;

const PAYMENT_STATUS = {
  pending:   { label: "Pending",   color: "bg-muted text-muted-foreground"       },
  requested: { label: "Requested", color: "bg-yellow-500/10 text-yellow-600"     },
  paid:      { label: "Paid",      color: "bg-emerald-500/10 text-emerald-600"   },
  overdue:   { label: "Overdue",   color: "bg-red-500/10 text-red-500"           },
} as const;

type Props = {
  project:   DBProjectWithMeta;
  milestones: DBMilestone[];
  approvals: DBApprovalWithMeta[];
  payments:  DBPayment[];
  userId:    string;
  role:      string;
};

export default function ClientRoadmap({
  project, milestones, approvals: initialApprovals, payments: initialPayments,
  userId, role,
}: Props) {
  const router   = useRouter();
  const [approvals, setApprovals] = useState(initialApprovals);
  const [payments,  setPayments]  = useState(initialPayments);
  const [activeTab, setActiveTab] = useState<"roadmap" | "payments">("roadmap");
  const [loading,   setLoading]   = useState<string | null>(null);
  const [note,      setNote]      = useState("");

  const isClient = role === "viewer";

  const progress = milestones.length > 0
    ? Math.round((milestones.filter((m) => m.status === "completed").length / milestones.length) * 100)
    : 0;

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const totalPaid        = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalAmount      = payments.reduce((s, p) => s + Number(p.amount), 0);

  const handleApproval = async (approvalId: string, status: "approved" | "rejected") => {
    setLoading(approvalId);
    const res = await fetch(`/api/projects/${project.id}/approvals/${approvalId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status, note: note || undefined }),
    });
    const data = await res.json();
    if (res.ok) {
      setApprovals((prev) => prev.map((a) => a.id === approvalId ? { ...a, ...data.approval } : a));
      setNote("");
    }
    setLoading(null);
  };

  const handlePaymentConfirm = async (paymentId: string) => {
    setLoading(paymentId);
    const res = await fetch(`/api/projects/${project.id}/payments/${paymentId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status: "paid", paid_at: new Date().toISOString() }),
    });
    const data = await res.json();
    if (res.ok) {
      setPayments((prev) => prev.map((p) => p.id === paymentId ? data.payment : p));
    }
    setLoading(null);
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
        <div className="flex-1">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Project Roadmap
          </p>
          <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>
      </div>

      {/* Pending approvals alert */}
      {pendingApprovals.length > 0 && isClient && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <AlertCircle size={16} className="text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <span className="font-semibold">{pendingApprovals.length} item{pendingApprovals.length > 1 ? "s" : ""}</span> waiting for your approval
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Progress",      value: `${progress}%`                                                 },
          { label: "Milestones",    value: `${milestones.filter((m) => m.status === "completed").length}/${milestones.length}` },
          { label: "Total Budget",  value: project.price ? `$${Number(project.price).toLocaleString()}` : "—" },
          { label: "Paid",          value: `$${totalPaid.toLocaleString()}`                               },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 p-4 rounded-2xl border bg-card">
            <span className="text-lg font-extrabold tracking-tighter text-foreground">{stat.value}</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-widest">Project Progress</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["roadmap", "payments"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors duration-150 border-b-2 -mb-px capitalize ${
              activeTab === tab
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {tab === "payments" && payments.filter((p) => p.status === "requested").length > 0 && (
              <span className="ms-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500 text-[9px] text-white font-bold">
                {payments.filter((p) => p.status === "requested").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Roadmap tab */}
      {activeTab === "roadmap" && (
        <div className="flex flex-col gap-2">

          {/* Pending approvals */}
          {pendingApprovals.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Awaiting Your Approval
              </p>
              {pendingApprovals.map((approval) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-0.5">
                        {approval.milestone_title ?? approval.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested by {approval.requested_by_name}
                      </p>
                      {approval.note && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          "{approval.note}"
                        </p>
                      )}
                    </div>
                    {isClient && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="rounded-full gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                          disabled={loading === approval.id}
                          onClick={() => handleApproval(approval.id, "approved")}
                        >
                          <ThumbsUp size={12} />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full gap-1.5 h-8 text-red-500 border-red-200 hover:bg-red-50"
                          disabled={loading === approval.id}
                          onClick={() => handleApproval(approval.id, "rejected")}
                        >
                          <ThumbsDown size={12} />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Milestones timeline */}
          {milestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border bg-card">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">🗺️</div>
              <p className="text-sm text-muted-foreground">No milestones yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {milestones.map((milestone, i) => {
                const ms      = MILESTONE_STATUS[milestone.status as keyof typeof MILESTONE_STATUS];
                const Icon    = ms?.icon ?? Circle;
                const isLast  = i === milestones.length - 1;

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="relative flex gap-4"
                  >
                    {!isLast && (
                      <div className="absolute left-[1.1rem] top-10 bottom-0 w-px bg-border" />
                    )}

                    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 bg-background ${ms?.border}`}>
                      <Icon size={14} className={ms?.color} />
                    </div>

                    <div className="flex-1 pb-4">
                      <div className={`p-3 rounded-2xl border bg-card ${
                        milestone.status === "pending_approval" ? "border-yellow-500/30 bg-yellow-500/5" : ""
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`text-sm font-semibold ${
                                milestone.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
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
                              <p className="text-xs text-muted-foreground mb-1.5">
                                {milestone.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                              <span className={ms?.color}>{ms?.label}</span>
                              {milestone.due_date && (
                                <span>Due {new Date(milestone.due_date).toLocaleDateString()}</span>
                              )}
                              {milestone.completed_at && (
                                <span className="text-emerald-600">
                                  Done {new Date(milestone.completed_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Payments tab */}
      {activeTab === "payments" && (
        <div className="flex flex-col gap-4">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total",    value: `$${totalAmount.toLocaleString()}`,                                           color: "text-foreground"    },
              { label: "Paid",     value: `$${totalPaid.toLocaleString()}`,                                             color: "text-emerald-600"   },
              { label: "Remaining",value: `$${(totalAmount - totalPaid).toLocaleString()}`,                             color: "text-muted-foreground" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1 p-4 rounded-2xl border bg-card">
                <span className={`text-lg font-extrabold tracking-tighter ${s.color}`}>{s.value}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Payment list */}
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border bg-card">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <DollarSign size={16} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No payments scheduled</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {payments.map((payment, i) => {
                const ps = PAYMENT_STATUS[payment.status as keyof typeof PAYMENT_STATUS];
                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border bg-card"
                  >
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <DollarSign size={14} className="text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-foreground">
                          ${Number(payment.amount).toLocaleString()}
                        </span>
                        {payment.percentage && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            ({payment.percentage}%)
                          </span>
                        )}
                        <Badge className={`text-[10px] px-2 py-0 rounded-full border-0 ${ps?.color}`}>
                          {ps?.label}
                        </Badge>
                      </div>
                      {payment.description && (
                        <p className="text-xs text-muted-foreground">{payment.description}</p>
                      )}
                      {payment.due_date && (
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          Due {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {payment.status === "requested" && isClient && (
                      <Button
                        size="sm"
                        className="rounded-full gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shrink-0"
                        disabled={loading === payment.id}
                        onClick={() => handlePaymentConfirm(payment.id)}
                      >
                        {loading === payment.id ? (
                          <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 size={12} />
                            Confirm Payment
                          </>
                        )}
                      </Button>
                    )}

                    {payment.status === "paid" && payment.paid_at && (
                      <p className="text-[10px] font-mono text-emerald-600 shrink-0">
                        Paid {new Date(payment.paid_at).toLocaleDateString()}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
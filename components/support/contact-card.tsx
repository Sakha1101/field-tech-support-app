"use client";

import { PhoneCall } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";
import { SectionCard } from "@/components/ui/section-card";

export function ContactCard({
  contact,
  technician,
}: {
  contact: any;
  technician: { id: string; full_name: string | null; mobile_number: string };
}) {
  const supabase = createClient();
  const [isCalling, setIsCalling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCall = async () => {
    if (isCalling) return;
    setIsCalling(true);
    setErrorMessage("");

    const { error } = await supabase.from("support_call_logs").insert({
      technician_id: technician.id,
      technician_name: technician.full_name || "Technician",
      technician_mobile: technician.mobile_number,
      category_id: contact.category_id,
      category_name: contact.selectedCategory?.name || contact.category || "Unknown",
      issue_type_id: contact.selectedIssueType?.id || null,
      issue_type_name: contact.selectedIssueType?.name || "Unknown",
      support_contact_id: contact.id,
      support_contact_name: contact.name,
      support_contact_mobile: contact.mobile_number,
      escalation_level: contact.escalation_level,
      call_action: "call",
    });

    if (error) {
      setIsCalling(false);
      setErrorMessage("Could not log this support call. Please try again.");
      toast.error("Could not log support call");
      return;
    }

    window.location.href = `tel:${contact.mobile_number}`;
  };

  return (
    <SectionCard className="space-y-4">
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {contact.selectedCategory?.name || contact.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {contact.selectedIssueType?.name || "Issue Type"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            L{contact.escalation_level}
          </span>
        </div>
        <h3 className="mt-1 text-xl font-bold text-ink">{contact.name}</h3>
        {contact.designation ? <p className="text-sm text-slate-600">{contact.designation}</p> : null}
      </div>
      <div className="grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
        <p><span className="font-semibold">Category:</span> {contact.selectedCategory?.name || contact.category}</p>
        <p><span className="font-semibold">Issue Type:</span> {contact.selectedIssueType?.name || "Not selected"}</p>
        <p><span className="font-semibold">Escalation Level:</span> {contact.escalation_level}</p>
        {contact.notes ? <p><span className="font-semibold">Notes:</span> {contact.notes}</p> : null}
      </div>
      {errorMessage ? <p className="text-sm font-medium text-rose-600">{errorMessage}</p> : null}
      <button
        type="button"
        onClick={handleCall}
        disabled={isCalling}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <PhoneCall className="h-4 w-4" />
        {isCalling ? "Logging Call..." : "Call Now"}
      </button>
    </SectionCard>
  );
}

"use client";

import { useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContactCard } from "@/components/support/contact-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";

type Option = {
  id: string;
  name: string;
};

type Contact = {
  id: string;
  name: string;
  designation?: string | null;
  mobile_number: string;
  notes?: string | null;
  escalation_level: number;
  category_id: string;
};

export function SupportRoutingPanel({
  categories,
  issueTypes,
  contacts,
  selectedCategoryId,
  selectedIssueTypeId,
  showContacts,
  technician,
}: {
  categories: Option[];
  issueTypes: Option[];
  contacts: Contact[];
  selectedCategoryId?: string;
  selectedIssueTypeId?: string;
  showContacts: boolean;
  technician: { id: string; full_name: string | null; mobile_number: string };
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const selectedIssueType = issueTypes.find((item) => item.id === selectedIssueTypeId) ?? null;
  const selectedCategory = categories.find((item) => item.id === selectedCategoryId) ?? null;

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) =>
      [
        contact.name,
        contact.designation,
        contact.mobile_number,
        contact.notes,
        selectedCategory?.name,
        selectedIssueType?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [contacts, searchTerm, selectedCategory?.name, selectedIssueType?.name]);

  const level1 = filteredContacts.filter((item) => item.escalation_level === 1);
  const level2 = filteredContacts.filter((item) => item.escalation_level === 2);

  const navigate = (next: {
    categoryId?: string;
    issueTypeId?: string;
    show?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (next.categoryId) params.set("category_id", next.categoryId);
    if (next.issueTypeId) params.set("issue_type_id", next.issueTypeId);
    if (next.show) params.set("show", "1");

    setSearchTerm("");
    startTransition(() => {
      router.push(`/support${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  return (
    <div className="space-y-5">
      <SectionCard className="space-y-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Search Loaded Contacts</span>
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search category, issue type, or person"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            This filters the contacts already shown on screen. Select category and issue type first.
          </p>
        </label>
      </SectionCard>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Categories</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate({ categoryId: item.id, issueTypeId: selectedIssueTypeId })}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold ${
                selectedCategoryId === item.id ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Issue Types</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {issueTypes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate({ categoryId: selectedCategoryId, issueTypeId: item.id })}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-semibold ${
                selectedIssueTypeId === item.id ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <SectionCard className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Ready to route support</p>
            <p className="text-xs text-slate-500">
              {selectedCategory && selectedIssueType
                ? `${selectedCategory.name} / ${selectedIssueType.name}`
                : "Choose both filters to load contacts for the selected category."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ categoryId: selectedCategoryId, issueTypeId: selectedIssueTypeId, show: true })}
            disabled={!selectedCategoryId || !selectedIssueTypeId}
            className="rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Show Contacts
          </button>
        </div>
      </SectionCard>

      {!categories.length || !issueTypes.length ? (
        <EmptyState
          title="Support setup is not ready"
          description="Active categories or issue types are missing. Please ask an admin to update support masters."
        />
      ) : !selectedCategoryId || !selectedIssueTypeId ? (
        <EmptyState
          title="Select both category and issue type"
          description="Choose a category and an issue type to load the support escalation list."
        />
      ) : !showContacts ? (
        <EmptyState
          title="Tap Show Contacts"
          description="Your category and issue type are selected. Tap Show Contacts to load the support escalation list."
        />
      ) : !filteredContacts.length ? (
        <EmptyState
          title={contacts.length ? "No contacts match your search" : "No support contacts found"}
          description={
            contacts.length
              ? "Try a different local search term or clear the search bar."
              : "No active contacts are mapped for this category yet. Please contact admin."
          }
        />
      ) : (
        <div className="space-y-4">
          <SectionCard>
            <h2 className="text-base font-bold text-ink">Escalation Level 1</h2>
          </SectionCard>
          {level1.length ? (
            level1.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={{ ...contact, selectedIssueType, selectedCategory }}
                technician={technician}
              />
            ))
          ) : (
            <EmptyState title="No level 1 contact found" description="No active level 1 contact is mapped for this category." />
          )}

          <SectionCard>
            <h2 className="text-base font-bold text-ink">Escalation Level 2</h2>
          </SectionCard>
          {level2.length ? (
            level2.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={{ ...contact, selectedIssueType, selectedCategory }}
                technician={technician}
              />
            ))
          ) : (
            <EmptyState title="No level 2 contact found" description="No active level 2 contact is mapped for this category." />
          )}
        </div>
      )}
    </div>
  );
}

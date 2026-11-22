/** Admin overview — Figma frame `78:59` (Admin · Overview). */
export const adminOverviewCopy = {
  workspace: "WORKSPACE",
  title: "Overview",
  subtitle: "Bradford dispatch — bookings, quotes and invoices at a glance.",
  stats: {
    newRequests: { label: "New requests", hint: "Pending review" },
    quotes: { label: "Quotes", hint: "Sent, awaiting response" },
    awaitingDeposit: { label: "Awaiting deposit", hint: "Invoice outstanding" },
    confirmedWeek: { label: "Confirmed", hint: "This week" },
    unread: { label: "Unread messages", hint: "Customer threads" },
    enquiries: { label: "New enquiries", hint: "Website contact form" },
  },
  needsAttention: "Needs attention",
  needsAttentionEmpty: "Nothing needs action right now.",
  latestBookings: "Latest bookings",
  viewAllBookings: "View all bookings",
  viewMessages: "Open inbox",
  viewEnquiries: "Open enquiries",
  quickActions: "Quick actions",
  actions: [
    { label: "All bookings", href: "/admin/bookings" },
    { label: "Send quotes", href: "/admin/bookings?status=QUOTED" },
    { label: "Invoices & payments", href: "/admin/payments" },
  ],
} as const;

export const adminNavCopy = {
  shellTitle: "Fete Nexus Admin",
  shellSubtitle: "Office workspace",
  dispatchTitle: "Dispatch contact",
  dispatchSupport: "24/7 dispatch control",
} as const;
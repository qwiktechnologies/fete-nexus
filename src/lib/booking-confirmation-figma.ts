/** Booking confirmation — Figma frame `78:37` (Moving Logistic). */
export const bookingConfirmationCopy = {
  statusSuffix: "CONFIRMED",
  headline: "You’re booked. We’ll take it from here.",
  thanks: (firstName: string, serviceLabel: string) =>
    `Thanks, ${firstName}. Your deposit is paid and your ${serviceLabel.toLowerCase()} is confirmed.`,
  glanceTitle: "Your move at a glance",
  labels: {
    from: "FROM",
    to: "TO",
    service: "Service",
    team: "Team & vehicle",
    distance: "Estimated distance",
  },
  defaultTeam: "2 movers · 1 large van",
  defaultDistance: "—",
  manageBooking: "Manage booking",
  addToCalendar: "Add to calendar",
  nextTitle: "What happens next?",
  steps: [
    {
      number: "01",
      title: "Your team gets ready",
      body: "We’ll confirm your moving team and send an arrival reminder.",
    },
    {
      number: "02",
      title: "Prepare for moving day",
      body: "Pack loose items, label boxes and keep access routes clear.",
    },
    {
      number: "03",
      title: "We handle the heavy lifting",
      body: "Your team arrives at the scheduled time. The balance is due on completion.",
    },
  ],
  paymentTitle: "Payment summary",
  totalQuote: "Total quote",
  depositPaid: "Deposit paid",
  balanceDue: "Balance on completion",
  downloadReceipt: "Download receipt",
  helpTitle: "We’re here to help",
  confirmationSent: "Confirmation sent to",
  changeHint: "Need to change something? Quote your booking reference when you contact dispatch.",
  dispatchSupport: "24/7 dispatch support",
  tagline: "Fete Nexus  /  Your move, made simple.",
} as const;
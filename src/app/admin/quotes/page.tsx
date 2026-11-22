import { redirect } from "next/navigation";

export default function AdminQuotesPage() {
  redirect("/admin/bookings?status=QUOTED");
}
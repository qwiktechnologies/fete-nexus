import {
  FiBox,
  FiBriefcase,
  FiClock,
  FiHome,
  FiLayers,
  FiMapPin,
  FiPackage,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import type { IconType } from "react-icons";

const icons: Record<string, IconType> = {
  clearance: FiTrash2,
  home: FiHome,
  truck: FiTruck,
  package: FiPackage,
  office: FiBriefcase,
  clock: FiClock,
  layers: FiLayers,
  pin: FiMapPin,
  box: FiBox,
};

export const iconOptions = [
  ["clearance", "Clearance"],
  ["home", "Home"],
  ["truck", "Vehicle"],
  ["package", "Parcels"],
  ["office", "Office"],
  ["clock", "Same day"],
  ["layers", "Commercial"],
  ["pin", "Location"],
] as const;

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = icons[name] ?? FiBox;
  return <Icon className={className} aria-hidden />;
}

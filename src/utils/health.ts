export type HealthColor = "success" | "warning" | "danger";

export function getHealthColor(health: number): HealthColor {
  if (health >= 80) return "success";
  if (health >= 60) return "warning";
  return "danger";
}

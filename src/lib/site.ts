export const site = {
  name: "Monopoly Game Club",
  shortName: "Game Club",
  description:
    "Rules, strategy and history for Monopoly and the world's favourite board games, from chess and Catan to Scrabble, Risk and Ticket to Ride.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://monopolygameclub.com").replace(/\/$/, ""),
};

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

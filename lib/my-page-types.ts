import type { HeroChipData } from "@/components/hero-chip";

export type MyPagePlayer = {
  id: string;
  displayName: string;
  slug: string;
  steamId?: string | null;
  ladderScore?: number | null;
  primaryRole: string | null;
  highlightMatchIds: string[];
  championshipCount: number;
  teamName: string;
  teamId: string | null;
  teamSlug: string | null;
  heroCards: HeroChipData[];
};

export type MyPageTeam = {
  id: string;
  name: string;
  slug: string;
  slogan: string | null;
  summary: string | null;
  logoUrl: string | null;
  captain: string | null;
  captainPlayerId: string | null;
  championshipCount: number;
  honorScore: number;
  wins: number;
  losses: number;
  draws: number;
  members: Array<{
    id: string;
    displayName: string;
    slug: string;
  }>;
};

export type MyPageMatch = {
  id: string;
  slug: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  scoreHome: number | null;
  scoreAway: number | null;
  participantTeamNames: string[];
  participantTeamIds: string[];
  homeTeamName: string;
  homeTeamId: string | null;
  homeTeamSlug: string | null;
  awayTeamName: string;
  awayTeamId: string | null;
  awayTeamSlug: string | null;
};

export type MyPageReview = {
  id: string;
  authorPlayerId: string;
  authorPlayerName: string;
  authorPlayerSlug: string;
  targetPlayerId: string;
  targetPlayerName: string;
  targetPlayerSlug: string;
  content: string;
  showOnProfile: boolean;
  createdAt: string;
};

export type MyPageVisibleReview = Pick<MyPageReview, "id" | "authorPlayerName" | "content">;
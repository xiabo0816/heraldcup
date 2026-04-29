import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import type { InvitationStatus, InvitationType, Prisma, UserRole } from "@prisma/client";
import { isPrismaConnectionError, prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "heraldcup_session";
const REMEMBER_ME_DURATION_DAYS = 7;

type CreateUserSessionOptions = {
  persistent?: boolean;
};

export type Viewer = {
  user: {
    id: string;
    name: string;
    email: string | null;
    role: UserRole;
  };
  player: {
    id: string;
    displayName: string;
    slug: string;
  } | null;
  team: {
    id: string;
    name: string;
    slug: string;
  } | null;
  currentTeam: {
    id: string;
    name: string;
    slug: string;
    captainPlayerId: string | null;
  } | null;
  captainTeam: {
    id: string;
    name: string;
    slug: string;
  } | null;
  pendingClaim: {
    id: string;
    status: string;
  } | null;
  binding: {
    id: string;
    steamId: string;
    status: string;
  } | null;
  roleState: "visitor" | "user" | "player" | "captain";
  invitationStats: {
    pendingTeam: number;
    pendingScrim: number;
  };
};

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createUserSession(userId: string, options?: CreateUserSessionOptions) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const persistent = options?.persistent ?? false;
  const expiresAt = new Date(Date.now() + REMEMBER_ME_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.authSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(persistent ? { expires: expiresAt } : {})
  });
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.authSession.deleteMany({
      where: {
        tokenHash: hashSessionToken(token)
      }
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

const viewerInclude = {
  player: {
    include: {
      teamMemberships: {
        where: {
          isCurrent: true
        },
        take: 1,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              slug: true,
              captainPlayerId: true
            }
          }
        }
      },
      captainOfTeams: {
        where: {
          active: true
        },
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  },
  steamBinding: true,
  claimRequests: {
    where: {
      status: "PENDING"
    },
    orderBy: {
      submittedAt: "desc"
    },
    take: 1,
    select: {
      id: true,
      status: true
    }
  }
} satisfies Prisma.UserInclude;

async function getInvitationCounts(teamId?: string | null, playerId?: string | null) {
  if (!teamId && !playerId) {
    return {
      pendingTeam: 0,
      pendingScrim: 0
    };
  }

  const [pendingTeam, pendingScrim] = await Promise.all([
    playerId
      ? prisma.invitation.count({
          where: {
            status: "PENDING",
            type: "TEAM_MEMBER",
            targetPlayerId: playerId
          }
        })
      : Promise.resolve(0),
    teamId
      ? prisma.invitation.count({
          where: {
            status: "PENDING",
            type: "SCRIM",
            targetTeamId: teamId
          }
        })
      : Promise.resolve(0)
  ]);

  return {
    pendingTeam,
    pendingScrim
  };
}

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await prisma.authSession.findFirst({
      where: {
        tokenHash: hashSessionToken(token),
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          include: viewerInclude
        }
      }
    });

    if (!session) {
      return null;
    }

    await prisma.authSession.update({
      where: {
        id: session.id
      },
      data: {
        lastSeenAt: new Date()
      }
    });

    const captainTeam = session.user.player?.captainOfTeams[0] ?? null;
    const currentMembershipTeam = session.user.player?.teamMemberships[0]?.team ?? null;
    const currentTeam = currentMembershipTeam ?? captainTeam ?? null;
    const currentTeamCaptainPlayerId = currentMembershipTeam?.captainPlayerId ?? (captainTeam && currentTeam?.id === captainTeam.id ? session.user.player?.id ?? null : null);
    const invitationStats = await getInvitationCounts(captainTeam?.id, session.user.player?.id);
    const roleState = session.user.playerId
      ? captainTeam
        ? "captain"
        : "player"
      : "user";

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      },
      player: session.user.player
        ? {
            id: session.user.player.id,
            displayName: session.user.player.displayName,
            slug: session.user.player.slug
          }
        : null,
      team: captainTeam,
      currentTeam: currentTeam
        ? {
            id: currentTeam.id,
            name: currentTeam.name,
            slug: currentTeam.slug,
            captainPlayerId: currentTeamCaptainPlayerId
          }
        : null,
      captainTeam: captainTeam
        ? {
            id: captainTeam.id,
            name: captainTeam.name,
            slug: captainTeam.slug
          }
        : null,
      pendingClaim: session.user.claimRequests[0] ?? null,
      binding: session.user.steamBinding
        ? {
            id: session.user.steamBinding.id,
            steamId: session.user.steamBinding.steamId,
            status: session.user.steamBinding.status
          }
        : null,
      roleState,
      invitationStats
    };
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      return null;
    }

    throw error;
  }
});

export function isAdmin(viewer: Viewer | null) {
  return viewer?.user.role === "ADMIN";
}

export function invitationLabel(type: InvitationType, status: InvitationStatus) {
  return `${type.toLowerCase()}-${status.toLowerCase()}`;
}
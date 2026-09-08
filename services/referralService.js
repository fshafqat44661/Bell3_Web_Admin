import { apiFetch } from "@/configs/api";
import {
  buildAppInviteLink,
  buildRegisterInviteLink,
  resolveReferralCode,
} from "@/services/referralUtils";

/** Admin API route (api.php, auth:api): GET /api/users/{userId}/referrals */
const REFERRALS_PATH = (userId) => `users/${userId}/referrals`;

function formatUser(user) {
  if (!user) return null;
  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.fullName ||
        user.full_name ||
        user.username ||
        user.name ||
        "User";

  const countRaw =
    user.referral_count != null
      ? user.referral_count
      : user.total_referrals != null
        ? user.total_referrals
        : user.totalReferrals != null
          ? user.totalReferrals
          : 0;

  return {
    id: user.id,
    fullName,
    email: user.email || "",
    username: user.username || "",
    referralCode: resolveReferralCode(user) || `BELL-${user.id}`,
    totalReferrals: Number(countRaw) || 0,
    profileImage:
      user.profile_photo_url ||
      user.creator_profile ||
      user.profileImage ||
      null,
    userType: user.user_type || user.role || "user",
    joinDate: user.created_at || user.joinDate || "",
  };
}

function formatReferral(referral) {
  const fullName =
    referral.fullName ||
    referral.name ||
    (referral.first_name || referral.last_name
      ? `${referral.first_name || ""} ${referral.last_name || ""}`.trim()
      : null) ||
    referral.username ||
    referral.email ||
    "User";

  return {
    id: referral.id,
    fullName,
    email: referral.email || "",
    profileImage:
      referral.profileImage ||
      referral.profile_photo_url ||
      referral.creator_profile ||
      null,
    joinDate: referral.createdAt || referral.created_at || "",
    userType: referral.user_type || referral.role || "user",
    status: referral.status || "active",
  };
}

function unwrapList(body) {
  if (Array.isArray(body?.data?.data)) return body.data.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

function unwrapPagination(body, page, limit, listLength) {
  const p =
    body?.pagination ||
    body?.meta ||
    body?.data?.pagination ||
    body?.data?.meta ||
    {};

  const total =
    p.total != null
      ? p.total
      : body?.total != null
        ? body.total
        : listLength != null
          ? listLength
          : 0;
  const perPage =
    p.per_page != null ? p.per_page : p.perPage != null ? p.perPage : limit;
  const currentPage =
    p.current_page != null
      ? p.current_page
      : p.currentPage != null
        ? p.currentPage
        : page;
  const lastPage =
    p.pages != null
      ? p.pages
      : p.last_page != null
        ? p.last_page
        : p.lastPage != null
          ? p.lastPage
          : Math.max(1, Math.ceil(Number(total) / Number(perPage) || 1));

  return {
    total: Number(total) || 0,
    pages: Number(lastPage) || 1,
    current_page: Number(currentPage) || page,
    per_page: Number(perPage) || limit,
  };
}

class ReferralService {
  /**
   * List users via admin API. Sign-up counts load in Details via
   * GET /api/users/{id}/referrals
   */
  async getAllUsers(page = 1, limit = 15, search = "") {
    const params = new URLSearchParams({ page: String(page) });
    if (search.trim()) params.set("search", search.trim());

    const body = await apiFetch(`admin/users/all?${params.toString()}`);
    let users = unwrapList(body).map(formatUser).filter(Boolean);

    const serverPaged =
      body?.current_page != null ||
      body?.last_page != null ||
      body?.meta?.current_page != null;

    let pagination;
    if (serverPaged) {
      pagination = {
        total: Number(body.total != null ? body.total : users.length) || 0,
        pages: Number(body.last_page != null ? body.last_page : 1) || 1,
        current_page: Number(body.current_page != null ? body.current_page : page) || page,
        per_page: Number(body.per_page != null ? body.per_page : limit) || limit,
      };
    } else {
      const start = (page - 1) * limit;
      users = users.slice(start, start + limit);
      pagination = {
        total: users.length,
        pages: Math.max(1, Math.ceil(users.length / limit)),
        current_page: page,
        per_page: limit,
      };
    }

    // Admin users payload has no referral_count — counts load in Details modal
    return { data: users, pagination };
  }

  async searchUsers(searchTerm = "", page = 1, limit = 15) {
    return this.getAllUsers(page, limit, searchTerm);
  }

  /**
   * Parallel count fetch for users on the current page.
   * Uses pagination.total from /api/web/user/{id}/referrals
   */
  async enrichReferralCounts(users) {
    if (!users.length) return users;

    const counts = await Promise.all(
      users.map(async (user) => {
        try {
          const res = await this.getUserReferrals(user.id, 1, 1);
          return { id: user.id, total: res.pagination.total };
        } catch (error) {
          console.warn(
            `[ReferralService] count failed for user ${user.id}:`,
            error?.status || error?.message
          );
          return { id: user.id, total: user.totalReferrals || 0 };
        }
      })
    );

    const byId = Object.fromEntries(counts.map((c) => [c.id, c.total]));
    return users.map((u) => ({
      ...u,
      totalReferrals: byId[u.id] != null ? byId[u.id] : u.totalReferrals || 0,
    }));
  }

  /**
   * Correct admin path from backend api.php:
   * Route::middleware('auth:api')->group(...)
   *   GET /users/{userId}/referrals  →  ReferralController@index
   * Full URL: /api/users/{userId}/referrals
   */
  async getUserReferrals(userId, page = 1, limit = 10) {
    try {
      const body = await apiFetch(
        `${REFERRALS_PATH(userId)}?page=${page}&limit=${limit}`
      );
      const raw = unwrapList(body);
      const data = raw.map(formatReferral);
      const pagination = unwrapPagination(body, page, limit, data.length);

      return { data, pagination };
    } catch (error) {
      console.error("[ReferralService] getUserReferrals failed:", error);
      throw error;
    }
  }

  async getUserReferralDetails(userId, knownUser = null) {
    try {
      const referralsRes = await this.getUserReferrals(userId, 1, 10);
      const totalReferrals = referralsRes.pagination.total;
      const base = knownUser
        ? formatUser({
            ...knownUser,
            first_name: knownUser.first_name,
            last_name: knownUser.last_name,
            referral_code: knownUser.referralCode || knownUser.referral_code,
            profile_photo_url: knownUser.profileImage || knownUser.profile_photo_url,
          }) || knownUser
        : {
            id: userId,
            fullName: "User",
            email: "",
            referralCode: `BELL-${userId}`,
            profileImage: null,
          };

      return {
        ...base,
        totalReferrals,
        statistics: {
          totalReferrals,
          activeReferrals: totalReferrals,
          totalReward: 0,
          currency: "USD",
        },
        registerInviteLink: buildRegisterInviteLink(base.referralCode),
        appInviteLink: buildAppInviteLink(base.referralCode),
      };
    } catch (error) {
      console.error("[ReferralService] getUserReferralDetails failed:", error);
      throw error;
    }
  }
}

export const referralService = new ReferralService();
export default referralService;

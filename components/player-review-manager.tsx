"use client";

import { useActionState } from "react";
import {
  createPlayerReviewAction,
  initialMyActionState,
  togglePlayerReviewVisibilityAction
} from "@/app/my/actions";
import { AdminFormSubmit } from "@/components/admin-form-submit";

type ReviewPlayer = {
  id: string;
  displayName: string;
  teamName: string;
};

type ReviewItem = {
  id: string;
  authorPlayerId: string;
  authorPlayerName: string;
  targetPlayerId: string;
  targetPlayerName: string;
  content: string;
  showOnProfile: boolean;
  createdAt: string;
};

export function PlayerReviewManager({
  currentPlayer,
  players,
  reviews
}: {
  currentPlayer: ReviewPlayer;
  players: ReviewPlayer[];
  reviews: ReviewItem[];
}) {
  const [state, formAction] = useActionState(createPlayerReviewAction, initialMyActionState);
  const receivedReviews = reviews.filter((review) => review.targetPlayerId === currentPlayer.id);
  const sentReviews = reviews.filter((review) => review.authorPlayerId === currentPlayer.id);
  const reviewablePlayers = players.filter((player) => player.id !== currentPlayer.id);

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">选手互评</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">给其他选手留一句评价</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">每位选手对同一个人保留一条评价，再次提交会覆盖旧内容，适合留下最有代表性的印象。</p>

        <form action={formAction} className="mt-6 grid gap-4">
          <input type="hidden" name="authorPlayerId" value={currentPlayer.id} />
          <label className="grid gap-2 text-sm text-slate-300">
            <span>评价对象</span>
            <select name="targetPlayerId" className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none">
              {reviewablePlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.displayName} / {player.teamName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-300">
            <span>评价内容</span>
            <textarea
              name="content"
              rows={5}
              className="rounded-2xl border border-white/10 bg-ink px-4 py-3 text-slate-100 outline-none"
              placeholder="比如：团战沟通很稳，关键局能把队伍情绪顶住。"
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">{state.message}</div>
          <div className="flex justify-end">
            <AdminFormSubmit idleLabel="保存评价" pendingLabel="保存中..." />
          </div>
        </form>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">我写过的评价</div>
          <div className="mt-4 space-y-3">
            {sentReviews.length ? sentReviews.map((review) => (
              <article key={review.id} className="rounded-[20px] border border-white/10 bg-slate-950/50 px-4 py-4">
                <div className="text-sm font-semibold text-white">给 {review.targetPlayerName}</div>
                <p className="mt-2 text-sm leading-7 text-slate-300">{review.content}</p>
              </article>
            )) : <div className="text-sm leading-7 text-slate-400">你还没有给其他选手留下评价。</div>}
          </div>
        </div>
      </article>

      <article className="rounded-[32px] border border-white/10 bg-panel/80 p-6 shadow-glow backdrop-blur">
        <div className="text-xs uppercase tracking-[0.28em] text-amber-300">展示设置</div>
        <h2 className="mt-2 text-3xl font-semibold text-white">决定哪些评价展示到你的个人首页</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">别人对你的评价都会先收进这里，是否公开到个人首页和选手详情页，由你自己控制。</p>

        <div className="mt-6 space-y-4">
          {receivedReviews.length ? receivedReviews.map((review) => (
            <article key={review.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">来自 {review.authorPlayerName}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{review.content}</p>
                </div>
                <span className={review.showOnProfile ? "rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100" : "rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-300"}>
                  {review.showOnProfile ? "已公开" : "未公开"}
                </span>
              </div>

              <form action={togglePlayerReviewVisibilityAction} className="mt-4 flex justify-end">
                <input type="hidden" name="reviewId" value={review.id} />
                <input type="hidden" name="targetPlayerId" value={currentPlayer.id} />
                <input type="hidden" name="showOnProfile" value={review.showOnProfile ? "false" : "true"} />
                <AdminFormSubmit idleLabel={review.showOnProfile ? "从个人首页隐藏" : "展示到个人首页"} pendingLabel="提交中..." />
              </form>
            </article>
          )) : <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-400">目前还没有人给你留下评价。</div>}
        </div>
      </article>
    </section>
  );
}
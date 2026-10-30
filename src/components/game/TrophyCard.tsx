import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Achievement } from "@/types";

interface TrophyCardProps {
  achievement: Achievement;
}

export function TrophyCard({ achievement }: TrophyCardProps) {
  if (achievement.status === "Locked") {
    return (
      <div className="relative bg-surface-container-low border-[4px] border-surface-variant shadow-[8px_8px_0_0_#020617] p-4 flex flex-col gap-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="bg-surface-variant text-on-surface-variant px-3 py-1 font-label-sm text-label-sm border-2 border-surface w-fit uppercase">
          LOCKED
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 bg-surface border-[4px] border-surface-variant flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="font-headline-xl text-headline-xl text-surface-variant">
              ?
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-headline-md text-headline-md text-on-surface-variant">{achievement.title}</h2>
            <p className="text-surface-variant font-label-sm text-label-sm uppercase">Classified</p>
          </div>
        </div>
        <div className="p-3 bg-surface border-2 border-surface-variant text-surface-variant flex items-center justify-center">
          <span className="font-label-sm text-label-sm">COMING SOON...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="relative bg-surface-container border-[4px] border-primary shadow-[8px_8px_0_0_#020617] p-4 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="bg-primary text-on-primary px-3 py-1 font-label-sm text-label-sm border-2 border-on-primary uppercase w-fit">
          UNLOCKED
        </div>
        {achievement.date && <span className="text-primary font-label-sm text-label-sm">{achievement.date}</span>}
      </div>
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 bg-surface-container-highest border-[4px] border-primary flex items-center justify-center shrink-0">
          <Trophy aria-hidden="true" className="w-10 h-10 text-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-headline-md text-headline-md text-primary leading-tight">{achievement.title}</h2>
          {achievement.subtitle && (
            <p className="text-on-surface-variant font-label-sm text-label-sm uppercase">{achievement.subtitle}</p>
          )}
        </div>
      </div>
      {(achievement.description || achievement.organizer) && (
        <div className="p-3 bg-surface border-2 border-surface-variant text-on-surface text-body-md font-body-md">
          {achievement.description && <p>{achievement.description}</p>}
          {achievement.organizer && (
            <p className="mt-1 text-on-surface-variant font-label-sm text-label-sm">{achievement.organizer}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

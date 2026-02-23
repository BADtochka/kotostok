import { playSound, unlockAudio } from '@/utils/audio';
import { cn, delay } from 'badlib';
import type { AnimationDefinition, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

type DiceProps = {
  index?: number;
  value?: number;
  color?: string;
  animate?: boolean;
  combos?: number;
};

export const Dice = forwardRef<HTMLDivElement, DiceProps>(
  ({ animate, color = '#3f3f46', combos = 0, index, value }, ref) => {
    const WIPE_DICE_DELAY_MS = 200;

    const DICE_VARIANTS: Variants = {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: {
        opacity: 0,
        y: '100%',
        transition: {
          delay: WIPE_DICE_DELAY_MS / 1000,
        },
      },
    };

    const onAnimationStart = async (def: AnimationDefinition, needSound = true) => {
      if (!needSound) return;
      switch (def) {
        case 'animate': {
          await unlockAudio();
          playSound('makeTurn');
          break;
        }
        case 'exit': {
          await delay(WIPE_DICE_DELAY_MS);
          await unlockAudio();
          playSound('wipeDice');
          break;
        }
      }
    };

    return (
      <motion.div
        layout
        initial='initial'
        animate='animate'
        exit='exit'
        variants={DICE_VARIANTS}
        transition={{ duration: animate ? 0.5 : 0, delay: (index ?? 0) * 0.1 }}
        className={cn('size-16 outline outline-transparent flex items-center justify-center', {
          'outline-blue-500': combos > 1,
          'outline-yellow-500': combos > 2,
        })}
        style={{ background: color }}
        onAnimationStart={(def) => onAnimationStart(def, animate)}
        ref={ref}
      >
        {value}
      </motion.div>
    );
  },
);

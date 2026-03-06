import { rulesModalAtom } from '@/atoms/modals';
import { ClientOnly } from '@tanstack/react-router';
import { cn } from 'badlib';
import { motion, type Variants } from 'framer-motion';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

type Rule = {
  title: string;
  description: string;
  image?: string;
};

export const RulesModal = () => {
  const [isOpen, setIsOpen] = useAtom(rulesModalAtom);
  const [currentSlide, setCurrentSlide] = useState(0);
  const RULES_LIST: Rule[] = [
    {
      title: 'PvP',
      description: 'Два игрока по очереди делают ходы на общем поле. Побеждает тот, кто наберёт больше очков.',
      image: 'pvp.png',
    },
    {
      title: 'Выбор колонки',
      description:
        'За ход нужно выбрать одну из колонок. Кубик автоматически падает вниз и занимает первую свободную ячейку сверху вниз.',
      image: 'column_drop.webp',
    },
    {
      title: 'Комбо одинаковых кубиков',
      description:
        'Если в колонке оказывается несколько кубиков с одинаковым значением, срабатывает комбо: очки считаются как значение кубика × количество × количество.',
      image: 'combo.webp',
    },
    {
      title: 'Уничтожение кубиков оппонента',
      description:
        'Если у оппонента в той же колонке есть кубики с таким же значением — они немедленно убираются из его колонки.',
      image: 'destroy.webp',
    },
  ];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      transitionEnd: {
        display: 'none',
      },
    },
    visible: {
      opacity: 1,
      display: 'flex',
    },
  };

  const backdropVariants: Variants = {
    hidden: {
      opacity: 0,
      transitionEnd: {
        display: 'none',
      },
    },
    visible: {
      opacity: 1,
      display: 'flex',
    },
  };

  const onNextSlide = () => {
    if (currentSlide + 1 >= RULES_LIST.length) return;
    setCurrentSlide((prev) => ++prev);
  };

  const onPrevSlide = () => {
    if (currentSlide - 1 < 0) return;
    setCurrentSlide((prev) => --prev);
  };

  const backdropElement = createPortal(
    <motion.div
      variants={backdropVariants}
      animate={isOpen ? 'visible' : 'hidden'}
      className='fixed inset-0 bg-black/70 z-9'
      onClick={() => setIsOpen(false)}
    />,
    document.body,
  );

  return (
    <ClientOnly>
      <motion.div
        variants={variants}
        initial={false}
        animate={isOpen ? 'visible' : 'hidden'}
        className='fixed top-1/2 left-1/2 -translate-1/2 flex justify-between flex-col z-10 p-4 rounded-xl max-w-96 min-h-96 w-full bg-zinc-900'
      >
        <div className='flex flex-col gap-2'>
          <p className='font-bold text-xl'>{RULES_LIST[currentSlide].title}</p>
          <p>{RULES_LIST[currentSlide].description}</p>
          <img className='mt-6' src={`/images/rules/${RULES_LIST[currentSlide].image}`} />
        </div>
        <p className='mx-auto mt-2'>
          {currentSlide + 1} / {RULES_LIST.length}
        </p>
        <div className='mt-4 flex gap-2 justify-center'>
          <Button className='size-10 font-medium' onClick={onPrevSlide} disabled={currentSlide === 0}>
            {'<'}
          </Button>
          <Button
            className={cn('size-10 font-medium', {
              disabled: currentSlide === RULES_LIST.length - 1,
            })}
            onClick={onNextSlide}
          >
            {'>'}
          </Button>
        </div>
        {backdropElement}
      </motion.div>
    </ClientOnly>
  );
};

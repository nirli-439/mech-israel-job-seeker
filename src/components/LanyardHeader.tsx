import React from 'react';
import DecayCard from '@/components/reactbits/DecayCard';

/**
 * Displays the main header using a single DecayCard where the
 * title and sub header are split to opposite sides of the card.
 */
const LanyardHeader: React.FC = () => {
  return (
    <DecayCard
      width={600}
      height={400}
      image="https://picsum.photos/600/400?grayscale"
      contentClassName="!p-4 w-[calc(100%-2em)]"
    >
      <div className="flex w-full justify-between items-end gap-4">
        <span className="font-black text-[2.5rem] leading-tight first-line:text-[6rem] text-right">
          MechJobs IL
        </span>
        <span className="font-semibold text-xl leading-tight text-left">
          מציאת עבודות לסטודנטים להנדסת מכונות בישראל
          <br />
          היעד האחד שלך לגילוי הזדמנויות בחברות הישראליות המובילות
        </span>
      </div>
    </DecayCard>
  );
};

export default LanyardHeader;

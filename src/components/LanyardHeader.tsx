import React from 'react';
import Lanyard from '@/components/reactbits/Lanyard';
import ShinyButton from '@/components/reactbits/ShinyButton';
import { Checkbox } from '@/components/ui/checkbox';

const LanyardHeader: React.FC = () => {
  return (
    <Lanyard cardClassName="w-[22rem] sm:w-[28rem]">
      <div className="p-4 flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-2">
          <span className="font-black text-[2rem] sm:text-[2.5rem] leading-tight">
            MechJobs IL
          </span>
          <span className="font-semibold text-sm sm:text-lg leading-tight">
            מציאת עבודות לסטודנטים להנדסת מכונות בישראל
            <br />
            היעד האחד שלך לכל הזדמנויות בחברות הישראליות המובילות
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShinyButton>שלחתי היום!</ShinyButton>
          <Checkbox
            defaultChecked
            className="data-[state=checked]:bg-green-600 data-[state=checked]:text-white border-green-600"
          />
        </div>
      </div>
    </Lanyard>
  );
};

export default LanyardHeader;

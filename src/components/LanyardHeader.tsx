
import React from 'react';
import Lanyard from '@/components/reactbits/Lanyard';
import ShinyButton from '@/components/reactbits/ShinyButton';
import { Checkbox } from '@/components/ui/checkbox';

const LanyardHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Lanyard 
        className="w-full max-w-2xl h-96"
        cardClassName="text-xs"
        gravity={[0, -15, 0]}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-black text-lg leading-tight">
            MechJobs IL
          </span>
          <span className="font-semibold text-xs leading-tight">
            מציאת עבודות לסטודנטים
            <br />
            להנדסת מכונות בישראל
          </span>
        </div>
      </Lanyard>
      
      <div className="flex items-center justify-center gap-2 mt-4">
        <ShinyButton>שלחתי היום!</ShinyButton>
        <Checkbox
          defaultChecked
          className="data-[state=checked]:bg-green-600 data-[state=checked]:text-white border-green-600"
        />
      </div>
    </div>
  );
};

export default LanyardHeader;

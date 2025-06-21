
import React from 'react';
import { useLanyardWS } from 'use-lanyard';

interface DiscordPresenceProps {
  userId: string;
}

const DiscordPresence: React.FC<DiscordPresenceProps> = ({ userId }) => {
  const data = useLanyardWS(userId as `${bigint}`);

  if (!data) return null;

  return (
    <div className="text-sm text-gray-600">
      דיסקורד: {data.discord_status}
      {data.spotify && (
        <div>
          מאזין ל‎{data.spotify.song} מאת {data.spotify.artist}
        </div>
      )}
    </div>
  );
};

export default DiscordPresence;

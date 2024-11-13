import React, { useEffect, useRef, useCallback } from 'react';
import FallingClipart from '~/components/BackgroundFallAnimation/FallingClipart';
import OurTeam from '~/components/TeamPage/OurTeam';
function OurTeamPage() {
 
  return (
    <div>
      <FallingClipart />
      <OurTeam />
    </div>
  );
}

export default OurTeamPage;

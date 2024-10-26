import React, { useEffect, useRef, useCallback } from 'react';
import Events from '~/components/Events';
import { api } from '~/utils/api';

function EventsPage() {
  return (
    <div>
      <Events />
    </div>
  );
}

export default EventsPage;

import React from 'react'
import Events from '~/components/Event'
import useAnalytics from '~/hooks/useAnalytics';

function EventsPage() {
  useAnalytics();
  return (
    <div>
      <Events/>
    </div>
  )
}

export default EventsPage

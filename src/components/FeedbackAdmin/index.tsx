import { useState } from 'react'
import Loading from '~/pages/Loading'
import { api } from '~/utils/api'

import { DataTable } from './data-table'
import { eventColumns } from './coloums' 
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectItem  
} from '~/components/ui/select'

/**
 * EmailVerifications Component
 * Main component for managing event playback videos in the admin panel.
 * Displays a table of all playbacks with filtering options for event type and day.
 */
const FeedbackAdmin = () => {
  const { data: feedbacks = [], isLoading } = api.feedback.getAllFeedback.useQuery();

  const [selectedRating,setSelectedRating] = useState<string>('all');
  if (isLoading) return <Loading />;

  const filteredFeedbacks = selectedRating === 'all' ? feedbacks : feedbacks.filter(feedback => feedback.rating.toString() === selectedRating);

  return (
    <div className="p-4">
      <h1 className="flex justify-center text-4xl font-Teknaf mb-8 py-5 text-center">
        Feedbacks
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        <div className="col-span-12 lg:col-span-2 flex md:flex-col gap-4 order-1 lg:order-2">
          
          <Select onValueChange={(value) => setSelectedRating(value)} value={selectedRating}>
            <SelectTrigger className="select">
              <SelectValue placeholder="Select Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
            
                <SelectItem value="all" defaultChecked>All Ratings</SelectItem>
                {[1,2,3,4,5].map(rating=>(
                  <SelectItem value={rating.toString()} key={rating}>{rating}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>

        <div className="col-span-12 lg:col-span-10 order-2 lg:order-1">
          <DataTable columns={eventColumns} data={filteredFeedbacks } />
        </div>

      </div>
    </div>
  )
}

export default FeedbackAdmin

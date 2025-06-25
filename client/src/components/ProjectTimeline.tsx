import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle, PlayCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  type: 'milestone' | 'update' | 'deadline';
}

interface ProjectTimelineProps {
  projectId: number;
  events?: TimelineEvent[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId, events = [] }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  // Sample timeline data if none provided
  const defaultEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Project Submitted',
      description: 'Initial project request received and under review',
      date: new Date().toISOString(),
      status: 'completed',
      type: 'milestone'
    },
    {
      id: '2',
      title: 'Requirements Analysis',
      description: 'Team analyzing project requirements and scope',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress',
      type: 'update'
    },
    {
      id: '3',
      title: 'Quote Preparation',
      description: 'Preparing detailed quote and timeline estimation',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      type: 'milestone'
    },
    {
      id: '4',
      title: 'Project Kickoff',
      description: 'Start development phase',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      type: 'deadline'
    }
  ];

  const timelineEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center mb-6">
        <Calendar className="h-6 w-6 text-primary mr-3" />
        <h3 className="text-lg font-semibold text-foreground">Project Timeline</h3>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {/* Timeline events */}
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-card border-2 border-border rounded-full">
                {getStatusIcon(event.status)}
              </div>
              
              {/* Event content */}
              <div className={`ml-6 flex-1 p-4 rounded-lg border ${getStatusColor(event.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{event.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'milestone' ? 'bg-primary/10 text-primary' :
                      event.type === 'deadline' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
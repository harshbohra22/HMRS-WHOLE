import React, { useState, useEffect } from 'react';
import { jobApplicationsApi } from '../services/api';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageCircle, Users, ClipboardList, LayoutDashboard } from 'lucide-react';
import { FloatingChat } from '../components/Chat/FloatingChat';
import type { JobApplication } from '../types';
import toast from 'react-hot-toast';

export const EmployerDashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<JobApplication | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const result = await jobApplicationsApi.getAll();
      const isSuccess = result.success || (result as any).succes || false;
      if (isSuccess) {
        setApplications(result.data || []);
      } else {
        toast.error(result.message || 'Failed to load applications');
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage candidate applications and screening chats</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardBody className="py-20 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No applications found</h3>
              <p className="text-gray-500">Wait for candidates to apply for your jobs.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <Card key={app.id} hover className="overflow-hidden border-l-4 border-l-blue-600">
                <CardBody className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Application #{app.id}</h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Candidate: <span className="font-semibold text-gray-900 dark:text-white">ID {app.jobSeekerId}</span> · 
                        Job Position: <span className="font-semibold text-gray-900 dark:text-white">{app.jobTitle}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => {
                        // Store job seeker name if available, otherwise generic
                        localStorage.setItem('temp_seekerName', `Candidate #${app.jobSeekerId}`);
                        setActiveChat(app);
                      }} 
                      className="flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Candidate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.success('Status update coming soon!')}>
                      Update Status
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {activeChat && (
        <FloatingChat
          applicationId={activeChat.id}
          senderType="EMPLOYER"
          senderId={1} // Mock Employer ID
          senderName="HR Manager (Tech Solutions)"
          jobTitle={activeChat.jobTitle}
          companyName="Tech Solutions"
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

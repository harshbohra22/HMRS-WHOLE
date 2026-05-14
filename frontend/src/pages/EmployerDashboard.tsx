import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApplicationsApi } from '../services/api';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageCircle, Users, ClipboardList, LayoutDashboard } from 'lucide-react';
import { FloatingChat } from '../components/Chat/FloatingChat';
import type { JobApplication } from '../types';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['PENDING', 'AWAITING_RECRUITER', 'ACCEPTED', 'REJECTED'] as const;

export const EmployerDashboard: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<JobApplication | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState(0);
  const [employerId, setEmployerId] = useState(1);
  const [statusApp, setStatusApp] = useState<JobApplication | null>(null);
  const [nextStatus, setNextStatus] = useState<string>('AWAITING_RECRUITER');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('employerId');
    if (raw) setEmployerId(parseInt(raw, 10));
  }, []);

  useEffect(() => {
    loadApplications();
  }, [page]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const result = await jobApplicationsApi.getAllPage(page, pageSize);
      const isSuccess = result.success || (result as any).succes || false;
      if (isSuccess && result.data) {
        setApplications(result.data.content || []);
        setTotalPages(result.data.totalPages);
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

  const submitStatus = async () => {
    if (!statusApp) return;
    try {
      setSaving(true);
      const result = await jobApplicationsApi.updateStatus({
        applicationId: statusApp.id,
        status: nextStatus,
      });
      const ok = result.success || (result as any).succes;
      if (ok) {
        toast.success(result.message || 'Status updated');
        setStatusApp(null);
        await loadApplications();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Applications, chat, and status updates</p>
            </div>
          </div>
          <Link to="/employer/post-job">
            <Button>Post new job</Button>
          </Link>
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No applications on this page</h3>
              <p className="text-gray-500">Wait for candidates to apply, or post a job listing.</p>
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
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Application #{app.id}</h3>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : app.status === 'REJECTED'
                                ? 'bg-red-100 text-red-700'
                                : app.status === 'AWAITING_RECRUITER'
                                  ? 'bg-sky-100 text-sky-800'
                                  : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Candidate: <span className="font-semibold text-gray-900 dark:text-white">ID {app.jobSeekerId}</span> ·{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{app.jobTitle}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on {new Date(app.applicationDate as unknown as string).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      onClick={() => {
                        localStorage.setItem('temp_seekerName', `Candidate #${app.jobSeekerId}`);
                        setActiveChat(app);
                      }}
                      className="flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Candidate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStatusApp(app);
                        setNextStatus(app.status);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {statusApp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardBody className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update application #{statusApp.id}</h3>
              <label className="block text-sm text-gray-600 dark:text-gray-400">New status</label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setStatusApp(null)}>
                  Cancel
                </Button>
                <Button onClick={submitStatus} disabled={saving} isLoading={saving}>
                  Save
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeChat && (
        <FloatingChat
          applicationId={activeChat.id}
          senderType="EMPLOYER"
          senderId={employerId}
          senderName={localStorage.getItem('employerCompanyName') ?? 'Recruiter'}
          jobTitle={activeChat.jobTitle ?? 'Position'}
          companyName={activeChat.employerCompanyName ?? localStorage.getItem('employerCompanyName') ?? 'Company'}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

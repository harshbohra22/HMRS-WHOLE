import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { ChatWindow } from '../components/Chat/ChatWindow';

/**
 * Full-page chat view.
 *
 * URL:  /chat/:applicationId
 * QS:   ?senderType=EMPLOYER|JOBSEEKER
 *       &senderId=<number>
 *       &senderName=<display name>
 *       &jobTitle=<job title>
 *       &companyName=<company name>
 */
export const ChatPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [searchParams] = useSearchParams();

  const senderType = searchParams.get('senderType') as 'EMPLOYER' | 'JOBSEEKER' | null;
  const senderId = searchParams.get('senderId');
  const senderName = searchParams.get('senderName') ?? 'Unknown';
  const jobTitle = searchParams.get('jobTitle') ?? 'Job Position';
  const companyName = searchParams.get('companyName') ?? 'Company';

  const appId = applicationId ? parseInt(applicationId, 10) : NaN;
  const sid = senderId ? parseInt(senderId, 10) : NaN;

  const isValid =
    !isNaN(appId) &&
    !isNaN(sid) &&
    (senderType === 'EMPLOYER' || senderType === 'JOBSEEKER');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* ── Page Header ── */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/60 px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            to="/jobs"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Jobs
          </Link>
          <div className="h-4 w-px bg-slate-700" />
          <p className="text-slate-400 text-sm">
            Real-time Chat
            {isValid && (
              <span className="ml-2 text-slate-600">— Application #{appId}</span>
            )}
          </p>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex items-start justify-center px-4 py-6">
        <div className="w-full max-w-3xl" style={{ height: 'calc(100vh - 140px)' }}>
          {!isValid ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-200 mb-1">Invalid Chat Link</p>
                <p className="text-sm text-slate-500 max-w-sm">
                  This chat link is missing required parameters. Please open it from the{' '}
                  <Link to="/jobs" className="text-indigo-400 hover:text-indigo-300 underline">
                    Jobs page
                  </Link>
                  .
                </p>
              </div>
            </div>
          ) : (
            <ChatWindow
              applicationId={appId}
              senderType={senderType}
              senderId={sid}
              senderName={senderName}
              jobTitle={jobTitle}
              companyName={companyName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

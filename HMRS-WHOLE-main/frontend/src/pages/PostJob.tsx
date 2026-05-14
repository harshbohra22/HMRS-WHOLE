import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { citiesApi, jobAdvertisementsApi, jobPositionsApi } from '../services/api';
import type { City, JobPosition } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import toast from 'react-hot-toast';

export const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [employerId, setEmployerId] = useState<number | null>(null);
  const [jobPositionId, setJobPositionId] = useState('');
  const [cityId, setCityId] = useState('');
  const [description, setDescription] = useState('');
  const [openPositionCount, setOpenPositionCount] = useState('1');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('employerId');
    if (raw) setEmployerId(parseInt(raw, 10));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([citiesApi.getAll(), jobPositionsApi.getAll()]);
        const cOk = cRes.success || cRes.succes;
        const pOk = pRes.success || pRes.succes;
        if (cOk) setCities(cRes.data || []);
        if (pOk) setPositions(pRes.data || []);
      } catch {
        toast.error('Failed to load cities or job positions');
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerId) {
      toast.error('Register as an employer first.');
      navigate('/register/employer');
      return;
    }
    if (!jobPositionId || !cityId) {
      toast.error('Select position and city');
      return;
    }
    if (description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }
    if (!applicationDeadline) {
      toast.error('Pick an application deadline');
      return;
    }
    const openings = parseInt(openPositionCount, 10);
    if (!Number.isFinite(openings) || openings < 1) {
      toast.error('Open positions must be at least 1');
      return;
    }
    try {
      setSubmitting(true);
      const result = await jobAdvertisementsApi.add({
        jobPositionId: parseInt(jobPositionId, 10),
        cityId: parseInt(cityId, 10),
        employerId,
        description: description.trim(),
        openPositionCount: openings,
        minSalary: minSalary === '' ? null : parseInt(minSalary, 10),
        maxSalary: maxSalary === '' ? null : parseInt(maxSalary, 10),
        applicationDeadline,
      });
      const ok = result.success || result.succes;
      if (ok) {
        toast.success(result.message || 'Job posted!');
        navigate('/jobs');
      } else {
        toast.error(result.message || 'Failed to post job');
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const cityOpts = cities.map((c) => ({ value: String(c.id), label: c.cityName }));
  const posOpts = positions.map((p) => ({ value: String(p.id), label: p.title }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/employer"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post a job</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">POST /api/jobPost/add</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {!employerId ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No employer ID in this browser.{' '}
                <Link to="/register/employer" className="text-blue-600 hover:underline">
                  Register as employer
                </Link>
              </p>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <Select
                  label="Job position"
                  options={posOpts}
                  value={jobPositionId}
                  onChange={(e) => setJobPositionId(e.target.value)}
                />
                <Select label="City" options={cityOpts} value={cityId} onChange={(e) => setCityId(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                    placeholder="Role summary, requirements, stack…"
                  />
                </div>
                <Input
                  label="Open positions"
                  type="number"
                  min={1}
                  value={openPositionCount}
                  onChange={(e) => setOpenPositionCount(e.target.value)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Min salary (optional)" type="number" min={0} value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
                  <Input label="Max salary (optional)" type="number" min={0} value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
                </div>
                <Input
                  label="Application deadline"
                  type="date"
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" isLoading={submitting} disabled={submitting}>
                  Publish listing
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

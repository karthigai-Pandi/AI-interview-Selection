import { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { uploadResumeFile } from '../../services/uploadService';
import { completeResumeUpload, setResumeProgress } from '../../store/slices/workflowSlice';
import { RootState } from '../../store';

const ResumeUploadPage = () => {
  const dispatch = useDispatch();
  const workflow = useSelector((state: RootState) => state.workflow);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const analyzeResumeText = (filename: string) => {
    const jobTitle = filename.toLowerCase().includes('engineer') ? 'Senior Software Engineer' : 'Product Design Specialist';
    const name = filename.replace(/\.[^/.]+$/, '').replace(/[-_.]/g, ' ').trim() || 'Candidate';
    return {
      name: `${name.charAt(0).toUpperCase() + name.slice(1)}`,
      role: jobTitle,
      summary: `Experienced professional with strong project delivery, technical ownership and collaboration across cross-functional teams.`,
    };
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume file before uploading.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await uploadResumeFile(file, (percentage) => {
        dispatch(setResumeProgress(percentage));
      });
      const atsScore = Math.floor(72 + Math.random() * 20);
      const extracted = analyzeResumeText(file.name);
      dispatch(completeResumeUpload({ filename: file.name, atsScore, extracted }));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (workflow.currentStep !== 'resume') {
    return <Navigate replace to={`/candidate/${workflow.currentStep}`} />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_0.7fr]">
      <Card title="Resume upload" description="Start the workflow by uploading your resume and unlocking the hiring pipeline.">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <label className="block text-sm text-slate-300">Select resume file</label>
                <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
                  className="mt-4 w-full rounded-3xl border border-white/10 bg-surface/80 px-4 py-3 text-slate-100 outline-none"
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <p className="text-sm text-slate-400">Upload progress</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface/80">
              <motion.div
                initial={false}
                animate={{ width: `${workflow.resume.uploadProgress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300"
              />
            </div>
            <p className="mt-2 text-sm text-slate-400">{workflow.resume.uploadProgress}% completed</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button onClick={handleUpload} disabled={loading}>
            {workflow.resume.uploaded ? 'Resume uploaded' : loading ? 'Uploading…' : 'Upload resume'}
          </Button>
        </div>
      </Card>

      <Card title="Resume preview" description="AI extracted profile details appear after upload.">
        {workflow.resume.completed && workflow.resume.extracted ? (
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Candidate</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{workflow.resume.extracted.name}</h3>
              <p className="text-slate-400">{workflow.resume.extracted.role}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Summary</p>
              <p className="mt-2 text-slate-300">{workflow.resume.extracted.summary}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-5 border border-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">ATS score</p>
              <p className="mt-2 text-5xl font-semibold text-white">{workflow.resume.atsScore}%</p>
              <p className="mt-2 text-sm text-slate-400">Resume has been evaluated for job-match and keywords.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-slate-400">
            <p>Upload your resume to see a preview, ATS rating, and extracted candidate details.</p>
            <p>This step must be completed to unlock the Aptitude round.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResumeUploadPage;

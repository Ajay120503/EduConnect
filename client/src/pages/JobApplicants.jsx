import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  Clock,
  GraduationCap,
} from "lucide-react";
import API from "../utils/axios";
import toast from "react-hot-toast";

const statusColors = {
  applied: "badge-ghost",
  reviewed: "badge-info",
  shortlisted: "badge-warning",
  rejected: "badge-error",
  selected: "badge-success",
};

const statusSteps = ["applied", "reviewed", "shortlisted", "selected"];

const JobApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, appRes] = await Promise.all([
          API.get(`/jobs/${id}`),
          API.get(
            `/jobs/${id}/applicants${
              filterStatus ? `?status=${filterStatus}` : ""
            }`
          ),
        ]);
        setJob(jobRes.data.job);
        setApplications(appRes.data.applications);
      } catch {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, filterStatus]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await API.put(`/jobs/applications/${applicationId}/status`, { status });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="h-8 w-48 skeleton rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card border border-base-300/50 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full skeleton"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 skeleton rounded"></div>
                  <div className="h-3 w-48 skeleton rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p>Job not found</p>
        <Link to="/jobs" className="btn btn-primary mt-4">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <Link
        to="/jobs"
        className="text-primary text-sm flex items-center gap-1 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="card bg-base-100 border border-base-300/50 p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold font-heading">{job.title}</h1>
            <p className="text-sm text-base-content/60 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              {job.institutionName} · {job.location}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-base-content/50">
              <UserCheck className="w-4 h-4" />
              {applications.length} applicant{applications.length !== 1 && "s"}
            </span>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm font-medium text-base-content/60">
          Filter:
        </span>
        {["", "applied", "reviewed", "shortlisted", "selected", "rejected"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`badge badge-sm cursor-pointer transition-all ${
                filterStatus === status
                  ? "badge-primary"
                  : status
                  ? `${statusColors[status]} hover:opacity-70`
                  : "badge-ghost hover:badge-primary"
              }`}
            >
              {status || "All"}
            </button>
          )
        )}
      </div>

      {/* Applications */}
      {applications.length === 0 ? (
        <div className="text-center py-16">
          <Eye className="w-16 h-16 mx-auto text-base-content/15 mb-4" />
          <p className="text-base-content/40 font-medium">
            No applications yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="card bg-base-100 border border-base-300/50 shadow-sm hover:shadow-md transition-all p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Applicant Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden flex-shrink-0 ring-2 ring-base-100 shadow-sm">
                    {app.applicant?.profilePic?.url ? (
                      <img
                        src={app.applicant.profilePic.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                        {app.applicant?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/profile/${app.applicant?._id}`}
                      className="font-semibold text-sm hover:text-primary transition-colors"
                    >
                      {app.applicant?.name || "Unknown"}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {app.applicant?.educationLevel && (
                        <span className="text-xs text-base-content/40 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {app.applicant.educationLevel}
                        </span>
                      )}
                      {app.applicant?.city && (
                        <span className="text-xs text-base-content/40">
                          · {app.applicant.city}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {app.applicant?.skills?.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="badge badge-xs badge-ghost text-[10px]"
                        >
                          {skill}
                        </span>
                      ))}
                      {app.applicant?.skills?.length > 3 && (
                        <span className="text-[10px] text-base-content/30">
                          +{app.applicant.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-3 flex-shrink-0">
                  <span
                    className={`badge badge-sm ${
                      statusColors[app.status] || "badge-ghost"
                    } font-medium`}
                  >
                    {app.status}
                  </span>

                  {/* Status update buttons */}
                  <div className="flex items-center gap-1">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = statusSteps.indexOf(app.status);
                      const isPast = currentIdx >= idx;
                      return (
                        <button
                          key={step}
                          onClick={() => handleStatusUpdate(app._id, step)}
                          disabled={step === app.status}
                          title={`Mark as ${step}`}
                          className={`btn btn-xs btn-circle transition-all ${
                            step === app.status
                              ? "btn-primary"
                              : isPast
                              ? "btn-ghost text-primary/40"
                              : "btn-ghost text-base-content/20 hover:text-primary"
                          }`}
                        >
                          {step === "rejected" ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : step === "selected" ? (
                            <CheckCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </button>
                      );
                    })}
                    {/* Reject button */}
                    {app.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusUpdate(app._id, "rejected")}
                        title="Reject"
                        className="btn btn-xs btn-circle btn-ghost text-error/50 hover:text-error"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {app.applicant?.email && (
                    <a
                      href={`mailto:${app.applicant.email}`}
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <Mail className="w-3 h-3" /> Email
                    </a>
                  )}
                </div>
              </div>

              {app.coverLetter && (
                <div className="mt-3 pt-3 border-t border-base-200">
                  <p className="text-xs text-base-content/50 mb-1 font-medium">
                    Cover Letter
                  </p>
                  <p className="text-sm text-base-content/70 line-clamp-3">
                    {app.coverLetter}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;

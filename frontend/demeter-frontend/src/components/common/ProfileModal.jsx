import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ProfileModal({
  open,
  onClose,
  setProfilePhoto,
  profilePhoto
}) {

  const { user } = useAuth();

  const name = user?.username || "Student";
  const studentId = user?.userId || "N/A";
  const batch = "N/A";

  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-20 sm:justify-end sm:pr-6 z-50">

      <div className="w-[90vw] max-w-[360px] max-h-[calc(100vh-6rem)] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-gray-900 dark:text-white text-lg font-semibold">
            Student Profile
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-300"
          >
            <X size={16}/>
          </button>

        </div>

        {/* PROFILE PHOTO */}
        <div className="flex flex-col items-center mb-6">

          <div className="relative w-24 h-24">

            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden text-gray-700 dark:text-white text-xl font-semibold">

              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}

            </div>

            {profilePhoto && (
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600"
              >
                <X size={12}/>
              </button>
            )}

          </div>

          <label className="text-teal-600 dark:text-teal-400 text-sm cursor-pointer hover:underline mt-3">
            Change Photo
            <input
              type="file"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>

        </div>

        {/* INFO */}
        <div className="space-y-4 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-slate-400">Name</span>
            <span className="text-gray-900 dark:text-white">{name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-slate-400">Student ID</span>
            <span className="text-gray-900 dark:text-white">{studentId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-slate-400">Batch</span>
            <span className="text-gray-900 dark:text-white">{batch}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
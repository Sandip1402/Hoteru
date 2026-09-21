import { useEffect, useState } from "react";
import { FaCamera, FaCheckCircle, FaPen } from "react-icons/fa";

import { useHoteruAuth } from "../auth/HoteruAuthProvider";
import { useUserService } from "../hooks/useUserService";

const getInitials = (firstname, lastname, name) => {
  const first = firstname?.trim()?.[0];
  const last = lastname?.trim()?.[0];

  if (first || last) {
    return `${first || ""}${last || ""}`.toUpperCase();
  }

  if (name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return "U";
};

const formatDate = (date) => {
  if (!date) return "Not provided";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not provided";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const Profile = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    currentUser,
  } = useHoteruAuth();

  const {
    updateUser,
    updateProfileImage,
  } = useUserService();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    country: "",
    DOB: "",
  });

  // Combine Auth0 + DB user data. DB data takes priority
  useEffect(() => {
    if (!user && !currentUser) {
      setProfileData(null);
      return;
    }

    const authName = user?.name || "";

    const authNameParts = authName.trim().split(" ").filter(Boolean);

    setProfileData({
      image:
        currentUser?.image ||
        user?.picture ||
        null,

      firstname:
        currentUser?.firstname ||
        authNameParts[0] ||
        "",

      lastname:
        currentUser?.lastname ||
        authNameParts.slice(1).join(" ") ||
        "",

      email:
        currentUser?.email ||
        user?.email ||
        "",

      country:
        currentUser?.country ||
        "",

      DOB:
        currentUser?.DOB ||
        null,

      emailVerified:
        user?.email_verified || false,

      nickname:
        user?.nickname || "",

      createdAt:
        currentUser?.createdAt || null,

      roles:
        currentUser?.roles || [],
    });
  }, [user, currentUser]);

  /*
   * Populate edit form whenever
   * DB/Auth data changes.
   */
  useEffect(() => {
    if (!profileData) return;

    setForm({
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      country: profileData.country || "",
      DOB: profileData.DOB
          ? new Date(profileData.DOB).toISOString().split('T')[0] 
          : null, 
    });
  }, [profileData]);

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="
                rounded-2xl
                border border-border
                bg-white
                p-6
            ">
        <p className="text-sm text-text-muted">
          Loading profile...
        </p>
      </div>
    );
  }

  /*
   * Not authenticated
   */
  if (!isAuthenticated || !profileData) {
    return (
      <div className="
                rounded-2xl
                border border-border
                bg-white
                p-6
            ">
        <h2 className="
                    text-lg
                    font-semibold
                    text-text
                ">
          Profile unavailable
        </h2>

        <p className="
                    mt-2
                    text-sm
                    text-text-muted
                ">
          Unable to load your profile information.
        </p>
      </div>
    );
  }

  const displayName =
    [profileData.firstname, profileData.lastname]
      .filter(Boolean)
      .join(" ") ||
    user?.name ||
    "Hoteru User";

  const initials = getInitials(
    profileData.firstname,
    profileData.lastname,
    user?.name
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setForm({
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      country: profileData.country || "",
      DOB: profileData.DOB
          ? new Date(profileData.DOB).toISOString().split('T')[0] 
          : null, 
    });

    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!form.firstname.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.lastname.trim()) {
      setError("Last name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const updatedDOB = form.DOB
        ? new Date(
          `${form.DOB}T00:00:00.000Z`
        ).toISOString()
        : null;

      await updateUser({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        country: form.country.trim() || null,
        DOB: updatedDOB,
      });

      /*
       * Update the UI immediately.
       * currentUser from Auth0/context may still
       * contain the previous DB values.
       */
      setProfileData((previous) => ({
        ...previous,
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        country: form.country.trim() || "",
        DOB: updatedDOB,
      }));

      setSuccess("Profile updated successfully.");
      setIsEditing(false);

    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err.message ||
        "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);

      const response = await updateProfileImage(file);

      const imageUrl =
        response?.data?.imageUrl;

      if (imageUrl) {
        setProfileData((previous) => ({
          ...previous,
          image: imageUrl,
        }));
      }

      setSuccess(
        response?.message ||
        "Profile image updated successfully."
      );

    } catch (err) {
      console.error(
        "Failed to update profile image:",
        err
      );

      setError(
        err.message ||
        "Unable to update profile image."
      );
    } finally {
      setIsUploading(false);

      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">

      {/* Profile header */}
      <section className="
                overflow-hidden
                rounded-2xl
                border border-border
                bg-white
            ">
        <div className="
                    bg-surface
                    px-5 py-6
                    sm:px-7 sm:py-8
                ">
          <div className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

            {/* Profile identity */}
            <div className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                        ">
              {/* Avatar */}
              <div className="
                                relative
                                h-20 w-20
                                shrink-0
                                sm:h-24 sm:w-24
                            ">
                {profileData.image ? (
                  <img
                    src={profileData.image}
                    alt={displayName}
                    className="
                                            h-full w-full
                                            rounded-full
                                            border-4
                                            border-white
                                            object-cover
                                            shadow-sm
                                        "
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="
                                        flex
                                        h-full w-full
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-primary/10
                                        text-xl
                                        font-semibold
                                        text-primary
                                        sm:text-2xl
                                    ">
                    {initials}
                  </div>
                )}

                {/* Change image */}
                <label className="
                                    absolute
                                    bottom-0
                                    right-0
                                    flex
                                    h-8 w-8
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    border-white
                                    bg-primary
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-primary-dark
                                ">
                  <FaCamera size={12} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleImageChange
                    }
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Name */}
              <div className="min-w-0">
                <h2 className="
                                    truncate
                                    text-xl
                                    font-semibold
                                    text-text
                                    sm:text-2xl
                                ">
                  {displayName}
                </h2>

                <p className="
                                    mt-1
                                    truncate
                                    text-sm
                                    text-text-muted
                                ">
                  {profileData.email}
                </p>

                {profileData.emailVerified && (
                  <span className="
                                        mt-2
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        font-medium
                                        text-green-600
                                    ">
                    <FaCheckCircle
                      size={12}
                    />
                    Email verified
                  </span>
                )}
              </div>
            </div>

            {/* Edit */}
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setIsEditing(true);
                }}
                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-lg
                                    border border-border
                                    bg-white
                                    px-4 py-2.5
                                    text-sm
                                    font-semibold
                                    text-text
                                    transition
                                    hover:bg-surface
                                "
              >
                <FaPen size={11} />
                Edit profile
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div className="
                    rounded-xl
                    border border-red-200
                    bg-red-50
                    px-4 py-3
                ">
          <p className="
                        text-sm
                        text-red-600
                    ">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="
                    rounded-xl
                    border border-green-200
                    bg-green-50
                    px-4 py-3
                ">
          <p className="
                        text-sm
                        text-green-700
                    ">
            {success}
          </p>
        </div>
      )}

      {/* Personal information */}
      <section className="
                rounded-2xl
                border border-border
                bg-white
            ">
        <div className="
                    border-b border-border
                    px-5 py-5
                    sm:px-6
                ">
          <h2 className="
                        text-lg
                        font-semibold
                        text-text
                    ">
            Personal information
          </h2>

          <p className="
                        mt-1
                        text-sm
                        text-text-muted
                    ">
            Your basic profile information.
          </p>
        </div>

        <div className="
                    px-5 py-5
                    sm:px-6 sm:py-6
                ">
          {isEditing ? (
            <div className="
                            grid
                            gap-5
                            sm:grid-cols-2
                        ">

              {/* First name */}
              <div>
                <label
                  htmlFor="firstname"
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-text
                                    "
                >
                  First name
                </label>

                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={form.firstname}
                  onChange={handleChange}
                  className="
                                        w-full
                                        rounded-lg
                                        border border-border
                                        bg-white
                                        px-3 py-2.5
                                        text-sm
                                        text-text
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/10
                                    "
                />
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="lastname"
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-text
                                    "
                >
                  Last name
                </label>

                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={handleChange}
                  className="
                                        w-full
                                        rounded-lg
                                        border border-border
                                        bg-white
                                        px-3 py-2.5
                                        text-sm
                                        text-text
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/10
                                    "
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-text
                                    "
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  className="
                                        w-full
                                        rounded-lg
                                        border border-border
                                        bg-white
                                        px-3 py-2.5
                                        text-sm
                                        text-text
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/10
                                    "
                />
              </div>

              {/* DOB */}
              <div>
                <label
                  htmlFor="DOB"
                  className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-text
                                    "
                >
                  Date of birth
                </label>

                <input
                  id="DOB"
                  name="DOB"
                  type="date"
                  value={form.DOB}
                  onChange={handleChange}
                  className="
                                        block
                                        w-full
                                        min-w-0
                                        rounded-lg
                                        border border-border
                                        bg-white
                                        px-3 py-2.5
                                        text-sm
                                        text-text
                                        outline-none
                                        transition
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/10
                                    "
                />
              </div>

              {/* Buttons */}
              <div className="
                                flex
                                flex-col-reverse
                                gap-3
                                border-t border-border
                                pt-5
                                sm:col-span-2
                                sm:flex-row
                                sm:justify-end
                            ">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="
                                        rounded-lg
                                        border border-border
                                        px-5 py-2.5
                                        text-sm
                                        font-semibold
                                        text-text
                                        transition
                                        hover:bg-surface
                                        disabled:opacity-50
                                    "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="
                                        rounded-lg
                                        bg-primary
                                        px-5 py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-primary-dark
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                >
                  {isSaving
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="
                            grid
                            gap-x-8
                            gap-y-6
                            sm:grid-cols-2
                        ">
              <InfoItem
                label="First name"
                value={
                  profileData.firstname ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Last name"
                value={
                  profileData.lastname ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Email"
                value={
                  profileData.email ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Country"
                value={
                  profileData.country ||
                  "Not provided"
                }
              />

              <InfoItem
                label="Date of birth"
                value={formatDate(profileData.DOB)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Account information */}
      {!isEditing && (
        <section className="
                    rounded-2xl
                    border border-border
                    bg-white
                ">
          <div className="
                        border-b border-border
                        px-5 py-5
                        sm:px-6
                    ">
            <h2 className="
                            text-lg
                            font-semibold
                            text-text
                        ">
              Account information
            </h2>

            <p className="
                            mt-1
                            text-sm
                            text-text-muted
                        ">
              Information managed by Hoteru.
            </p>
          </div>

          <div className="
                        grid
                        gap-x-8
                        gap-y-6
                        px-5 py-5
                        sm:grid-cols-2
                        sm:px-6 sm:py-6
                    ">
            <InfoItem
              label="Member since"
              value={formatDate(
                profileData.createdAt
              )}
            />

            <InfoItem
              label="Account email"
              value={profileData.email}
            />

            <InfoItem
              label="Email verification"
              value={
                profileData.emailVerified
                  ? "Verified"
                  : "Not verified"
              }
            />
          </div>
        </section>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div className="min-w-0">
      <p className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-text-light
            ">
        {label}
      </p>

      <p className="
                mt-1.5
                break-words
                text-sm
                font-medium
                text-text
            ">
        {value}
      </p>
    </div>
  );
};
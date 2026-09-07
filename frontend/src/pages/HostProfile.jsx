import { useEffect, useState } from "react";
import { useHostService } from "../hooks/useHostService.js";

export const HostProfile = () => {
    const { getHostProfile } = useHostService();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getHostProfile();

                setProfile(response.data);
            } catch (err) {
                console.error("Failed to fetch host profile:", err);

                setError(
                    err.message || "Failed to load host profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="w-full bg-white rounded-box p-5 shadow-md">
                <div className="animate-pulse space-y-5">

                    <div className="h-8 w-48 bg-gray-200 rounded" />

                    <div className="space-y-3">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white rounded-box p-5 shadow-md">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    const { user, host } = profile;

    return (
        <div className="w-full space-y-5">

            {/* Profile header */}
            <div className="bg-white rounded-box p-5 shadow-md">

                <div className="flex items-center gap-4">

                    <img
                        src={
                            user.image ||
                            "/default-avatar.png"
                        }
                        alt="Profile"
                        className="
                            w-20 h-20
                            rounded-full
                            object-cover
                        "
                    />

                    <div>
                        <h2 className="text-xl font-semibold">
                            {user.firstname || user.lastname
                                ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
                                : "Host"}
                        </h2>

                        <p className="text-gray-500">
                            {user.email}
                        </p>
                    </div>

                </div>

            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-box p-5 shadow-md">

                <h2 className="text-lg font-semibold mb-5">
                    Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                    <InfoField
                        label="First Name"
                        value={user.firstname}
                    />

                    <InfoField
                        label="Last Name"
                        value={user.lastname}
                    />

                    <InfoField
                        label="Email"
                        value={user.email}
                    />

                    <InfoField
                        label="Date of Birth"
                        value={
                            user.DOB
                                ? new Date(user.DOB).toLocaleDateString()
                                : null
                        }
                    />

                    <InfoField
                        label="Country"
                        value={user.country}
                    />

                </div>

            </div>

            {/* Host Information */}
            <div className="bg-white rounded-box p-5 shadow-md">

                <h2 className="text-lg font-semibold mb-5">
                    Host Information
                </h2>

                {!host ? (
                    <p className="text-gray-500">
                        No host request information found.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">

                        <InfoField
                            label="Business Name"
                            value={host.businessName}
                        />

                        <InfoField
                            label="Phone Number"
                            value={host.phoneNumber}
                        />

                        <InfoField
                            label="Government ID Type"
                            value={host.governmentIdType}
                        />

                        <InfoField
                            label="Host Status"
                            value={host.status}
                            capitalize
                        />

                        <InfoField
                            label="Request Date"
                            value={
                                host.createdAt
                                    ? new Date(
                                        host.createdAt
                                    ).toLocaleDateString()
                                    : null
                            }
                        />

                        <InfoField
                            label="Verified Date"
                            value={
                                host.verifiedAt
                                    ? new Date(
                                        host.verifiedAt
                                    ).toLocaleDateString()
                                    : null
                            }
                        />

                    </div>
                )}

            </div>

        </div>
    );
};


const InfoField = ({
    label,
    value,
    capitalize = false,
}) => {
    return (
        <div>
            <p className="text-sm text-gray-500 mb-1">
                {label}
            </p>

            <div className="min-h-10 flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                <p
                    className={
                        capitalize
                            ? "capitalize"
                            : ""
                    }
                >
                    {value || "Not provided"}
                </p>
            </div>
        </div>
    );
};
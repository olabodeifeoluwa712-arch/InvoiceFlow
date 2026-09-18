import { useEffect, useState } from "react";
import { useBusiness } from "../../Context/BusinessContext";
import { useTheme } from "../../Context/ThemeContext";
import api from "../../api/http";

const steps = [
    {
        number: 1,
        title: "Business Information",
        description: "Tell us about your business",
        key: "businessInformation",
    },
    {
        number: 2,
        title: "Owner Information",
        description: "Add the business owner's details",
        key: "ownerInformation",
    },
    {
        number: 3,
        title: "Documents",
        description: "Verify your business",
        key: "businessDocuments",
    },
];

const emptyBusiness = {
    name: "",
    contactNumber: "",
    rcNumber: "",
    industry: "",
    address: {
        street: "",
        city: "",
        state: "",
        country: "Nigeria",
    },
    defaultCurrency: "",
};

const emptyOwner = {
    fullName: "",
    idType: "",
    idNumber: "",
    address: {
        street: "",
        city: "",
        state: "",
        country: "Nigeria",
    },
    phoneNumber: "",
    email: "",
};

const emptyDocuments = {
    passportPhoto: "",
    idDocument: "",
    proofOfAddress: "",
};

export default function CreateBusiness() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const {
        setBusiness,
        getMyBusiness,
        createBusiness,
        updateOwnerDetails,
        uploadDocument,
        currentUser,
    } = useBusiness();

    const [businessId, setBusinessId] = useState(null);

    const [businessData, setBusinessData] =
        useState(emptyBusiness);

    const [currencies, setCurrencies] = useState([]);
    const [loadingCurrencies, setLoadingCurrencies] =
        useState(true);

    const [ownerData, setOwnerData] =
        useState(emptyOwner);

    const [documents, setDocuments] =
        useState(emptyDocuments);

    const [currentStep, setCurrentStep] = useState(1);

    /*
    |--------------------------------------------------------------------------
    | Backend completion state
    |--------------------------------------------------------------------------
    */

    const [completedSteps, setCompletedSteps] = useState({
        businessInformation: false,
        ownerInformation: false,
        businessDocuments: false,
    });

    const [loadingProfile, setLoadingProfile] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Reusable Change Handler
    |--------------------------------------------------------------------------
    */

    const handleChange = (e, setState) => {
        const { name, value } = e.target;

        setState((prev) => {
            const keys = name.split(".");

            // Normal field
            if (keys.length === 1) {
                return {
                    ...prev,
                    [name]: value,
                };
            }

            // Nested field
            const updated = { ...prev };

            let current = updated;

            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current[key] = {
                        ...current[key],
                    };

                    current = current[key];
                }
            });

            return updated;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Load Existing Profile
    |--------------------------------------------------------------------------
    */

    const loadExistingProfile = async () => {
        try {
            setLoadingProfile(true);

            const business = await getMyBusiness();

            /*
             * No business exists yet.
             */

            if (!business) {
                setCurrentStep(1);

                setCompletedSteps({
                    businessInformation: false,
                    ownerInformation: false,
                    businessDocuments: false,
                });

                return;
            }

            /*
             * Business ID
             */

            setBusinessId(business._id);

            /*
             * Business information
             */

            setBusinessData({
                name: business.name || "",
                email:
                    business.email ||
                    currentUser?.email ||
                    "",
                contactNumber:
                    business.contactNumber || "",
                rcNumber: business.rcNumber || "",
                industry: business.industry || "",

                address: {
                    street:
                        business.address?.street || "",
                    city:
                        business.address?.city || "",
                    state:
                        business.address?.state || "",
                    country:
                        business.address?.country ||
                        "Nigeria",
                },

                defaultCurrency:
                    business.defaultCurrency || "",
            });

            /*
             * Owner information
             */

            if (business.owner) {
                setOwnerData({
                    fullName:
                        business.owner.fullName || "",

                    idType:
                        business.owner.idType || "",

                    idNumber:
                        business.owner.idNumber || "",

                    address: {
                        street:
                            business.owner.address?.street ||
                            "",
                        city:
                            business.owner.address?.city ||
                            "",
                        state:
                            business.owner.address?.state ||
                            "",
                        country:
                            business.owner.address?.country ||
                            "Nigeria",
                    },

                    phoneNumber:
                        business.owner.phoneNumber || "",

                    email:
                        business.owner.email || "",
                });
            }

            /*
             * Documents
             */

            setDocuments({
                passportPhoto:
                    business.owner?.passportPhotoUrl || "",

                idDocument:
                    business.owner?.idDocumentUrl || "",

                proofOfAddress:
                    business.proofOfAddressUrl || "",
            });

            /*
             |--------------------------------------------------------------------------
             | IMPORTANT
             |--------------------------------------------------------------------------
             | Backend is the source of truth for completion.
             */

            const completed =
                business.completedSteps || {};

            setCompletedSteps({
                businessInformation:
                    completed.businessInformation || false,

                ownerInformation:
                    completed.ownerInformation || false,

                businessDocuments:
                    completed.businessDocuments || false,
            });

            /*
             * Resume at the first incomplete step.
             *
             * This ONLY decides the initial screen.
             * It does NOT control the progress percentage.
             */

            if (!completed.businessInformation) {
                setCurrentStep(1);
            } else if (!completed.ownerInformation) {
                setCurrentStep(2);
            } else if (!completed.businessDocuments) {
                setCurrentStep(3);
            } else {
                setCurrentStep(3);
            }
        } catch (error) {
            console.error(
                "Failed to load existing profile:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Unable to load your business profile."
            );
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        loadExistingProfile();

        const fetchCurrencies = async () => {
            try {
                setLoadingCurrencies(true);

                const response =
                    await api.get("/currencies");

                console.log(
                    "Currencies response:",
                    response
                );

                setCurrencies(
                    response.currencies || []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch currencies:",
                    error
                );

                setCurrencies([]);
            } finally {
                setLoadingCurrencies(false);
            }
        };

        fetchCurrencies();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Business Submit
    |--------------------------------------------------------------------------
    */

    const handleBusinessSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        try {
            setSubmitting(true);

            const response =
                await createBusiness(
                    businessData
                );

            console.log(
                "CREATE BUSINESS RESPONSE:",
                response
            );

            console.log(
                "RESPONSE BUSINESS:",
                response?.business
            );

            console.log(
                "RESPONSE BUSINESS ID:",
                response?.business?._id
            );

            /*
             * Do not show success unless backend
             * actually confirms creation.
             */

            if (
                response.success &&
                response.business
            ) {
                setBusiness(response.business);
            }

            if (!response?.success) {
                setErrorMessage(
                    response?.message ||
                    response?.error ||
                    "Unable to create business."
                );

                return;
            }

            /*
             * ID is released after successful creation.
             */

            const id =
                response.business?._id;

            if (id) {
                setBusinessId(id);
            }

            /*
             * Mark the step complete locally
             * only after successful backend response.
             */

            setCompletedSteps((prev) => ({
                ...prev,
                businessInformation: true,
            }));

            setSuccessMessage(
                response.message ||
                "Business information saved successfully."
            );

            setCurrentStep(2);
        } catch (error) {
            console.error(
                "Business creation failed:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Unable to create business. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Owner Submit
    |--------------------------------------------------------------------------
    */

    const handleOwnerSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        try {
            setSubmitting(true);

            console.log(
                "BUSINESS ID BEFORE OWNER UPDATE:",
                businessId
            );

            const response =
                await updateOwnerDetails(
                    businessId,
                    ownerData
                );

            /*
             * Backend must confirm the update.
             */

            if (response?.success === false) {
                setErrorMessage(
                    response?.message ||
                    "Unable to save owner information."
                );

                return;
            }

            setCompletedSteps((prev) => ({
                ...prev,
                ownerInformation: true,
            }));

            setSuccessMessage(
                response?.message ||
                "Owner information saved successfully."
            );

            setCurrentStep(3);
        } catch (error) {
            console.error(
                "Owner details update failed:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Unable to save owner information."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Documents Submit
    |--------------------------------------------------------------------------
    */

    const handleDocumentsSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        try {
            setSubmitting(true);

            const formData = new FormData();

            if (
                documents.passportPhoto instanceof File
            ) {
                formData.append(
                    "passportPhoto",
                    documents.passportPhoto
                );
            }

            if (
                documents.idDocument instanceof File
            ) {
                formData.append(
                    "idDocument",
                    documents.idDocument
                );
            }

            if (
                documents.proofOfAddress instanceof File
            ) {
                formData.append(
                    "proofOfAddress",
                    documents.proofOfAddress
                );
            }

            /*
             * Don't send an empty upload request.
             */

            if (
                !documents.passportPhoto &&
                !documents.idDocument &&
                !documents.proofOfAddress
            ) {
                setErrorMessage(
                    "Please select at least one document to upload."
                );

                return;
            }

            console.log("FORM DATA CONTENT:");

            for (
                const [key, value]
                of formData.entries()
            ) {
                console.log(
                    key,
                    value,
                    value instanceof File,
                    value instanceof File
                        ? value.name
                        : ""
                );
            }

            const response =
                await uploadDocument(
                    formData,
                    businessId
                );

            if (response?.success === false) {
                setErrorMessage(
                    response?.message ||
                    "Unable to upload business documents."
                );

                return;
            }

            setCompletedSteps((prev) => ({
                ...prev,
                businessDocuments: true,
            }));

            setSuccessMessage(
                response?.message ||
                "Business documents uploaded successfully."
            );
        } catch (error) {
            console.error(
                "Document upload failed:",
                error
            );

            setErrorMessage(
                error?.message ||
                "Unable to add business document. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | File Selection
    |--------------------------------------------------------------------------
    */

    const handleFileChange = (e, field) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setDocuments((prev) => ({
            ...prev,
            [field]: file,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    /*
    |--------------------------------------------------------------------------
    | Clickable Step Navigation
    |--------------------------------------------------------------------------
    */

    const handleStepClick = (stepNumber) => {
        setErrorMessage("");
        setSuccessMessage("");

        /*
         * A user can view any step that has already
         * been completed.
         *
         * We also allow moving to the current step.
         */

        if (stepNumber === currentStep) {
            return;
        }

        const selectedStep =
            steps.find(
                (step) =>
                    step.number === stepNumber
            );

        if (!selectedStep) return;

        const isCompleted =
            completedSteps[selectedStep.key];

        const previousStepsCompleted =
            steps
                .filter(
                    (step) =>
                        step.number < stepNumber
                )
                .every(
                    (step) =>
                        completedSteps[step.key]
                );

        /*
         * Don't allow jumping into an unfinished
         * step whose previous step isn't complete.
         */

        if (
            !isCompleted &&
            !previousStepsCompleted
        ) {
            return;
        }

        setCurrentStep(stepNumber);
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loadingProfile) {
        return (
            <div
                className={`min-w-0 w-full px-6 py-6 lg:px-8 ${isDark
                        ? "bg-slate-950 text-white"
                        : "bg-slate-50 text-gray-900"
                    }`}
            >
                <div className="flex items-center justify-center py-20">
                    <p
                        className={`text-sm ${isDark
                                ? "text-slate-400"
                                : "text-gray-500"
                            }`}
                    >
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | REAL PROFILE COMPLETION
    |--------------------------------------------------------------------------
    */

    const completedCount =
        Object.values(completedSteps).filter(
            Boolean
        ).length;

    const completionPercentage =
        Math.round(
            (completedCount / 3) * 100
        );

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (
        <div
            className={`min-w-0 w-full px-6 py-6 lg:px-8 ${isDark
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-gray-900"
                }`}
        >
            {/* HEADER */}

            <div className="mb-8">
                <p className="text-sm font-medium text-[#7C3AED]">
                    Business Profile
                </p>

                <h1
                    className={`mt-1 text-2xl font-bold ${isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                >
                    Set up your business profile
                </h1>

                <p
                    className={`mt-2 max-w-2xl text-sm ${isDark
                            ? "text-slate-400"
                            : "text-gray-500"
                        }`}
                >
                    Complete your profile to start using
                    InvoiceFlow. You can return to any
                    completed section whenever you need
                    to make changes.
                </p>
            </div>

            {/* MAIN LAYOUT */}

            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

                {/* LEFT PROGRESS PANEL */}

                <aside
                    className={`h-fit rounded-2xl border p-6 ${isDark
                            ? "border-slate-800 bg-slate-900"
                            : "border-gray-200 bg-white"
                        }`}
                >
                    {/* CIRCLE */}

                    <div className="flex justify-center">
                        <div
                            className="relative flex h-40 w-40 items-center justify-center rounded-full"
                            style={{
                                background: `conic-gradient(
                                    #7C3AED ${completionPercentage}%,
                                    ${isDark
                                        ? "#1E293B"
                                        : "#F3F4F6"
                                    } ${completionPercentage}% 100%
                                )`,
                            }}
                        >
                            <div
                                className={`flex h-32 w-32 flex-col items-center justify-center rounded-full ${isDark
                                        ? "bg-slate-900"
                                        : "bg-white"
                                    }`}
                            >
                                <span
                                    className={`text-3xl font-bold ${isDark
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                >
                                    {completionPercentage}%
                                </span>

                                <span
                                    className={`mt-1 text-xs ${isDark
                                            ? "text-slate-500"
                                            : "text-gray-400"
                                        }`}
                                >
                                    Profile complete
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* PROGRESS TEXT */}

                    <div className="mt-6 text-center">
                        <p
                            className={`text-sm font-semibold ${isDark
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                        >
                            Profile setup
                        </p>

                        <p
                            className={`mt-1 text-xs ${isDark
                                    ? "text-slate-500"
                                    : "text-gray-400"
                                }`}
                        >
                            {completedCount} of 3 steps completed
                        </p>
                    </div>

                    {/* STEPS */}

                    <div className="mt-8">
                        {steps.map((step, index) => {
                            const active =
                                currentStep ===
                                step.number;

                            const completed =
                                completedSteps[
                                step.key
                                ];

                            const previousCompleted =
                                index === 0 ||
                                completedSteps[
                                steps[index - 1].key
                                ];

                            const clickable =
                                completed ||
                                active ||
                                previousCompleted;

                            return (
                                <div
                                    key={step.number}
                                    className="relative"
                                >
                                    {/* CONNECTING DOT */}

                                    {index <
                                        steps.length - 1 && (
                                            <div
                                                className={`absolute left-[17px] top-10 h-10 w-px ${isDark
                                                        ? "bg-slate-800"
                                                        : "bg-gray-200"
                                                    }`}
                                            />
                                        )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStepClick(
                                                step.number
                                            )
                                        }
                                        disabled={
                                            !clickable
                                        }
                                        className={`relative z-10 flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${active
                                                ? isDark
                                                    ? "bg-slate-800"
                                                    : "bg-[#F3EEFF]"
                                                : clickable
                                                    ? isDark
                                                        ? "hover:bg-slate-800"
                                                        : "hover:bg-gray-50"
                                                    : "opacity-50"
                                            }`}
                                    >
                                        {/* CHECK / NUMBER */}

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${completed
                                                    ? "bg-green-500 text-white"
                                                    : active
                                                        ? "bg-[#7C3AED] text-white"
                                                        : isDark
                                                            ? "bg-slate-800 text-slate-400"
                                                            : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {completed
                                                ? "✓"
                                                : step.number}
                                        </div>

                                        {/* TEXT */}

                                        <div className="min-w-0">
                                            <p
                                                className={`text-sm font-semibold ${active
                                                        ? "text-[#6D28D9]"
                                                        : completed
                                                            ? "text-green-700"
                                                            : isDark
                                                                ? "text-slate-300"
                                                                : "text-gray-700"
                                                    }`}
                                            >
                                                {step.title}
                                            </p>

                                            <p
                                                className={`mt-0.5 text-xs ${isDark
                                                        ? "text-slate-500"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {completed
                                                    ? "Completed"
                                                    : active
                                                        ? "Currently viewing"
                                                        : step.description}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* FORM AREA */}

                <main
                    className={`min-w-0 rounded-2xl border p-6 md:p-8 ${isDark
                            ? "border-slate-800 bg-slate-900"
                            : "border-gray-200 bg-white"
                        }`}
                >
                    {/* ERROR */}

                    {errorMessage && (
                        <div
                            className={`mb-6 rounded-xl border px-4 py-3 ${isDark
                                    ? "border-red-900/50 bg-red-950/40"
                                    : "border-red-200 bg-red-50"
                                }`}
                        >
                            <p
                                className={`text-sm font-medium ${isDark
                                        ? "text-red-400"
                                        : "text-red-700"
                                    }`}
                            >
                                {errorMessage}
                            </p>
                        </div>
                    )}

                    {/* SUCCESS */}

                    {successMessage && (
                        <div
                            className={`mb-6 rounded-xl border px-4 py-3 ${isDark
                                    ? "border-green-900/50 bg-green-950/40"
                                    : "border-green-200 bg-green-50"
                                }`}
                        >
                            <p
                                className={`text-sm font-medium ${isDark
                                        ? "text-green-400"
                                        : "text-green-700"
                                    }`}
                            >
                                {successMessage}
                            </p>
                        </div>
                    )}

                    {/* ====================================================
                        STEP 1
                    ==================================================== */}

                    {currentStep === 1 && (
                        <form
                            onSubmit={
                                handleBusinessSubmit
                            }
                            className="space-y-6"
                        >
                            <FormHeader
                                theme={theme}
                                title="Business Information"
                                description="Enter the basic information about your business."
                            />

                            <div className="grid gap-5 md:grid-cols-2">

                                <Input
                                    theme={theme}
                                    label="Business Name"
                                    name="name"
                                    value={
                                        businessData.name
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setBusinessData
                                        )
                                    }
                                    required
                                />

                                <Input
                                    theme={theme}
                                    label="Business Email"
                                    type="email"
                                    value={
                                        businessData.email ||
                                        ""
                                    }
                                    readOnly
                                />

                                <Input
                                    theme={theme}
                                    label="Contact Number"
                                    name="contactNumber"
                                    value={
                                        businessData.contactNumber
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setBusinessData
                                        )
                                    }
                                    required
                                />

                                <Input
                                    theme={theme}
                                    label="CAC / RC Number"
                                    name="rcNumber"
                                    value={
                                        businessData.rcNumber
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setBusinessData
                                        )
                                    }
                                    required
                                />

                                <Input
                                    theme={theme}
                                    label="Industry"
                                    name="industry"
                                    value={
                                        businessData.industry
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setBusinessData
                                        )
                                    }
                                    required
                                />

                                <div>
                                    <label
                                        className={`mb-2 block text-sm font-medium ${isDark
                                                ? "text-slate-200"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        Default Currency
                                    </label>

                                    <select
                                        name="defaultCurrency"
                                        value={
                                            businessData.defaultCurrency
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                setBusinessData
                                            )
                                        }
                                        required
                                        disabled={
                                            loadingCurrencies
                                        }
                                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/10 ${isDark
                                                ? "border-slate-700 bg-slate-800 text-white disabled:bg-slate-800"
                                                : "border-gray-200 bg-white text-gray-900 disabled:bg-gray-50"
                                            } disabled:cursor-not-allowed`}
                                    >
                                        <option value="">
                                            {loadingCurrencies
                                                ? "Loading currencies..."
                                                : "Select default currency"}
                                        </option>

                                        {currencies.map(
                                            (currency) => (
                                                <option
                                                    key={
                                                        currency
                                                    }
                                                    value={
                                                        currency
                                                    }
                                                >
                                                    {currency}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* BUSINESS ADDRESS */}

                                <div className="md:col-span-2">
                                    <p
                                        className={`mb-3 text-sm font-semibold ${isDark
                                                ? "text-slate-200"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        Business Address
                                    </p>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Input
                                            theme={theme}
                                            label="Street"
                                            name="address.street"
                                            value={
                                                businessData
                                                    .address
                                                    .street
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setBusinessData
                                                )
                                            }
                                            required
                                        />

                                        <Input
                                            theme={theme}
                                            label="City"
                                            name="address.city"
                                            value={
                                                businessData
                                                    .address
                                                    .city
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setBusinessData
                                                )
                                            }
                                            required
                                        />

                                        <Input
                                            theme={theme}
                                            label="State"
                                            name="address.state"
                                            value={
                                                businessData
                                                    .address
                                                    .state
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setBusinessData
                                                )
                                            }
                                            required
                                        />

                                        <Input
                                            theme={theme}
                                            label="Country"
                                            name="address.country"
                                            value={
                                                businessData
                                                    .address
                                                    .country
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setBusinessData
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    loading={submitting}
                                >
                                    Save & Continue
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ====================================================
                        STEP 2
                    ==================================================== */}

                    {currentStep === 2 && (
                        <form
                            onSubmit={
                                handleOwnerSubmit
                            }
                            className="space-y-6"
                        >
                            <FormHeader
                                theme={theme}
                                title="Owner Information"
                                description="Provide the business owner's identification and contact details."
                            />

                            <div
                                className={`rounded-xl border p-4 ${isDark
                                        ? "border-violet-900/50 bg-violet-950/30"
                                        : "border-[#E9D5FF] bg-[#FAF5FF]"
                                    }`}
                            >
                                <p className="text-sm font-medium text-[#6D28D9]">
                                    Account information
                                </p>

                                <p
                                    className={`mt-1 text-xs leading-5 ${isDark
                                            ? "text-slate-400"
                                            : "text-gray-500"
                                        }`}
                                >
                                    Your account information
                                    is automatically used
                                    where applicable.
                                </p>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                <Input
                                    theme={theme}
                                    label="Full Name"
                                    name="fullName"
                                    value={
                                        ownerData.fullName
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setOwnerData
                                        )
                                    }
                                    required
                                />

                                <div>
                                    <label
                                        className={`mb-2 block text-sm font-medium ${isDark
                                                ? "text-slate-200"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        ID Type
                                    </label>

                                    <select
                                        name="idType"
                                        value={
                                            ownerData.idType
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                e,
                                                setOwnerData
                                            )
                                        }
                                        required
                                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/10 ${isDark
                                                ? "border-slate-700 bg-slate-800 text-white"
                                                : "border-gray-200 bg-white text-gray-900"
                                            }`}
                                    >
                                        <option value="">
                                            Select ID type
                                        </option>

                                        <option value="national_id">
                                            National ID
                                        </option>

                                        <option value="international_passport">
                                            International Passport
                                        </option>

                                        <option value="drivers_license">
                                            Driver's License
                                        </option>

                                        <option value="voters_card">
                                            Voter's Card
                                        </option>
                                    </select>
                                </div>

                                <Input
                                    theme={theme}
                                    label="ID Number"
                                    name="idNumber"
                                    value={
                                        ownerData.idNumber
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setOwnerData
                                        )
                                    }
                                    required
                                />

                                <Input
                                    theme={theme}
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={
                                        ownerData.phoneNumber
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            e,
                                            setOwnerData
                                        )
                                    }
                                />

                                {/* OWNER ADDRESS */}

                                <div className="md:col-span-2">
                                    <p
                                        className={`mb-3 text-sm font-semibold ${isDark
                                                ? "text-slate-200"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        Owner Address
                                    </p>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Input
                                            theme={theme}
                                            label="Street"
                                            name="address.street"
                                            value={
                                                ownerData
                                                    .address
                                                    .street
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setOwnerData
                                                )
                                            }
                                            required
                                        />

                                        <Input
                                            theme={theme}
                                            label="City"
                                            name="address.city"
                                            value={
                                                ownerData
                                                    .address
                                                    .city
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setOwnerData
                                                )
                                            }
                                            required
                                        />

                                        <Input
                                            theme={theme}
                                            label="State"
                                            name="address.state"
                                            value={
                                                ownerData
                                                    .address
                                                    .state
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setOwnerData
                                                )
                                            }
                                            required
                                        />

                                        <Input
                                            theme={theme}
                                            label="Country"
                                            name="address.country"
                                            value={
                                                ownerData
                                                    .address
                                                    .country
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    e,
                                                    setOwnerData
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStepClick(1)
                                    }
                                    className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${isDark
                                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    Back
                                </button>

                                <Button
                                    type="submit"
                                    loading={submitting}
                                >
                                    Save & Continue
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ====================================================
                        STEP 3
                    ==================================================== */}

                    {currentStep === 3 && (
                        <form
                            onSubmit={
                                handleDocumentsSubmit
                            }
                            className="space-y-6"
                        >
                            <FormHeader
                                theme={theme}
                                title="Business Documents"
                                description="Upload or replace the documents used to verify your business."
                            />

                            <DocumentUpload
                                theme={theme}
                                title="Passport Photograph"
                                existingFile={
                                    documents.passportPhoto
                                }
                                onChange={(e) =>
                                    handleFileChange(
                                        e,
                                        "passportPhoto"
                                    )
                                }
                            />

                            <DocumentUpload
                                theme={theme}
                                title="Identification Document"
                                existingFile={
                                    documents.idDocument
                                }
                                onChange={(e) =>
                                    handleFileChange(
                                        e,
                                        "idDocument"
                                    )
                                }
                            />

                            <DocumentUpload
                                theme={theme}
                                title="Proof of Address"
                                existingFile={
                                    documents.proofOfAddress
                                }
                                onChange={(e) =>
                                    handleFileChange(
                                        e,
                                        "proofOfAddress"
                                    )
                                }
                            />

                            <div className="flex justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStepClick(2)
                                    }
                                    className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${isDark
                                            ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    Back
                                </button>

                                <Button
                                    type="submit"
                                    loading={submitting}
                                >
                                    Save Documents
                                </Button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| FORM HEADER
|--------------------------------------------------------------------------
*/

function FormHeader({
    title,
    description,
    theme,
}) {
    const isDark = theme === "dark";

    return (
        <div
            className={`border-b pb-5 ${isDark
                    ? "border-slate-800"
                    : "border-gray-100"
                }`}
        >
            <h2
                className={`text-xl font-bold ${isDark
                        ? "text-white"
                        : "text-gray-900"
                    }`}
            >
                {title}
            </h2>

            <p
                className={`mt-1 text-sm ${isDark
                        ? "text-slate-400"
                        : "text-gray-500"
                    }`}
            >
                {description}
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function Input({
    label,
    theme,
    ...props
}) {
    const isDark = theme === "dark";

    return (
        <div>
            <label
                className={`mb-2 block text-sm font-medium ${isDark
                        ? "text-slate-200"
                        : "text-gray-700"
                    }`}
            >
                {label}
            </label>

            <input
                {...props}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/10 ${isDark
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-gray-200 bg-white text-gray-900"
                    }`}
            />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| BUTTON
|--------------------------------------------------------------------------
*/

function Button({
    children,
    loading,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={loading}
            className="rounded-xl bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading
                ? "Saving..."
                : children}
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| DOCUMENT UPLOAD
|--------------------------------------------------------------------------
*/

function DocumentUpload({
    title,
    existingFile,
    onChange,
    theme,
}) {
    const isDark = theme === "dark";

    const isExisting =
        typeof existingFile === "string" &&
        existingFile.length > 0;

    const isNewFile =
        existingFile instanceof File;

    const fileUrl = isExisting
        ? `http://localhost:8080${existingFile.replace(
            /\\/g,
            "/"
        )}`
        : null;

    const isImage =
        typeof fileUrl === "string" &&
        /\.(jpg|jpeg|png|webp)$/i.test(
            fileUrl
        );

    console.log("DOCUMENT:", title);
    console.log(
        "EXISTING FILE:",
        existingFile
    );
    console.log("FILE URL:", fileUrl);
    console.log("IS IMAGE:", isImage);

    return (
        <div
            className={`rounded-2xl border p-5 ${isDark
                    ? "border-slate-800 bg-slate-900"
                    : "border-gray-200 bg-white"
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3
                        className={`text-sm font-semibold ${isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                    >
                        {title}
                    </h3>

                    <p
                        className={`mt-1 text-xs ${isDark
                                ? "text-slate-500"
                                : "text-gray-400"
                            }`}
                    >
                        JPG, PNG or PDF
                    </p>
                </div>

                {isExisting && (
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark
                                ? "bg-green-950/40 text-green-400"
                                : "bg-green-50 text-green-600"
                            }`}
                    >
                        Uploaded
                    </span>
                )}
            </div>

            {isExisting && fileUrl && (
                <div className="mt-4">
                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={title}
                            className="h-32 w-32 rounded-xl object-cover"
                            onLoad={() =>
                                console.log(
                                    "IMAGE LOADED:",
                                    fileUrl
                                )
                            }
                            onError={(error) =>
                                console.error(
                                    "IMAGE FAILED:",
                                    fileUrl,
                                    error
                                )
                            }
                        />
                    ) : (
                        <div
                            className={`rounded-xl p-4 ${isDark
                                    ? "bg-slate-800"
                                    : "bg-gray-50"
                                }`}
                        >
                            <p
                                className={`text-sm font-medium ${isDark
                                        ? "text-slate-200"
                                        : "text-gray-700"
                                    }`}
                            >
                                Document already uploaded
                            </p>

                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block text-xs font-medium text-[#7C3AED]"
                            >
                                View document
                            </a>
                        </div>
                    )}
                </div>
            )}

            {isNewFile && (
                <div
                    className={`mt-4 rounded-xl p-4 ${isDark
                            ? "bg-violet-950/30"
                            : "bg-[#F3EEFF]"
                        }`}
                >
                    <p className="text-sm font-medium text-[#6D28D9]">
                        New file selected
                    </p>

                    <p
                        className={`mt-1 text-xs ${isDark
                                ? "text-slate-400"
                                : "text-gray-500"
                            }`}
                    >
                        {existingFile.name}
                    </p>
                </div>
            )}

            <label
                className={`mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed px-4 py-6 text-sm transition hover:border-[#8B5CF6] ${isDark
                        ? "border-slate-700 text-slate-400 hover:bg-slate-800"
                        : "border-gray-300 text-gray-500 hover:bg-[#FAF8FF]"
                    }`}
            >
                {isExisting
                    ? "Replace document"
                    : "Choose document"}

                <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={onChange}
                />
            </label>
        </div>
    );
}
import { useState, useEffect } from "react";
import Input from "../../ui/Input";
import { useAuth } from "../../Context/AuthContext"
import { useNavigate } from "react-router-dom";
const steps = [
    "Business Info",
    "Owner Details",
    "Documents",
];


export default function CreateBusiness() {
    const { createBusiness, uploadDocument } = useAuth()
    const [currentStep, setCurrentStep] = useState(1);
    const [currencies, setCurrencies] = useState([]);
    const [documents, setDocuments] = useState({
        passportPhoto: null,
        idDocument: null,
        proofOfAddress: null
    });
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:7000/api/currencies/")
            .then(res => {
                console.log("status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("currency data:", JSON.stringify(data, null, 2));

                // Adjust this depending on your backend response

                setCurrencies(data.currencies);;
            })
            .catch(error => {
                console.error("currency error:", error);
            });
    }, []);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        rcNumber: "",
        industry: "",
        defaultCurrency: "NGN",

        address: {
            street: "",
            city: "",
            state: "",
            country: "",
        },
        owner: {

            phoneNumber: "",
            idType: "",
            idNumber: "",

            address: {
                street: "",
                city: "",
                state: "",
                country: "",
            }
        },
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDocuments(prev => {
            return {
                ...prev,
                [name]: files[0]
            }
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target;

        const keys = name.split(".");

        setFormData((prev) => {
            const newData = { ...prev };

            let current = newData;

            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current[key] = { ...current[key] };
                    current = current[key];
                }
            });

            return newData;
        });
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };


    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // 1. Create business
            const businessResponse = await createBusiness(formData);

            if (!businessResponse.ok) {
                throw new Error(businessResponse.message);
            }

            // // 2. Prepare documents
            // const documentFormData = new FormData();

            // documentFormData.append(
            //     "passportPhoto",
            //     documents.passportPhoto
            // );

            // documentFormData.append(
            //     "idDocument",
            //     documents.idDocument
            // );

            // documentFormData.append(
            //     "proofOfAddress",
            //     documents.proofOfAddress
            // );

            // 3. Upload documents
            const documentResponse = await uploadDocument(documents);

            if (!documentResponse.ok) {
                throw new Error(documentResponse.message);
            }

            // 4. Everything succeeded
            setSuccess(documentResponse.message);
            setTimeout(() => {
                navigate("/dashboard")
            }, 2000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">

            <div className="
        w-full 
        max-w-3xl
        bg-white
        rounded-2xl
        border border-gray-100
        p-8
      ">
                {error && (
                    <div className="mb-4 border border-red-300/50 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2.5 animate-fade-in">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-semibold">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-4 border border-emerald-300/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2.5 animate-fade-in">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{success}</span>
                    </div>
                )}


                <h1 className="
          text-2xl
          font-semibold
          text-gray-900
          mb-2
        ">
                    Create Business
                </h1>

                <p className="text-sm text-[#99A1AF] mb-8">
                    Complete your business profile to start using InvoiceFlow.
                </p>


                {/* STEPS */}

                <div className="flex items-center justify-between mb-10">

                    {steps.map((step, index) => {

                        const number = index + 1;

                        return (
                            <div
                                key={step}
                                className="flex items-center flex-1"
                            >

                                <div className="flex flex-col items-center">

                                    <div
                                        className={`
                    h-10 w-10 rounded-full
                    flex items-center justify-center
                    font-medium
                    ${currentStep >= number
                                                ?
                                                "bg-[#7F22FE] text-white"
                                                :
                                                "bg-[#F5F3FF] text-[#7F22FE]"
                                            }
                  `}
                                    >
                                        {number}
                                    </div>

                                    <span className="
                  text-xs 
                  mt-2
                  text-[#6A799E]
                  whitespace-nowrap
                  ">
                                        {step}
                                    </span>

                                </div>


                                {
                                    index !== steps.length - 1 &&
                                    <div className="
                  flex-1 
                  h-[2px]
                  mx-4
                  bg-gray-200
                  ">
                                    </div>
                                }


                            </div>
                        )

                    })}

                </div>



                <form onSubmit={handleSubmit}>

                    {/* STEP 1 */}

                    {
                        currentStep === 1 &&

                        <div className="space-y-5">

                            <Input
                                label="Business Name"
                                name="name"
                                placeholder="Enter business name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <Input
                                label="Business Email"
                                name="email"
                                type="email"
                                placeholder="example@business.com"
                                value={formData.email}
                                onChange={handleChange}
                            />


                            <Input
                                label="Contact Number"
                                name="contactNumber"
                                placeholder="+234..." value={formData.contactNumber}
                                onChange={handleChange}
                            />


                            <Input
                                label="RC Number (Required)"
                                name="rcNumber"
                                placeholder="RC123456"
                                value={formData.rcNumber}
                                onChange={handleChange}
                            />


                            <Input
                                label="Industry"
                                name="industry"
                                placeholder="Technology, Retail..."
                                value={formData.industry}
                                onChange={handleChange}
                            />  <div className="space-y-5">


                                <Input
                                    label="Street"
                                    name="address.street"
                                    placeholder="Business street address"
                                    value={formData.address.street}
                                    onChange={handleChange}
                                />


                                <Input
                                    label="City"
                                    name="address.city"
                                    placeholder="City"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                />


                                <Input
                                    label="State"
                                    name="address.state"
                                    placeholder="State"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                />


                                <Input
                                    label="Country"
                                    name="address.country"
                                    placeholder="Nigeria" value={formData.address.country}
                                    onChange={handleChange}
                                />
                            </div>



                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                    Default Currency
                                </label>

                                <select
                                    name="defaultCurrency"
                                    value={formData.defaultCurrency}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#7F22FE] focus:ring-2 focus:ring-[#7F22FE]/10 transition-all font-medium"
                                >
                                    {currencies.map((currency) => (
                                        <option key={currency} value={currency}>
                                            {currency}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    }



                    {/* STEP 2 */}

                    {
                        currentStep === 2 &&
                        <div className="space-y-5">

                            <Input
                                label="Owner Phone Number"
                                name="owner.phoneNumber"
                                placeholder="+234..."
                                value={formData.owner.phoneNumber}
                                onChange={handleChange}
                            />


                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                    ID Type
                                </label>

                                <select
                                    name="owner.idType"
                                    value={formData.owner.idType}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#7F22FE] focus:ring-2 focus:ring-[#7F22FE]/10 transition-all font-medium"
                                >
                                    <option value="">Select ID type</option>
                                    <option value="national_id">National ID</option>
                                    <option value="drivers_license">Driver's License</option>
                                    <option value="passport">Passport</option>
                                    <option value="voters_card">Voter's Card</option>
                                </select>
                            </div>



                            <Input
                                label="ID Number"
                                name="owner.idNumber"
                                placeholder="Identification number"
                                value={formData.owner.idNumber}
                                onChange={handleChange}
                            />
                            <h3 className="
          text-sm 
          font-semibold
          text-gray-800
          pt-4
          ">
                                Owner Address
                            </h3>


                            <Input
                                label="Street"
                                name="owner.address.street"
                                placeholder="Street"
                                value={formData.owner.address.street}
                                onChange={handleChange}
                            />


                            <Input
                                label="City"
                                name="owner.address.city"
                                placeholder="City" value={formData.owner.address.city}
                                onChange={handleChange}
                            />


                            <Input
                                label="State"
                                name="owner.address.state"
                                placeholder="State" value={formData.owner.address.state}
                                onChange={handleChange}
                            />


                            <Input
                                label="Country"
                                name="owner.address.country"
                                placeholder="Nigeria"
                                value={formData.owner.address.country}
                                onChange={handleChange}
                            />


                        </div>
                    }

                    {/* STEP 3 */}

                    {
                        currentStep === 3 &&

                        <div className="space-y-5">

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                    ID Document
                                </label>

                                <input
                                    type="file"
                                    name="idDocument"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    placeholder="Upload business owner's ID document."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#7F22FE] file:text-white file:text-sm file:font-medium hover:file:opacity-90"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                    Proof Of Address
                                </label>

                                <input
                                    type="file"
                                    name="proofOfAddress"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    placeholder="Upload an evidence of address e.g Utility bill"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#7F22FE] file:text-white file:text-sm file:font-medium hover:file:opacity-90"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                    Passport Photo
                                </label>

                                <input
                                    type="file"
                                    name="passportPhoto"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#7F22FE] file:text-white file:text-sm file:font-medium hover:file:opacity-90"
                                />
                            </div>

                        </div>
                    }



                    {/* BUTTONS */}

                    <div className="
        flex 
        justify-between
        mt-10
        ">


                        {
                            currentStep > 1 &&
                            <button
                                type="button"
                                onClick={previousStep}
                                className="
          px-6 py-3
          rounded-xl
          border
          text-sm
          text-gray-600
          "
                            >
                                Back
                            </button>
                        }


                        {
                            currentStep < 3 ?

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="ml-auto px-6 py-3 rounded-xl bg-[#7F22FE] text-white text-sm hover:opacity-90"
                                >
                                    Continue
                                </button>

                                :

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto px-6 py-3 rounded-xl bg-[#7F22FE] text-white text-sm hover:opacity-90"
                                >
                                    {loading ? "Creating Business..." : "Create Business"}
                                </button>
                        }

                    </div>


                </form>


            </div>

        </div>
    );
}
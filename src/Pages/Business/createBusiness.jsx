import { useState,useEffect } from "react";
import Input from "../../ui/Input";
const steps = [
    "Business Info",
    "Address",
    "Owner Details",
];

export default function CreateBusiness() {
    const [currentStep, setCurrentStep] = useState(1);
    const [currencies, setCurrencies] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/currencies/")
            .then(res => res.json())
            .then(data => setCurrencies(data));
    }, []);
    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        contactNumber: "",
        rcNumber: "",
        industry: "",
        defaultCurrency: "NGN",

        address: {
            street: "",
            city: "",
            state: "",
            country: "Nigeria",
        },
        proofOfAddressUrl: "",
        owner: {
            fullName: "",
            email: "",
            phoneNumber: "",
            idType: "",
            idNumber: "",
            idDocumentUrl: "",
            passportPhotoUrl: "",

            address: {
                street: "",
                city: "",
                state: "",
                country: "Nigeria",
            }
        },
    });


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


    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(formData);

        // send data to backend here
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
                                name="businessName"
                                placeholder="Enter business name"
                                value={formData.businessName}
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
                            />



                            <select
                                label="defaultCurrency"
                                name="defaultCurrency"
                                value={formData.defaultCurrency}
                                onChange={handleChange}>
                                {
                                    currencies.map((currency) => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.symbol} {currency.code}
                                        </option>
                                    ))
                                }
                            </select>


                        </div>
                    }



                    {/* STEP 2 */}

                    {
                        currentStep === 2 &&

                        <div className="space-y-5">


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


                            <Input
                                label="Proof Of Address URL"
                                name="proofOfAddressUrl"
                                placeholder="Upload document URL"
                                value={formData.proofOfAddressUrl}
                                onChange={handleChange}
                            />

                        </div>
                    }




                    {/* STEP 3 */}

                    {
                        currentStep === 3 &&

                        <div className="space-y-5">


                            <Input
                                label="Owner Full Name"
                                name="owner.fullName"
                                placeholder="Full name"
                                value={formData.owner.fullName}
                                onChange={handleChange}
                            />


                            <Input
                                label="Owner Email"
                                name="owner.email"
                                type="email"
                                placeholder="owner@email.com" value={formData.owner.email}
                                onChange={handleChange}
                            />


                            <Input
                                label="Owner Phone Number"
                                name="owner.phoneNumber"
                                placeholder="+234..."
                                value={formData.owner.phoneNumber}
                                onChange={handleChange}
                            />


                            <Input
                                label="ID Type"
                                name="owner.idType"
                                placeholder="national_id"
                                value={formData.owner.idType}
                                onChange={handleChange}
                            />


                            <Input
                                label="ID Number"
                                name="owner.idNumber"
                                placeholder="Identification number"
                                value={formData.owner.idNumber}
                                onChange={handleChange}
                            />


                            <Input
                                label="ID Document URL"
                                name="owner.idDocumentUrl"
                                placeholder="Document URL"
                                value={formData.owner.idDocumentUrl}
                                onChange={handleChange}
                            />


                            <Input
                                label="Passport Photo URL"
                                name="owner.passportPhotoUrl"
                                placeholder="Photo URL"
                                value={formData.owner.passportPhotoUrl}
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
                                    className="
          ml-auto
          px-6 py-3
          rounded-xl
          bg-[#7F22FE]
          text-white
          text-sm
          hover:opacity-90
          "
                                >
                                    Continue
                                </button>

                                :

                                <button
                                    type="submit"
                                    className="
          ml-auto
          px-6 py-3
          rounded-xl
          bg-[#7F22FE]
          text-white
          text-sm
          hover:opacity-90
          "
                                >
                                    Create Business
                                </button>

                        }


                    </div>


                </form>


            </div>

        </div>
    );
}
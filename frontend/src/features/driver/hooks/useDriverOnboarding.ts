import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { ROUTES } from '@/shared/constants';

export interface OnboardingPersonalInfo {
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    emergencyContact: string;
    emergencyPhone: string;
}

export interface OnboardingLicenseInfo {
    licenseNumber: string;
    licenseType: string;
    licenseExpiry: string;
    yearsOfExperience: string;
}

export interface OnboardingVehicleInfo {
    ownsCab: boolean;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleColor: string;
    registrationNumber: string;
    insuranceExpiry: string;
}

export interface OnboardingData {
    personalInfo: OnboardingPersonalInfo;
    licenseInfo: OnboardingLicenseInfo;
    vehicleInfo: OnboardingVehicleInfo;
    documents: {
        licenseFront?: File;
        licenseBack?: File;
        aadhaarFront?: File;
        aadhaarBack?: File;
        policeClearance?: File;
        vehicleRC?: File;
        vehicleInsurance?: File;
    };
}

// Submit driver onboarding data to backend
async function submitOnboarding(data: OnboardingData): Promise<void> {
    const formData = new FormData();

    // Add personal info
    formData.append('date_of_birth', data.personalInfo.dateOfBirth);
    formData.append('address', data.personalInfo.address);
    formData.append('city', data.personalInfo.city);
    formData.append('state', data.personalInfo.state);
    formData.append('pincode', data.personalInfo.pincode);
    formData.append('emergency_contact', data.personalInfo.emergencyContact);
    formData.append('emergency_phone', data.personalInfo.emergencyPhone);

    // Add license info
    formData.append('license_number', data.licenseInfo.licenseNumber);
    formData.append('license_type', data.licenseInfo.licenseType);
    formData.append('license_expiry', data.licenseInfo.licenseExpiry);
    formData.append('years_of_experience', data.licenseInfo.yearsOfExperience);

    // Add vehicle info
    formData.append('owns_cab', String(data.vehicleInfo.ownsCab));
    if (data.vehicleInfo.ownsCab) {
        formData.append('vehicle_make', data.vehicleInfo.vehicleMake);
        formData.append('vehicle_model', data.vehicleInfo.vehicleModel);
        formData.append('vehicle_year', data.vehicleInfo.vehicleYear);
        formData.append('vehicle_color', data.vehicleInfo.vehicleColor);
        formData.append('registration_number', data.vehicleInfo.registrationNumber);
        formData.append('insurance_expiry', data.vehicleInfo.insuranceExpiry);
    }

    // Add documents
    if (data.documents.licenseFront) {
        formData.append('license_front', data.documents.licenseFront);
    }
    if (data.documents.licenseBack) {
        formData.append('license_back', data.documents.licenseBack);
    }
    if (data.documents.aadhaarFront) {
        formData.append('aadhaar_front', data.documents.aadhaarFront);
    }
    if (data.documents.aadhaarBack) {
        formData.append('aadhaar_back', data.documents.aadhaarBack);
    }
    if (data.documents.policeClearance) {
        formData.append('police_clearance', data.documents.policeClearance);
    }
    if (data.vehicleInfo.ownsCab) {
        if (data.documents.vehicleRC) {
            formData.append('vehicle_rc', data.documents.vehicleRC);
        }
        if (data.documents.vehicleInsurance) {
            formData.append('vehicle_insurance', data.documents.vehicleInsurance);
        }
    }

    await apiClient.upload('/drivers/onboarding', formData);
}

export function useDriverOnboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const [personalInfo, setPersonalInfo] = useState<OnboardingPersonalInfo>({
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        emergencyContact: '',
        emergencyPhone: '',
    });

    const [licenseInfo, setLicenseInfo] = useState<OnboardingLicenseInfo>({
        licenseNumber: '',
        licenseType: 'LMV',
        licenseExpiry: '',
        yearsOfExperience: '',
    });

    const [vehicleInfo, setVehicleInfo] = useState<OnboardingVehicleInfo>({
        ownsCab: true,
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        registrationNumber: '',
        insuranceExpiry: '',
    });

    const [documents, setDocuments] = useState<OnboardingData['documents']>({});

    const submitMutation = useMutation({
        mutationFn: submitOnboarding,
        onSuccess: () => {
            navigate(ROUTES.DRIVER.DASHBOARD);
        },
    });

    const goToNextStep = useCallback(() => {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        setCurrentStep((prev) => prev + 1);
    }, [currentStep]);

    const goToPrevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
    }, []);

    const goToStep = useCallback((step: number) => {
        setCurrentStep(step);
    }, []);

    const handleSubmit = useCallback(() => {
        submitMutation.mutate({
            personalInfo,
            licenseInfo,
            vehicleInfo,
            documents,
        });
    }, [personalInfo, licenseInfo, vehicleInfo, documents, submitMutation]);

    const updateDocument = useCallback(
        (key: keyof OnboardingData['documents'], file: File | undefined) => {
            setDocuments((prev) => ({ ...prev, [key]: file }));
        },
        []
    );

    return {
        // Step navigation
        currentStep,
        completedSteps,
        goToNextStep,
        goToPrevStep,
        goToStep,

        // Form data
        personalInfo,
        setPersonalInfo,
        licenseInfo,
        setLicenseInfo,
        vehicleInfo,
        setVehicleInfo,
        documents,
        updateDocument,

        // Submission
        handleSubmit,
        isSubmitting: submitMutation.isPending,
        submitError: submitMutation.error,
    };
}

export default useDriverOnboarding;

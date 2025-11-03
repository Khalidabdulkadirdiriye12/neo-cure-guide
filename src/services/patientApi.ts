import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  contact?: string;
  email?: string;
  diagnosis?: string;
  stage?: string;
  status?: "Active" | "Under Treatment" | "Recovered" | "Critical";
  medical_history?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Patient[];
}

export interface CreatePatientData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  contact?: string;
  email?: string;
  diagnosis?: string;
  stage?: string;
  status?: "Active" | "Under Treatment" | "Recovered" | "Critical";
  medical_history?: string;
}

export interface UpdatePatientData extends Partial<CreatePatientData> {}

/**
 * List all patients with pagination
 * GET /api/patients/
 * @param page - Page number (default: 1)
 * @returns Paginated list of patients
 */
export const listPatients = async (page: number = 1): Promise<PaginatedResponse> => {
  const response = await axios.get(`${API_BASE_URL}/patients/`, {
    params: { page }
  });
  return response.data;
};

/**
 * Create a new patient
 * POST /api/patients/
 * Required fields: first_name, last_name, date_of_birth, gender
 * @param patientData - Patient data to create
 * @returns Created patient with 201 status
 */
export const createPatient = async (patientData: CreatePatientData): Promise<Patient> => {
  const response = await axios.post(`${API_BASE_URL}/patients/`, patientData);
  return response.data;
};

/**
 * Retrieve a single patient by ID
 * GET /api/patients/{id}/
 * @param id - Patient ID
 * @returns Patient details
 */
export const getPatient = async (id: number): Promise<Patient> => {
  const response = await axios.get(`${API_BASE_URL}/patients/${id}/`);
  return response.data;
};

/**
 * Full update of a patient (requires all fields)
 * PUT /api/patients/{id}/
 * @param id - Patient ID
 * @param patientData - Complete patient data
 * @returns Updated patient
 */
export const updatePatient = async (id: number, patientData: CreatePatientData): Promise<Patient> => {
  const response = await axios.put(`${API_BASE_URL}/patients/${id}/`, patientData);
  return response.data;
};

/**
 * Partial update of a patient (only specified fields)
 * PATCH /api/patients/{id}/
 * @param id - Patient ID
 * @param patientData - Partial patient data
 * @returns Updated patient
 */
export const patchPatient = async (id: number, patientData: UpdatePatientData): Promise<Patient> => {
  const response = await axios.patch(`${API_BASE_URL}/patients/${id}/`, patientData);
  return response.data;
};

/**
 * Delete a patient
 * DELETE /api/patients/{id}/
 * @param id - Patient ID
 * @returns 204 No Content on success
 */
export const deletePatient = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/patients/${id}/`);
};

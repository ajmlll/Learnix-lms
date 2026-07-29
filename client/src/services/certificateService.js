import api from './api';

export const certificateService = {
  // Claim/generate certificate upon 100% course completion
  claimCertificate: async (courseId) => {
    const response = await api.post(`/certificates/claim/${courseId}`);
    return response.data.data;
  },

  // Verify certificate by certificateId (PUBLIC)
  verifyCertificate: async (certificateId) => {
    const response = await api.get(`/certificates/verify/${certificateId}`);
    return response.data;
  },
};

export default certificateService;

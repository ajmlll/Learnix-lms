import api from './api';

export const codeService = {
  // Execute code via Judge0 / Server Sandbox
  executeCode: async (language, code, input = '') => {
    const response = await api.post('/code/execute', { language, code, input });
    return response.data;
  },
};

export default codeService;

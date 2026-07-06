import { api } from './client';

export const safetyApi = {
  verifyGatePass: (passCode, validDate) =>
    api.post('/safety/gate-passes/verify', null, { params: { passCode, validDate } }),
};

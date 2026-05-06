// unlock-test.service.ts

import { examApi } from '@/lib/exam-api'

export type UnlockTestPayload = {
  testId: number
  password: string
}

export type UnlockTestResponse = {
  success: boolean
  message: string
  testStatus: number
  testDescription: string
}

export async function unlockTest(
  payload: UnlockTestPayload,
): Promise<UnlockTestResponse> {
  return examApi
    .post('auth/unlock-test', {
      json: payload,
    })
    .json<UnlockTestResponse>()
}
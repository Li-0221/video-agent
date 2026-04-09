import { localStg } from '@/utils/storage';
import { mockAuthUsers } from '@/mock/video-platform';

type MockFlatResponse<T> = Promise<{
  data: T;
  error: null;
}>;

function resolveMock<T>(data: T): MockFlatResponse<T> {
  return Promise.resolve({
    data,
    error: null
  });
}

function getMockUserKey(userName?: string) {
  const normalized = (userName || '').toLowerCase();

  if (normalized.includes('student') || normalized.includes('学生')) {
    return 'student';
  }

  if (normalized.includes('admin') || normalized.includes('主任') || normalized.includes('管理员')) {
    return 'admin';
  }

  return 'teacher';
}

/**
 * Login
 *
 * Uses local mock data so the frontend can run independently from backend services.
 */
export function fetchLogin(userName: string, _password: string) {
  const mockUserKey = getMockUserKey(userName);

  localStg.set('mockUserKey', mockUserKey);

  return resolveMock<Api.Auth.LoginToken>({
    token: `mock-token-${mockUserKey}`,
    refreshToken: `mock-refresh-token-${mockUserKey}`
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  const mockUserKey = localStg.get('mockUserKey') || 'teacher';
  const user = mockAuthUsers[mockUserKey] || mockAuthUsers.teacher;

  return resolveMock<Api.Auth.UserInfo>(user);
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return resolveMock<Api.Auth.LoginToken>({
    token: `${refreshToken}-next`,
    refreshToken: `${refreshToken}-rotate`
  });
}

/**
 * return custom backend error
 *
 * kept for compatibility with existing call sites
 */
export function fetchCustomBackendError(_code: string, _msg: string) {
  return Promise.resolve({
    data: null,
    error: new Error('Mock mode does not simulate custom backend errors.')
  });
}

import { Validator, AsyncValidator } from '../types/validation';
import axios from 'axios';

export const emailValidator: Validator = (value: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value) ? undefined : '無効なメールアドレスです';
};

export const locationValidator: AsyncValidator = async (location: string) => {
  try {
    const response = await axios.post('/api/validate-location', { location });
    if (!response.data.isValid) {
      return '無効な場所です';
    }
    return undefined;
  } catch (error) {
    return '場所の検証中にエラーが発生しました';
  }
};

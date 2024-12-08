import {
  Validator,
  AsyncValidator,
  ExistsValidator,
} from '../types/validation';
import axios from 'axios';

export const existsValidator: ExistsValidator = (
  value: string,
  fieldName: string,
  min = 1
) => {
  const errorMessage =
    min === 1
      ? 'は空であってはなりません'
      : `${min}文字以上で入力してください。`;
  return value && value?.length >= min
    ? undefined
    : `${fieldName}${errorMessage}`;
};

export const emailValidator: Validator = (value: string) => {
  const emptyError = existsValidator(value, 'email');
  if (!emptyError) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? undefined : '無効なメールアドレスです';
  } else {
    return emptyError;
  }
};

export const locationValidator: AsyncValidator = async (location: string) => {
  try {
    const response = await axios.post(
      '/api/validate-location',
      { location },
      { withCredentials: false }
    );
    if (!response.data.isValid) {
      return '無効な場所です';
    }
    return undefined;
  } catch (error) {
    return '場所の検証中にエラーが発生しました';
  }
};

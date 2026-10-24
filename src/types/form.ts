export type QuestionType = 'TEXT' | 'EMAIL' | 'MULTIPLE_CHOICE' | 'YES_NO';
export type FormStatus = 'DRAFT' | 'PUBLISHED';

export interface FormData {
  id: string;
  publicId: string;
  title: string;
  description: string | null;
  status: FormStatus;
  welcomeMessage: string;
  completionMessage: string;
  primaryColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionData {
  id: string;
  formId: string;
  label: string;
  description: string | null;
  type: QuestionType;
  options: string | null;
  required: boolean;
  order: number;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  read?: boolean;
}
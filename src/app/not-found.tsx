import { Column, Span } from './_components/layout/layout';
import { ErrorHandler } from './errorHandler';

export default function NotFound() {
  return (
    <ErrorHandler error="404" />
  );
}

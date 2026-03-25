import { Column, Span } from './_components/layout/layout';

export function ErrorHandler({ error }: { error: Error | string }) {
  const text = (error instanceof Error) ? error.message : error;

  return (
    <Span>
      <Column>
        <h1>(,,{'>'}﹏{'<'},,)</h1>
        <h3 className="subtle">{text}</h3>
      </Column>
    </Span>
  )
}
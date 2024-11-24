import React from 'react';
import { useWaitForTransaction } from 'wagmi';

interface TransactionStatusProps {
  hash: string;
}

export default function TransactionStatus({ hash }: TransactionStatusProps) {
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: hash as `0x${string}`,
  });

  if (isLoading) return <div className="text-blue-600">Processing transaction...</div>;
  if (isError) return <div className="text-red-600">Error processing transaction</div>;
  if (data) return <div className="text-green-600">Transaction successful!</div>;
  
  return null;
}
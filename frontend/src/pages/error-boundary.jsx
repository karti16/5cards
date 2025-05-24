import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router';

export default function ErrorBoundary() {
  const error = useRouteError();
  const status = {
    404: "This page doesn't exist!",
    401: "You aren't authorized to see this",
    503: 'Looks like our API is down',
    418: '🫖',
  };

  if (isRouteErrorResponse(error)) {
    return <div>{status[error.status]}</div>;
  }

  return <div>Something went wrong</div>;
}

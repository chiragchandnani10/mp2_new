import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('Uncaught error:', error);
  }
  render() {
    if (this.state.hasError) {
      return <div className="center-message">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

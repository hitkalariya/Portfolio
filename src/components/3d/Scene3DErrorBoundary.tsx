import React from 'react';

interface Scene3DErrorBoundaryProps {
  children: React.ReactNode;
}

interface Scene3DErrorBoundaryState {
  hasError: boolean;
}

export class Scene3DErrorBoundary extends React.Component<Scene3DErrorBoundaryProps, Scene3DErrorBoundaryState> {
  constructor(props: Scene3DErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): Scene3DErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      );
    }

    return this.props.children;
  }
}
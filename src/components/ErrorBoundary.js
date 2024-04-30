import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false, msg: "Error de renderizado" }

    static getDerivedStateFromError(error) {
        return { hasError: true, msg: error.message }
    }
    componentDidCatch(error, errorInfo) {
        console.error('Error capturado:', error, errorInfo);
    }


    render() {
        if (this.state.hasError) return <div className='flex justify-center'> 
            <span className='rounded-lg p-4 border border-danger text-danger bg-warning-50 my-4 uppercase'>
                Error de renderizado
            </span>
        </div>

        return this.props.children
    }
}

export default ErrorBoundary;
import { Suspense, lazy, Component, ErrorInfo, ReactNode } from "react";
import Header from "./components/header/header";
import Roads from "./components/roads/roads";
import GuidePane from "./components/guidepane/guidepane";

const Waifu = lazy(() => import("./components/waifu/waifu"));

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-600 dark:text-red-400">
          Something went wrong. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className='flex flex-col min-h-screen bg-pink-200 dark:bg-zinc-800'>
        <Header />
        <Suspense fallback={null}>
          <Waifu />
        </Suspense>
        <Roads />
        <GuidePane /> 
      </div>
    </ErrorBoundary>
  );
}

export default App;

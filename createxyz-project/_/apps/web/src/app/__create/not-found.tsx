import { Link, useRouteLoaderData } from 'react-router-dom';

export default function NotFound() {
  const { loaderData } = useRouteLoaderData("root");
  const missingPath = loaderData.path.replace(/^\//, '');
  const existingRoutes = loaderData.pages.map((page) => ({
    to: page.path,
    label: page.path,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Oops! The page <span className="font-mono text-red-500">/{missingPath}</span> you are looking for does not exist.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Here are some existing routes:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {existingRoutes.map((route) => (
            <Link
              key={route.to}
              to={route.to}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
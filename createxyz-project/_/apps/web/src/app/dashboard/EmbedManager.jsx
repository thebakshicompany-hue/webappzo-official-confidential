import { useState } from "react";

const EmbedManager = () => {
  const [embeddedApps, setEmbeddedApps] = useState([
    {
      id: "vercel-app",
      url: "https://7b062b56166aa2de8022.vercel.app/create",
      name: "Vercel App",
    },
    {
      id: "apps-app",
      url: "https://wcaptu.netlify.app/",
      name: "apps App",
    },
  ]);

  const [unlinkedApps, setUnlinkedApps] = useState([]);

  const handleUnlink = (id) => {
    const appToUnlink = embeddedApps.find((app) => app.id === id);
    if (appToUnlink) {
      setEmbeddedApps(embeddedApps.filter((app) => app.id !== id));
      setUnlinkedApps([...unlinkedApps, appToUnlink]);
    }
  };

  const handleRelink = (id) => {
    const appToRelink = unlinkedApps.find((app) => app.id === id);
    if (appToRelink) {
      setUnlinkedApps(unlinkedApps.filter((app) => app.id !== id));
      setEmbeddedApps([...embeddedApps, appToRelink]);
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Embedded Apps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {embeddedApps.map((app) => (
          <div key={app.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">{app.name}</h3>
              <button
                onClick={() => handleUnlink(app.id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Unlink
              </button>
            </div>
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              {/* 16:9 Aspect Ratio */}
              <iframe
                src={app.url}
                title={app.name}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              ></iframe>
            </div>
          </div>
        ))}
      </div>

      {unlinkedApps.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unlinked Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlinkedApps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">{app.name}</h3>
                  <button
                    onClick={() => handleRelink(app.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors"
                  >
                    Relink
                  </button>
                </div>
                <div className="relative" style={{ paddingTop: "56.25%" }}>
                  {/* 16:9 Aspect Ratio */}
                  <iframe
                    src={app.url}
                    title={app.name}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default EmbedManager;
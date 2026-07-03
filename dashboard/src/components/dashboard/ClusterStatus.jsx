const services = [
  {
    name: "Docker",
    status: "Running",
  },
  {
    name: "Kubernetes",
    status: "Healthy",
  },
  {
    name: "Registry",
    status: "Online",
  },
  {
    name: "Floci",
    status: "Connected",
  },
];

const ClusterStatus = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="mb-5 text-lg font-semibold">Cluster Status</h2>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <span>{service.name}</span>

            <span className="font-medium text-green-400">{service.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterStatus;

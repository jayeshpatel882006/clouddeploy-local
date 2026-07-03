import Card from "@/components/ui/Card";

const SettingsSection = ({ title, subtitle, children, headerRight, className = "" }) => {
  return (
    <Card title={title} subtitle={subtitle} headerRight={headerRight} className={className}>
      <div className="space-y-5">{children}</div>
    </Card>
  );
};

export default SettingsSection;

import ConfigurationCard from "@/components/dashboard/ConfigurationCard"

const DashboardUI = () => {
  return (
    <div className="bg-gradient-to-br p-8">
      <div className="max-w-3xl mx-auto">
        {/* Configuration Card - spans full width */}
        <div className="mb-6">
          <ConfigurationCard />
        </div>
      </div>
    </div>
  )
}

export default DashboardUI
